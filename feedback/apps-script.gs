// Google Apps Script backend for the /feedback form.
// This file is a reference copy — the live version runs as a container-bound
// script on the "Agentic Programming Feedback" Google Sheet.
// Deployment steps are in the README ("Feedback form" section).
//
// Email notifications require the mail scope to be declared explicitly in the
// manifest (appsscript.json), otherwise the editor never prompts for consent
// and MailApp.sendEmail throws "no permission" at runtime (silently swallowed
// by the try/catch below). The manifest must include:
//   "oauthScopes": [
//     "https://www.googleapis.com/auth/script.send_mail",
//     "https://www.googleapis.com/auth/spreadsheets.currentonly"
//   ]
// Because the mail is sent from (and forwards back to) the owner's own Gmail,
// Gmail dedups it out of the Inbox and auto-marks it read. A Gmail filter
// (to:author@… subject:"New book feedback" → star, label "Book Feedback",
// mark important, never spam) surfaces it. See the README for details.

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Honeypot: bots fill the hidden "website" field. Pretend success, write nothing.
  if (p.website) {
    return ContentService.createTextOutput('ok');
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  // Columns: Timestamp, Edition, Chapter, Section, Quoted text, Type, Comment, Name, Email
  sheet.appendRow([
    new Date(),
    p.edition || '',
    p.chapter || '',
    p.section || '',
    p.quote || '',
    p.type || '',
    p.comment || '',
    p.name || '',
    p.email || ''
  ]);

  // Notify the author on new feedback. Wrapped so a mail failure never
  // loses the feedback row that was just saved above.
  try {
    MailApp.sendEmail({
      to: 'author@agenticprogrammingbook.com',
      subject: 'New book feedback' + (p.type ? ' (' + p.type + ')' : ''),
      body: [
        'Edition: ' + (p.edition || ''),
        'Chapter: ' + (p.chapter || ''),
        'Section: ' + (p.section || ''),
        'Type:    ' + (p.type || ''),
        '',
        'Quote:',
        (p.quote || '(none)'),
        '',
        'Comment:',
        (p.comment || '(none)'),
        '',
        'From: ' + (p.name || 'anonymous') + ' <' + (p.email || 'no email') + '>'
      ].join('\n')
    });
  } catch (err) {
    console.error('Feedback email failed: ' + err);
  }

  return ContentService.createTextOutput('ok');
}
