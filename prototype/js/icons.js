(function (global) {
  'use strict';

  const TC = (global.TapClinic = global.TapClinic || {});

  // Aligned to Figma PROGRES-IMK Screen B2 (6 sensations in 2x3 grid)
  const SENSATIONS = [
    {
      id: 'throbbing',
      labelId: 'Berdenyut',
      color: '#0284c7',
      svg: `
        <svg viewBox="0 0 40 40" width="34" height="34" fill="none" aria-hidden="true">
          <path class="sens-anim-pulse" d="M22 5 11 21h8l-2 14 12-17h-8l1-13Z" fill="currentColor" opacity="0.18" stroke="currentColor" stroke-width="2.3" stroke-linejoin="round"/>
        </svg>`
    },
    {
      id: 'burning',
      labelId: 'Panas / Terbakar',
      color: '#ea580c',
      svg: `
        <svg viewBox="0 0 40 40" width="34" height="34" fill="none" aria-hidden="true">
          <path d="M20 5c4 5 9 9.5 9 16.5a9 9 0 1 1-18 0c0-4.2 2.2-7.5 4.4-10.2.5 2.4 2 3.8 3.6 4.2-.8-3.6-.5-7.4 1-10.5Z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
          <path d="M20 20c2 2.2 3.5 4.1 3.5 6.3a3.5 3.5 0 1 1-7 0c0-2.1 1.4-4 3.5-6.3Z" fill="currentColor"/>
        </svg>`
    },
    {
      id: 'sharp',
      labelId: 'Perih / Menusuk',
      color: '#dc2626',
      svg: `
        <svg viewBox="0 0 40 40" width="34" height="34" fill="none" aria-hidden="true">
          <path d="M20 6v9M20 25v9M6 20h9M25 20h9M10.1 10.1l6.2 6.2M23.7 23.7l6.2 6.2M29.9 10.1l-6.2 6.2M16.3 23.7l-6.2 6.2" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
          <circle cx="20" cy="20" r="2.6" fill="currentColor"/>
        </svg>`
    },
    {
      id: 'dull',
      labelId: 'Pegal / Tegang',
      color: '#0284c7',
      svg: `
        <svg viewBox="0 0 40 40" width="34" height="34" fill="none" aria-hidden="true">
          <path d="M8 15c3.5-3 7.5-3 12 0s8.5 3 12 0" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/>
          <path d="M8 24c3.5-3 7.5-3 12 0s8.5 3 12 0" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" opacity="0.72"/>
        </svg>`
    },
    {
      id: 'tingling',
      labelId: 'Kesemutan / Kebas',
      color: '#0284c7',
      svg: `
        <svg viewBox="0 0 40 40" width="34" height="34" fill="none" aria-hidden="true">
          <circle cx="14" cy="13" r="2.2" fill="currentColor"/>
          <circle cx="24" cy="11" r="1.9" fill="currentColor"/>
          <circle cx="28" cy="19" r="2.3" fill="currentColor"/>
          <circle cx="20" cy="20" r="2.7" fill="currentColor"/>
          <circle cx="11" cy="23" r="1.9" fill="currentColor"/>
          <circle cx="16" cy="29" r="2.2" fill="currentColor"/>
          <circle cx="26" cy="28" r="2.1" fill="currentColor"/>
        </svg>`
    },
    {
      id: 'nausea',
      labelId: 'Mual / Pusing',
      color: '#0284c7',
      svg: `
        <svg viewBox="0 0 40 40" width="34" height="34" fill="none" aria-hidden="true">
          <path d="M20 20c0-2.5 2-4.2 4.2-4.2 3.1 0 5.3 2.5 5.3 5.7 0 4.5-3.8 8-8.5 8-5.6 0-10-4.4-10-10 0-6.5 5.3-11.5 11.8-11.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`
    }
  ];

  const DURATIONS = [
    {
      id: 'just_now',
      labelId: 'Baru saja',
      svg: `
        <svg viewBox="0 0 36 36" width="24" height="24" fill="none" aria-hidden="true">
          <circle cx="18" cy="20" r="11" stroke="currentColor" stroke-width="2.2"/>
          <path d="M15 6h6M18 6v3M18 20v-6M18 20l4 2.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>`
    },
    {
      id: 'today',
      labelId: 'Hari ini',
      svg: `
        <svg viewBox="0 0 36 36" width="24" height="24" fill="none" aria-hidden="true">
          <circle cx="18" cy="18" r="6.5" fill="currentColor" opacity="0.22" stroke="currentColor" stroke-width="2.2"/>
          <path d="M18 5v3M18 28v3M5 18h3M28 18h3M8.8 8.8l2.2 2.2M25 25l2.2 2.2M27.2 8.8 25 11M11 25l-2.2 2.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>`
    },
    {
      id: 'days',
      labelId: '2–6 hari',
      svg: `
        <svg viewBox="0 0 36 36" width="24" height="24" fill="none" aria-hidden="true">
          <rect x="6" y="8" width="24" height="21" rx="4" stroke="currentColor" stroke-width="2.2"/>
          <path d="M6 14.5h24M12 5.5v4M24 5.5v4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="13" cy="20" r="1.8" fill="currentColor"/>
          <circle cx="18" cy="20" r="1.8" fill="currentColor"/>
          <circle cx="23" cy="20" r="1.8" fill="currentColor"/>
        </svg>`
    },
    {
      id: 'week_plus',
      labelId: '> 1 minggu',
      svg: `
        <svg viewBox="0 0 36 36" width="24" height="24" fill="none" aria-hidden="true">
          <rect x="6" y="8" width="24" height="21" rx="4" stroke="currentColor" stroke-width="2.2"/>
          <path d="M6 14.5h24M12 5.5v4M24 5.5v4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M18 18.5v7M14.5 22h7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        </svg>`
    }
  ];

  function getSeverityBucket(level) {
    const n = Number(level) || 1;
    if (n <= 3) return { cls: 'sev-low', color: '#16a34a', bg: '#dcfce7', labelId: 'Nyeri Ringan' };
    if (n <= 5) return { cls: 'sev-mid', color: '#d97706', bg: '#fef3c7', labelId: 'Nyeri Sedang' };
    if (n <= 7) return { cls: 'sev-high', color: '#ea580c', bg: '#ffedd5', labelId: 'Nyeri Berat' };
    return { cls: 'sev-crit', color: '#dc2626', bg: '#fee2e2', labelId: 'Nyeri Sangat Berat' };
  }

  function getPainFaceSvg(level, size) {
    const px = size || 48;
    const n = Math.max(1, Math.min(10, Number(level) || 1));
    let bg = '#dcfce7';
    let stroke = '#15803d';
    let eyes = '<circle cx="18" cy="20" r="2.2" fill="#15803d"/><circle cx="30" cy="20" r="2.2" fill="#15803d"/>';
    let brows = '';
    let mouth = '<path d="M16 29c2.5 3.5 13.5 3.5 16 0" stroke="#15803d" stroke-width="2.6" stroke-linecap="round" fill="none"/>';
    let sweat = '';

    if (n >= 3 && n <= 4) {
      bg = '#fef9c3';
      stroke = '#a16207';
      eyes = '<circle cx="18" cy="20" r="2.2" fill="#a16207"/><circle cx="30" cy="20" r="2.2" fill="#a16207"/>';
      mouth = '<path d="M17 30c3.5 1 10.5 1 14 0" stroke="#a16207" stroke-width="2.6" stroke-linecap="round" fill="none"/>';
    } else if (n >= 5 && n <= 6) {
      bg = '#fef3c7';
      stroke = '#b45309';
      eyes = '<circle cx="18" cy="20" r="2.2" fill="#b45309"/><circle cx="30" cy="20" r="2.2" fill="#b45309"/>';
      brows = '<path d="M14 15.5l6 1.5M34 15.5l-6 1.5" stroke="#b45309" stroke-width="2" stroke-linecap="round"/>';
      mouth = '<path d="M16 30.5h16" stroke="#b45309" stroke-width="2.6" stroke-linecap="round"/>';
    } else if (n >= 7 && n <= 8) {
      bg = '#ffedd5';
      stroke = '#ea580c';
      eyes = '<circle cx="18" cy="21" r="2.3" fill="#0f172a"/><circle cx="30" cy="21" r="2.3" fill="#0f172a"/>';
      brows = '<path d="M13.5 14.5l6.5 3.5M34.5 14.5l-6.5 3.5" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>';
      mouth = '<path d="M16 32c3.5-4 12.5-4 16 0" stroke="#0f172a" stroke-width="2.6" stroke-linecap="round" fill="none"/>';
      sweat = '<path d="M36 16c1.5 2.2 1.5 3.8 0 4.6a1.9 1.9 0 0 1-2.8-1.6c0-1 1.1-2 2.8-3Z" fill="#0284c7"/>';
    } else if (n >= 9) {
      bg = '#fee2e2';
      stroke = '#dc2626';
      eyes = '<path d="M15 18.5l5 2-5 2M33 18.5l-5 2 5 2" stroke="#0f172a" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
      brows = '<path d="M13.5 14l6.5 3M34.5 14l-6.5 3" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>';
      mouth = '<path d="M15.5 33c2.5-4.5 14.5-4.5 17 0" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" fill="none"/>';
      sweat = '<path d="M35.5 23.5c1.6 2.4 1.6 4.2 0 5.2a2.1 2.1 0 0 1-3-1.8c0-1.2 1.2-2.2 3-3.4Z" fill="#0284c7"/>';
    }

    return `
      <svg viewBox="0 0 48 48" width="${px}" height="${px}" aria-hidden="true">
        <circle cx="24" cy="24" r="21" fill="${bg}" stroke="${stroke}" stroke-width="2.6"/>
        ${brows}
        ${eyes}
        ${mouth}
        ${sweat}
      </svg>`;
  }

  function getMiniPainTicksHtml(currentLevel) {
    const ticks = [1, 3, 5, 7, 10];
    return ticks
      .map((val) => {
        const active = Math.abs(Number(currentLevel) - val) <= 1 &&
          ticks.reduce((best, t) => (Math.abs(t - currentLevel) < Math.abs(best - currentLevel) ? t : best), ticks[0]) === val;
        return `
          <button type="button" class="b3-tick-btn ${active ? 'active' : ''}" data-tick-level="${val}" aria-label="Pilih skala nyeri ${val}">
            ${getPainFaceSvg(val, 28)}
            <span>${val}</span>
          </button>`;
      })
      .join('');
  }

  const MINI_FRONT_ICON = `
    <svg viewBox="0 0 28 36" width="20" height="26" fill="none" aria-hidden="true">
      <circle cx="14" cy="5.5" r="3.2" fill="currentColor" opacity="0.22" stroke="currentColor" stroke-width="1.7"/>
      <path d="M8.5 11.5c0-1.4 2.4-2.2 5.5-2.2s5.5.8 5.5 2.2l2 8.5h-2.5l-1.2-5v16h-2.6v-9.5h-2.4V31h-2.6V15l-1.2 5H6.5l2-8.5Z" fill="currentColor" opacity="0.16" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="12.8" cy="5.2" r="0.6" fill="currentColor"/>
      <circle cx="15.2" cy="5.2" r="0.6" fill="currentColor"/>
      <path d="M12 13.5h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    </svg>`;

  const MINI_BACK_ICON = `
    <svg viewBox="0 0 28 36" width="20" height="26" fill="none" aria-hidden="true">
      <circle cx="14" cy="5.5" r="3.2" fill="currentColor" opacity="0.85" stroke="currentColor" stroke-width="1.7"/>
      <path d="M8.5 11.5c0-1.4 2.4-2.2 5.5-2.2s5.5.8 5.5 2.2l2 8.5h-2.5l-1.2-5v16h-2.6v-9.5h-2.4V31h-2.6V15l-1.2 5H6.5l2-8.5Z" fill="currentColor" opacity="0.16" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M14 10.5v10.5" stroke="currentColor" stroke-width="1.5" stroke-dasharray="1.5 1.5" stroke-linecap="round"/>
    </svg>`;

  const FLIP_180_ICON = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/>
      <path d="M3 21v-5h5"/>
    </svg>`;

  const DUAL_VIEW_ICON = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="8" height="16" rx="2"/>
      <rect x="13" y="4" width="8" height="16" rx="2"/>
    </svg>`;

  const STETHOSCOPE_ICON = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3"/>
      <path d="M9 12.5V16a5 5 0 0 0 10 0v-3.5"/>
      <circle cx="19" cy="10" r="2.2"/>
    </svg>`;

  function getSensationById(id) {
    if (id === 'cramping') return SENSATIONS[3];
    return SENSATIONS.find((s) => s.id === id) || SENSATIONS[0];
  }

  function getDurationById(id) {
    return DURATIONS.find((d) => d.id === id) || DURATIONS[1];
  }

  TC.Icons = {
    SENSATIONS,
    DURATIONS,
    getSeverityBucket,
    getPainFaceSvg,
    getMiniPainTicksHtml,
    getSensationById,
    getDurationById,
    MINI_FRONT_ICON,
    MINI_BACK_ICON,
    FLIP_180_ICON,
    DUAL_VIEW_ICON,
    STETHOSCOPE_ICON
  };
})(window);
