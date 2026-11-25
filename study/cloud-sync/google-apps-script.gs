/**
 * TapClinic HCI Experiment — Write-Only Dual-Tab Google Sheets Collector
 *
 * Memisahkan hasil ke 2 sheet (tab) agar rapi:
 * 1. "Dataset_Paper"        -> Khusus data numerik/statistik siap olah di Python (analyze_usability.py)
 * 2. "Detail_Respon_Pasien" -> Log apa yang diketik di Varian A, apa yang di-tap di Varian B, & feedback
 *
 * Keamanan:
 * - Hanya mengimplementasikan doPost(e) (write-only). Tidak ada endpoint baca (doGet) atau hapus.
 */

const DATASET_COLUMNS = [
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

const DETAIL_COLUMNS = [
  'participant_id',
  'order',
  'completed_at',
  'scenario_a',
  'va_lokasi_ketik',
  'va_gejala_ketik',
  'va_skala_nyeri',
  'scenario_b',
  'vb_ringkasan_tap',
  'vb_region_ids',
  'preference',
  'feedback'
];

function getOrInitSheet(ss, name, headers, preferFirstSheet) {
  let sheet = ss.getSheetByName(name);
  if (!sheet && preferFirstSheet) {
    sheet = ss.getSheets()[0];
    if (sheet.getName() !== name && sheet.getName() === 'Sheet1') {
      sheet.setName(name);
    } else if (sheet.getName() !== name) {
      sheet = ss.insertSheet(name);
    }
  }
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else if (sheet.getLastColumn() < headers.length) {
    // Pastikan kolom baru (mis. feedback) ditambahkan di header jika sheet lama sudah terisi
    for (let i = sheet.getLastColumn() + 1; i <= headers.length; i += 1) {
      sheet.getRange(1, i).setValue(headers[i - 1]).setFontWeight('bold');
    }
  }
  return sheet;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const datasetSheet = getOrInitSheet(ss, 'Dataset_Paper', DATASET_COLUMNS, true);
    const detailSheet = getOrInitSheet(ss, 'Detail_Respon_Pasien', DETAIL_COLUMNS, false);

    const datasetRow = DATASET_COLUMNS.map((col) =>
      data[col] !== undefined && data[col] !== null ? data[col] : ''
    );
    const detailRow = DETAIL_COLUMNS.map((col) =>
      data[col] !== undefined && data[col] !== null ? data[col] : ''
    );

    datasetSheet.appendRow(datasetRow);
    detailSheet.appendRow(detailRow);

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
