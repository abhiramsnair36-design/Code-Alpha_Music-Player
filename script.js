/**
 * Musify — vanilla JavaScript, no dependencies.
 *
 * Sections
 *   1. Config & data
 *   2. Helpers
 *   3. State & persistence
 *   4. Playback engine (queue, shuffle, repeat)
 *   5. Rendering (UI, playlist, visualizer)
 *   6. Local files (picker + drag & drop)
 *   7. Media Session (lock-screen / hardware key controls)
 *   8. Event wiring & init
 */
(() => {
  'use strict';

  /* ------------------------------------------------------------------
   * 1. Config & data
   * ---------------------------------------------------------------- */
  const CATEGORIES = {
    all: 'All',
    '90s': "90's",
    recent: 'Recent Release',
    dev: 'Developer Favourite',
  };

  const CATEGORY_PALETTES = {
    '90s': ['#ff007f', '#00f0ff'],      // Radiant Electric Fuchsia & Neon Cyan
    recent: ['#ff0055', '#ffaa00'],     // Radiant Solar Flame & Neon Amber
    dev: ['#00ff88', '#00e5ff'],        // Cyber Matrix Mint & Electric Aqua
    all: ['#7928ca', '#00f0ff'],        // Radiant Cosmic Ultraviolet & Cyan
  };

  const CURATED_TRACKS = [
    // 90's (Featuring user's 90's tracks with seamless procedural synth fallback)
    {
      id: '90s-chura-ke-dil',
      category: '90s',
      categoryLabel: "90's",
      title: 'Chura Ke Dil Mera',
      artist: 'Kumar Sanu & Alka Yagnik · Main Khiladi Tu Anari',
      src: encodeURI("90's/Chura Ke Dil Mera - 4K VIDEO Akshay & Shilpa Main Khiladi Tu Anari Kumar Sanu & Alka Yagnik.mp3"),
      duration: 453,
      bpm: 124,
      scale: [220, 261.63, 293.66, 329.63, 392, 440],
      colors: ['#00f0ff', '#ff007f'],
      synthType: '90s',
      local: false,
      failed: false,
    },
    {
      id: '90s-ek-sanam',
      category: '90s',
      categoryLabel: "90's",
      title: 'Ek Sanam Chahiye Aashiqui Ke Liye',
      artist: 'Kumar Sanu · Aashiqui',
      src: encodeURI("90's/Ek Sanam Chahiye Aashiqui Ke Liye Lyrical Video Aashiqui Kumar Sanu Rahul Roy, Anu Agarwal.mp3"),
      duration: 370,
      bpm: 110,
      scale: [164.81, 196, 220, 246.94, 293.66, 329.63],
      colors: ['#f59e0b', '#ec4899'],
      synthType: '90s',
      local: false,
      failed: false,
    },
    {
      id: '90s-jaadu-teri-nazar',
      category: '90s',
      categoryLabel: "90's",
      title: 'Jaadu Teri Nazar',
      artist: 'Udit Narayan · Darr',
      src: encodeURI("90's/Jaadu Teri Nazar Song Darr Shah Rukh Khan, Juhi Chawla Udit Narayan Shiv-Hari Anand Bakshi.mp3"),
      duration: 157,
      bpm: 96,
      scale: [174.61, 220, 261.63, 329.63, 392, 440],
      colors: ['#8b5cf6', '#00f0ff'],
      synthType: '90s',
      local: false,
      failed: false,
    },
    {
      id: '90s-kajra-re',
      category: '90s',
      categoryLabel: "90's",
      title: 'Kajra Re',
      artist: 'Alisha Chinai & Shankar Mahadevan · Bunty Aur Babli',
      src: encodeURI("90's/Kajra Re Full Song Bunty Aur Babli Aishwarya, Abhishek, Amitabh Bachchan Shankar-Ehsaan-Loy.mp3"),
      duration: 474,
      bpm: 126,
      scale: [196, 220, 261.63, 293.66, 329.63, 392],
      colors: ['#ff0055', '#ff9900'],
      synthType: '90s',
      local: false,
      failed: false,
    },
    {
      id: '90s-ladki-badi-anjani',
      category: '90s',
      categoryLabel: "90's",
      title: 'Ladki Badi Anjani Hai',
      artist: 'Kumar Sanu & Alka Yagnik · Kuch Kuch Hota Hai',
      src: encodeURI("90's/Ladki Badi Anjani Hai Kuch Kuch Hota Hai Shah Rukh Khan, Kajol Kumar Sanu Alka Yagnik 4K.mp3"),
      duration: 358,
      bpm: 118,
      scale: [220, 261.63, 293.66, 329.63, 392, 440],
      colors: ['#10b981', '#06b6d4'],
      synthType: '90s',
      local: false,
      failed: false,
    },
    {
      id: '90s-main-duniya-bhula',
      category: '90s',
      categoryLabel: "90's",
      title: 'Main Duniya Bhula Doonga',
      artist: 'Kumar Sanu & Anuradha Paudwal · Aashiqui',
      src: encodeURI("90's/Main Duniya Bhula Doonga - Lyrical Video Song Aashiqui Rahul Roy, Anu Agarwal.mp3"),
      duration: 323,
      bpm: 104,
      scale: [164.81, 196, 220, 261.63, 329.63, 392],
      colors: ['#00ffcc', '#7928ca'],
      synthType: '90s',
      local: false,
      failed: false,
    },
    {
      id: '90s-mehndi-laga-ke',
      category: '90s',
      categoryLabel: "90's",
      title: 'Mehndi Laga Ke Rakhna',
      artist: 'Lata Mangeshkar & Udit Narayan · DDLJ',
      src: encodeURI("90's/Mehndi Laga Ke Rakhna Song Dilwale Dulhania Le Jayenge Shah Rukh Khan, Kajol Lata, Udit DDLJ.mp3"),
      duration: 280,
      bpm: 128,
      scale: [220, 261.63, 293.66, 329.63, 392, 440],
      colors: ['#f43f5e', '#fbbf24'],
      synthType: '90s',
      local: false,
      failed: false,
    },
    {
      id: '90s-mera-dil-bhi-kitna',
      category: '90s',
      categoryLabel: "90's",
      title: 'Mera Dil Bhi Kitna Pagal Hai',
      artist: 'Kumar Sanu & Alka Yagnik · Saajan',
      src: encodeURI("90's/Mera Dil Bhi Kitna Pagal Hai SAAJAN Madhuri Sanjay Dutt Saajan 90s Romantic Song.mp3"),
      duration: 317,
      bpm: 98,
      scale: [174.61, 220, 261.63, 329.63, 392, 440],
      colors: ['#a855f7', '#ec4899'],
      synthType: '90s',
      local: false,
      failed: false,
    },
    {
      id: '90s-ruk-ja-o-dil',
      category: '90s',
      categoryLabel: "90's",
      title: 'Ruk Ja O Dil Deewane',
      artist: 'Udit Narayan · DDLJ',
      src: encodeURI("90's/Ruk Ja O Dil Deewane - Full Song Dilwale Dulhania Le Jayenge Shah Rukh Khan, Kajol Udit Narayan.mp3"),
      duration: 236,
      bpm: 132,
      scale: [196, 220, 261.63, 293.66, 329.63, 392],
      colors: ['#06b6d4', '#3b82f6'],
      synthType: '90s',
      local: false,
      failed: false,
    },
    {
      id: '90s-tu-mere-saamne',
      category: '90s',
      categoryLabel: "90's",
      title: 'Tu Mere Saamne',
      artist: 'Alka Yagnik & Udit Narayan · Chori Chori',
      src: encodeURI("90's/Tu Mere Saamne 4K Video Chori Chori Alka Yagnik, Udit Narayan Ajay Devgan, Rani Mukerji.mp3"),
      duration: 232,
      bpm: 112,
      scale: [164.81, 196, 220, 261.63, 329.63, 392],
      colors: ['#ec4899', '#8b5cf6'],
      synthType: '90s',
      local: false,
      failed: false,
    },
    {
      id: '90s-yeh-ladka-hai-deewana',
      category: '90s',
      categoryLabel: "90's",
      title: 'Yeh Ladka Hai Deewana',
      artist: 'Udit Narayan & Alka Yagnik · Kuch Kuch Hota Hai',
      src: encodeURI("90's/Yeh Ladka Hai Deewana 4K Video Kuch Kuch Hota Hai Shah Rukh Khan, Kajol Udit Narayan Alka Yagnik.mp3"),
      duration: 390,
      bpm: 125,
      scale: [220, 261.63, 293.66, 329.63, 392, 440],
      colors: ['#00f0ff', '#3b82f6'],
      synthType: '90s',
      local: false,
      failed: false,
    },

    // Recent Release (Featuring audio from the "Recent release" folder)
    {
      id: 'recent-rehbara',
      category: 'recent',
      categoryLabel: 'Recent Release',
      title: 'Rehbara',
      artist: 'Abhijeet Srivastava & Shayra Apoorva',
      src: encodeURI("Recent release/'REHBARA' Official Lyrical Video Abhijeet Srivastava Shayra Apoorva Unbound Records.mp3"),
      duration: 175,
      bpm: 118,
      scale: [220, 261.63, 293.66, 329.63, 392, 440],
      colors: ['#00f0ff', '#ff007f'],
      synthType: 'recent',
      local: false,
      failed: false,
    },
    {
      id: 'recent-gehra-hua',
      category: 'recent',
      categoryLabel: 'Recent Release',
      title: 'Gehra Hua',
      artist: 'Arijit Singh & Shashwat Sachdev · Dhurandhar',
      src: encodeURI("Recent release/Gehra Hua Dhurandhar Ranveer Singh, Sara Arjun, Shashwat Sachdev, Arijit Singh Releasing 5 Dec.mp3"),
      duration: 230,
      bpm: 110,
      scale: [196, 220, 261.63, 293.66, 329.63, 392],
      colors: ['#8b5cf6', '#00f0ff'],
      synthType: 'recent',
      local: false,
      failed: false,
    },
    {
      id: 'recent-kalyani',
      category: 'recent',
      categoryLabel: 'Recent Release',
      title: 'Kalyani',
      artist: 'Shreya Ghoshal, ARJN, KDS, FIFTY4 & RONN',
      src: encodeURI("Recent release/KALYANI (with Shreya Ghoshal) ARJN KDS FIFTY4 RONN Kya Fitoor Door Raha Kyun JaayeNa Lyrical.mp3"),
      duration: 248,
      bpm: 120,
      scale: [261.63, 293.66, 329.63, 392, 440, 523.25],
      colors: ['#ff0055', '#ff9900'],
      synthType: 'recent',
      local: false,
      failed: false,
    },
    {
      id: 'recent-kaise-hua',
      category: 'recent',
      categoryLabel: 'Recent Release',
      title: 'Kaise Hua',
      artist: 'Vishal Mishra & Manoj Muntashir · Kabir Singh',
      src: encodeURI("Recent release/LYRICAL Kaise Hua Kabir Singh Shahid K, Kiara A, Sandeep V Vishal Mishra, Manoj Muntashir.mp3"),
      duration: 254,
      bpm: 108,
      scale: [174.61, 220, 261.63, 329.63, 392, 440],
      colors: ['#10b981', '#06b6d4'],
      synthType: 'recent',
      local: false,
      failed: false,
    },
    {
      id: 'recent-mashooqa',
      category: 'recent',
      categoryLabel: 'Recent Release',
      title: 'Mashooqa',
      artist: 'Pritam, Mahmood, Amitabh B, Raghav C & Ruaa K · Cocktail 2',
      src: encodeURI("Recent release/Mashooqa (Video) Shahid, Kriti, Rashmika Pritam, Mahmood, Amitabh B, Raghav C, Ruaa K Cocktail 2.mp3"),
      duration: 176,
      bpm: 126,
      scale: [220, 261.63, 293.66, 329.63, 392, 440],
      colors: ['#f43f5e', '#fbbf24'],
      synthType: 'recent',
      local: false,
      failed: false,
    },
    {
      id: 'recent-sahiba',
      category: 'recent',
      categoryLabel: 'Recent Release',
      title: 'Sahiba',
      artist: 'Aditya Rikhari & Ankita Chhetri',
      src: encodeURI("Recent release/Sahiba (Official Music Video) Aditya Rikhari, Ankita Chhetri T-Series.mp3"),
      duration: 183,
      bpm: 112,
      scale: [164.81, 196, 220, 246.94, 293.66, 329.63],
      colors: ['#ec4899', '#8b5cf6'],
      synthType: 'recent',
      local: false,
      failed: false,
    },
    {
      id: 'recent-surma',
      category: 'recent',
      categoryLabel: 'Recent Release',
      title: 'Surma',
      artist: 'Umar Quadri',
      src: encodeURI("Recent release/Umar Quadri - Surma Latest Dance Song 2024.mp3"),
      duration: 143,
      bpm: 128,
      scale: [220, 261.63, 329.63, 392, 440, 523.25],
      colors: ['#00ffcc', '#7928ca'],
      synthType: 'recent',
      local: false,
      failed: false,
    },
    {
      id: 'recent-vaaroon',
      category: 'recent',
      categoryLabel: 'Recent Release',
      title: 'Vaaroon',
      artist: 'Romy, Anand Bhaskar & Ginny Diwan · Mirzapur',
      src: encodeURI("Recent release/Vaaroon - Mirzapur Pankaj Tripathi, Ali Fazal, Divyenndu Romy, Anand Bhaskar, Ginny D Lyrical.mp3"),
      duration: 365,
      bpm: 116,
      scale: [196, 246.94, 293.66, 369.99, 440, 493.88],
      colors: ['#a855f7', '#ec4899'],
      synthType: 'recent',
      local: false,
      failed: false,
    },

    // Developer Favourite (Featuring audio from the "developer" folder)
    {
      id: 'dev-aaj-se-teri',
      category: 'dev',
      categoryLabel: 'Developer Favourite',
      title: 'Aaj Se Teri',
      artist: 'Arijit Singh & Amit Trivedi · Padman',
      src: encodeURI("developer/Aaj Se Teri - Lyrical Padman Akshay Kumar & Radhika Apte Arijit Singh Amit Trivedi.mp3"),
      duration: 320,
      bpm: 86,
      scale: [146.83, 174.61, 220, 261.63, 293.66, 349.23],
      colors: ['#10b981', '#6366f1'],
      synthType: 'dev',
      local: false,
      failed: false,
    },
    {
      id: 'dev-aashiq-tera',
      category: 'dev',
      categoryLabel: 'Developer Favourite',
      title: 'Aashiq Tera',
      artist: 'Altamash Faridi & Sohail Sen · Happy Bhag Jayegi',
      src: encodeURI("developer/Aashiq Tera Full Audio Song Happy Bhag Jayegi.mp3"),
      duration: 303,
      bpm: 92,
      scale: [164.81, 196, 246.94, 293.66, 329.63, 392],
      colors: ['#8b5cf6', '#00ffcc'],
      synthType: 'dev',
      local: false,
      failed: false,
    },
    {
      id: 'dev-darkhaast',
      category: 'dev',
      categoryLabel: 'Developer Favourite',
      title: 'Darkhaast',
      artist: 'Arijit Singh & Sunidhi Chauhan · Shivaay',
      src: encodeURI("developer/DARKHAAST Full Video Song SHIVAAY Arijit Singh & Sunidhi Chauhan Ajay Devgn T-Series.mp3"),
      duration: 431,
      bpm: 82,
      scale: [130.81, 164.81, 196, 246.94, 261.63, 329.63],
      colors: ['#00f0ff', '#a855f7'],
      synthType: 'dev',
      local: false,
      failed: false,
    },
    {
      id: 'dev-ishq-de-fanniyar',
      category: 'dev',
      categoryLabel: 'Developer Favourite',
      title: 'Ishq De Fanniyar',
      artist: 'Jyotica Tangri, Shaarib & Toshi · Fukrey Returns',
      src: encodeURI("developer/Ishq De Fanniyar (Female) - Full Audio Fukrey Returns Jyotica Tangri Shaarib & Toshi.mp3"),
      duration: 182,
      bpm: 98,
      scale: [146.83, 174.61, 220, 261.63, 293.66, 349.23],
      colors: ['#ec4899', '#8b5cf6'],
      synthType: 'dev',
      local: false,
      failed: false,
    },
    {
      id: 'dev-khamoshiyan',
      category: 'dev',
      categoryLabel: 'Developer Favourite',
      title: 'Khamoshiyan',
      artist: 'Arijit Singh & Jeet Gannguli · Khamoshiyan',
      src: encodeURI("developer/Khamoshiyan Full Video - Title Track Arijit Singh Ali Fazal, Sapna Pabbi, Gurmeet C.mp3"),
      duration: 196,
      bpm: 78,
      scale: [130.81, 164.81, 196, 246.94, 261.63, 329.63],
      colors: ['#00f0ff', '#ff007f'],
      synthType: 'dev',
      local: false,
      failed: false,
    },
    {
      id: 'dev-humnava-mere',
      category: 'dev',
      categoryLabel: 'Developer Favourite',
      title: 'Humnava Mere',
      artist: 'Jubin Nautiyal & Rocky - Shiv',
      src: encodeURI("developer/Official Video Humnava Mere Song Jubin Nautiyal Manoj Muntashir Rocky - Shiv Bhushan Kumar.mp3"),
      duration: 407,
      bpm: 74,
      scale: [146.83, 174.61, 220, 261.63, 293.66, 329.63],
      colors: ['#f59e0b', '#ec4899'],
      synthType: 'dev',
      local: false,
      failed: false,
    },
    {
      id: 'dev-raanjhanaa',
      category: 'dev',
      categoryLabel: 'Developer Favourite',
      title: 'Raanjhanaa',
      artist: 'Jaswinder Singh, Shiraz Uppal & A.R. Rahman · Raanjhanaa',
      src: encodeURI("developer/Raanjhanaa - Lyrical Video Dhanush, Sonam Kapoor A. R. Rahman Jaswinder Singh & Shiraz Uppal.mp3"),
      duration: 255,
      bpm: 104,
      scale: [196, 220, 261.63, 293.66, 329.63, 392],
      colors: ['#ff0055', '#ff9900'],
      synthType: 'dev',
      local: false,
      failed: false,
    },
  ];

  const DEFAULT_PALETTES = [
    ['#00f0ff', '#ff007f'], // Neon Cyan & Electric Pink
    ['#7928ca', '#00ffcc'], // Neon Violet & Radiant Teal
    ['#ff0055', '#ff9900'], // Radiant Crimson & Neon Amber
    ['#00ff88', '#0070f3'], // Neon Mint & Electric Blue
    ['#f72585', '#4361ee'], // Radiant Fuchsia & Royal Neon
    ['#ff00ff', '#00ffff'], // Synthwave Magenta & Cyan
  ];

  const RATES = [0.75, 1, 1.25, 1.5, 2];
  const REPEAT_MODES = ['off', 'all', 'one'];
  const REPEAT_LABELS = {
    off: 'Repeat: off',
    all: 'Repeat: all tracks',
    one: 'Repeat: current track',
  };
  const SEEK_STEP = 5;               // seconds, for arrow keys
  const VOLUME_STEP = 0.05;
  const RESTART_THRESHOLD = 3;       // "previous" restarts the track after this many seconds
  const HISTORY_LIMIT = 50;
  const AUDIO_EXTENSIONS = /\.(mp3|m4a|aac|wav|ogg|oga|opus|flac|weba|webm)$/i;
  const STORAGE_KEY = 'musify:prefs';
  const LEGACY_STORAGE_KEY = 'music-player:prefs';

  /* ------------------------------------------------------------------
   * 2. Helpers
   * ---------------------------------------------------------------- */
  const $ = (selector) => document.querySelector(selector);

  const els = {
    root: document.documentElement,
    audio: $('#audio'),
    art: $('#art'),
    title: $('#title'),
    artist: $('#artist'),
    viz: $('#viz'),
    seek: $('#seek'),
    timeCurrent: $('#time-current'),
    timeDuration: $('#time-duration'),
    play: $('#play'),
    playIcon: $('#play-icon'),
    prev: $('#prev'),
    next: $('#next'),
    shuffle: $('#shuffle'),
    repeat: $('#repeat'),
    repeatIcon: $('#repeat-icon'),
    mute: $('#mute'),
    muteIcon: $('#mute-icon'),
    volume: $('#volume'),
    volumeWrap: $('#volume-wrap'),
    downloadCurrent: $('#download-current'),
    rate: $('#rate'),
    playlist: $('#playlist'),
    count: $('#count'),
    addFiles: $('#add-files'),
    fileInput: $('#file-input'),
    toast: $('#toast'),
    themeToggle: $('#theme-toggle'),
    themeIcon: $('#theme-icon'),
    categoryBadge: $('#category-badge'),
    categoriesNav: $('#categories'),
  };
  const audio = els.audio;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const total = Math.floor(seconds);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = String(total % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
  }

  const storage = {
    get(key) { try { return window.localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch { /* unavailable */ } },
  };

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let toastTimer = 0;
  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => els.toast.classList.remove('is-visible'), 3200);
  }

  /**
   * Download any audio track directly.
   * Handles relative file paths, Blob object URLs, and local user files.
   */
  async function downloadTrack(track) {
    if (!track || !track.src) {
      showToast('No audio source available to download');
      return;
    }

    const cleanTitle = (track.title || 'Track').replace(/[\\/:*?"<>|]/g, '').trim();
    const cleanArtist = (track.artist || '').replace(/[\\/:*?"<>|]/g, '').trim();
    const baseName = (cleanArtist && cleanArtist !== 'Unknown Artist')
      ? `${cleanArtist} - ${cleanTitle}`
      : cleanTitle;

    let ext = '.mp3';
    if (typeof track.src === 'string') {
      const match = track.src.match(/\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i);
      if (match) ext = `.${match[1].toLowerCase()}`;
    }
    const filename = `${baseName || 'Musify-Audio'}${ext}`;

    const triggerDownload = (url) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    showToast(`Downloading: ${track.title}…`);

    // If it's already a blob URL or File object
    if (track.src.startsWith('blob:') || track.file) {
      triggerDownload(track.src);
      return;
    }

    // Try fetching as blob to trigger direct save dialog across all modern browsers
    try {
      const res = await fetch(track.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      triggerDownload(blobUrl);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch {
      // Direct link fallback (works in local file:/// and standard contexts)
      triggerDownload(track.src);
    }
  }

  function setRangeFill(input, percent) {
    input.style.setProperty('--fill', `${clamp(percent, 0, 100)}%`);
  }

  function setLoading(loading) {
    if (els.play) {
      els.play.classList.toggle('is-loading', loading);
      els.play.setAttribute('aria-busy', String(loading));
    }
  }

  function applyDisplayColors(palette) {
    if (!palette || !palette[0]) return;
    els.root.style.setProperty('--accent-1', palette[0]);
    els.root.style.setProperty('--accent-2', palette[1] || palette[0]);
    viz.colors = palette;
  }

  /** Small deterministic hash so local files get a stable colour pair. */
  function paletteFor(name) {
    let hash = 0;
    for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return DEFAULT_PALETTES[hash % DEFAULT_PALETTES.length];
  }

  /* ---- Audio buffer to WAV Blob encoder (zero external files required) ---- */
  function bufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const numSamples = buffer.length;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numSamples * blockAlign;
    const arrayBuffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(arrayBuffer);

    function writeString(offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    const channels = [];
    for (let c = 0; c < numChannels; c++) {
      channels.push(buffer.getChannelData(c));
    }

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        const sample = Math.max(-1, Math.min(1, channels[c][i]));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  /* ---- Procedural audio generator for curated categories ---- */
  async function ensureTrackAudio(track) {
    if (track.src) return track.src;
    const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!Ctx) return null;

    const duration = track.duration || 32;
    const sampleRate = 22050; // fast & lightweight
    const totalSamples = Math.floor(sampleRate * duration);
    const actx = new Ctx(2, totalSamples, sampleRate);

    const bpm = track.bpm || 100;
    const beatSec = 60 / bpm;
    const scale = track.scale || [220, 261.63, 329.63, 392, 440];
    const kind = track.synthType || 'dev';

    // Master bus
    const master = actx.createGain();
    master.gain.value = 0.65;
    master.connect(actx.destination);

    // Smooth envelope in/out
    master.gain.setValueAtTime(0.001, 0);
    master.gain.linearRampToValueAtTime(0.65, 1.2);
    master.gain.setValueAtTime(0.65, Math.max(0, duration - 1.8));
    master.gain.linearRampToValueAtTime(0.001, duration);

    const numBeats = Math.floor(duration / beatSec);

    function playNote(freq, start, len, type = 'sine', gainVal = 0.14) {
      if (start >= duration) return;
      if (start + len > duration) len = Math.max(0.01, duration - start);
      const osc = actx.createOscillator();
      const g = actx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);

      g.gain.setValueAtTime(0.001, start);
      g.gain.linearRampToValueAtTime(gainVal, start + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, start + len);

      osc.connect(g);
      g.connect(master);
      osc.start(start);
      osc.stop(start + len);
    }

    // Chords and harmonic beds
    for (let b = 0; b < numBeats; b += 4) {
      const time = b * beatSec;
      const chordIndex = Math.floor(b / 4) % 4;
      const baseFreq = scale[chordIndex % scale.length];

      if (kind === '90s') {
        playNote(baseFreq, time, beatSec * 3.8, 'sawtooth', 0.1);
        playNote(baseFreq * 1.25, time, beatSec * 3.8, 'triangle', 0.1);
        playNote(baseFreq * 1.5, time, beatSec * 3.8, 'sawtooth', 0.08);
        for (let s = 0; s < 4; s++) {
          playNote(baseFreq * 0.5, time + s * beatSec, beatSec * 0.45, 'sawtooth', 0.16);
        }
      } else if (kind === 'recent') {
        playNote(baseFreq, time, beatSec * 3.6, 'sawtooth', 0.1);
        playNote(baseFreq * 1.25, time, beatSec * 3.6, 'triangle', 0.1);
        playNote(baseFreq * 1.5, time, beatSec * 3.6, 'sine', 0.12);
        playNote(baseFreq * 0.5, time, beatSec * 1.9, 'sine', 0.25);
        playNote(baseFreq * 0.5, time + beatSec * 2, beatSec * 1.8, 'sine', 0.22);
      } else {
        // dev (Developer Favourite)
        playNote(baseFreq, time, beatSec * 3.8, 'triangle', 0.16);
        playNote(baseFreq * 1.25, time, beatSec * 3.8, 'sine', 0.14);
        playNote(baseFreq * 1.5, time, beatSec * 3.8, 'sine', 0.11);
        playNote(baseFreq * 1.875, time, beatSec * 3.8, 'triangle', 0.08);
        playNote(baseFreq * 0.5, time, beatSec * 1.8, 'sine', 0.22);
        playNote(baseFreq * 0.75, time + beatSec * 2, beatSec * 1.8, 'sine', 0.18);
      }
    }

    // Melodic arpeggio lines
    for (let b = 0; b < numBeats; b++) {
      const time = b * beatSec;
      const note1 = scale[(b * 2) % scale.length] * 2;
      const note2 = scale[(b * 3 + 1) % scale.length] * 2;
      const synthType = kind === '90s' ? 'square' : 'triangle';

      playNote(note1, time, beatSec * 0.45, synthType, 0.08);
      playNote(note2, time + beatSec * 0.5, beatSec * 0.45, synthType, 0.06);
    }

    // Subtle rhythmic pulse for upbeat genres
    for (let b = 0; b < numBeats; b++) {
      const time = b * beatSec;
        if (b % 2 === 0) {
          const osc = actx.createOscillator();
          const g = actx.createGain();
          osc.frequency.setValueAtTime(130, time);
          osc.frequency.exponentialRampToValueAtTime(36, time + 0.13);
          g.gain.setValueAtTime(0.24, time);
          g.gain.exponentialRampToValueAtTime(0.001, time + 0.13);
          osc.connect(g);
          g.connect(master);
          osc.start(time);
          osc.stop(time + 0.14);
        }
      }

    const rendered = await actx.startRendering();
    const wavBlob = bufferToWav(rendered);
    track.src = URL.createObjectURL(wavBlob);
    return track.src;
  }

  /* ------------------------------------------------------------------
   * 3. State & persistence
   * ---------------------------------------------------------------- */
  function loadPrefs() {
    const defaults = { volume: 0.8, muted: false, shuffle: false, repeat: 'off', rate: 1, trackId: null, theme: 'dark', category: '90s' };
    try {
      const saved = JSON.parse(storage.get(STORAGE_KEY) || storage.get(LEGACY_STORAGE_KEY) || '{}');
      return {
        volume: typeof saved.volume === 'number' ? clamp(saved.volume, 0, 1) : defaults.volume,
        muted: saved.muted === true,
        shuffle: saved.shuffle === true,
        repeat: REPEAT_MODES.includes(saved.repeat) ? saved.repeat : defaults.repeat,
        rate: RATES.includes(saved.rate) ? saved.rate : defaults.rate,
        trackId: typeof saved.trackId === 'string' ? saved.trackId : null,
        theme: ['dark', 'light'].includes(saved.theme) ? saved.theme : defaults.theme,
        category: (saved.category && (CATEGORIES[saved.category] || saved.category === 'all')) ? saved.category : defaults.category,
      };
    } catch {
      return defaults;
    }
  }

  const prefs = loadPrefs();
  let localCounter = 0;

  const state = {
    tracks: CURATED_TRACKS.map((track) => ({ ...track, src: track.src || null })),
    category: prefs.category || '90s',
    index: -1,
    playing: false,
    wantPlay: false,            // user intent: should playback continue across track changes?
    scrubbing: false,
    shuffle: prefs.shuffle,
    repeat: prefs.repeat,
    rate: prefs.rate,
    volume: prefs.volume,
    muted: prefs.muted,
    theme: prefs.theme,
    played: new Set(),          // track ids already played in the current shuffle cycle
    history: [],                // track ids, for "previous" while shuffling
  };

  const currentTrack = () => state.tracks[state.index] || null;

  function savePrefs() {
    const track = currentTrack();
    storage.set(STORAGE_KEY, JSON.stringify({
      volume: state.volume,
      muted: state.muted,
      shuffle: state.shuffle,
      repeat: state.repeat,
      rate: state.rate,
      trackId: track && !track.local ? track.id : null,
      theme: state.theme,
      category: state.category,
    }));
  }

  /* ------------------------------------------------------------------
   * 4. Playback engine
   * ---------------------------------------------------------------- */
  let graph = null; // { ctx, analyser, data } — created lazily on first play

  /**
   * The live visualizer needs Web Audio, which silences audio loaded from
   * file:// pages. In that case we skip it and use a decorative animation.
   */
  function ensureAudioGraph() {
    if (graph) {
      if (graph.ctx.state === 'suspended') graph.ctx.resume().catch(() => {});
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx || window.location.protocol === 'file:') return;

    try {
      const ctx = new Ctx();
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      graph = { ctx, analyser, data: new Uint8Array(analyser.frequencyBinCount) };
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    } catch {
      graph = null;
    }
  }

  async function loadTrack(index, { autoplay = false } = {}) {
    const track = state.tracks[index];
    if (!track) return;

    state.index = index;
    state.played.add(track.id);

    // Apply UI theme & details immediately for instant feedback
    applyTrackTheme(track);
    renderNowPlaying();
    resetProgress();
    updatePlaylistState();
    scrollCurrentIntoView();

    // Synthesize audio procedural buffer if not already generated
    if (!track.src && track.synthType) {
      setLoading(true);
      try {
        await ensureTrackAudio(track);
      } catch (err) {
        console.error('Synthesis error:', err);
      } finally {
        setLoading(false);
      }
    }

    if (state.index !== index) return; // Superseded by another track selection

    audio.src = track.src || '';
    audio.defaultPlaybackRate = state.rate;
    audio.playbackRate = state.rate;
    audio.load();

    updateMediaMetadata(track);
    savePrefs();

    if (autoplay) play();
  }

  function getFilteredIndices() {
    const list = [];
    state.tracks.forEach((track, i) => {
      if (state.category === 'all' || track.category === state.category) {
        list.push(i);
      }
    });
    return list;
  }

  function setCategory(cat) {
    if (!CATEGORIES[cat] && cat !== 'all') return;
    state.category = cat;
    els.root.dataset.category = cat;
    if (els.categoriesNav) {
      els.categoriesNav.querySelectorAll('.category-pill').forEach((pill) => {
        pill.classList.toggle('is-active', pill.dataset.cat === cat);
      });
    }

    // Automatically change the display radiant colors with the selected category type!
    const catColors = CATEGORY_PALETTES[cat] || CATEGORY_PALETTES.all;
    applyDisplayColors(catColors);

    renderPlaylist();
    scrollCurrentIntoView();
    savePrefs();
  }

  /** Move to another track, remembering where we came from (for shuffle "previous"). */
  function playIndex(index, { fromHistory = false } = {}) {
    const leaving = currentTrack();
    if (!fromHistory && leaving && !leaving.failed && state.index !== index) {
      state.history.push(leaving.id);
      if (state.history.length > HISTORY_LIMIT) state.history.shift();
    }
    loadTrack(index, { autoplay: true });
  }

  async function play() {
    if (state.index < 0) return;
    state.wantPlay = true;
    ensureAudioGraph();
    try {
      await audio.play();
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        state.wantPlay = false;
        showToast('Press play to start playback');
      }
      // AbortError (track changed mid-load) and decode errors are handled elsewhere.
    }
  }

  function pause() {
    state.wantPlay = false;
    audio.pause();
  }

  function togglePlay() {
    if (audio.paused) play(); else pause();
  }

  function playableIndices() {
    const filtered = getFilteredIndices().filter((i) => !state.tracks[i].failed);
    if (filtered.length > 0) return filtered;
    return state.tracks.reduce((list, t, i) => (t.failed ? list : (list.push(i), list)), []);
  }

  /**
   * Pick the next track index, or -1 when the queue is finished.
   * `auto` is true when a track ended by itself (respects repeat-off);
   * a manual "next" always wraps around.
   */
  function nextIndex(auto) {
    const playable = playableIndices();
    if (!playable.length) return -1;
    const current = currentTrack();

    if (state.shuffle) {
      let pool = playable.filter((i) => !state.played.has(state.tracks[i].id));
      if (!pool.length) {
        if (auto && state.repeat !== 'all') return -1;
        state.played.clear();
        if (current) state.played.add(current.id);
        pool = playable.filter((i) => i !== state.index);
        if (!pool.length) pool = playable; // only one playable track
      }
      return pool[Math.floor(Math.random() * pool.length)];
    }

    const currentPos = playable.indexOf(state.index);
    if (currentPos >= 0) {
      const nextPos = currentPos + 1;
      if (nextPos >= playable.length) {
        if (auto && state.repeat !== 'all') return -1;
        return playable[0]; // loop around
      }
      return playable[nextPos];
    }

    return playable[0];
  }

  function goNext() {
    const index = nextIndex(false);
    if (index >= 0) playIndex(index);
  }

  function goPrevious() {
    if (audio.currentTime > RESTART_THRESHOLD) {
      audio.currentTime = 0;
      updateProgress();
      return;
    }

    if (state.shuffle) {
      while (state.history.length) {
        const id = state.history.pop();
        const index = state.tracks.findIndex((t) => t.id === id && !t.failed);
        if (index >= 0) { playIndex(index, { fromHistory: true }); return; }
      }
      audio.currentTime = 0;
      return;
    }

    const playable = playableIndices();
    if (!playable.length) return;
    const currentPos = playable.indexOf(state.index);
    if (currentPos > 0) {
      playIndex(playable[currentPos - 1]);
    } else if (currentPos === 0) {
      playIndex(playable[playable.length - 1]);
    } else {
      playIndex(playable[0]);
    }
  }

  function handleEnded() {
    if (state.repeat === 'one') {
      audio.currentTime = 0;
      play();
      return;
    }

    const index = nextIndex(true);
    if (index >= 0) {
      playIndex(index);
      return;
    }

    // Queue finished: get ready to start again from the top.
    state.wantPlay = false;
    state.played.clear();
    const first = playableIndices()[0];
    if (first !== undefined) loadTrack(first);
  }

  function handleError() {
    const track = currentTrack();
    if (!track || !audio.error) return;

    // If track had a static src that failed (e.g. disk file moved/blocked), fall back to procedural synthesis
    if (track.synthType && !track.synthesized) {
      track.synthesized = true;
      track.src = null;
      loadTrack(state.index, { autoplay: state.wantPlay });
      return;
    }

    track.failed = true;
    updatePlaylistState();
    showToast(`Couldn't play “${track.title}”`);

    if (state.wantPlay) {
      const index = nextIndex(true);
      if (index >= 0 && index !== state.index) playIndex(index);
      else state.wantPlay = false;
    }
  }

  function seekTo(seconds) {
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = clamp(seconds, 0, audio.duration);
    updateProgress();
  }

  const seekBy = (delta) => seekTo(audio.currentTime + delta);

  function setShuffle(on) {
    state.shuffle = on;
    state.played.clear();
    const track = currentTrack();
    if (track) state.played.add(track.id);
    renderModes();
    savePrefs();
  }

  function cycleRepeat() {
    state.repeat = REPEAT_MODES[(REPEAT_MODES.indexOf(state.repeat) + 1) % REPEAT_MODES.length];
    renderModes();
    savePrefs();
  }

  function cycleRate() {
    state.rate = RATES[(RATES.indexOf(state.rate) + 1) % RATES.length];
    renderRate();
    savePrefs();
  }

  function setVolume(value) {
    state.volume = clamp(Math.round(value * 100) / 100, 0, 1);
    if (state.volume > 0) state.muted = false;
    renderVolume();
    savePrefs();
  }

  function toggleMute() {
    if (state.muted || state.volume === 0) {
      state.muted = false;
      if (state.volume === 0) state.volume = 0.6;
    } else {
      state.muted = true;
    }
    renderVolume();
    savePrefs();
  }

  function removeTrack(index) {
    const track = state.tracks[index];
    if (!track || !track.local) return;

    const wasCurrent = index === state.index;
    const wasPlaying = state.wantPlay && !audio.paused;

    URL.revokeObjectURL(track.src);
    state.tracks.splice(index, 1);
    state.played.delete(track.id);
    state.history = state.history.filter((id) => id !== track.id);

    if (wasCurrent) {
      audio.pause();
      state.index = -1;
      const replacement = Math.min(index, state.tracks.length - 1);
      renderPlaylist();
      loadTrack(replacement, { autoplay: wasPlaying });
    } else {
      if (index < state.index) state.index -= 1;
      renderPlaylist();
    }
  }

  /* ------------------------------------------------------------------
   * 5. Rendering
   * ---------------------------------------------------------------- */
  function applyTrackTheme(track) {
    const palette = (track.category && CATEGORY_PALETTES[track.category])
      ? CATEGORY_PALETTES[track.category]
      : (track.colors || CATEGORY_PALETTES.all);

    applyDisplayColors(palette);

    els.art.classList.remove('is-swapping');
    void els.art.offsetWidth; // restart the CSS animation
    els.art.classList.add('is-swapping');
  }

  function renderNowPlaying() {
    const track = currentTrack();
    if (els.categoryBadge) {
      els.categoryBadge.textContent = track
        ? (track.categoryLabel || CATEGORIES[track.category] || 'Musify')
        : 'Musify Radio';
      els.categoryBadge.className = 'meta__category' + (track?.category ? ` meta__category--${track.category}` : ' meta__category--all');
    }
    els.title.textContent = track ? track.title : 'No track loaded';
    els.artist.textContent = track ? track.artist : 'Add audio files to play';
    els.title.title = track ? track.title : '';
    document.title = track && state.playing ? `${track.title} · ${track.artist}` : 'Musify';
  }

  function renderPlayButton() {
    els.playIcon.setAttribute('href', state.playing ? '#i-pause' : '#i-play');
    els.play.setAttribute('aria-label', state.playing ? 'Pause' : 'Play');
    els.art.classList.toggle('is-playing', state.playing);
  }

  function renderModes() {
    els.shuffle.setAttribute('aria-pressed', String(state.shuffle));
    els.shuffle.classList.toggle('is-on', state.shuffle); // label stays "Shuffle"; aria-pressed carries the state

    els.repeat.dataset.mode = state.repeat;
    els.repeat.classList.toggle('is-on', state.repeat !== 'off');
    els.repeat.setAttribute('aria-label', REPEAT_LABELS[state.repeat]);
    els.repeatIcon.setAttribute('href', state.repeat === 'one' ? '#i-repeat-one' : '#i-repeat');
  }

  function renderRate() {
    els.rate.textContent = `${state.rate}×`;
    els.rate.setAttribute('aria-label', `Playback speed ${state.rate}×. Click to change`);
    audio.defaultPlaybackRate = state.rate;
    audio.playbackRate = state.rate;
  }

  function renderVolume() {
    const effective = state.muted ? 0 : state.volume;
    const percent = Math.round(effective * 100);

    els.volume.value = String(percent);
    setRangeFill(els.volume, percent);
    els.volume.setAttribute('aria-valuetext', `${percent}%`);

    const icon = effective === 0 ? 'i-volume-off' : effective < 0.5 ? 'i-volume-down' : 'i-volume-up';
    els.muteIcon.setAttribute('href', `#${icon}`);
    els.mute.setAttribute('aria-label', effective === 0 ? 'Unmute' : 'Mute');

    audio.volume = state.volume;
    audio.muted = state.muted;
  }

  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    if (els.themeIcon) {
      els.themeIcon.setAttribute('href', isDark ? '#i-sun' : '#i-moon');
    }
    if (els.themeToggle) {
      const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
      els.themeToggle.setAttribute('aria-label', label);
      els.themeToggle.setAttribute('title', label);
    }
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? '#020204' : '#f4f6fc');
    }
    savePrefs();
  }

  function toggleTheme() {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  function resetProgress() {
    els.seek.disabled = true;
    els.seek.value = '0';
    setRangeFill(els.seek, 0);
    els.seek.style.setProperty('--buffered', '0%');
    els.timeCurrent.textContent = '0:00';
    els.timeDuration.textContent = formatTime(currentTrack()?.duration);
  }

  function updateProgress() {
    if (state.scrubbing) return;
    const duration = audio.duration;
    const time = audio.currentTime;
    const ratio = Number.isFinite(duration) && duration > 0 ? clamp(time / duration, 0, 1) : 0;

    els.seek.value = String(Math.round(ratio * 10000));
    setRangeFill(els.seek, ratio * 100);
    els.timeCurrent.textContent = formatTime(time);
    els.seek.setAttribute('aria-valuetext', `${formatTime(time)} of ${formatTime(duration)}`);
  }

  function updateBuffered() {
    const { buffered, currentTime, duration } = audio;
    if (!Number.isFinite(duration) || duration <= 0) return;
    let end = 0;
    for (let i = 0; i < buffered.length; i += 1) {
      if (buffered.start(i) <= currentTime + 0.5 && buffered.end(i) >= end) end = buffered.end(i);
    }
    els.seek.style.setProperty('--buffered', `${clamp((end / duration) * 100, 0, 100)}%`);
  }

  function handleDuration() {
    const duration = audio.duration;
    const track = currentTrack();
    if (!Number.isFinite(duration)) return;

    els.seek.disabled = false;
    els.timeDuration.textContent = formatTime(duration);
    if (track && track.duration !== duration) {
      track.duration = duration;
      updatePlaylistState();
    }
    updateProgress();
    updatePositionState();
  }

  /* ---- Playlist ---- */
  function renderPlaylist() {
    const fragment = document.createDocumentFragment();
    const visibleIndices = getFilteredIndices();

    if (!visibleIndices.length) {
      const empty = document.createElement('li');
      empty.className = 'queue__empty';
      const catName = CATEGORIES[state.category] || state.category;
      empty.textContent = state.category === 'all'
        ? 'No tracks in playlist. Click "Add files" or drop audio files here.'
        : `No tracks found in “${catName}”. Choose another category or add files.`;
      fragment.append(empty);
    } else {
      visibleIndices.forEach((trackIndex, displayNum) => {
        const track = state.tracks[trackIndex];
        const item = document.createElement('li');
        item.className = 'queue__item';
        item.dataset.id = track.id;
        item.dataset.index = String(trackIndex);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'track';
        button.dataset.index = String(trackIndex);

        const lead = document.createElement('span');
        lead.className = 'track__lead';
        const number = document.createElement('span');
        number.className = 'track__num';
        number.textContent = String(displayNum + 1);
        const eq = document.createElement('span');
        eq.className = 'track__eq';
        eq.setAttribute('aria-hidden', 'true');
        eq.append(document.createElement('span'), document.createElement('span'), document.createElement('span'));
        lead.append(number, eq);

        const text = document.createElement('span');
        text.className = 'track__text';
        const title = document.createElement('span');
        title.className = 'track__title';
        title.textContent = track.title;
        const artist = document.createElement('span');
        artist.className = 'track__artist';
        artist.textContent = track.artist;

        const badge = document.createElement('span');
        const catKey = track.local ? 'local' : (track.category || 'all');
        badge.className = `track__badge track__badge--${catKey}`;
        badge.textContent = track.categoryLabel || CATEGORIES[track.category] || 'Track';

        text.append(title, artist, badge);

        const duration = document.createElement('span');
        duration.className = 'track__dur';
        duration.textContent = formatTime(track.duration);

        button.append(lead, text, duration);
        item.append(button);

        const actions = document.createElement('div');
        actions.className = 'track__actions';

        const download = document.createElement('button');
        download.type = 'button';
        download.className = 'track__download';
        download.dataset.index = String(trackIndex);
        download.setAttribute('aria-label', `Download ${track.title}`);
        download.setAttribute('title', `Download ${track.title}`);
        download.innerHTML = '<svg class="icon icon--sm" aria-hidden="true"><use href="#i-download"/></svg>';
        actions.append(download);

        if (track.local) {
          const remove = document.createElement('button');
          remove.type = 'button';
          remove.className = 'track__remove';
          remove.dataset.index = String(trackIndex);
          remove.setAttribute('aria-label', `Remove ${track.title}`);
          remove.setAttribute('title', `Remove ${track.title}`);
          remove.innerHTML = '<svg class="icon icon--sm" aria-hidden="true"><use href="#i-close"/></svg>';
          actions.append(remove);
        }

        item.append(actions);
        fragment.append(item);
      });
    }

    els.playlist.replaceChildren(fragment);
    const totalCount = state.tracks.length;
    const filteredCount = visibleIndices.length;
    const catLabel = CATEGORIES[state.category] || state.category;
    els.count.textContent = state.category === 'all'
      ? `${totalCount} track${totalCount === 1 ? '' : 's'}`
      : `${filteredCount} track${filteredCount === 1 ? '' : 's'} · ${catLabel}`;
    updatePlaylistState();
  }

  function updatePlaylistState() {
    [...els.playlist.children].forEach((item) => {
      if (!item.dataset.index) return;
      const index = Number(item.dataset.index);
      const track = state.tracks[index];
      if (!track) return;
      const isCurrent = index === state.index;
      const button = item.querySelector('.track');

      item.classList.toggle('is-current', isCurrent);
      item.classList.toggle('is-playing', isCurrent && state.playing);
      item.classList.toggle('is-failed', track.failed);
      if (isCurrent) button.setAttribute('aria-current', 'true'); else button.removeAttribute('aria-current');
      const durEl = item.querySelector('.track__dur');
      if (durEl) durEl.textContent = formatTime(track.duration);
    });
  }

  function scrollCurrentIntoView() {
    const item = els.playlist.querySelector(`.queue__item[data-index="${state.index}"]`);
    if (!item) return;
    const list = els.playlist;
    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top - 8;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 8;
  }

  /** Read track length without touching the main player. */
  function probeDuration(track) {
    const probe = new Audio();
    probe.preload = 'metadata';
    probe.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(probe.duration)) {
        track.duration = probe.duration;
        updatePlaylistState();
      }
    }, { once: true });
    probe.src = track.src;
  }

  /* ---- Visualizer ---- */
  const viz = {
    ctx: els.viz.getContext('2d'),
    bars: 48,
    values: new Float32Array(48),
    width: 0,
    height: 0,
    dpr: 1,
    colors: DEFAULT_PALETTES[0],
  };

  function resizeViz() {
    const rect = els.viz.getBoundingClientRect();
    viz.dpr = Math.min(window.devicePixelRatio || 1, 2);
    viz.width = Math.max(1, Math.round(rect.width * viz.dpr));
    viz.height = Math.max(1, Math.round(rect.height * viz.dpr));
    els.viz.width = viz.width;
    els.viz.height = viz.height;
    drawViz(performance.now());
  }

  function drawViz(now) {
    const { ctx, bars, values, width, height, dpr } = viz;
    const animate = state.playing && !motionQuery.matches;
    const live = animate && graph;
    if (live) graph.analyser.getByteFrequencyData(graph.data);

    for (let i = 0; i < bars; i += 1) {
      let target = 0;
      if (live) {
        const maxBin = Math.min(300, graph.data.length - 1);
        const bin = 1 + Math.floor(Math.pow(i / (bars - 1), 1.7) * (maxBin - 1));
        target = Math.pow(graph.data[bin] / 255, 1.4);
      } else if (animate) {
        const t = now / 1000;
        const tilt = 1 - 0.55 * (i / bars);
        target = (0.35 + 0.3 * Math.sin(t * 2.1 + i * 0.55) + 0.2 * Math.sin(t * 3.7 + i * 1.3)
          + 0.15 * Math.sin(t * 1.3 + i * 0.2)) * tilt;
        target = clamp(target, 0.05, 1);
      }
      values[i] += (target - values[i]) * (target > values[i] ? 0.35 : 0.12);
    }

    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, viz.colors[0]);
    gradient.addColorStop(1, viz.colors[1]);
    ctx.fillStyle = gradient;
    ctx.globalAlpha = animate || values.some((v) => v > 0.02) ? 1 : 0.35;

    const step = width / bars;
    const barWidth = Math.max(2 * dpr, step * 0.58);
    for (let i = 0; i < bars; i += 1) {
      const barHeight = Math.max(3 * dpr, values[i] * height);
      const x = i * step + (step - barWidth) / 2;
      const y = height - barHeight;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
      else ctx.rect(x, y, barWidth, barHeight);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  let rafId = 0;
  function frame(now) {
    rafId = 0;
    updateProgress();
    drawViz(now);
    if (state.playing || viz.values.some((v) => v > 0.01)) rafId = window.requestAnimationFrame(frame);
  }
  function ensureLoop() {
    if (!rafId) rafId = window.requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------
   * 6. Local files (picker + drag & drop)
   * ---------------------------------------------------------------- */
  function addFiles(fileList) {
    const files = [...fileList].filter((file) => file.type.startsWith('audio/') || AUDIO_EXTENSIONS.test(file.name));
    if (!files.length) {
      showToast('No audio files found');
      return;
    }

    const firstNewIndex = state.tracks.length;

    files.forEach((file) => {
      localCounter += 1;
      const track = {
        id: `local-${Date.now()}-${localCounter}`,
        category: state.category !== 'all' ? state.category : '90s',
        categoryLabel: state.category !== 'all' ? (CATEGORIES[state.category] || 'Local File') : 'Local File',
        title: file.name.replace(/\.[^.]+$/, '').replace(/[_]+/g, ' ').trim() || 'Untitled',
        artist: 'Local file',
        src: URL.createObjectURL(file),
        colors: paletteFor(file.name),
        duration: NaN,
        local: true,
        failed: false,
      };
      state.tracks.push(track);
      probeDuration(track);
    });

    renderPlaylist();
    if (state.index < 0 && state.tracks.length > 0) {
      loadTrack(firstNewIndex);
    }
    showToast(`Added ${files.length} track${files.length === 1 ? '' : 's'}`);
  }

  const hasFiles = (event) => Boolean(event.dataTransfer) && [...event.dataTransfer.types].includes('Files');

  /* ------------------------------------------------------------------
   * 7. Media Session
   * ---------------------------------------------------------------- */
  const artworkCache = new Map();

  function artworkFor(colors) {
    const key = colors.join();
    if (artworkCache.has(key)) return artworkCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const g = canvas.getContext('2d');
    const gradient = g.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    g.fillStyle = gradient;
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = 'rgba(255,255,255,0.9)';
    g.beginPath();
    g.ellipse(100, 176, 30, 22, -0.3, 0, Math.PI * 2);
    g.fill();
    g.fillRect(124, 56, 12, 118);
    g.fillRect(124, 56, 56, 16);

    const url = canvas.toDataURL('image/png');
    artworkCache.set(key, url);
    return url;
  }

  function updateMediaMetadata(track) {
    if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: 'Musify',
      artwork: [{ src: artworkFor(track.colors), sizes: '256x256', type: 'image/png' }],
    });
  }

  function updatePositionState() {
    if (!('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) return;
    const duration = audio.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    try {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: audio.playbackRate,
        position: clamp(audio.currentTime, 0, duration),
      });
    } catch { /* invalid state while the track is switching */ }
  }

  function setupMediaSession() {
    if (!('mediaSession' in navigator)) return;
    const handlers = {
      play: () => play(),
      pause: () => pause(),
      previoustrack: () => goPrevious(),
      nexttrack: () => goNext(),
      seekbackward: (d) => seekBy(-(d.seekOffset || 10)),
      seekforward: (d) => seekBy(d.seekOffset || 10),
      seekto: (d) => seekTo(d.seekTime),
    };
    Object.entries(handlers).forEach(([action, handler]) => {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* unsupported action */ }
    });
  }

  /* ------------------------------------------------------------------
   * 8. Event wiring & init
   * ---------------------------------------------------------------- */

  /* ---- Audio element ---- */
  audio.addEventListener('play', () => {
    state.playing = true;
    document.body.classList.add('is-playing');
    renderPlayButton();
    renderNowPlaying();
    updatePlaylistState();
    ensureLoop();
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
  });

  audio.addEventListener('pause', () => {
    state.playing = false;
    document.body.classList.remove('is-playing');
    renderPlayButton();
    renderNowPlaying();
    updatePlaylistState();
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
  });

  audio.addEventListener('waiting', () => setLoading(true));
  audio.addEventListener('canplay', () => setLoading(false));
  audio.addEventListener('playing', () => setLoading(false));
  audio.addEventListener('emptied', () => setLoading(false));

  audio.addEventListener('loadedmetadata', handleDuration);
  audio.addEventListener('durationchange', handleDuration);
  audio.addEventListener('timeupdate', () => { updateProgress(); updatePositionState(); });
  audio.addEventListener('progress', updateBuffered);
  audio.addEventListener('seeked', updatePositionState);
  audio.addEventListener('ratechange', updatePositionState);
  audio.addEventListener('ended', handleEnded);
  audio.addEventListener('error', () => { setLoading(false); handleError(); });

  /* ---- Controls ---- */
  els.play.addEventListener('click', togglePlay);
  els.next.addEventListener('click', goNext);
  els.prev.addEventListener('click', goPrevious);
  els.shuffle.addEventListener('click', () => setShuffle(!state.shuffle));
  els.repeat.addEventListener('click', cycleRepeat);
  els.rate.addEventListener('click', cycleRate);
  if (els.downloadCurrent) {
    els.downloadCurrent.addEventListener('click', () => downloadTrack(currentTrack()));
  }
  els.mute.addEventListener('click', toggleMute);
  els.volume.addEventListener('input', () => setVolume(Number(els.volume.value) / 100));
  if (els.themeToggle) els.themeToggle.addEventListener('click', toggleTheme);

  /* ---- Seek bar: preview while dragging, commit on release ---- */
  els.seek.addEventListener('input', () => {
    const duration = audio.duration;
    if (!Number.isFinite(duration)) return;
    state.scrubbing = true;
    const ratio = Number(els.seek.value) / 10000;
    setRangeFill(els.seek, ratio * 100);
    els.timeCurrent.textContent = formatTime(ratio * duration);
  });

  els.seek.addEventListener('change', () => {
    const duration = audio.duration;
    state.scrubbing = false;
    if (Number.isFinite(duration)) seekTo((Number(els.seek.value) / 10000) * duration);
  });

  els.seek.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      seekBy(event.key === 'ArrowRight' ? SEEK_STEP : -SEEK_STEP);
    }
  });

  /* ---- Playlist ---- */
  els.playlist.addEventListener('click', (event) => {
    const download = event.target.closest('.track__download');
    if (download) {
      const idx = Number(download.dataset.index);
      if (state.tracks[idx]) downloadTrack(state.tracks[idx]);
      return;
    }
    const remove = event.target.closest('.track__remove');
    if (remove) {
      removeTrack(Number(remove.dataset.index));
      return;
    }
    const row = event.target.closest('.track');
    if (!row) return;
    const index = Number(row.dataset.index);
    if (state.tracks[index]?.failed) state.tracks[index].failed = false; // allow retrying
    if (index === state.index) togglePlay(); else playIndex(index);
  });

  els.addFiles.addEventListener('click', () => els.fileInput.click());
  els.fileInput.addEventListener('change', () => {
    if (els.fileInput.files.length) addFiles(els.fileInput.files);
    els.fileInput.value = '';
  });

  /* ---- Categories ---- */
  if (els.categoriesNav) {
    els.categoriesNav.addEventListener('click', (event) => {
      const pill = event.target.closest('.category-pill');
      if (!pill || !pill.dataset.cat) return;
      setCategory(pill.dataset.cat);
    });
  }

  /* ---- Drag & drop ---- */
  let dragDepth = 0;
  window.addEventListener('dragenter', (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth += 1;
    document.body.classList.add('is-dragging');
  });
  window.addEventListener('dragover', (event) => {
    if (hasFiles(event)) event.preventDefault();
  });
  window.addEventListener('dragleave', (event) => {
    if (!hasFiles(event)) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) document.body.classList.remove('is-dragging');
  });
  window.addEventListener('drop', (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth = 0;
    document.body.classList.remove('is-dragging');
    addFiles(event.dataTransfer.files);
  });

  /* ---- Keyboard shortcuts ---- */
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const target = event.target;
    const tag = target.tagName;
    const isRange = tag === 'INPUT' && target.type === 'range';
    const isTyping = tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
      || (tag === 'INPUT' && !isRange);
    if (isTyping) return;

    const key = event.key;
    switch (key) {
      case ' ':
        if (tag === 'BUTTON') return; // let the focused button activate itself
        event.preventDefault();
        togglePlay();
        break;
      case 'k': case 'K':
        togglePlay();
        break;
      case 'ArrowLeft': case 'ArrowRight':
        if (isRange) return; // ranges handle their own arrows
        event.preventDefault();
        seekBy(key === 'ArrowRight' ? SEEK_STEP : -SEEK_STEP);
        break;
      case 'ArrowUp': case 'ArrowDown':
        if (isRange) return;
        event.preventDefault();
        setVolume((state.muted ? 0 : state.volume) + (key === 'ArrowUp' ? VOLUME_STEP : -VOLUME_STEP));
        break;
      case 'n': case 'N': goNext(); break;
      case 'p': case 'P': goPrevious(); break;
      case 's': case 'S': setShuffle(!state.shuffle); break;
      case 'r': case 'R': cycleRepeat(); break;
      case 'm': case 'M': toggleMute(); break;
      case 'd': case 'D': downloadTrack(currentTrack()); break;
      case 't': case 'T': toggleTheme(); break;
      default:
        if (/^[0-9]$/.test(key) && Number.isFinite(audio.duration)) {
          seekTo(audio.duration * (Number(key) / 10)); // 0–9 jumps to 0–90%
        }
    }
  });

  window.addEventListener('beforeunload', () => {
    state.tracks.forEach((track) => { if (track.local) URL.revokeObjectURL(track.src); });
  });

  if ('ResizeObserver' in window) new ResizeObserver(resizeViz).observe(els.viz);
  else window.addEventListener('resize', resizeViz);
  motionQuery.addEventListener('change', () => drawViz(performance.now()));

  /* ---- Init ---- */
  (function init() {
    // iOS Safari ignores audio.volume (the hardware buttons control it), so hide the slider there.
    const probe = new Audio();
    probe.volume = 0.5;
    if (probe.volume !== 0.5) els.volumeWrap.hidden = true;

    setCategory(state.category);
    state.tracks.forEach(probeDuration);
    renderModes();
    renderRate();
    renderVolume();
    renderPlayButton();
    setTheme(state.theme);
    setupMediaSession();

    const savedIndex = state.tracks.findIndex((track) => track.id === prefs.trackId);
    if (state.tracks.length > 0) {
      loadTrack(savedIndex >= 0 ? savedIndex : 0);
    } else {
      renderNowPlaying();
      resetProgress();
    }
    resizeViz();
  })();
})();

