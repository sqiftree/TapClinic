/**
 * TapClinic HCI Experiment — Write-Only Google Sheets Collector (Google Apps Script)
 *
 * Keamanan:
 * - Hanya mengimplementasikan doPost(e) untuk MENAMBAH baris baru (appendRow).
 * - Tidak ada endpoint baca (doGet) atau hapus data, sehingga partisipan/pengguna link
 *   tidak dapat melihat, mengunduh, atau menghapus isi Spreadsheet tim peneliti.
 * - Spreadsheet sumber cukup dibagikan secara privat hanya kepada 3 anggota tim inti.
 */

const COLUMNS = [
  'participant_id',
  'order',
  'age',
  'gender',
  'clinic_history',
  'hl_1',
  'hl_2',
  'hl_3',
  'hl_mean',
  'scenario_a',
  'scenario_b',
  'time_a_sec',
  'errors_a',
  'keystrokes_a',
  'backspaces_a',
  'sus_a',
  'time_b_sec',
  'errors_b',
  'interactions_b',
  'regions_b_count',
  'sus_b',
  'preference',
  'completed_at',
  'feedback'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];

    // Inisialisasi header kolom secara otomatis pada baris pertama
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const row = COLUMNS.map((col) => (data[col] !== undefined && data[col] !== null ? data[col] : ''));
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, participant_id: data.participant_id || '' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
