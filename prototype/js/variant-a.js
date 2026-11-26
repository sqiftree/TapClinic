(function (global) {
  'use strict';

  const TC = (global.TapClinic = global.TapClinic || {});

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function mountVariantA(container, options) {
    const opts = options || {};
    const onComplete = typeof opts.onComplete === 'function' ? opts.onComplete : null;
    const onExit = typeof opts.onExit === 'function' ? opts.onExit : null;
    const tracker = new TC.Telemetry.TaskTracker('variant_a');

    // Alur 3 langkah formulir teks: A1 -> A2 -> A3 -> A4 (ringkasan mode demo)
    const state = {
      step: 1,
      errorMsg: '',
      keystrokes: 0,
      backspaces: 0,
      validationErrors: 0,
      backSteps: 0,
      lastMetrics: null,
      form: {
        primaryLocation: '',
        primarySensation: '',
        intensityPrimary: '',
        intensitySecondary: ''
      }
    };

    function bindInputTracking(el, field) {
      if (!el) return;
      let countedInBeforeInput = false;
      let prevLen = (el.value || '').length;

      el.addEventListener('beforeinput', (ev) => {
        const type = ev.inputType || '';
        if (type.startsWith('delete')) {
          state.backspaces += 1;
          state.keystrokes += 1;
          countedInBeforeInput = true;
        } else if (type === 'insertCompositionText') {
          // Biarkan event 'input' membandingkan perubahan panjang teks (komposisi Gboard Android)
          countedInBeforeInput = false;
        } else if (type.startsWith('insert')) {
          state.keystrokes += 1;
          countedInBeforeInput = true;
        }
      });

      el.addEventListener('input', (ev) => {
        const val = ev.target.value;
        if (!countedInBeforeInput) {
          if (val.length < prevLen) {
            state.backspaces += 1;
            state.keystrokes += 1;
          } else if (val.length > prevLen) {
            state.keystrokes += 1;
          }
        }
        countedInBeforeInput = false;
        prevLen = val.length;
        state.form[field] = val;

        if (state.errorMsg) {
          state.errorMsg = '';
          const errEl = container.querySelector('#va-error-msg');
          if (errEl) errEl.remove();
        }
      });
    }

    function isValidPainScale(raw) {
      const trimmed = String(raw || '').trim();
      if (!trimmed) return false;
      const n = Number(trimmed);
      return Number.isFinite(n) && Number.isInteger(n) && n >= 1 && n <= 10;
    }

    function validateStep() {
      if (state.step === 1 && !state.form.primaryLocation.trim()) {
        return 'Mohon tuliskan bagian tubuh mana yang terasa sakit atau tidak nyaman.';
      }
      if (state.step === 2 && !state.form.primarySensation.trim()) {
        return 'Mohon jelaskan sensasi rasa sakit beserta sejak kapan keluhan dirasakan.';
      }
      if (state.step === 3) {
        if (!isValidPainScale(state.form.intensityPrimary)) {
          return 'Masukkan angka bulat 1 sampai 10 untuk skala nyeri keluhan utama.';
        }
        if (
          state.form.intensitySecondary.trim() !== '' &&
          !isValidPainScale(state.form.intensitySecondary)
        ) {
          return 'Skala nyeri keluhan kedua harus berupa angka bulat 1 sampai 10 (atau kosongkan jika hanya 1 keluhan).';
        }
      }
      return '';
    }

    function nextStep() {
      const err = validateStep();
      if (err) {
        state.errorMsg = err;
        state.validationErrors += 1;
        tracker.recordError('validation_error', 'step_' + state.step);
        render();
        return;
      }

      tracker.log('step_next', 'step_' + state.step);

      if (state.step < 3) {
        state.step += 1;
        state.errorMsg = '';
        render();
        return;
      }

      const summary = tracker.stop();
      const combinedIntensity = state.form.intensitySecondary.trim()
        ? `${state.form.intensityPrimary.trim()}; ${state.form.intensitySecondary.trim()}`
        : state.form.intensityPrimary.trim();

      const payload = {
        variant: 'A',
        form: {
          primaryLocation: state.form.primaryLocation.trim(),
          primarySensation: state.form.primarySensation.trim(),
          intensity: combinedIntensity,
          intensityPrimary: state.form.intensityPrimary.trim(),
          intensitySecondary: state.form.intensitySecondary.trim()
        },
        durationSec: summary.durationSec,
        errorCount: summary.errorCount,
        validationErrors: state.validationErrors,
        backSteps: state.backSteps,
        keystrokes: state.keystrokes,
        backspaces: state.backspaces,
        interactionCount: summary.interactionCount,
        events: summary.events
      };

      if (onComplete) {
        onComplete(payload);
      } else {
        state.step = 4;
        state.lastMetrics = payload;
        render();
      }
    }

    function prevStep() {
      if (state.step > 1 && state.step <= 3) {
        state.step -= 1;
        state.backSteps += 1;
        state.errorMsg = '';
        tracker.recordError('back_step', 'to_step_' + state.step);
        render();
      }
    }

    function renderStepBody() {
      if (state.step === 1) {
        return `
          <div class="form-group">
            <label for="va-loc">Tuliskan secara rinci bagian tubuh mana saja yang terasa sakit atau tidak nyaman saat ini:</label>
            <textarea
              id="va-loc"
              class="textarea-control"
              rows="4"
              placeholder="Contoh: Dada sebelah kiri dan punggung bagian bawah..."
            >${escapeHtml(state.form.primaryLocation)}</textarea>
          </div>`;
      }

      if (state.step === 2) {
        return `
          <div class="form-group">
            <label for="va-sens">Jelaskan sensasi rasa sakit yang Anda alami (misal: berdenyut, perih, panas, pegal, kesemutan) beserta sejak kapan masing-masing keluhan dirasakan:</label>
            <textarea
              id="va-sens"
              class="textarea-control"
              rows="4"
              placeholder="Ketik deskripsi sensasi dan durasi keluhan di sini..."
            >${escapeHtml(state.form.primarySensation)}</textarea>
          </div>`;
      }

      if (state.step === 3) {
        return `
          <div class="form-group">
            <label for="va-int-1">Masukkan angka 1 sampai 10 untuk skala nyeri keluhan utama:</label>
            <input
              id="va-int-1"
              class="input-control"
              type="number"
              inputmode="numeric"
              min="1"
              max="10"
              step="1"
              placeholder="Contoh: 7"
              value="${escapeHtml(state.form.intensityPrimary)}"
            />
          </div>
          <div class="form-group">
            <label for="va-int-2">Skala nyeri keluhan kedua (1–10, isi jika ada keluhan tambahan):</label>
            <input
              id="va-int-2"
              class="input-control"
              type="number"
              inputmode="numeric"
              min="1"
              max="10"
              step="1"
              placeholder="Opsional (kosongkan jika hanya 1 keluhan)"
              value="${escapeHtml(state.form.intensitySecondary)}"
            />
          </div>`;
      }

      return `
        <div>
          <h3 style="margin-top:0">✓ Formulir Teks Terkirim</h3>
          <div class="metrics-compare-grid">
            <div class="metric-box"><small>Waktu Pengisian</small><strong>${state.lastMetrics.durationSec} dtk</strong></div>
            <div class="metric-box"><small>Error Validasi/Mundur</small><strong>${state.lastMetrics.errorCount}</strong></div>
            <div class="metric-box"><small>Total Ketikan</small><strong>${state.lastMetrics.keystrokes} tombol</strong></div>
            <div class="metric-box"><small>Hapus / Revisi</small><strong>${state.lastMetrics.backspaces}x Hapus</strong></div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button type="button" id="va-restart" class="btn btn-secondary">↻ Ulangi</button>
            ${onExit ? '<button type="button" id="va-exit" class="btn btn-primary">⌂ Beranda</button>' : ''}
          </div>
        </div>`;
    }

    function render() {
      const bars = [1, 2, 3]
        .map((n) => `<div class="step-bar ${state.step >= n ? 'done' : ''}"></div>`)
        .join('');

      const stepSubtitles = {
        1: 'Langkah 1 dari 3 — Lokasi Keluhan',
        2: 'Langkah 2 dari 3 — Deskripsi Gejala & Durasi',
        3: 'Langkah 3 dari 3 — Tingkat Keparahan'
      };

      container.innerHTML = `
        <div class="phone-card">
          <div>
            <span class="step-kicker">${state.step <= 3 ? stepSubtitles[state.step] : 'Varian A — Selesai'}</span>
            ${state.step <= 3 ? `<div class="step-progress" style="margin-top:8px;margin-bottom:4px">${bars}</div>` : ''}
          </div>
          ${renderStepBody()}
          ${state.errorMsg ? `<p id="va-error-msg" class="field-error" style="margin:0">${state.errorMsg}</p>` : ''}
          ${
            state.step <= 3
              ? `<div class="wizard-actions">
                  ${state.step > 1 ? '<button type="button" id="va-prev" class="btn btn-secondary">← Kembali</button>' : ''}
                  <button type="button" id="va-next" class="btn btn-primary" style="flex:1">${state.step === 3 ? 'Kirim Formulir' : 'Lanjut'}</button>
                </div>`
              : ''
          }
        </div>`;

      if (state.step === 1) bindInputTracking(container.querySelector('#va-loc'), 'primaryLocation');
      if (state.step === 2) bindInputTracking(container.querySelector('#va-sens'), 'primarySensation');
      if (state.step === 3) {
        bindInputTracking(container.querySelector('#va-int-1'), 'intensityPrimary');
        bindInputTracking(container.querySelector('#va-int-2'), 'intensitySecondary');
      }

      const prevBtn = container.querySelector('#va-prev');
      const nextBtn = container.querySelector('#va-next');
      if (prevBtn) prevBtn.addEventListener('click', prevStep);
      if (nextBtn) nextBtn.addEventListener('click', nextStep);

      const restartBtn = container.querySelector('#va-restart');
      if (restartBtn) restartBtn.addEventListener('click', () => mountVariantA(container, opts));
      const exitBtn = container.querySelector('#va-exit');
      if (exitBtn && onExit) exitBtn.addEventListener('click', onExit);
    }

    render();
  }

  TC.VariantA = { mount: mountVariantA };
})(window);
