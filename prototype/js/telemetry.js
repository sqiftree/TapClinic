(function (global) {
  'use strict';

  const TC = (global.TapClinic = global.TapClinic || {});
  const STORAGE_KEY = 'tapclinic_hci_sessions_v1';
  const CLOUD_URL_OVERRIDE_KEY = 'tapclinic_cloud_url_v1';

  // Web App URL (/exec) Google Apps Script (write-only) untuk sinkronisasi otomatis ke Sheets tim
  const CLOUD_SYNC_URL = 'https://script.google.com/macros/s/AKfycbz6d8N47tXtBb2g5yQ50zB28l5vpNIq9Ip9wc8I-aHl882MoX15yasndiGUAheKoyJj5Q/exec';

  const CSV_COLUMNS = [
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
    'completed_at'
  ];

  class TaskTracker {
    constructor(variantName) {
      this.variantName = variantName;
      this.startedAt = performance.now();
      this.endedAt = null;
      this.errorCount = 0;
      this.interactionCount = 0;
      this.events = [];
    }

    log(type, detail) {
      this.interactionCount += 1;
      this.events.push({
        tMs: Math.round(performance.now() - this.startedAt),
        type,
        detail: detail || null
      });
    }

    recordError(type, detail) {
      this.errorCount += 1;
      this.log(type, detail);
    }

    stop() {
      if (this.endedAt === null) {
        this.endedAt = performance.now();
      }
      return this.getSummary();
    }

    getSummary() {
      const end = this.endedAt !== null ? this.endedAt : performance.now();
      const durationSec = Math.max(0.1, Math.round(((end - this.startedAt) / 1000) * 10) / 10);
      return {
        variant: this.variantName,
        durationSec,
        errorCount: this.errorCount,
        interactionCount: this.interactionCount,
        events: this.events.slice()
      };
    }
  }

  function calculateSUS(answers) {
    if (!Array.isArray(answers) || answers.length !== 10) {
      return null;
    }
    let total = 0;
    for (let i = 0; i < 10; i += 1) {
      const val = Number(answers[i]);
      if (!Number.isFinite(val) || val < 1 || val > 5) {
        return null;
      }
      total += i % 2 === 0 ? val - 1 : 5 - val;
    }
    return Math.round(total * 2.5 * 10) / 10;
  }

  function escapeCsvCell(val) {
    const str = val === null || val === undefined ? '' : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function triggerDownload(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const DatasetStore = {
    getAll() {
      try {
        const raw = global.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (_err) {
        return [];
      }
    },

    addSession(record) {
      const list = this.getAll();
      list.push(record);
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list.length;
    },

    clear() {
      global.localStorage.removeItem(STORAGE_KEY);
    },

    getNextParticipantId() {
      const nextNum = this.getAll().length + 1;
      return 'P' + String(nextNum).padStart(2, '0');
    },

    getNextOrder() {
      return this.getAll().length % 2 === 0 ? 'AB' : 'BA';
    },

    toCSV() {
      const rows = this.getAll();
      const lines = [CSV_COLUMNS.join(',')];
      rows.forEach((r) => {
        const line = CSV_COLUMNS.map((col) => escapeCsvCell(r[col])).join(',');
        lines.push(line);
      });
      return lines.join('\n') + '\n';
    },

    downloadCSV() {
      const stamp = new Date().toISOString().slice(0, 10);
      triggerDownload(`tapclinic_hci_data_${stamp}.csv`, this.toCSV(), 'text/csv;charset=utf-8');
    },

    downloadJSON() {
      const stamp = new Date().toISOString().slice(0, 10);
      const payload = JSON.stringify(this.getAll(), null, 2);
      triggerDownload(`tapclinic_hci_data_${stamp}.json`, payload, 'application/json;charset=utf-8');
    }
  };

  const CloudSync = {
    getUrl() {
      const builtIn = String(CLOUD_SYNC_URL || '').trim();
      if (builtIn) return builtIn;
      try {
        return String(global.localStorage.getItem(CLOUD_URL_OVERRIDE_KEY) || '').trim();
      } catch (_e) {
        return '';
      }
    },

    setOverrideUrl(url) {
      const clean = String(url || '').trim();
      try {
        if (!clean) {
          global.localStorage.removeItem(CLOUD_URL_OVERRIDE_KEY);
        } else {
          global.localStorage.setItem(CLOUD_URL_OVERRIDE_KEY, clean);
        }
      } catch (_e) {
        // ignore
      }
    },

    isConfigured() {
      return Boolean(this.getUrl());
    },

    async sendSession(record) {
      const url = this.getUrl();
      if (!url) {
        return { status: 'not_configured' };
      }
      try {
        await global.fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(record)
        });
        return { status: 'sent' };
      } catch (err) {
        return { status: 'failed', error: String(err) };
      }
    }
  };

  TC.Telemetry = {
    CSV_COLUMNS,
    TaskTracker,
    calculateSUS,
    DatasetStore,
    CloudSync
  };
})(window);
