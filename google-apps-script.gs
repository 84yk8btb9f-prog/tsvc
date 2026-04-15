// ══════════════════════════════════════════════════════════
//  TSVC Studio — Google Apps Script Backend
//  Paste this entire file into Google Apps Script editor
//  Then deploy as a Web App (instructions in README)
// ══════════════════════════════════════════════════════════

// ── CONFIG ── Change these two values ──────────────────────
const SHEET_NAME        = 'Briefs';           // Tab name in your Google Sheet
const NOTIFICATION_EMAIL = 'your@email.com';  // Email to receive notifications
// ───────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // 1. Write to Google Sheet
    writeToSheet(data);

    // 2. Send email notification
    sendNotificationEmail(data);

    // 3. Return success
    return buildResponse({ success: true, message: 'Brief received.' });

  } catch (err) {
    return buildResponse({ success: false, error: err.message });
  }
}

// ── Allow preflight CORS requests ──
function doGet(e) {
  return buildResponse({ status: 'TSVC Studio API is running.' });
}

// ── Write a new row to the Sheet ──
function writeToSheet(data) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);

  // Auto-create sheet + header row if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp',
      'Full Name',
      'Email',
      'Brand / Channel',
      'Platform',
      'Service',
      'Budget',
      'Message'
    ]);

    // Style the header row
    const header = sheet.getRange(1, 1, 1, 8);
    header.setBackground('#cc1111');
    header.setFontColor('#ffffff');
    header.setFontWeight('bold');
    sheet.setFrozenRows(1);

    // Column widths
    sheet.setColumnWidth(1, 160);  // Timestamp
    sheet.setColumnWidth(2, 160);  // Name
    sheet.setColumnWidth(3, 200);  // Email
    sheet.setColumnWidth(4, 180);  // Brand
    sheet.setColumnWidth(5, 140);  // Platform
    sheet.setColumnWidth(6, 180);  // Service
    sheet.setColumnWidth(7, 120);  // Budget
    sheet.setColumnWidth(8, 360);  // Message
  }

  // Append the new submission
  sheet.appendRow([
    new Date().toLocaleString('el-GR', { timeZone: 'Europe/Athens' }),
    data.name    || '—',
    data.email   || '—',
    data.brand   || '—',
    data.platform|| '—',
    data.service || '—',
    data.budget  || '—',
    data.message || '—'
  ]);

  // Alternate row shading for readability
  const lastRow = sheet.getLastRow();
  if (lastRow % 2 === 0) {
    sheet.getRange(lastRow, 1, 1, 8).setBackground('#f9f9f9');
  }
}

// ── Send notification email ──
function sendNotificationEmail(data) {
  const subject = `🎯 New TSVC Brief — ${data.name || 'Unknown'} (${data.brand || '?'})`;

  const body = `
New brief submitted on the TSVC Studio website.

━━━━━━━━━━━━━━━━━━━━━━━━━
CLIENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━
Name:      ${data.name    || '—'}
Email:     ${data.email   || '—'}
Brand:     ${data.brand   || '—'}
Platform:  ${data.platform|| '—'}
Service:   ${data.service || '—'}
Budget:    ${data.budget  || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message || '(no message)'}

━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted: ${new Date().toLocaleString('el-GR', { timeZone: 'Europe/Athens' })}
━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  const htmlBody = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:#cc1111;padding:24px 32px;">
    <h2 style="color:#fff;margin:0;font-size:20px;letter-spacing:1px;">🎯 NEW BRIEF — TSVC STUDIO</h2>
  </div>
  <div style="padding:28px 32px;border:1px solid #eee;border-top:none;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr style="background:#f9f9f9;"><td style="padding:10px 12px;font-weight:600;width:140px;color:#555;">Full Name</td><td style="padding:10px 12px;">${data.name || '—'}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:600;color:#555;">Email</td><td style="padding:10px 12px;"><a href="mailto:${data.email}" style="color:#cc1111;">${data.email || '—'}</a></td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:10px 12px;font-weight:600;color:#555;">Brand</td><td style="padding:10px 12px;">${data.brand || '—'}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:600;color:#555;">Platform</td><td style="padding:10px 12px;">${data.platform || '—'}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:10px 12px;font-weight:600;color:#555;">Service</td><td style="padding:10px 12px;">${data.service || '—'}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:600;color:#555;">Budget</td><td style="padding:10px 12px;">${data.budget || '—'}</td></tr>
    </table>
    <div style="margin-top:20px;padding:16px;background:#f9f9f9;border-left:3px solid #cc1111;border-radius:4px;">
      <div style="font-size:12px;font-weight:600;color:#999;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Brief</div>
      <div style="font-size:14px;line-height:1.7;color:#333;">${(data.message || '—').replace(/\n/g, '<br>')}</div>
    </div>
    <div style="margin-top:20px;font-size:12px;color:#aaa;">Submitted: ${new Date().toLocaleString('el-GR', { timeZone: 'Europe/Athens' })}</div>
  </div>
</div>
  `.trim();

  MailApp.sendEmail({
    to:       NOTIFICATION_EMAIL,
    subject:  subject,
    body:     body,
    htmlBody: htmlBody
  });
}

// ── CORS-friendly JSON response ──
function buildResponse(obj) {
  const output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
