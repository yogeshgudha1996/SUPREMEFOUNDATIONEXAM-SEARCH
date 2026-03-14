const SHEET_NAME = 'Responses';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');

    const requiredFields = [
      'name',
      'mobile',
      'rollNumber',
      'location',
      'grade',
      'subject',
      'school',
    ];

    const missing = requiredFields.filter((field) => !payload[field] || String(payload[field]).trim() === '');

    if (missing.length > 0) {
      return jsonResponse({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      }, 400);
    }

    const sheet = getOrCreateSheet_();
    const uniqueId = generateUniqueId_(sheet);
    const timestamp = new Date();

    sheet.appendRow([
      uniqueId,
      timestamp,
      payload.name,
      payload.mobile,
      payload.rollNumber,
      payload.location,
      payload.grade,
      payload.subject,
      payload.school,
    ]);

    return jsonResponse({
      success: true,
      message: 'Application submitted successfully.',
      uniqueId,
    }, 200);
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message || 'Unexpected server error.',
    }, 500);
  }
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'UniqueID',
      'Timestamp',
      'Name',
      'Mobile',
      'RollNumber',
      'Location',
      'Grade',
      'Subject',
      'School',
    ]);
  }

  return sheet;
}

function generateUniqueId_(sheet) {
  const now = new Date();
  const month = Utilities.formatDate(now, Session.getScriptTimeZone(), 'MMM').toUpperCase();
  const year = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yy');
  const prefix = `SF${month}${year}`;

  const values = sheet.getRange(2, 1, Math.max(0, sheet.getLastRow() - 1), 1).getValues().flat();
  const currentSeries = values
    .filter((id) => typeof id === 'string' && id.startsWith(prefix))
    .map((id) => Number(id.slice(prefix.length)))
    .filter((num) => !Number.isNaN(num));

  const nextNumber = currentSeries.length ? Math.max(...currentSeries) + 1 : 1;
  const serial = String(nextNumber).padStart(3, '0');

  return `${prefix}${serial}`;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
