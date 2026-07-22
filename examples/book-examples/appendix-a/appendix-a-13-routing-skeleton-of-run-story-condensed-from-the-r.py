index = stage_names.index(state.current_stage)
while index < len(stages):
    stage = stages[index]
    name = stage["name"]
    state.current_stage = name
    save_state(run_dir, state)
    append_event(run_dir, f"{name} stage started")

    context = context_assembler.build_context(
        story_text=story_text, run_dir=run_dir, target_root=target_root,
        config=config, rules=rules, retry_count=state.retry_count)
    template = context_assembler.load_template(harness_root, stage["prompt"])
    prompt = context_assembler.render(template, context)
    attempt = state.retry_count + 1
    (run_dir / f"prompt-{name}-attempt-{attempt}.md").write_text(prompt)

    result = runner(prompt, stage=name, cwd=target_root, log_path=log_path,
                    permission_mode=config.get("permission_mode", "acceptEdits"),
                    model=config.get("model"),
                    allowed_tools=config.get("allowed_tools"))
    if not result.ok:
        return _escalate(run_dir, state, f"{name} agent process failed")

    missing = [out for out in stage.get("outputs", [])
               if not (run_dir / out).is_file()]
    if missing:
        return _escalate(run_dir, state, f"{name} did not produce required artifacts: ...")

    if name == "implementer":
        violation = _blocked_violation(run_dir, rules.get("blocked_paths", []))
        if violation:
            return _escalate(run_dir, state, f"implementer modified blocked path: {violation}")

    if name == "verifier":
        verdict = json.loads((run_dir / "verification-result.json").read_text())
        state.verification_iterations += 1
        # ... archive verdict to verification/iteration-N.json ...
        if verdict.get("status") == "passed":
            append_event(run_dir, "verification passed")
        elif verdict.get("retry_recommended") and state.retry_count < rules["max_retries"]:
            state.retry_count += 1
            save_state(run_dir, state)
            append_event(run_dir, f"verification failed; retry {state.retry_count} of ...")
            index = stage_names.index(stage["on_failure"]["retry_stage"])
            continue
        elif verdict.get("retry_recommended"):
            return _escalate(run_dir, state, "verification failed and retries are exhausted")
        else:
            return _escalate(run_dir, state,
                             "verification failed and the verifier did not recommend a retry")
    else:
        append_event(run_dir, f"{name} stage completed")

    index += 1

return _complete(run_dir, state, story_text, target_root)
