(function (global) {
  'use strict';

  const TC = (global.TapClinic = global.TapClinic || {});

  // Realistic 8-head proportional symmetric human contour (viewBox 0 0 320 680, center x = 160)
  // Left & right halves are exact mirrors around x = 160.
  const BODY_OUTLINE_PATH = [
    // Cranium & ears -> jawline
    'M 160,16',
    'C 172,16 181,25 181,40',
    'C 183,42 185,46 184,54',
    'C 184,60 182,63 179,63',
    'C 178,74 174,82 169,86',
    // Neck -> trapezius -> acromion shoulder
    'L 171,99',
    'C 175,112 198,118 220,126',
    // Outer arm (natural A-pose)
    'C 236,133 243,148 244,167',
    'C 246,191 251,211 255,227',
    'C 262,252 271,280 278,308',
    // Wrist, fingers & lateral thumb
    'C 284,316 293,332 296,343',
    'C 296,347 291,348 287,341',
    'L 289,363',
    'C 289,369 284,371 281,366',
    'L 278,373',
    'C 276,376 272,375 271,368',
    'L 266,356',
    'C 264,347 265,332 266,317',
    // Inner forearm & bicep up to axilla
    'C 256,292 246,264 239,236',
    'C 231,218 221,197 215,183',
    // Torso: ribcage, waist, iliac hip, outer thigh
    'C 211,206 208,236 204,258',
    'C 208,284 218,308 219,336',
    'C 221,366 216,404 211,446',
    // Knee, calf, ankle, foot
    'C 210,468 214,496 213,522',
    'C 211,554 205,586 202,612',
    'C 206,626 212,642 211,653',
    'C 210,660 198,663 186,661',
    'C 178,659 175,650 177,638',
    'L 181,612',
    // Inner calf, inner knee, inner thigh up to perineum
    'C 178,582 178,550 181,522',
    'C 181,496 178,468 179,446',
    'C 175,412 169,382 163,358',
    'L 160,354',
    // Symmetric viewer-left half
    'L 157,358',
    'C 151,382 145,412 141,446',
    'C 142,468 139,496 139,522',
    'C 142,550 142,582 139,612',
    'L 143,638',
    'C 145,650 142,659 134,661',
    'C 122,663 110,660 109,653',
    'C 108,642 114,626 118,612',
    'C 115,586 109,554 107,522',
    'C 106,496 110,468 109,446',
    'C 104,404 99,366 101,336',
    'C 102,308 112,284 116,258',
    'C 112,236 109,206 105,183',
    'C 99,197 89,218 81,236',
    'C 74,264 64,292 54,317',
    'C 55,332 56,347 54,356',
    'L 49,368',
    'C 48,375 44,376 42,373',
    'L 39,366',
    'C 36,371 31,369 31,363',
    'L 33,341',
    'C 29,348 24,347 24,343',
    'C 27,332 36,316 42,308',
    'C 49,280 58,252 65,227',
    'C 69,211 74,191 76,167',
    'C 77,148 84,133 100,126',
    'C 122,118 145,112 149,99',
    'L 151,86',
    'C 146,82 142,74 141,63',
    'C 138,63 136,60 136,54',
    'C 135,46 137,42 139,40',
    'C 139,25 148,16 160,16 Z'
  ].join(' ');

  // Distinct, zero-text anatomical landmarks: Front (Anterior) vs Back (Posterior)
  const FRONT_LANDMARKS = `
    <g class="anatomy-landmarks" fill="none" stroke="#64748b" stroke-linecap="round" stroke-linejoin="round">
      <!-- Subtle facial contours & hairline -->
      <path d="M140,36 C144,21 176,21 180,36" stroke-width="1.2" opacity="0.5"/>
      <path d="M147,44 Q152,41.5 156,44 M164,44 Q168,41.5 173,44" stroke-width="1.25" opacity="0.68"/>
      <circle cx="151.5" cy="48.5" r="1.2" fill="#64748b" stroke="none" opacity="0.68"/>
      <circle cx="168.5" cy="48.5" r="1.2" fill="#64748b" stroke="none" opacity="0.68"/>
      <path d="M160,47 L160,57 Q157.5,59.5 162.5,59.5" stroke-width="1.15" opacity="0.55"/>
      <path d="M154.5,67 Q160,69.5 165.5,67" stroke-width="1.15" opacity="0.58"/>
      <path d="M149,78 Q160,83 171,78" stroke-width="0.95" opacity="0.35"/>

      <!-- Sternocleidomastoid V-line & Clavicles (collarbones) -->
      <path d="M150,92 L158,123 M170,92 L162,123" stroke-width="1.15" opacity="0.52"/>
      <path d="M156,125 C140,121 122,127 104,134" stroke-width="1.5" opacity="0.66"/>
      <path d="M164,125 C180,121 198,127 216,134" stroke-width="1.5" opacity="0.66"/>
      <path d="M156,125 Q160,129 164,125" stroke-width="1.35" opacity="0.62"/>

      <!-- Pectoral / Chest contour & Sternum -->
      <path d="M160,136 L160,188" stroke-width="1" opacity="0.34"/>
      <path d="M112,174 C122,189 145,189 156,178" stroke-width="1.3" opacity="0.54"/>
      <path d="M208,174 C198,189 175,189 164,178" stroke-width="1.3" opacity="0.54"/>

      <!-- Costal rib arch, Rectus abdominis & Umbilicus (navel) -->
      <path d="M125,204 Q143,191 160,196 Q177,191 195,204" stroke-width="1.15" opacity="0.44"/>
      <path d="M160,202 L160,262" stroke-width="0.95" opacity="0.3"/>
      <path d="M139,214 Q137,242 141,268 M181,214 Q183,242 179,268" stroke-width="1" opacity="0.34"/>
      <circle cx="160" cy="272" r="2.3" stroke-width="1.35" opacity="0.68"/>

      <!-- Anterior iliac / pelvic V-line -->
      <path d="M114,296 Q135,327 156,343 M206,296 Q185,327 164,343" stroke-width="1.25" opacity="0.48"/>

      <!-- Elbow creases & palm creases -->
      <path d="M76,224 Q85,228 92,222 M244,224 Q235,228 228,222" stroke-width="1.05" opacity="0.4"/>
      <path d="M40,334 Q46,338 50,332 M280,334 Q274,338 270,332" stroke-width="0.95" opacity="0.4"/>

      <!-- Quadriceps & Patellae (kneecaps) -->
      <path d="M126,374 Q123,408 128,434 M194,374 Q197,408 192,434" stroke-width="1.05" opacity="0.35"/>
      <ellipse cx="126" cy="450" rx="7.5" ry="9" stroke-width="1.35" opacity="0.6"/>
      <ellipse cx="194" cy="450" rx="7.5" ry="9" stroke-width="1.35" opacity="0.6"/>

      <!-- Shin line, ankle & forward-facing toes -->
      <path d="M126,472 L126,592 M194,472 L194,592" stroke-width="1.05" opacity="0.34"/>
      <path d="M118,616 Q125,619 133,616 M187,616 Q195,619 202,616" stroke-width="1.05" opacity="0.42"/>
      <path d="M113,655 L114,648 M119,657 L120,649 M125,658 L125,649 M131,657 L131,648" stroke-width="1.05" opacity="0.52"/>
      <path d="M207,655 L206,648 M201,657 L200,649 M195,658 L195,649 M189,657 L189,648" stroke-width="1.05" opacity="0.52"/>
    </g>`;

  const BACK_LANDMARKS = `
    <g class="anatomy-landmarks" fill="none" stroke="#64748b" stroke-linecap="round" stroke-linejoin="round">
      <!-- Posterior cranium / hair fill (unmistakably back of head) -->
      <path d="M139,49 C137,23 148,16.5 160,16.5 C172,16.5 183,23 181,49 C179,64 173,75 168,79 C164,74 156,74 152,79 C147,75 141,64 139,49 Z" fill="#94a3b8" fill-opacity="0.45" stroke-width="1.25" opacity="0.82"/>
      <!-- Nape / C7 prominence -->
      <circle cx="160" cy="112" r="2.4" stroke-width="1.25" opacity="0.6"/>

      <!-- Left & Right Scapulae (Shoulder Blades) -->
      <path d="M118,144 C132,141 146,154 143,174 C140,188 127,193 121,181 C116,170 113,152 118,144 Z" fill="#cbd5e1" fill-opacity="0.32" stroke-width="1.35" opacity="0.6"/>
      <path d="M202,144 C188,141 174,154 177,174 C180,188 193,193 199,181 C204,170 207,152 202,144 Z" fill="#cbd5e1" fill-opacity="0.32" stroke-width="1.35" opacity="0.6"/>

      <!-- Central Vertebral Spine Furrow -->
      <path d="M160,118 L160,296" stroke-width="1.6" opacity="0.58"/>
      <path d="M157,138h6M157,156h6M157,174h6M157,192h6M157,210h6M157,228h6M157,246h6M157,264h6M157,282h6" stroke-width="0.95" opacity="0.4"/>

      <!-- Sacral dimples & Gluteal contour / crease -->
      <circle cx="148" cy="296" r="1.6" fill="#64748b" stroke="none" opacity="0.48"/>
      <circle cx="172" cy="296" r="1.6" fill="#64748b" stroke="none" opacity="0.48"/>
      <path d="M107,322 C110,352 134,362 158,351" stroke-width="1.45" opacity="0.64"/>
      <path d="M213,322 C210,352 186,362 162,351" stroke-width="1.45" opacity="0.64"/>
      <path d="M160,308 L160,351" stroke-width="1.25" opacity="0.5"/>

      <!-- Posterior elbow & dorsal hand tendons -->
      <path d="M72,222 Q77,226 81,221 M248,222 Q243,226 239,221" stroke-width="1.15" opacity="0.46"/>
      <path d="M41,346 L43,358 M46,347 L47,361 M279,346 L277,358 M274,347 L273,361" stroke-width="0.95" opacity="0.42"/>

      <!-- Popliteal folds (back of knees) -->
      <path d="M114,452 Q126,456 138,452 M182,452 Q194,456 206,452" stroke-width="1.35" opacity="0.6"/>

      <!-- Gastrocnemius calves, Achilles tendons & heels -->
      <path d="M118,488 Q126,522 127,542 M136,488 Q128,522 127,542" stroke-width="1.15" opacity="0.46"/>
      <path d="M202,488 Q194,522 193,542 M184,488 Q192,522 193,542" stroke-width="1.15" opacity="0.46"/>
      <path d="M127,560 L127,632 M193,560 L193,632" stroke-width="1.45" opacity="0.52"/>
      <path d="M117,642 Q127,650 138,642 M182,642 Q193,650 203,642" stroke-width="1.45" opacity="0.65"/>
    </g>`;

  // 28 Ergonomic Regional Hitboxes (14 Front + 14 Back)
  const ANATOMY_REGIONS = {
    front_head: {
      id: 'front_head',
      side: 'front',
      labelId: 'Kepala & Wajah',
      cx: 160,
      cy: 48,
      path: 'M 110,0 L 210,0 L 210,88 L 110,88 Z'
    },
    front_neck: {
      id: 'front_neck',
      side: 'front',
      labelId: 'Leher Depan & Tenggorokan',
      cx: 160,
      cy: 108,
      path: 'M 120,88 L 200,88 L 206,128 L 114,128 Z'
    },
    front_upper_arm_right: {
      id: 'front_upper_arm_right',
      side: 'front',
      labelId: 'Bahu & Lengan Atas Kanan',
      cx: 86,
      cy: 176,
      path: 'M 0,115 L 118,115 L 114,128 L 106,184 L 102,240 L 0,240 Z'
    },
    front_upper_arm_left: {
      id: 'front_upper_arm_left',
      side: 'front',
      labelId: 'Bahu & Lengan Atas Kiri',
      cx: 234,
      cy: 176,
      path: 'M 202,115 L 320,115 L 320,240 L 218,240 L 214,184 L 206,128 Z'
    },
    front_forearm_hand_right: {
      id: 'front_forearm_hand_right',
      side: 'front',
      labelId: 'Lengan Bawah & Tangan Kanan',
      cx: 54,
      cy: 298,
      path: 'M 0,240 L 100,240 L 96,390 L 0,390 Z'
    },
    front_forearm_hand_left: {
      id: 'front_forearm_hand_left',
      side: 'front',
      labelId: 'Lengan Bawah & Tangan Kiri',
      cx: 266,
      cy: 298,
      path: 'M 220,240 L 320,240 L 320,390 L 224,390 Z'
    },
    front_chest_right: {
      id: 'front_chest_right',
      side: 'front',
      labelId: 'Dada Kanan',
      cx: 132,
      cy: 166,
      path: 'M 114,128 L 160,128 L 160,206 L 103,206 L 106,184 Z'
    },
    front_chest_left: {
      id: 'front_chest_left',
      side: 'front',
      labelId: 'Dada Kiri',
      cx: 188,
      cy: 166,
      path: 'M 160,128 L 206,128 L 214,184 L 217,206 L 160,206 Z'
    },
    front_abdomen_upper: {
      id: 'front_abdomen_upper',
      side: 'front',
      labelId: 'Perut Atas / Ulu Hati',
      cx: 160,
      cy: 234,
      path: 'M 103,206 L 217,206 L 216,264 L 104,264 Z'
    },
    front_abdomen_lower: {
      id: 'front_abdomen_lower',
      side: 'front',
      labelId: 'Perut Bawah & Panggul',
      cx: 160,
      cy: 304,
      path: 'M 98,264 L 222,264 L 226,358 L 94,358 Z'
    },
    front_thigh_right: {
      id: 'front_thigh_right',
      side: 'front',
      labelId: 'Paha & Lutut Kanan',
      cx: 126,
      cy: 416,
      path: 'M 90,358 L 160,358 L 160,478 L 90,478 Z'
    },
    front_thigh_left: {
      id: 'front_thigh_left',
      side: 'front',
      labelId: 'Paha & Lutut Kiri',
      cx: 194,
      cy: 416,
      path: 'M 160,358 L 230,358 L 230,478 L 160,478 Z'
    },
    front_lower_leg_foot_right: {
      id: 'front_lower_leg_foot_right',
      side: 'front',
      labelId: 'Betis & Kaki Kanan',
      cx: 126,
      cy: 560,
      path: 'M 90,478 L 160,478 L 160,680 L 90,680 Z'
    },
    front_lower_leg_foot_left: {
      id: 'front_lower_leg_foot_left',
      side: 'front',
      labelId: 'Betis & Kaki Kiri',
      cx: 194,
      cy: 560,
      path: 'M 160,478 L 230,478 L 230,680 L 160,680 Z'
    },

    back_head: {
      id: 'back_head',
      side: 'back',
      labelId: 'Kepala Belakang',
      cx: 160,
      cy: 48,
      path: 'M 110,0 L 210,0 L 210,88 L 110,88 Z'
    },
    back_neck: {
      id: 'back_neck',
      side: 'back',
      labelId: 'Tengkuk & Leher Belakang',
      cx: 160,
      cy: 108,
      path: 'M 120,88 L 200,88 L 206,128 L 114,128 Z'
    },
    back_upper_arm_left: {
      id: 'back_upper_arm_left',
      side: 'back',
      labelId: 'Bahu & Lengan Atas Kiri (Belakang)',
      cx: 86,
      cy: 176,
      path: 'M 0,115 L 118,115 L 114,128 L 106,184 L 102,240 L 0,240 Z'
    },
    back_upper_arm_right: {
      id: 'back_upper_arm_right',
      side: 'back',
      labelId: 'Bahu & Lengan Atas Kanan (Belakang)',
      cx: 234,
      cy: 176,
      path: 'M 202,115 L 320,115 L 320,240 L 218,240 L 214,184 L 206,128 Z'
    },
    back_forearm_hand_left: {
      id: 'back_forearm_hand_left',
      side: 'back',
      labelId: 'Lengan Bawah & Tangan Kiri (Belakang)',
      cx: 54,
      cy: 298,
      path: 'M 0,240 L 100,240 L 96,390 L 0,390 Z'
    },
    back_forearm_hand_right: {
      id: 'back_forearm_hand_right',
      side: 'back',
      labelId: 'Lengan Bawah & Tangan Kanan (Belakang)',
      cx: 266,
      cy: 298,
      path: 'M 220,240 L 320,240 L 320,390 L 224,390 Z'
    },
    back_upper_back: {
      id: 'back_upper_back',
      side: 'back',
      labelId: 'Punggung Atas & Belikat',
      cx: 160,
      cy: 164,
      path: 'M 114,128 L 206,128 L 214,184 L 217,202 L 103,202 L 106,184 Z'
    },
    back_mid_back: {
      id: 'back_mid_back',
      side: 'back',
      labelId: 'Punggung Tengah',
      cx: 160,
      cy: 228,
      path: 'M 103,202 L 217,202 L 215,254 L 105,254 Z'
    },
    back_lower_back: {
      id: 'back_lower_back',
      side: 'back',
      labelId: 'Pinggang & Punggung Bawah',
      cx: 160,
      cy: 278,
      path: 'M 102,254 L 218,254 L 222,302 L 98,302 Z'
    },
    back_glutes: {
      id: 'back_glutes',
      side: 'back',
      labelId: 'Pinggul & Bokong',
      cx: 160,
      cy: 332,
      path: 'M 94,302 L 226,302 L 226,362 L 94,362 Z'
    },
    back_thigh_left: {
      id: 'back_thigh_left',
      side: 'back',
      labelId: 'Paha Belakang & Lipatan Lutut Kiri',
      cx: 126,
      cy: 418,
      path: 'M 90,362 L 160,362 L 160,478 L 90,478 Z'
    },
    back_thigh_right: {
      id: 'back_thigh_right',
      side: 'back',
      labelId: 'Paha Belakang & Lipatan Lutut Kanan',
      cx: 194,
      cy: 418,
      path: 'M 160,362 L 230,362 L 230,478 L 160,478 Z'
    },
    back_lower_leg_foot_left: {
      id: 'back_lower_leg_foot_left',
      side: 'back',
      labelId: 'Betis & Tumit Kiri',
      cx: 126,
      cy: 560,
      path: 'M 90,478 L 160,478 L 160,680 L 90,680 Z'
    },
    back_lower_leg_foot_right: {
      id: 'back_lower_leg_foot_right',
      side: 'back',
      labelId: 'Betis & Tumit Kanan',
      cx: 194,
      cy: 560,
      path: 'M 160,478 L 230,478 L 230,680 L 160,680 Z'
    }
  };

  let svgInstanceCounter = 0;

  function getRegionsBySide(side) {
    return Object.values(ANATOMY_REGIONS).filter((r) => r.side === side);
  }

  function renderBodySvg(options) {
    const opts = options || {};
    const side = opts.side === 'back' ? 'back' : 'front';
    const entries = opts.entries || {};
    const selectedRegionId = opts.selectedRegionId || null;
    const interactive = opts.interactive !== false;
    const uid = 'tcclip-' + side + '-' + (++svgInstanceCounter);
    const gradId = 'tcskin-' + side + '-' + svgInstanceCounter;
    const regions = getRegionsBySide(side);

    const hitPaths = regions
      .map((r) => {
        const entry = entries[r.id];
        const classes = ['body-region-hit'];
        if (entry) {
          classes.push(TC.Icons.getSeverityBucket(entry.intensity).cls);
        }
        if (selectedRegionId === r.id) {
          classes.push('is-selected');
        }
        return `<path class="${classes.join(' ')}" data-region-id="${r.id}" d="${r.path}" role="${interactive ? 'button' : 'img'}" tabindex="${interactive ? '0' : '-1'}" aria-label="${r.labelId}"></path>`;
      })
      .join('');

    const painPins = regions
      .filter((r) => Boolean(entries[r.id]) || selectedRegionId === r.id)
      .map((r) => {
        const entry = entries[r.id];
        if (entry) {
          const sev = TC.Icons.getSeverityBucket(entry.intensity);
          return `
            <g class="pain-pin-group" transform="translate(${r.cx}, ${r.cy})">
              <circle class="pain-pin-pulse" cx="0" cy="0" r="14" fill="${sev.color}" opacity="0.45"></circle>
              <circle cx="0" cy="0" r="12" fill="${sev.color}" stroke="#ffffff" stroke-width="2.2"></circle>
              <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff" font-family="system-ui, sans-serif">${entry.intensity}</text>
            </g>`;
        }
        return `
          <g class="pain-pin-group" transform="translate(${r.cx}, ${r.cy})">
            <circle class="pain-pin-pulse" cx="0" cy="0" r="14" fill="#ef4444" opacity="0.5"></circle>
            <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#ffffff" stroke-width="2.4"></circle>
          </g>`;
      })
      .join('');

    const landmarks = side === 'front' ? FRONT_LANDMARKS : BACK_LANDMARKS;
    const ariaSide = side === 'front' ? 'Anatomi Tubuh Tampak Depan' : 'Anatomi Tubuh Tampak Belakang';

    return `
      <svg class="body-svg" viewBox="18 10 284 660" data-body-side="${side}" aria-label="${ariaSide}">
        <defs>
          <clipPath id="${uid}">
            <path d="${BODY_OUTLINE_PATH}"></path>
          </clipPath>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="50%" stop-color="#f1f5f9"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
          </linearGradient>
        </defs>

        <rect class="body-bg-miss" x="0" y="0" width="320" height="680" fill="transparent"></rect>
        <path d="${BODY_OUTLINE_PATH}" fill="url(#${gradId})" stroke="#334155" stroke-width="2.2" stroke-linejoin="round"></path>

        <g clip-path="url(#${uid})">
          ${hitPaths}
        </g>

        <g pointer-events="none">
          ${landmarks}
          <path d="${BODY_OUTLINE_PATH}" fill="none" stroke="#334155" stroke-width="2.1" stroke-linejoin="round"></path>
        </g>

        ${painPins}
      </svg>`;
  }

  TC.Anatomy = {
    BODY_OUTLINE_PATH,
    ANATOMY_REGIONS,
    getRegionsBySide,
    renderBodySvg
  };
})(window);
