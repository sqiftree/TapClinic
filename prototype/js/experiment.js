(function (global) {
  'use strict';

  const TC = (global.TapClinic = global.TapClinic || {});

  const SCENARIOS = {
    X: {
      id: 'X',
      title: 'Skenario Keluhan X',
      bullets: [
        'Keluhan 1: Dada sebelah kiri terasa berdenyut, intensitas 7/10, mulai terasa hari ini.',
        'Keluhan 2: Punggung bawah / pinggang terasa pegal, intensitas 5/10, sudah berlangsung 2–6 hari.'
      ]
    },
    Y: {
      id: 'Y',
      title: 'Skenario Keluhan Y',
      bullets: [
        'Keluhan 1: Perut bagian atas (ulu hati) terasa panas/perih, intensitas 8/10, sudah 2–6 hari.',
        'Keluhan 2: Lengan bawah & tangan kanan terasa kesemutan, intensitas 4/10, baru saja muncul.'
      ]
    }
  };

  const SUS_ITEMS_ID = [
    'Saya rasa saya akan sering menggunakan sistem ini.',
    'Saya merasa sistem ini terlalu rumit tanpa alasan yang jelas.',
    'Saya merasa sistem ini mudah digunakan.',
    'Saya rasa saya memerlukan bantuan orang teknis untuk dapat menggunakan sistem ini.',
    'Saya menemukan bahwa berbagai fungsi dalam sistem ini terintegrasi dengan baik.',
    'Saya rasa terlalu banyak ketidakkonsistenan dalam sistem ini.',
    'Saya membayangkan kebanyakan orang akan belajar menggunakan sistem ini dengan sangat cepat.',
    'Saya merasa sistem ini sangat canggung/membingungkan saat digunakan.',
    'Saya merasa sangat percaya diri saat menggunakan sistem ini.',
    'Saya perlu mempelajari banyak hal terlebih dahulu sebelum dapat menggunakan sistem ini.'
  ];

  function mountExperiment(container, onExit, onDatasetUpdated) {
    const state = {
      stage: 'intake', // intake | task1 | sus1 | task2 | sus2 | done
      participant: {
        participant_id: TC.Telemetry.DatasetStore.getNextParticipantId(),
        age: '20',
        gender: 'L',
        clinic_history: 'Pernah',
        hl_1: 3,
        hl_2: 3,
        hl_3: 3,
        order: TC.Telemetry.DatasetStore.getNextOrder()
      },
      results: { A: null, B: null },
      susAnswers: { A: Array(10).fill(null), B: Array(10).fill(null) },
      preference: 'B',
      feedback: '',
      saved: false,
      errorMsg: ''
    };

    function getOrderVariants() {
      return state.participant.order === 'AB' ? ['A', 'B'] : ['B', 'A'];
    }

    function renderScenarioBanner(scenarioKey, variantLabel) {
      const sc = SCENARIOS[scenarioKey];
      return `
        <div class="scenario-banner">
          <div class="scenario-banner-head">
            <h3>${sc.title} — Tugas pada ${variantLabel}</h3>
          </div>
          <ul class="scenario-bullets">
            ${sc.bullets.map((b) => `<li>${b}</li>`).join('')}
          </ul>
        </div>`;
    }

    function renderIntake() {
      const p = state.participant;
      container.innerHTML = `
        <div class="card va-card">
          <h2 style="margin-top:0">Mode Eksperimen HCI (Within-Subjects A/B)</h2>
          <p style="color:var(--ink-muted);font-size:0.9rem;margin-top:0">
            Isi data responden anonim sebelum memulai pengujian dua varian secara berurutan.
          </p>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px">
            <div class="form-group">
              <label for="exp-pid">ID Partisipan (Anonim)</label>
              <input id="exp-pid" class="input-control" type="text" value="${p.participant_id}" />
            </div>
            <div class="form-group">
              <label for="exp-order">Urutan (Counterbalance)</label>
              <select id="exp-order" class="select-control">
                <option value="AB" ${p.order === 'AB' ? 'selected' : ''}>AB (Teks → TapClinic)</option>
                <option value="BA" ${p.order === 'BA' ? 'selected' : ''}>BA (TapClinic → Teks)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="exp-age">Usia (Tahun)</label>
              <input id="exp-age" class="input-control" type="number" min="17" max="80" value="${p.age}" />
            </div>
            <div class="form-group">
              <label for="exp-gender">Jenis Kelamin</label>
              <select id="exp-gender" class="select-control">
                <option value="L" ${p.gender === 'L' ? 'selected' : ''}>Laki-laki</option>
                <option value="P" ${p.gender === 'P' ? 'selected' : ''}>Perempuan</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="exp-clinic">Pernah berobat ke klinik/fasilitas kesehatan kampus?</label>
            <select id="exp-clinic" class="select-control">
              <option value="Pernah" ${p.clinic_history === 'Pernah' ? 'selected' : ''}>Pernah</option>
              <option value="Belum" ${p.clinic_history === 'Belum' ? 'selected' : ''}>Belum pernah</option>
            </select>
          </div>

          <div style="border-top:1px solid var(--border);padding-top:12px;margin-top:6px">
            <strong style="font-size:0.92rem">Cek Singkat Literasi Kesehatan (Skala 1 = Sangat Sulit s.d. 4 = Sangat Mudah)</strong>
            ${[
              ['hl_1', '1. Memahami penjelasan dokter/tenaga medis tentang kondisi kesehatan Anda'],
              ['hl_2', '2. Menemukan informasi mengenai gejala penyakit yang sedang dialami'],
              ['hl_3', '3. Menilai kapan perlu segera pergi ke klinik saat sakit']
            ]
              .map(
                ([key, q]) => `
                <div class="form-group" style="margin-top:8px">
                  <label for="exp-${key}">${q}</label>
                  <select id="exp-${key}" class="select-control">
                    <option value="1" ${p[key] === 1 ? 'selected' : ''}>1 — Sangat Sulit</option>
                    <option value="2" ${p[key] === 2 ? 'selected' : ''}>2 — Cukup Sulit</option>
                    <option value="3" ${p[key] === 3 ? 'selected' : ''}>3 — Cukup Mudah</option>
                    <option value="4" ${p[key] === 4 ? 'selected' : ''}>4 — Sangat Mudah</option>
                  </select>
                </div>`
              )
              .join('')}
          </div>

          ${state.errorMsg ? `<p class="field-error">${state.errorMsg}</p>` : ''}

          <div class="wizard-actions">
            <button type="button" id="exp-cancel" class="btn btn-secondary">← Beranda</button>
            <button type="button" id="exp-start" class="btn btn-primary">Mulai Sesi Tugas 1 →</button>
          </div>
        </div>`;

      container.querySelector('#exp-cancel').addEventListener('click', onExit);
      container.querySelector('#exp-start').addEventListener('click', () => {
        const pid = container.querySelector('#exp-pid').value.trim();
        const age = Number(container.querySelector('#exp-age').value);
        if (!pid || !Number.isFinite(age) || age < 17) {
          state.errorMsg = 'Lengkapi ID partisipan dan usia (≥17 tahun).';
          render();
          return;
        }
        state.participant.participant_id = pid;
        state.participant.order = container.querySelector('#exp-order').value;
        state.participant.age = String(age);
        state.participant.gender = container.querySelector('#exp-gender').value;
        state.participant.clinic_history = container.querySelector('#exp-clinic').value;
        state.participant.hl_1 = Number(container.querySelector('#exp-hl_1').value);
        state.participant.hl_2 = Number(container.querySelector('#exp-hl_2').value);
        state.participant.hl_3 = Number(container.querySelector('#exp-hl_3').value);
        state.errorMsg = '';
        state.stage = 'task1';
        render();
      });
    }

    function renderTask(taskIndex) {
      const variants = getOrderVariants();
      const variant = variants[taskIndex];
      const scenarioKey = taskIndex === 0 ? 'X' : 'Y';
      const label = variant === 'B' ? 'Varian B (TapClinic Visual)' : 'Varian A (Formulir Teks)';

      container.innerHTML = `
        ${renderScenarioBanner(scenarioKey, label)}
        <div id="exp-task-host"></div>`;

      const host = container.querySelector('#exp-task-host');
      const doneCb = (res) => {
        res.scenario = scenarioKey;
        state.results[variant] = res;
        state.stage = taskIndex === 0 ? 'sus1' : 'sus2';
        render();
      };

      if (variant === 'B') {
        TC.VariantB.mount(host, { onComplete: doneCb });
      } else {
        TC.VariantA.mount(host, { onComplete: doneCb });
      }
    }

    function renderSUS(susIndex) {
      const variants = getOrderVariants();
      const variant = variants[susIndex];
      const title =
        variant === 'B'
          ? 'Kuesioner SUS — Varian B (TapClinic Peta Tubuh)'
          : 'Kuesioner SUS — Varian A (Formulir Teks)';
      const answers = state.susAnswers[variant];

      const itemsHtml = SUS_ITEMS_ID.map((text, idx) => {
        const optsHtml = [1, 2, 3, 4, 5]
          .map((val) => {
            const checked = answers[idx] === val ? 'checked' : '';
            const hint = val === 1 ? 'STS' : val === 5 ? 'SS' : '';
            return `
              <label class="likert-opt">
                <input type="radio" name="sus-q-${idx}" value="${val}" ${checked} />
                <span>${val}${hint ? `<small style="font-size:0.68rem">${hint}</small>` : ''}</span>
              </label>`;
          })
          .join('');
        return `
          <div class="sus-item">
            <p>${idx + 1}. ${text}</p>
            <div class="likert-row">${optsHtml}</div>
          </div>`;
      }).join('');

      const prefBlock =
        susIndex === 1
          ? `
          <div class="sus-item" style="background:var(--surface-tint);border-color:var(--primary)">
            <p>Secara keseluruhan, antarmuka mana yang lebih Anda pilih untuk digunakan di klinik kampus?</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <label class="btn btn-secondary btn-sm"><input type="radio" name="exp-pref" value="B" ${state.preference === 'B' ? 'checked' : ''} /> Varian B (TapClinic)</label>
              <label class="btn btn-secondary btn-sm"><input type="radio" name="exp-pref" value="A" ${state.preference === 'A' ? 'checked' : ''} /> Varian A (Teks)</label>
              <label class="btn btn-secondary btn-sm"><input type="radio" name="exp-pref" value="Equal" ${state.preference === 'Equal' ? 'checked' : ''} /> Sama saja</label>
            </div>
            <div class="form-group" style="margin-top:10px;margin-bottom:0">
              <label for="exp-feedback">Komentar singkat responden (opsional):</label>
              <input id="exp-feedback" class="input-control" type="text" value="${state.feedback}" placeholder="Apa yang paling membantu atau membingungkan?" />
            </div>
          </div>`
          : '';

      container.innerHTML = `
        <div class="card va-card">
          <h2 style="margin-top:0">${title}</h2>
          <p style="font-size:0.86rem;color:var(--ink-muted);margin-top:0">
            Skala 1 = Sangat Tidak Setuju (STS) hingga 5 = Sangat Setuju (SS).
          </p>
          ${itemsHtml}
          ${prefBlock}
          ${state.errorMsg ? `<p class="field-error">${state.errorMsg}</p>` : ''}
          <div class="wizard-actions">
            <span></span>
            <button type="button" id="exp-sus-next" class="btn btn-primary">
              ${susIndex === 0 ? 'Lanjut ke Tugas 2 →' : 'Selesaikan & Lihat Hasil ✓'}
            </button>
          </div>
        </div>`;

      container.querySelectorAll('input[type="radio"][name^="sus-q-"]').forEach((inp) => {
        inp.addEventListener('change', (ev) => {
          const idx = Number(ev.target.name.replace('sus-q-', ''));
          state.susAnswers[variant][idx] = Number(ev.target.value);
          state.errorMsg = '';
        });
      });

      if (susIndex === 1) {
        container.querySelectorAll('input[name="exp-pref"]').forEach((inp) => {
          inp.addEventListener('change', (ev) => {
            state.preference = ev.target.value;
          });
        });
        const fb = container.querySelector('#exp-feedback');
        if (fb) {
          fb.addEventListener('input', (ev) => {
            state.feedback = ev.target.value;
          });
        }
      }

      container.querySelector('#exp-sus-next').addEventListener('click', () => {
        if (state.susAnswers[variant].some((v) => v === null)) {
          state.errorMsg = 'Mohon isi seluruh 10 butir kuesioner SUS sebelum melanjutkan.';
          render();
          return;
        }
        state.errorMsg = '';
        state.stage = susIndex === 0 ? 'task2' : 'done';
        if (state.stage === 'done') {
          saveCurrentSession();
        }
        render();
      });
    }

    function buildSessionRecord() {
      const p = state.participant;
      const resA = state.results.A;
      const resB = state.results.B;
      const susA = TC.Telemetry.calculateSUS(state.susAnswers.A);
      const susB = TC.Telemetry.calculateSUS(state.susAnswers.B);
      const hlMean = Math.round(((p.hl_1 + p.hl_2 + p.hl_3) / 3) * 100) / 100;

      return {
        participant_id: p.participant_id,
        order: p.order,
        age: Number(p.age),
        gender: p.gender,
        clinic_history: p.clinic_history,
        hl_1: p.hl_1,
        hl_2: p.hl_2,
        hl_3: p.hl_3,
        hl_mean: hlMean,
        scenario_a: resA.scenario,
        scenario_b: resB.scenario,
        time_a_sec: resA.durationSec,
        errors_a: resA.errorCount,
        keystrokes_a: resA.keystrokes,
        backspaces_a: resA.backspaces,
        sus_a: susA,
        time_b_sec: resB.durationSec,
        errors_b: resB.errorCount,
        interactions_b: resB.interactionCount,
        regions_b_count: resB.regionsCount,
        sus_b: susB,
        preference: state.preference,
        feedback: state.feedback,
        completed_at: new Date().toISOString()
      };
    }

    function saveCurrentSession() {
      if (state.saved) return;
      state.record = buildSessionRecord();
      TC.Telemetry.DatasetStore.addSession(state.record);
      state.saved = true;
      if (onDatasetUpdated) onDatasetUpdated();
    }

    function renderDone() {
      const r = state.record || buildSessionRecord();
      container.innerHTML = `
        <div class="card va-card">
          <h2 style="margin-top:0">✓ Sesi Eksperimen Selesai (${r.participant_id})</h2>
          <p style="color:var(--ink-muted);font-size:0.9rem;margin-top:0">
            Data telah otomatis disimpan ke penyimpanan lokal browser (urutan <strong>${r.order}</strong>).
          </p>

          <div class="metrics-compare-grid">
            <div class="metric-box">
              <small>Waktu Pengisian (A vs B)</small>
              <strong>${r.time_a_sec}s vs ${r.time_b_sec}s</strong>
            </div>
            <div class="metric-box">
              <small>Error Tugas (A vs B)</small>
              <strong>${r.errors_a} vs ${r.errors_b}</strong>
            </div>
            <div class="metric-box">
              <small>Skor SUS (A vs B)</small>
              <strong>${r.sus_a} vs ${r.sus_b}</strong>
            </div>
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
            <button type="button" id="exp-dl-csv" class="btn btn-primary">⬇ Unduh CSV (Untuk Python)</button>
            <button type="button" id="exp-dl-json" class="btn btn-secondary">⬇ Unduh JSON</button>
            <button type="button" id="exp-next-p" class="btn btn-secondary">＋ Partisipan Berikutnya</button>
            <button type="button" id="exp-home" class="btn btn-secondary">⌂ Beranda</button>
          </div>
        </div>`;

      container.querySelector('#exp-dl-csv').addEventListener('click', () => TC.Telemetry.DatasetStore.downloadCSV());
      container.querySelector('#exp-dl-json').addEventListener('click', () => TC.Telemetry.DatasetStore.downloadJSON());
      container.querySelector('#exp-next-p').addEventListener('click', () => mountExperiment(container, onExit, onDatasetUpdated));
      container.querySelector('#exp-home').addEventListener('click', onExit);
    }

    function render() {
      if (state.stage === 'intake') renderIntake();
      else if (state.stage === 'task1') renderTask(0);
      else if (state.stage === 'sus1') renderSUS(0);
      else if (state.stage === 'task2') renderTask(1);
      else if (state.stage === 'sus2') renderSUS(1);
      else renderDone();
    }

    render();
  }

  TC.Experiment = { mount: mountExperiment, SCENARIOS, SUS_ITEMS_ID };
})(window);
