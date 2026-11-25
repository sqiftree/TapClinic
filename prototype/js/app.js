(function (global) {
  'use strict';

  const TC = (global.TapClinic = global.TapClinic || {});

  document.addEventListener('DOMContentLoaded', () => {
    const mainEl = document.getElementById('app-main');
    const btnHome = document.getElementById('btn-home');
    const btnLabels = document.getElementById('btn-toggle-labels');
    const btnOpenData = document.getElementById('btn-open-data');
    const badgeCount = document.getElementById('dataset-count-badge');
    const dataModal = document.getElementById('data-modal');
    const btnCloseData = document.getElementById('btn-close-data');
    const dataModalBody = document.getElementById('data-modal-body');

    function updateBadge() {
      badgeCount.textContent = String(TC.Telemetry.DatasetStore.getAll().length);
    }

    function renderHome() {
      mainEl.innerHTML = `
        <section class="hero-banner">
          <div class="hero-badge">TapClinic • Riset IMK UNS 2026</div>
          <h1>Tap-Where-It-Hurts: Anamnesis Visual Bebas Papan Ketik</h1>
          <p>
            Prototipe peta tubuh anatomi utuh (Depan &amp; Belakang) untuk membantu pasien heterogen menyampaikan keluhan pra-konsultasi tanpa beban mengetik maupun kendala literasi teks.
          </p>
        </section>

        <section class="hub-grid">
          <article class="hub-card featured">
            <div>
              <div class="hub-card-icon">${TC.Icons.MINI_FRONT_ICON}</div>
              <h2>TapClinic (Varian B)</h2>
              <p>Anatomi tubuh utuh Depan &amp; Belakang, 28 zona sentuh regional, 6 ikon sensasi, <em>slider</em> wajah nyeri 1–10, dan durasi visual tanpa papan ketik.</p>
            </div>
            <button type="button" id="go-demo-b" class="btn btn-primary">Buka Demo TapClinic →</button>
          </article>

          <article class="hub-card">
            <div>
              <div class="hub-card-icon">⌨</div>
              <h2>Pembanding (Varian A)</h2>
              <p>Formulir teks bertahap 5 langkah (1 pertanyaan per layar) sebagai kondisi kontrol pembanding untuk eksperimen kebergunaan.</p>
            </div>
            <button type="button" id="go-demo-a" class="btn btn-secondary">Buka Demo Formulir Teks →</button>
          </article>

          <article class="hub-card">
            <div>
              <div class="hub-card-icon">${TC.Icons.STETHOSCOPE_ICON}</div>
              <h2>Mode Eksperimen HCI (A/B + SUS)</h2>
              <p>Sesi pengujian lengkap <em>within-subjects counterbalanced</em> (AB/BA), pelacakan waktu &amp; error otomatis, kuesioner SUS 10-butir, dan ekspor CSV.</p>
            </div>
            <button type="button" id="go-exp" class="btn btn-primary">Mulai Sesi Eksperimen →</button>
          </article>
        </section>

        <div class="hub-meta">
          Tip: Tombol <strong>Aa</strong> di pojok kanan atas mengaktifkan atau menyembunyikan label kata singkat pada antarmuka visual (bawaan: Mode Visual Murni).
        </div>`;

      document.getElementById('go-demo-b').addEventListener('click', () => {
        TC.VariantB.mount(mainEl, { onExit: renderHome });
      });
      document.getElementById('go-demo-a').addEventListener('click', () => {
        TC.VariantA.mount(mainEl, { onExit: renderHome });
      });
      document.getElementById('go-exp').addEventListener('click', () => {
        TC.Experiment.mount(mainEl, renderHome, updateBadge);
      });
    }

    function renderDataModal() {
      const rows = TC.Telemetry.DatasetStore.getAll();
      if (rows.length === 0) {
        dataModalBody.innerHTML = `
          <p style="color:var(--ink-muted)">Belum ada sesi eksperimen yang tersimpan di browser ini. Jalankan <strong>Mode Eksperimen HCI</strong> untuk merekam partisipan.</p>`;
        return;
      }

      const trs = rows
        .map(
          (r) => `
          <tr>
            <td><strong>${r.participant_id}</strong></td>
            <td>${r.order}</td>
            <td>${r.age}/${r.gender}</td>
            <td>${r.time_a_sec}s</td>
            <td>${r.time_b_sec}s</td>
            <td>${r.errors_a}</td>
            <td>${r.errors_b}</td>
            <td>${r.sus_a}</td>
            <td>${r.sus_b}</td>
            <td>${r.preference}</td>
          </tr>`
        )
        .join('');

      dataModalBody.innerHTML = `
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" id="modal-dl-csv" class="btn btn-primary btn-sm">⬇ Ekspor CSV</button>
          <button type="button" id="modal-dl-json" class="btn btn-secondary btn-sm">⬇ Ekspor JSON</button>
          <button type="button" id="modal-clear" class="btn btn-danger-ghost btn-sm">🗑 Hapus Semua</button>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Urutan</th><th>Usia/JK</th>
                <th>Waktu A</th><th>Waktu B</th>
                <th>Err A</th><th>Err B</th>
                <th>SUS A</th><th>SUS B</th><th>Pilihan</th>
              </tr>
            </thead>
            <tbody>${trs}</tbody>
          </table>
        </div>`;

      document.getElementById('modal-dl-csv').addEventListener('click', () => TC.Telemetry.DatasetStore.downloadCSV());
      document.getElementById('modal-dl-json').addEventListener('click', () => TC.Telemetry.DatasetStore.downloadJSON());
      document.getElementById('modal-clear').addEventListener('click', () => {
        TC.Telemetry.DatasetStore.clear();
        updateBadge();
        renderDataModal();
      });
    }

    btnHome.addEventListener('click', renderHome);

    btnLabels.addEventListener('click', () => {
      const active = document.body.classList.toggle('show-labels');
      btnLabels.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    btnOpenData.addEventListener('click', () => {
      renderDataModal();
      dataModal.classList.remove('hidden');
    });

    btnCloseData.addEventListener('click', () => {
      dataModal.classList.add('hidden');
    });

    dataModal.addEventListener('click', (ev) => {
      if (ev.target === dataModal) dataModal.classList.add('hidden');
    });

    updateBadge();
    renderHome();
  });
})(window);
