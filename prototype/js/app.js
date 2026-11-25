(function (global) {
  'use strict';

  const TC = (global.TapClinic = global.TapClinic || {});

  const RESEARCHER_KEY = 'tapclinic_researcher_unlocked_v1';
  const PIN_SHA256 = 'f250606cbf93fcb624edc81ec931918306e06e706e4903d2f031a4ad0144ddaf';
  const PIN_FNV1A = 'bee19d02';

  function fnv1aHex(str) {
    let h = 0x811c9dc5;
    const bytes = new TextEncoder().encode(str);
    for (let i = 0; i < bytes.length; i += 1) {
      h ^= bytes[i];
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  }

  async function verifyPin(rawPin) {
    const pin = String(rawPin || '').trim();
    if (!pin) return false;
    if (global.crypto && global.crypto.subtle && global.isSecureContext) {
      const buf = await global.crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin));
      const hex = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      return hex === PIN_SHA256;
    }
    return fnv1aHex(pin) === PIN_FNV1A;
  }

  TC.ResearcherAuth = {
    isUnlocked() {
      try {
        return global.sessionStorage.getItem(RESEARCHER_KEY) === '1';
      } catch (_e) {
        return false;
      }
    },
    async unlock(pin) {
      const ok = await verifyPin(pin);
      if (ok) {
        try {
          global.sessionStorage.setItem(RESEARCHER_KEY, '1');
        } catch (_e) {
          // ignore
        }
      }
      return ok;
    },
    lock() {
      try {
        global.sessionStorage.removeItem(RESEARCHER_KEY);
      } catch (_e) {
        // ignore
      }
    }
  };

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
      const count = TC.Telemetry.DatasetStore.getAll().length;
      badgeCount.textContent = TC.ResearcherAuth.isUnlocked() ? String(count) : '🔒';
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
              <p>Formulir teks bertahap 3 langkah (1 pertanyaan per layar) sebagai kondisi kontrol pembanding untuk eksperimen kebergunaan.</p>
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

    function renderDataModal(authError) {
      if (!TC.ResearcherAuth.isUnlocked()) {
        dataModalBody.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:12px">
            <div style="background:var(--surface-tint);border:1px solid #bae6fd;border-radius:14px;padding:12px 14px;font-size:0.86rem;color:var(--ink-muted);line-height:1.5">
              <strong>🔒 Akses Khusus Tim Peneliti</strong><br/>
              Data eksperimen disimpan secara lokal di perangkat ini (tidak tercampur antar-pengguna). Masukkan PIN tim peneliti untuk melihat, mengekspor, atau menghapus dataset.
            </div>
            <form id="researcher-unlock-form" style="display:flex;flex-direction:column;gap:10px">
              <div class="form-group" style="margin-bottom:0">
                <label for="researcher-pin-input">PIN Tim Peneliti</label>
                <input id="researcher-pin-input" class="input-control" type="password" autocomplete="off" placeholder="Masukkan PIN tim..." required />
              </div>
              ${authError ? `<p class="field-error" style="margin:0">${authError}</p>` : ''}
              <button type="submit" class="btn btn-primary">Buka Akses Tim</button>
            </form>
          </div>`;

        const form = document.getElementById('researcher-unlock-form');
        const pinInput = document.getElementById('researcher-pin-input');
        pinInput.focus();
        form.addEventListener('submit', async (ev) => {
          ev.preventDefault();
          const ok = await TC.ResearcherAuth.unlock(pinInput.value);
          if (ok) {
            updateBadge();
            renderDataModal('');
          } else {
            renderDataModal('PIN tidak sesuai. Silakan periksa kembali dengan tim peneliti.');
          }
        });
        return;
      }

      const rows = TC.Telemetry.DatasetStore.getAll();
      if (rows.length === 0) {
        dataModalBody.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px">
            <span style="font-size:0.84rem;color:var(--ink-muted)">🔓 Akses Tim Aktif</span>
            <button type="button" id="modal-lock" class="btn btn-secondary btn-sm">🔒 Kunci Akses</button>
          </div>
          <p style="color:var(--ink-muted)">Belum ada sesi eksperimen yang tersimpan di browser ini. Jalankan <strong>Mode Eksperimen HCI</strong> untuk merekam partisipan.</p>`;
        document.getElementById('modal-lock').addEventListener('click', () => {
          TC.ResearcherAuth.lock();
          updateBadge();
          renderDataModal('');
        });
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
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center">
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" id="modal-dl-csv" class="btn btn-primary btn-sm">⬇ Ekspor CSV</button>
            <button type="button" id="modal-dl-json" class="btn btn-secondary btn-sm">⬇ Ekspor JSON</button>
            <button type="button" id="modal-clear" class="btn btn-danger-ghost btn-sm">🗑 Hapus Semua</button>
          </div>
          <button type="button" id="modal-lock" class="btn btn-secondary btn-sm">🔒 Kunci Akses</button>
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
      document.getElementById('modal-lock').addEventListener('click', () => {
        TC.ResearcherAuth.lock();
        updateBadge();
        renderDataModal('');
      });
      document.getElementById('modal-clear').addEventListener('click', () => {
        const confirmed = global.confirm(
          'Yakin ingin menghapus seluruh dataset eksperimen di perangkat ini? Tindakan ini tidak dapat dibatalkan.'
        );
        if (!confirmed) return;
        TC.Telemetry.DatasetStore.clear();
        updateBadge();
        renderDataModal('');
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
