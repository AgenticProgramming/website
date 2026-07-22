cmd = [
    "claude",
    "-p",
    "--permission-mode",
    permission_mode,
    "--output-format",
    "stream-json",
    "--verbose",
]
if model:
    cmd += ["--model", model]
if allowed_tools:
    cmd += ["--allowedTools", *allowed_tools]
