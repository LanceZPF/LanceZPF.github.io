/* ===================================================
   Philosophy: "Everything is Random"
   app.js -- self-contained vanilla JS
   =================================================== */

(() => {
  "use strict";

  /* ---------- 0. RANDOM ACCENT COLOR ---------- */
  /* Mutable accent state — single source of truth */
  let _hue = Math.floor(Math.random() * 360);
  let _accent = `hsl(${_hue}, 70%, 60%)`;
  let _accentDim = `hsla(${_hue}, 70%, 60%, 0.15)`;
  const root = document.documentElement;

  function applyAccent() {
    root.style.setProperty("--accent", _accent);
    root.style.setProperty("--accent-dim", _accentDim);
    document.getElementById("seed-val").textContent = _hue;
  }
  applyAccent();

  function setNewAccent() {
    _hue = Math.floor(Math.random() * 360);
    _accent = `hsl(${_hue}, 70%, 60%)`;
    _accentDim = `hsla(${_hue}, 70%, 60%, 0.15)`;
    applyAccent();
  }

  function currentAccent() { return _accent; }
  function currentHue() { return _hue; }

  function accentRGBA(a) {
    /* approximate HSL -> RGB */
    const s = 0.7, l = 0.6;
    const h = currentHue() / 360;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hue2rgb = (pp, qq, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return pp + (qq - pp) * 6 * t;
      if (t < 1/2) return qq;
      if (t < 2/3) return pp + (qq - pp) * (2/3 - t) * 6;
      return pp;
    };
    const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
    return `rgba(${r},${g},${b},${a})`;
  }

  /* ---------- 1. RANDOM WALK BACKGROUND ---------- */
  const walkCanvas = document.getElementById("walk-canvas");
  const wCtx = walkCanvas.getContext("2d");
  let walkers = [];
  const WALKER_COUNT = window.innerWidth < 600 ? 4 : 7;

  function resizeWalkCanvas() {
    walkCanvas.width = window.innerWidth;
    walkCanvas.height = window.innerHeight;
  }
  resizeWalkCanvas();
  window.addEventListener("resize", resizeWalkCanvas);

  function initWalkers() {
    walkers = [];
    for (let i = 0; i < WALKER_COUNT; i++) {
      walkers.push({
        x: Math.random() * walkCanvas.width,
        y: Math.random() * walkCanvas.height,
        step: 1.2 + Math.random() * 1.8,
        opacity: 0.06 + Math.random() * 0.12
      });
    }
  }
  initWalkers();

  function drawWalkers() {
    for (const w of walkers) {
      const px = w.x;
      const py = w.y;
      w.x += (Math.random() - 0.5) * w.step * 3;
      w.y += (Math.random() - 0.5) * w.step * 3;
      /* wrap around */
      if (w.x < 0) w.x = walkCanvas.width;
      if (w.x > walkCanvas.width) w.x = 0;
      if (w.y < 0) w.y = walkCanvas.height;
      if (w.y > walkCanvas.height) w.y = 0;
      wCtx.beginPath();
      wCtx.moveTo(px, py);
      wCtx.lineTo(w.x, w.y);
      wCtx.strokeStyle = accentRGBA(w.opacity);
      wCtx.lineWidth = 1;
      wCtx.stroke();
    }
    requestAnimationFrame(drawWalkers);
  }
  requestAnimationFrame(drawWalkers);

  /* ---------- 2. CURSOR TRAIL ---------- */
  const cursorCanvas = document.getElementById("cursor-canvas");
  const cCtx = cursorCanvas.getContext("2d");
  let mouse = { x: -100, y: -100 };
  let trail = [];

  function resizeCursorCanvas() {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
  }
  resizeCursorCanvas();
  window.addEventListener("resize", resizeCursorCanvas);

  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    trail.push({ x: e.clientX, y: e.clientY, age: 0 });
    if (trail.length > 80) trail.shift();
  });

  function drawCursor() {
    cCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    /* dot */
    cCtx.beginPath();
    cCtx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
    cCtx.fillStyle = currentAccent();
    cCtx.fill();
    /* trail */
    for (let i = 1; i < trail.length; i++) {
      const a = trail[i - 1];
      const b = trail[i];
      const alpha = 1 - b.age / 80;
      if (alpha <= 0) continue;
      cCtx.beginPath();
      cCtx.moveTo(a.x, a.y);
      cCtx.lineTo(b.x, b.y);
      cCtx.strokeStyle = accentRGBA(alpha * 0.3);
      cCtx.lineWidth = 1.5;
      cCtx.stroke();
    }
    trail.forEach((t) => t.age++);
    trail = trail.filter((t) => t.age < 80);
    requestAnimationFrame(drawCursor);
  }
  if (window.matchMedia("(pointer: fine)").matches) {
    requestAnimationFrame(drawCursor);
  }

  /* ---------- 3. THREE.JS DICE ---------- */
  const diceContainer = document.getElementById("dice-container");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(220, 220);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  diceContainer.appendChild(renderer.domElement);

  /* Dice textures -- create via canvas */
  function createFaceTexture(n) {
    const size = 256;
    const cv = document.createElement("canvas");
    cv.width = size; cv.height = size;
    const ctx = cv.getContext("2d");
    /* white face */
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    /* subtle border */
    ctx.strokeStyle = "#dddddd";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, size - 4, size - 4);
    /* dots */
    ctx.fillStyle = currentAccent();
    const r = 18;
    const positions = {
      1: [[128, 128]],
      2: [[80, 80], [176, 176]],
      3: [[80, 80], [128, 128], [176, 176]],
      4: [[80, 80], [176, 80], [80, 176], [176, 176]],
      5: [[80, 80], [176, 80], [128, 128], [80, 176], [176, 176]],
      6: [[80, 70], [176, 70], [80, 128], [176, 128], [80, 186], [176, 186]]
    };
    for (const [x, y] of positions[n]) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.needsUpdate = true;
    return tex;
  }

  /* Standard die layout: 1-front, 6-back, 2-right, 5-left, 3-top, 4-bottom */
  /* Three.js BoxGeometry face order: +x, -x, +y, -y, +z, -z */
  const faceOrder = [2, 5, 3, 4, 1, 6]; /* maps Three.js face index -> die number */
  const materials = faceOrder.map((n) =>
    new THREE.MeshStandardMaterial({ map: createFaceTexture(n) })
  );

  const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
  /* round edges with a slight bevel look via vertex displacement is too complex;
     keep simple cube -- the textures make it look great */
  const dice = new THREE.Mesh(geometry, materials);
  scene.add(dice);

  /* Lighting */
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(3, 4, 5);
  scene.add(dirLight);

  /* Random initial rotation */
  dice.rotation.x = Math.random() * Math.PI * 2;
  dice.rotation.y = Math.random() * Math.PI * 2;

  /* Dice state */
  let isDragging = false;
  let isRolling = false;
  let rollVelocity = { x: 0, y: 0, z: 0 };
  let idleSpeed = 0.003;
  let prevMouse = { x: 0, y: 0 };
  let activePointerId = null;
  let pointerStart = { x: 0, y: 0 };
  let didDrag = false;
  const CLICK_DRAG_THRESHOLD = 8;

  /* Section mapping: face 1-6 -> section id */
  const sectionMap = {
    1: "hero",
    2: "research",
    3: "publications",
    4: "life-walk",
    5: "quote-section",
    6: "publications"   /* 6 also goes to publications for fun */
  };

  /* Drag */
  diceContainer.addEventListener("pointerdown", (e) => {
    if (isRolling) return;
    isDragging = true;
    activePointerId = e.pointerId;
    prevMouse = { x: e.clientX, y: e.clientY };
    pointerStart = { x: e.clientX, y: e.clientY };
    didDrag = false;
    diceContainer.setPointerCapture(e.pointerId);
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDragging || e.pointerId !== activePointerId) return;
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    const totalDx = e.clientX - pointerStart.x;
    const totalDy = e.clientY - pointerStart.y;
    if (totalDx * totalDx + totalDy * totalDy > CLICK_DRAG_THRESHOLD * CLICK_DRAG_THRESHOLD) {
      didDrag = true;
    }
    dice.rotation.y += dx * 0.01;
    dice.rotation.x += dy * 0.01;
    prevMouse = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener("pointerup", (e) => {
    if (!isDragging || e.pointerId !== activePointerId) return;
    const rect = diceContainer.getBoundingClientRect();
    const releasedOnDice =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    isDragging = false;
    if (diceContainer.hasPointerCapture(activePointerId)) {
      diceContainer.releasePointerCapture(activePointerId);
    }
    activePointerId = null;

    if (!didDrag && releasedOnDice) {
      rollDice();
    }
  });

  window.addEventListener("pointercancel", (e) => {
    if (e.pointerId !== activePointerId) return;
    isDragging = false;
    if (diceContainer.hasPointerCapture(activePointerId)) {
      diceContainer.releasePointerCapture(activePointerId);
    }
    activePointerId = null;
    didDrag = false;
  });

  /* Roll function */
  function rollDice() {
    if (isRolling) return;
    isRolling = true;
    const face = Math.floor(Math.random() * 6) + 1;

    /* target rotations for each face to be upright toward camera (+z) */
    const faceTargets = {
      1: { x: 0, y: 0 },               /* face 1 = +z already */
      2: { x: 0, y: -Math.PI / 2 },    /* face 2 = +x */
      3: { x: Math.PI / 2, y: 0 },     /* face 3 = +y */
      4: { x: -Math.PI / 2, y: 0 },    /* face 4 = -y */
      5: { x: 0, y: Math.PI / 2 },     /* face 5 = -x */
      6: { x: 0, y: Math.PI }          /* face 6 = -z */
    };

    const target = faceTargets[face];
    /* add extra full spins for drama */
    const extraSpins = (2 + Math.floor(Math.random() * 3)) * Math.PI * 2;
    const targetX = target.x + extraSpins * (Math.random() > 0.5 ? 1 : -1);
    const targetY = target.y + extraSpins * (Math.random() > 0.5 ? 1 : -1);

    const startX = dice.rotation.x;
    const startY = dice.rotation.y;
    const startZ = dice.rotation.z;
    const duration = 1800;
    const startTime = performance.now();

    function easeOutBack(t) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function animateRoll(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const e = easeOutBack(t);
      dice.rotation.x = startX + (targetX - startX) * e;
      dice.rotation.y = startY + (targetY - startY) * e;
      dice.rotation.z = startZ * (1 - e);

      if (t < 1) {
        requestAnimationFrame(animateRoll);
      } else {
        isRolling = false;
        /* re-randomize everything on roll */
        reRandomize();
        /* scroll to section */
        const sectionId = sectionMap[face];
        const el = document.getElementById(sectionId);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 300);
        }
      }
    }
    requestAnimationFrame(animateRoll);
  }

  document.getElementById("roll-btn").addEventListener("click", rollDice);

  /* Space bar to roll */
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !e.repeat) {
      e.preventDefault();
      rollDice();
    }
  });

  /* Render loop */
  function renderDice() {
    if (!isDragging && !isRolling) {
      dice.rotation.y += idleSpeed;
      dice.rotation.x += idleSpeed * 0.3;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(renderDice);
  }
  requestAnimationFrame(renderDice);

  /* ---------- 4. RESEARCH KEYWORDS ---------- */
  const keywords = [
    { text: "multimodal", size: "kw-lg", desc: "vision + language + more" },
    { text: "agent", size: "kw-lg", desc: "autonomous AI systems" },
    { text: "world_model", size: "kw-md", desc: "learning world representations" },
    { text: "food_ai", size: "kw-md", desc: "computational food understanding" },
    { text: "LLM", size: "kw-lg", desc: "large language models" },
    { text: "diffusion", size: "kw-md", desc: "denoising diffusion models" },
    { text: "healthcare", size: "kw-sm", desc: "AI for health applications" },
    { text: "vision-language", size: "kw-md", desc: "cross-modal understanding" }
  ];

  const cloud = document.getElementById("keyword-cloud");

  function placeKeywords() {
    cloud.innerHTML = "";
    const rect = cloud.getBoundingClientRect();
    const placed = [];

    /* shuffle */
    const shuffled = [...keywords].sort(() => Math.random() - 0.5);

    for (const kw of shuffled) {
      const el = document.createElement("span");
      el.className = `keyword ${kw.size}`;
      el.innerHTML = `${kw.text}<span class="kw-desc">${kw.desc}</span>`;

      /* temporary place to measure */
      el.style.visibility = "hidden";
      cloud.appendChild(el);
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      el.style.visibility = "";

      /* find non-overlapping position */
      let attempts = 0;
      let x, y;
      do {
        x = Math.random() * (rect.width - w - 20) + 10;
        y = Math.random() * (rect.height - h - 30) + 10;
        attempts++;
      } while (
        attempts < 60 &&
        placed.some(
          (p) =>
            x < p.x + p.w + 12 &&
            x + w + 12 > p.x &&
            y < p.y + p.h + 8 &&
            y + h + 8 > p.y
        )
      );

      el.style.left = x + "px";
      el.style.top = y + "px";
      placed.push({ x, y, w, h });
    }
  }

  /* delay until layout is ready */
  setTimeout(placeKeywords, 100);
  window.addEventListener("resize", placeKeywords);

  /* ---------- 5. PUBLICATIONS ---------- */
  const papers = [
    {
      title: "OpenING: A Comprehensive Benchmark for Judging Open-ended Interleaved Image-Text Generation",
      venue: "CVPR 2025",
      oral: true,
      meta: {
        arXiv: "https://arxiv.org/abs/2411.18499",
        Homepage: "https://opening-benchmark.github.io/",
        pdf: "./files/papers/opening_arxiv_2024/opening.pdf"
      }
    },
    {
      title: "Neural-Driven Image Editing",
      venue: "NeurIPS 2025",
      oral: false,
      meta: {
        arXiv: "https://arxiv.org/abs/2507.05397",
        Homepage: "https://loongx1.github.io",
        pdf: "./files/papers/loongx_neurips_2025/loongx.pdf"
      }
    },
    {
      title: "FoodSky: A Food-oriented Large Language Model that Passes the Chef and Dietetic Examination",
      venue: "Patterns (Cell Press) 2025",
      oral: false,
      meta: {
        arXiv: "https://arxiv.org/abs/2406.10261",
        Demo: "http://222.92.101.211:8200",
        pdf: "./files/papers/foodsky_arxiv_2024/foodsky.pdf"
      }
    },
    {
      title: "Synthesizing Knowledge-enhanced Features for Real-world Zero-shot Food Detection",
      venue: "IEEE TIP 2024",
      oral: false,
      meta: {
        arXiv: "https://arxiv.org/abs/2402.09242",
        GitHub: "https://github.com/LanceZPF/KEFS",
        pdf: "./files/papers/zsfdet_tip_2024/zsfdet.pdf"
      }
    },
    {
      title: "SeeDS: Semantic Separable Diffusion Synthesizer for Zero-shot Food Detection",
      venue: "ACM MM 2023",
      oral: false,
      meta: {
        arXiv: "https://arxiv.org/abs/2310.04689",
        GitHub: "https://github.com/LanceZPF/SeeDS",
        pdf: "./files/papers/seeds_acmmm_2023/seeds.pdf"
      }
    },
    {
      title: "Self-supervised Enhancement for Named Entity Disambiguation via Multimodal Graph Convolution",
      venue: "IEEE TNNLS 2024",
      oral: false,
      meta: {
        GitHub: "https://github.com/LanceZPF/NNED_MMGraph",
        pdf: "./files/papers/mmgraph_tnnls_2022/mmgraph.pdf"
      }
    },
    {
      title: "CMRDF: A Real-Time Food Alerting System Based on Multimodal Data",
      venue: "IEEE IoTJ 2022",
      oral: false,
      meta: {
        GitHub: "https://github.com/LanceZPF/CMRDF",
        pdf: "./files/papers/cmrdf_iotj_2022/cmrdf.pdf"
      }
    },
    {
      title: "ISDA: Position-Aware Instance Segmentation with Deformable Attention",
      venue: "ICASSP 2022",
      oral: true,
      meta: {
        arXiv: "https://arxiv.org/abs/2202.12251",
        GitHub: "https://github.com/yingkaining/isda",
        pdf: "./files/papers/isda_icassp_2022/camera_ready.pdf"
      }
    },
    {
      title: "Exploring Implicit and Explicit Relations with the Dual Relation-Aware Network for Image Captioning",
      venue: "MMM 2022",
      oral: false,
      meta: {
        GitHub: "https://github.com/Zjut-MultimediaPlus/DRAN",
        pdf: "./files/papers/dran_mmm_2022/dran.pdf"
      }
    },
    {
      title: "RWMF: A Real-World Multimodal Foodlog Database",
      venue: "ICPR 2020",
      oral: false,
      meta: {
        DataPort: "https://ieee-dataport.org/open-access/rwmf-real-world-multimodal-foodlog-database",
        pdf: "./files/papers/rwmf_icpr_2020/rwmf.pdf"
      }
    }
  ];

  /* Pinned papers (always on top) */
  const PINNED_TITLES = [
    "OpenING: A Comprehensive Benchmark for Judging Open-ended Interleaved Image-Text Generation",
    "FoodSky: A Food-oriented Large Language Model that Passes the Chef and Dietetic Examination"
  ];

  function renderPapers() {
    const list = document.getElementById("paper-list");
    const pinned = papers.filter(p => PINNED_TITLES.includes(p.title));
    const rest = papers.filter(p => !PINNED_TITLES.includes(p.title));
    const shuffledRest = [...rest].sort(() => Math.random() - 0.5);
    const ordered = [...pinned, ...shuffledRest];
    list.innerHTML = "";
    for (const p of ordered) {
      const card = document.createElement("div");
      card.className = "paper-card";
      let metaLinks = "";
      for (const [label, url] of Object.entries(p.meta)) {
        metaLinks += `<a href="${url}" target="_blank">[${label.toLowerCase()}]</a>`;
      }
      const badge = p.oral ? `<span class="paper-badge">Oral</span>` : "";
      card.innerHTML = `
        <div class="paper-title">${p.title}${badge}</div>
        <div class="paper-venue">${p.venue}</div>
        <div class="paper-meta">${metaLinks}</div>
      `;
      list.appendChild(card);
    }
  }
  renderPapers();

  /* ---------- 6. LIFE RANDOM WALK SVG ---------- */
  function buildLifePath() {
    const container = document.getElementById("life-svg-container");
    const accent = _accent;
    const W = 760;
    const H = 320;
    const padL = 50, padR = 40, padT = 40, padB = 50;

    const events = [
      { year: 2020, label: "First pub", progress: 0.10 },
      { year: 2021, label: "B.E. @ ZJUT", progress: 0.26 },
      { year: 2022, label: "Multiple papers", progress: 0.38 },
      { year: 2024, label: "M.E. @ ICT-CAS", progress: 0.46 },
      { year: 2025, label: "NUS PhD Enroll", progress: 0.55 },
      { year: 2025.8, label: "CVPR Oral + NeurIPS + Cell Patterns", progress: 0.86 }
    ];

    const yearMin = 2018, yearMax = 2027;
    const xScale = (yr) => padL + ((yr - yearMin) / (yearMax - yearMin)) * (W - padL - padR);
    const yScale = (p) => padT + (1 - p) * (H - padT - padB);

    /* build stochastic path between events */
    let pathPoints = [];
    /* lead-in: extend line leftward from first event to left edge with Brownian drift */
    const firstX = xScale(events[0].year);
    const firstY = yScale(events[0].progress);
    const leadSteps = 15;
    const leadPoints = [];
    let lx = firstX, ly = firstY;
    for (let s = leadSteps; s >= 1; s--) {
      lx = padL + (firstX - padL) * (s / leadSteps);
      ly = firstY + (Math.random() - 0.5) * 14 + (s / leadSteps) * 20; /* drift lower to the left */
      leadPoints.push({ x: lx, y: ly });
    }
    leadPoints.reverse();
    pathPoints.push(...leadPoints);
    pathPoints.push({ x: firstX, y: firstY });

    for (let i = 0; i < events.length; i++) {
      const ev = events[i];
      const x = xScale(ev.year);
      const y = yScale(ev.progress);
      if (i === 0) {
        /* already added above */
      } else {
        const prev = events[i - 1];
        const px = xScale(prev.year);
        const py = yScale(prev.progress);
        const steps = 20 + Math.floor(Math.random() * 10);
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const baseX = px + (x - px) * t;
          const baseY = py + (y - py) * t;
          /* Brownian noise, larger in the middle */
          const noise = (Math.random() - 0.5) * 28 * Math.sin(t * Math.PI);
          pathPoints.push({ x: baseX + (Math.random() - 0.5) * 4, y: baseY + noise });
        }
      }
    }

    /* future trail */
    const lastEv = events[events.length - 1];
    let cx = xScale(lastEv.year);
    let cy = yScale(lastEv.progress);
    const futurePoints = [];
    for (let s = 0; s < 25; s++) {
      cx += (xScale(yearMax) - xScale(lastEv.year)) / 25;
      cy += (Math.random() - 0.46) * 12;
      futurePoints.push({ x: cx, y: cy });
    }

    /* build SVG */
    let pathD = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      pathD += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
    }

    let futureD = `M ${pathPoints[pathPoints.length - 1].x} ${pathPoints[pathPoints.length - 1].y}`;
    for (const fp of futurePoints) {
      futureD += ` L ${fp.x} ${fp.y}`;
    }

    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

    /* defs for future gradient */
    svg += `
      <defs>
        <linearGradient id="fade-future" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
        </linearGradient>
      </defs>`;

    /* x-axis */
    svg += `<line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" stroke="#333" stroke-width="1"/>`;
    for (let yr = 2018; yr <= 2026; yr += 2) {
      const x = xScale(yr);
      svg += `<line x1="${x}" y1="${H - padB}" x2="${x}" y2="${H - padB + 5}" stroke="#444" stroke-width="1"/>`;
      svg += `<text x="${x}" y="${H - padB + 20}" fill="#666" font-family="'JetBrains Mono',monospace" font-size="10" text-anchor="middle">${yr}</text>`;
    }

    /* y-axis label */
    svg += `<text x="12" y="${padT + (H - padT - padB) / 2}" fill="#444" font-family="'JetBrains Mono',monospace" font-size="10" text-anchor="middle" transform="rotate(-90 12 ${padT + (H - padT - padB) / 2})">progress(?)</text>`;

    /* main path */
    svg += `<path d="${pathD}" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>`;

    /* future dashed */
    svg += `<path d="${futureD}" fill="none" stroke="url(#fade-future)" stroke-width="2" stroke-dasharray="6 4" stroke-linecap="round"/>`;

    /* ??? label */
    const lastFuture = futurePoints[futurePoints.length - 1];
    svg += `<text x="${lastFuture.x + 4}" y="${lastFuture.y}" fill="#555" font-family="'JetBrains Mono',monospace" font-size="12" font-style="italic">???</text>`;

    /* event points and labels */
    for (const ev of events) {
      const x = xScale(ev.year);
      const y = yScale(ev.progress);
      svg += `<circle cx="${x}" cy="${y}" r="4" fill="${accent}" opacity="0.9"/>`;
      svg += `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${accent}" stroke-width="1" opacity="0.3"/>`;

      /* label -- alternate above/below */
      const idx = events.indexOf(ev);
      const above = idx % 2 === 0;
      const ly = above ? y - 14 : y + 20;
      svg += `<text x="${x}" y="${ly}" fill="#ccc" font-family="'JetBrains Mono',monospace" font-size="10" text-anchor="middle">${ev.label}</text>`;
    }

    svg += `</svg>`;
    container.innerHTML = svg;
  }
  buildLifePath();

  /* ---------- 7. RANDOM QUOTE ---------- */
  const quotes = [
    { text: "God does not play dice with the universe.", author: "Albert Einstein" },
    { text: "Stop telling God what to do with his dice.", author: "Niels Bohr" },
    { text: "Life is a school of probability.", author: "Walter Bagehot" },
    { text: "Randomness is the true foundation of mathematics.", author: "Gregory Chaitin" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "The dice of Zeus always fall luckily.", author: "Sophocles" },
    { text: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.", author: "Albert Camus" },
    { text: "Anyone who considers arithmetical methods of producing random digits is, of course, in a state of sin.", author: "John von Neumann" },
    { text: "It is remarkable that a science which began with the consideration of games of chance should have become the most important object of human knowledge.", author: "Pierre-Simon Laplace" },
    { text: "The generation of random numbers is too important to be left to chance.", author: "Robert R. Coveyou" },
    { text: "Probability is not a mere computation of odds on the dice or more complicated variants of it; it is the acceptance of the lack of certainty in our knowledge.", author: "Nassim Nicholas Taleb" },
    { text: "\u4e00\u5207\u4e1c\u897f\u90fd\u662f\u968f\u673a\u7684\u3002\u4eba\u751f\u662f\u590d\u6742\u7684 Random Walk\u3002", author: "Pengfei Zhou" }
  ];

  function showQuote() {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById("random-quote").innerHTML =
      `"${q.text}"<span class="quote-author">\u2014 ${q.author}</span>`;
  }
  showQuote();

  /* ---------- 8. RE-RANDOMIZE (called after dice roll lands) ---------- */
  function reRandomize() {
    /* new accent color — update the single source of truth */
    setNewAccent();

    /* clear old accent-colored trails and restart walkers */
    wCtx.clearRect(0, 0, walkCanvas.width, walkCanvas.height);
    initWalkers();

    /* update dice dot colors with new accent */
    for (let i = 0; i < faceOrder.length; i++) {
      const newTex = createFaceTexture(faceOrder[i]);
      materials[i].map.dispose();
      materials[i].map = newTex;
      materials[i].needsUpdate = true;
    }

    /* re-shuffle papers */
    renderPapers();
    /* re-place keywords */
    placeKeywords();
    /* re-draw life path */
    buildLifePath();
    /* new quote */
    showQuote();
  }

  /* ---------- 9. RE-ROLL BUTTON ---------- */
  document.getElementById("reroll-btn").addEventListener("click", () => {
    location.reload();
  });

})();
