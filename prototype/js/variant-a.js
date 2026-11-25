(function (global) {
  'use strict';

  const TC = (global.TapClinic = global.TapClinic || {});

  // Aligned to Figma PROGRES-IMK Variant A (A1 -> A2 -> A3)
  function mountVariantA(container, options) {
    const opts = options || {};
    const onComplete = typeof opts.onComplete === 'function' ? opts.onComplete : null;
    const onExit = typeof opts.onExit === 'function' ? opts.onExit : null;
    const tracker = new TC.Telemetry.TaskTracker('variant_a');

    const state = {
      step: 1, // 1 | 2 | 3 | 4 (done summary in demo mode)
      errorMsg: '',
      keystrokes: 0,
      backspaces: 0,
      validationErrors: 0,
      backSteps: 0,
      form: {
        primaryLocation: '',
        primarySensation: '',
        intensity: '7',
        durationText: '',
        ageText: '20'
      }
    };

    function bindInputTracking(el, field) {
      if (!el) return;
      el.addEventListener('keydown', (ev) => {
        state.keystrokes += 1;
        if (ev.key === 'Backspace' || ev.key === 'Delete') {
          state.backspaces += 1;
        }
      });
      el.addEventListener('input', (ev) => {
        state.form[field] = ev.target.value;
        state.errorMsg = '';
      });
    }

    function validateStep() {
      if (state.step === 1 && !state.form.primaryLocation.trim()) {
        return 'Mohon tuliskan bagian tubuh mana yang terasa sakit atau tidak nyaman.';
      }
      if (state.step === 2 && !state.form.primarySensation.trim()) {
        return 'Mohon jelaskan sensasi rasa sakit dan durasi atau keluhan tambahan Anda.';
      }
      if (state.step === 3) {
        const n = Number(state.form.intensity);
        if (!Number.isFinite(n) || n < 1 || n > 10) {
          return 'Masukkan angka skala nyeri antara 1 sampai 10.';
        }
        if (!state.form.ageText.trim()) {
          return 'Mohon masukkan usia Anda (tahun).';
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
      } else {
        const summary = tracker.stop();
        const totalErrors = state.validationErrors + state.backSteps + Math.floor(state.backspaces / 5);
        const payload = {
          variant: 'A',
          form: { ...state.form },
          durationSec: summary.durationSec,
          errorCount: totalErrors,
          validationErrors: state.validationErrors,
          backSteps: state.backSteps,
          keystrokes: state.keystrokes,
          backspaces: state.backspaces,
          interactionCount: summary.interactionCount
        };
        if (onComplete) {
          onComplete(payload);
        } else {
          state.step = 4;
          state.lastMetrics = payload;
          render();
        }
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
            <label for="va-loc">Tuliskan secara rinci bagian tubuh mana yang terasa sakit atau tidak nyaman saat ini:</label>
            <textarea id="va-loc" class="textarea-control" rows="4" placeholder="Contoh: Punggung bagian bawah sebelah kanan agak nyeri...">${escapeHtml(state.form.primaryLocation)}</textarea>
          </div>`;
      }
      if (state.step === 2) {
        return `
          <div class="form-group">
            <label for="va-sens">Jelaskan sensasi rasa sakit yang Anda alami (misal: berdenyut, perih, panas, menusuk) beserta sejak kapan &amp; keluhan tambahan:</label>
            <textarea id="va-sens" class="textarea-control" rows="4" placeholder="Ketik deskripsi di sini...">${escapeHtml(state.form.primarySensation)}</textarea>
          </div>`;
      }
      if (state.step === 3) {
        return `
          <div class="form-group">
            <label for="va-int">Masukkan angka 1 sampai 10 untuk tingkat keparahan nyeri Anda:</label>
            <input id="va-int" class="input-control" type="number" min="1" max="10" value="${escapeHtml(state.form.intensity)}" />
          </div>
          <div class="form-group">
            <label for="va-age">Masukkan usia Anda (tahun):</label>
            <input id="va-age" class="input-control" type="number" min="15" max="99" value="${escapeHtml(state.form.ageText)}" />
          </div>`;
      }
      return `
        <div>
          <h3 style="margin-top:0">✓ Formulir Teks Terkirim</h3>
          <div class="metrics-compare-grid">
            <div class="metric-box"><small>Waktu Pengisian</small><strong>${state.lastMetrics.durationSec} dtk</strong></div>
            <div class="metric-box"><small>Total Ketikan</small><strong>${state.lastMetrics.keystrokes} tombol</strong></div>
            <div class="metric-box"><small>Hapus / Revisi</small><strong>${state.lastMetrics.backspaces}x Backspace</strong></div>
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
        1: 'Langkah 1 dari 3 — Keluhan Utama',
        2: 'Langkah 2 dari 3 — Deskripsi Gejala',
        3: 'Langkah 3 dari 3 — Tingkat Keparahan'
      };

      container.innerHTML = `
        <div class="phone-card">
          <div>
            <span class="step-kicker">${state.step <= 3 ? stepSubtitles[state.step] : 'Varian A — Selesai'}</span>
            ${state.step <= 3 ? `<div class="step-progress" style="margin-top:8px;margin-bottom:4px">${bars}</div>` : ''}
          </div>
          ${renderStepBody()}
          ${state.errorMsg ? `<p class="field-error" style="margin:0">${state.errorMsg}</p>` : ''}
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
        bindInputTracking(container.querySelector('#va-int'), 'intensity');
        bindInputTracking(container.querySelector('#va-age'), 'ageText');
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

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  TC.VariantA = { mount: mountVariantA };
})(window);
