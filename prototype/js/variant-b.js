(function (global) {
  'use strict';

  const TC = (global.TapClinic = global.TapClinic || {});

  function mountVariantB(container, options) {
    const opts = options || {};
    const onComplete = typeof opts.onComplete === 'function' ? opts.onComplete : null;
    const onExit = typeof opts.onExit === 'function' ? opts.onExit : null;
    const tracker = new TC.Telemetry.TaskTracker('variant_b');

    // Step-based Figma PROGRES-IMK flow: b1 -> b2 -> b3 -> b4 -> b5 (EMR demo)
    const state = {
      step: 'b1', // 'b1' | 'b2' | 'b3' | 'b4' | 'b5'
      viewMode: 'dual', // 'dual' | 'front' | 'back'
      activeRegionId: null,
      draft: { sensation: 'throbbing', intensity: 7, duration: 'today' },
      entries: {},
      lastMetrics: null
    };

    function selectRegion(regionId) {
      const existing = state.entries[regionId];
      state.activeRegionId = regionId;
      state.draft = existing
        ? { ...existing }
        : { sensation: 'throbbing', intensity: 7, duration: 'today' };
      tracker.log('tap_region', regionId);
      render();
    }

    function commitDraftToEntries() {
      if (!state.activeRegionId) return;
      state.entries[state.activeRegionId] = {
        regionId: state.activeRegionId,
        sensation: state.draft.sensation,
        intensity: Number(state.draft.intensity),
        duration: state.draft.duration
      };
      tracker.log('save_region', state.activeRegionId);
    }

    function submitToDoctor() {
      const count = Object.keys(state.entries).length;
      if (count === 0) {
        tracker.recordError('finish_empty', null);
        return;
      }
      const summary = tracker.stop();
      const payload = {
        variant: 'B',
        entries: { ...state.entries },
        regionsCount: count,
        durationSec: summary.durationSec,
        errorCount: summary.errorCount,
        interactionCount: summary.interactionCount,
        events: summary.events
      };
      if (onComplete) {
        onComplete(payload);
      } else {
        state.lastMetrics = payload;
        state.step = 'b5';
        render();
      }
    }

    function renderStepB1() {
      const savedCount = Object.keys(state.entries).length;
      const selectedMeta = state.activeRegionId ? TC.Anatomy.ANATOMY_REGIONS[state.activeRegionId] : null;

      const dotsHtml = Object.values(state.entries)
        .map((e) => {
          const sev = TC.Icons.getSeverityBucket(e.intensity);
          return `<span class="pain-mini-dot" style="background:${sev.color}"></span>`;
        })
        .join('');

      const bodiesHtml =
        state.viewMode === 'dual'
          ? `
            <div class="b1-dual-bodies">
              <div class="b1-body-slot">
                <div class="b1-slot-badge">${TC.Icons.MINI_FRONT_ICON} <span class="label-text">Depan</span></div>
                <div class="body-svg-wrap">
                  ${TC.Anatomy.renderBodySvg({ side: 'front', entries: state.entries, selectedRegionId: state.activeRegionId })}
                </div>
              </div>
              <div class="b1-body-slot">
                <div class="b1-slot-badge">${TC.Icons.MINI_BACK_ICON} <span class="label-text">Belakang</span></div>
                <div class="body-svg-wrap">
                  ${TC.Anatomy.renderBodySvg({ side: 'back', entries: state.entries, selectedRegionId: state.activeRegionId })}
                </div>
              </div>
            </div>`
          : `
            <div class="b1-body-slot">
              <div class="b1-slot-badge">
                ${state.viewMode === 'front' ? TC.Icons.MINI_FRONT_ICON : TC.Icons.MINI_BACK_ICON}
                <span class="label-text">${state.viewMode === 'front' ? 'Depan' : 'Belakang'}</span>
              </div>
              <div class="body-svg-wrap">
                ${TC.Anatomy.renderBodySvg({ side: state.viewMode, entries: state.entries, selectedRegionId: state.activeRegionId })}
              </div>
            </div>`;

      return `
        <div class="phone-card">
          <div>
            <div class="b1-toolbar">
              <span class="step-kicker">TapClinic • Langkah 1/3</span>
              <div style="display:flex;align-items:center;gap:6px">
                ${savedCount > 0 ? `<span class="pain-dots-pill">${dotsHtml} <span>${savedCount}</span></span>` : ''}
                <div class="b1-mode-toggle" role="group" aria-label="Mode tampilan anatomi">
                  <button type="button" class="b1-mode-btn ${state.viewMode === 'dual' ? 'active' : ''}" data-view="dual" title="Depan & Belakang" aria-label="Tampilkan Depan dan Belakang">${TC.Icons.DUAL_VIEW_ICON}</button>
                  <button type="button" class="b1-mode-btn ${state.viewMode === 'front' ? 'active' : ''}" data-view="front" title="Fokus Depan" aria-label="Fokus Tampak Depan">${TC.Icons.MINI_FRONT_ICON}</button>
                  <button type="button" class="b1-mode-btn ${state.viewMode === 'back' ? 'active' : ''}" data-view="back" title="Fokus Belakang" aria-label="Fokus Tampak Belakang">${TC.Icons.MINI_BACK_ICON}</button>
                </div>
              </div>
            </div>
            <h2 class="step-title">Ketuk Bagian Tubuh yang Sakit</h2>
            <p class="step-subtitle label-block">Tanpa mengetik. Sentuh langsung area anatomi tampak depan atau belakang.</p>
          </div>

          ${bodiesHtml}

          <div class="selected-pill ${selectedMeta ? '' : 'empty'}">
            ${
              selectedMeta
                ? `<span class="pain-mini-dot" style="background:#dc2626"></span><span>Terpilih: ${selectedMeta.labelId}</span>`
                : '<span>Sentuh area tubuh di atas untuk memilih titik keluhan</span>'
            }
          </div>

          <button type="button" id="b1-next" class="btn btn-primary btn-full" ${selectedMeta ? '' : 'disabled'}>
            Lanjut Pilih Sensasi →
          </button>
          ${
            savedCount > 0
              ? `<button type="button" id="b1-to-summary" class="btn btn-secondary btn-full btn-sm">Lihat Ringkasan (${savedCount} keluhan) →</button>`
              : ''
          }
        </div>`;
    }

    function renderStepB2() {
      const meta = TC.Anatomy.ANATOMY_REGIONS[state.activeRegionId];
      const cardsHtml = TC.Icons.SENSATIONS.map((s) => {
        const active = state.draft.sensation === s.id ? 'active' : '';
        return `
          <button type="button" class="sens-card-btn ${active}" data-sensation="${s.id}" style="color:${s.color}" aria-label="${s.labelId}">
            <span class="sens-check-badge" aria-hidden="true">✓</span>
            ${s.svg}
            <span class="sens-card-title">${s.labelId}</span>
          </button>`;
      }).join('');

      return `
        <div class="phone-card">
          <div>
            <span class="step-kicker">TapClinic • Langkah 2/3</span>
            <h2 class="step-title">Seperti Apa Rasanya?</h2>
            <div class="pain-dots-pill" style="margin-top:6px;background:var(--primary-soft);border-color:#bae6fd;color:var(--primary-dark)">
              <span>Lokasi: ${meta.labelId}</span>
            </div>
          </div>

          <div class="sensation-grid-2x3">${cardsHtml}</div>

          <div class="wizard-actions">
            <button type="button" id="b2-back" class="btn btn-secondary">← Kembali</button>
            <button type="button" id="b2-next" class="btn btn-primary" style="flex:1">Lanjut ke Skala Nyeri →</button>
          </div>
        </div>`;
    }

    function renderStepB3() {
      const sev = TC.Icons.getSeverityBucket(state.draft.intensity);
      const durHtml = TC.Icons.DURATIONS.map((d) => {
        const active = state.draft.duration === d.id ? 'active' : '';
        return `
          <button type="button" class="tile-btn ${active}" data-duration="${d.id}" aria-label="${d.labelId}">
            ${d.svg}
            <span class="tile-lbl">${d.labelId}</span>
          </button>`;
      }).join('');

      return `
        <div class="phone-card">
          <div>
            <span class="step-kicker">TapClinic • Langkah 3/3</span>
            <h2 class="step-title">Seberapa Parah Rasa Sakitnya?</h2>
          </div>

          <div class="b3-face-stage">
            <div id="b3-face-big">${TC.Icons.getPainFaceSvg(state.draft.intensity, 92)}</div>
            <div class="b3-score-readout">
              <span class="big" id="b3-score-num">${state.draft.intensity}</span>
              <span class="denom">/10</span>
            </div>
            <span class="sev-pill" id="b3-sev-pill" style="background:${sev.bg};color:${sev.color}">${sev.labelId}</span>
          </div>

          <input id="b3-pain-range" class="pain-range" type="range" min="1" max="10" step="1" value="${state.draft.intensity}" aria-label="Skala intensitas nyeri 1 sampai 10" />

          <div class="b3-ticks-row" id="b3-ticks">
            ${TC.Icons.getMiniPainTicksHtml(state.draft.intensity)}
          </div>

          <div>
            <div style="font-size:0.8rem;font-weight:700;color:var(--ink-muted);margin-bottom:6px">Sejak kapan dirasakan?</div>
            <div class="duration-grid">${durHtml}</div>
          </div>

          <div class="wizard-actions">
            <button type="button" id="b3-back" class="btn btn-secondary">← Kembali</button>
            <button type="button" id="b3-next" class="btn btn-primary" style="flex:1">Lihat Ringkasan Keluhan →</button>
          </div>
        </div>`;
    }

    function renderStepB4() {
      const list = Object.values(state.entries);
      const cardsHtml = list
        .map((e) => {
          const reg = TC.Anatomy.ANATOMY_REGIONS[e.regionId];
          const sens = TC.Icons.getSensationById(e.sensation);
          const dur = TC.Icons.getDurationById(e.duration);
          const sev = TC.Icons.getSeverityBucket(e.intensity);
          return `
            <div class="b4-summary-item">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                <span style="font-size:0.76rem;font-weight:700;color:var(--primary)">${reg.side === 'front' ? 'Tampak Depan' : 'Tampak Belakang'}</span>
                <div style="display:flex;gap:6px">
                  <button type="button" class="btn btn-secondary btn-sm" data-edit-region="${e.regionId}">Ubah</button>
                  ${list.length > 1 ? `<button type="button" class="btn btn-danger-ghost btn-sm" data-del-region="${e.regionId}">Hapus</button>` : ''}
                </div>
              </div>
              <div class="b4-row">
                <div class="b4-row-icon">📍</div>
                <div><small>Lokasi</small><strong>${reg.labelId}</strong></div>
              </div>
              <div class="b4-row">
                <div class="b4-row-icon">⚡</div>
                <div><small>Sensasi</small><strong>${sens.labelId}</strong></div>
              </div>
              <div class="b4-row">
                <div class="b4-row-icon">🌡</div>
                <div>
                  <small>Keparahan &amp; Durasi</small>
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:2px">
                    <strong>${e.intensity} / 10</strong>
                    <span class="sev-pill" style="background:${sev.bg};color:${sev.color}">${sev.labelId}</span>
                    <span style="font-size:0.82rem;color:var(--ink-muted)">• ${dur.labelId}</span>
                  </div>
                </div>
              </div>
            </div>`;
        })
        .join('');

      return `
        <div class="phone-card">
          <div>
            <span class="step-kicker">TapClinic • Ringkasan</span>
            <h2 class="step-title">Ringkasan Keluhan Anda</h2>
          </div>

          ${cardsHtml}

          <button type="button" id="b4-add-more" class="btn btn-secondary btn-full btn-sm">
            ＋ Tambah Lokasi Nyeri Lain
          </button>

          <div class="b4-disclaimer">
            Catatan: Informasi ini hanya untuk pencatatan awal sebelum bertemu dokter, bukan merupakan diagnosis medis.
          </div>

          <button type="button" id="b4-submit" class="btn btn-primary btn-full">
            Kirim ke Ruang Dokter
          </button>
          <button type="button" id="b4-edit-last" class="btn btn-secondary btn-full">
            Ubah Jawaban
          </button>
        </div>`;
    }

    function renderStepB5() {
      const list = Object.values(state.entries);
      const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const primary = list[0];
      const primaryReg = TC.Anatomy.ANATOMY_REGIONS[primary.regionId];
      const primarySens = TC.Icons.getSensationById(primary.sensation);
      const primarySev = TC.Icons.getSeverityBucket(primary.intensity);

      const quickListHtml = list
        .map((e, idx) => {
          const r = TC.Anatomy.ANATOMY_REGIONS[e.regionId];
          const s = TC.Icons.getSensationById(e.sensation);
          const d = TC.Icons.getDurationById(e.duration);
          const sv = TC.Icons.getSeverityBucket(e.intensity);
          return `
            <div style="padding:10px 12px;border:1px solid var(--border);border-radius:12px;background:var(--surface);margin-bottom:8px">
              <div style="font-size:0.75rem;color:var(--ink-subtle)">Keluhan ${idx + 1} (${r.side === 'front' ? 'Anterior' : 'Posterior'})</div>
              <div style="font-weight:800;font-size:0.96rem;margin:2px 0">${r.labelId}</div>
              <div style="font-size:0.86rem;color:var(--ink-muted)">Karakteristik: <strong>${s.labelId}</strong> • Durasi: ${d.labelId}</div>
              <div style="margin-top:4px;font-weight:700;color:${sv.color}">${e.intensity}/10 — ${sv.labelId}</div>
            </div>`;
        })
        .join('');

      const autoSentence =
        list.length === 1
          ? `Pasien melaporkan nyeri ${primaryReg.labelId.toLowerCase()} bersifat ${primarySens.labelId.toLowerCase()} dengan intensitas ${primarySev.labelId.toLowerCase()} (${primary.intensity}/10). Siap untuk pemeriksaan fisik dokter.`
          : `Pasien melaporkan ${list.length} titik keluhan (utama: ${primaryReg.labelId.toLowerCase()}, ${primarySens.labelId.toLowerCase()}, ${primary.intensity}/10). Siap untuk pemeriksaan fisik dokter.`;

      return `
        <div class="b5-emr-card">
          <div class="b5-emr-header">
            <strong>EMR Klinik Kampus — Antrean Pra-Konsultasi</strong>
            <span>Auto-Generated TapClinic</span>
          </div>
          <div class="b5-meta-bar">
            <span>Pasien: <strong>Mahasiswa Aktif</strong> &nbsp;|&nbsp; Waktu Input: <strong>${nowTime} WIB</strong></span>
            <span class="b5-status-pill">Menunggu Dipanggil</span>
          </div>

          <div class="b5-emr-body">
            <div class="b1-dual-bodies">
              <div class="b1-body-slot">
                <div class="b1-slot-badge">${TC.Icons.MINI_FRONT_ICON} <span>Anterior</span></div>
                ${TC.Anatomy.renderBodySvg({ side: 'front', entries: state.entries, interactive: false })}
              </div>
              <div class="b1-body-slot">
                <div class="b1-slot-badge">${TC.Icons.MINI_BACK_ICON} <span>Posterior</span></div>
                ${TC.Anatomy.renderBodySvg({ side: 'back', entries: state.entries, interactive: false })}
              </div>
            </div>

            <div>
              <h3 style="margin:0 0 10px;color:var(--primary);font-size:1rem">Ringkasan Cepat (Quick Scan 3 Detik)</h3>
              ${quickListHtml}
              <div class="b5-quick-scan">
                <strong>Ringkasan Sistem:</strong> ${autoSentence}
              </div>
              <div style="font-size:0.8rem;color:var(--ink-subtle);margin-top:10px">
                Telemetri Demo: ${state.lastMetrics.durationSec} detik • Error sentuh: ${state.lastMetrics.errorCount} • Interaksi: ${state.lastMetrics.interactionCount}
              </div>
              <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
                <button type="button" id="b5-restart" class="btn btn-secondary btn-sm">↻ Coba Lagi</button>
                ${onExit ? '<button type="button" id="b5-home" class="btn btn-primary btn-sm">⌂ Beranda</button>' : ''}
              </div>
            </div>
          </div>
        </div>`;
    }

    function bindEvents() {
      if (state.step === 'b1') {
        container.querySelectorAll('.b1-mode-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            state.viewMode = btn.getAttribute('data-view');
            tracker.log('switch_view', state.viewMode);
            render();
          });
        });

        container.querySelectorAll('.body-region-hit').forEach((el) => {
          el.addEventListener('click', (ev) => {
            ev.stopPropagation();
            selectRegion(el.getAttribute('data-region-id'));
          });
          el.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
              ev.preventDefault();
              selectRegion(el.getAttribute('data-region-id'));
            }
          });
        });

        container.querySelectorAll('.body-bg-miss').forEach((bg) => {
          bg.addEventListener('click', () => {
            tracker.recordError('mis_tap', state.viewMode);
          });
        });

        const nextBtn = container.querySelector('#b1-next');
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            if (!state.activeRegionId) return;
            state.step = 'b2';
            render();
          });
        }

        const sumBtn = container.querySelector('#b1-to-summary');
        if (sumBtn) {
          sumBtn.addEventListener('click', () => {
            state.step = 'b4';
            render();
          });
        }
        return;
      }

      if (state.step === 'b2') {
        container.querySelectorAll('[data-sensation]').forEach((btn) => {
          btn.addEventListener('click', () => {
            state.draft.sensation = btn.getAttribute('data-sensation');
            tracker.log('pick_sensation', state.draft.sensation);
            render();
          });
        });
        container.querySelector('#b2-back').addEventListener('click', () => {
          tracker.recordError('cancel_region', state.activeRegionId);
          state.step = 'b1';
          render();
        });
        container.querySelector('#b2-next').addEventListener('click', () => {
          state.step = 'b3';
          render();
        });
        return;
      }

      if (state.step === 'b3') {
        const rangeEl = container.querySelector('#b3-pain-range');
        const syncIntensityUi = (val) => {
          state.draft.intensity = val;
          const sev = TC.Icons.getSeverityBucket(val);
          const faceBig = container.querySelector('#b3-face-big');
          const scoreNum = container.querySelector('#b3-score-num');
          const sevPill = container.querySelector('#b3-sev-pill');
          const ticksWrap = container.querySelector('#b3-ticks');
          if (faceBig) faceBig.innerHTML = TC.Icons.getPainFaceSvg(val, 92);
          if (scoreNum) scoreNum.textContent = String(val);
          if (sevPill) {
            sevPill.textContent = sev.labelId;
            sevPill.style.background = sev.bg;
            sevPill.style.color = sev.color;
          }
          if (ticksWrap) {
            ticksWrap.innerHTML = TC.Icons.getMiniPainTicksHtml(val);
            bindTickButtons();
          }
        };

        const bindTickButtons = () => {
          container.querySelectorAll('[data-tick-level]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const lvl = Number(btn.getAttribute('data-tick-level'));
              if (rangeEl) rangeEl.value = String(lvl);
              tracker.log('pick_intensity_tick', lvl);
              syncIntensityUi(lvl);
            });
          });
        };

        if (rangeEl) {
          rangeEl.addEventListener('input', (ev) => syncIntensityUi(Number(ev.target.value)));
          rangeEl.addEventListener('change', () => tracker.log('set_intensity', state.draft.intensity));
        }
        bindTickButtons();

        container.querySelectorAll('[data-duration]').forEach((btn) => {
          btn.addEventListener('click', () => {
            state.draft.duration = btn.getAttribute('data-duration');
            tracker.log('pick_duration', state.draft.duration);
            render();
          });
        });

        container.querySelector('#b3-back').addEventListener('click', () => {
          state.step = 'b2';
          render();
        });
        container.querySelector('#b3-next').addEventListener('click', () => {
          commitDraftToEntries();
          state.step = 'b4';
          render();
        });
        return;
      }

      if (state.step === 'b4') {
        container.querySelectorAll('[data-edit-region]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const rid = btn.getAttribute('data-edit-region');
            state.activeRegionId = rid;
            state.draft = { ...state.entries[rid] };
            state.step = 'b2';
            render();
          });
        });
        container.querySelectorAll('[data-del-region]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const rid = btn.getAttribute('data-del-region');
            delete state.entries[rid];
            tracker.log('delete_region', rid);
            render();
          });
        });
        container.querySelector('#b4-add-more').addEventListener('click', () => {
          state.activeRegionId = null;
          state.step = 'b1';
          render();
        });
        container.querySelector('#b4-submit').addEventListener('click', submitToDoctor);
        container.querySelector('#b4-edit-last').addEventListener('click', () => {
          const keys = Object.keys(state.entries);
          state.activeRegionId = keys[keys.length - 1] || null;
          state.step = 'b1';
          render();
        });
        return;
      }

      if (state.step === 'b5') {
        const restartBtn = container.querySelector('#b5-restart');
        if (restartBtn) restartBtn.addEventListener('click', () => mountVariantB(container, opts));
        const homeBtn = container.querySelector('#b5-home');
        if (homeBtn && onExit) homeBtn.addEventListener('click', onExit);
      }
    }

    function render() {
      if (state.step === 'b1') container.innerHTML = renderStepB1();
      else if (state.step === 'b2') container.innerHTML = renderStepB2();
      else if (state.step === 'b3') container.innerHTML = renderStepB3();
      else if (state.step === 'b4') container.innerHTML = renderStepB4();
      else container.innerHTML = renderStepB5();
      bindEvents();
    }

    render();
  }

  TC.VariantB = { mount: mountVariantB };
})(window);
