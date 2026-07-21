// Google Apps Script backend for the /feedback form.
// This file is a reference copy — the live version runs as a container-bound
// script on the "Agentic Programming Feedback" Google Sheet.
// Deployment steps are in the README ("Feedback form" section).

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Honeypot: bots fill the hidden "website" field. Pretend success, write nothing.
  if (p.website) {
    return ContentService.createTextOutput('ok');
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  // Columns: Timestamp, Edition, Chapter, Quoted text, Type, Comment, Name, Email
  sheet.appendRow([
    new Date(),
    p.edition || '',
    p.chapter || '',
    p.quote || '',
    p.type || '',
    p.comment || '',
    p.name || '',
    p.email || ''
  ]);

  return ContentService.createTextOutput('ok');
}
