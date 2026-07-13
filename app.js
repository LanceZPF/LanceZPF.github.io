/* ===================================================
   Phase Shift: Dual-mode academic portfolio
   Chaos (Philosophy) <-> Order (Full LanceHub)
   =================================================== */

(() => {
  "use strict";

  /* ==========================================================
     0. SHARED STATE
     ========================================================== */

  /* ---- CONFIG: set to true to enable dice → Order mode transition ---- */
  const ENABLE_ORDER_MODE = true;

  const HOT_PINK_HUE_MIN = 315;
  const HOT_PINK_HUE_MAX = 345;
  const ACCENT_HUES = Array.from({ length: 360 }, (_, hue) => hue)
    .filter((hue) => hue < HOT_PINK_HUE_MIN || hue > HOT_PINK_HUE_MAX);

  function pickAccentHue() {
    return ACCENT_HUES[Math.floor(Math.random() * ACCENT_HUES.length)];
  }

  let _hue = pickAccentHue();
  let _accent = `hsl(${_hue}, 70%, 60%)`;
  let _accentDim = `hsla(${_hue}, 70%, 60%, 0.15)`;
  const root = document.documentElement;
  let currentMode = "chaos"; // "chaos" | "order"

  function applyAccent() {
    root.style.setProperty("--accent", _accent);
    root.style.setProperty("--accent-dim", _accentDim);
    root.style.setProperty("--accent-tag-bg", `hsla(${_hue}, 70%, 60%, 0.12)`);
    root.style.setProperty("--accent-tag-border", `hsla(${_hue}, 70%, 60%, 0.25)`);
    const seedEl = document.getElementById("seed-val");
    if (seedEl) seedEl.textContent = _hue;
  }
  applyAccent();

  function setNewAccent() {
    _hue = pickAccentHue();
    _accent = `hsl(${_hue}, 70%, 60%)`;
    _accentDim = `hsla(${_hue}, 70%, 60%, 0.15)`;
    applyAccent();
  }

  function accentRGBA(a) {
    const s = 0.7, l = 0.6;
    const h = _hue / 360;
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

  /* Helper selectors for order-layer DOM */
  const OL = (sel) => document.querySelector("#order-layer " + sel);
  const OLA = (sel) => document.querySelectorAll("#order-layer " + sel);

  /* ==========================================================
     1. PAPER DATA
     ========================================================== */

  const papers = [
    {
      title: "Agent-as-a-Router",
      fullTitle: "Agent-as-a-Router: Agentic Model Routing for Coding Tasks",
      desc: "An agentic model-routing framework for coding tasks that closes the information gap through a Context–Action–Feedback loop, backed by ACRouter and CodeRouterBench.",
      venue: "Under Review", year: 2026, oral: false,
      venueColor: "#8b949e",
      tags: ["agent", "model routing", "coding", "benchmark"],
      stars: 503, forks: 14,
      links: {
        Homepage: "https://www.omnisource.cn/agent-as-a-router",
        arXiv: "https://arxiv.org/abs/2606.22902",
        Dataset: "https://huggingface.co/datasets/Lance1573/CodeRouterBench"
      },
      github: "https://github.com/LanceZPF/agent-as-a-router",
      date: "2026-06-22"
    },
    {
      title: "RDS",
      fullTitle: "Efficient Video Object Segmentation and Tracking with Recurrent Dynamic Submodel",
      desc: "A recurrent dynamic submodel for efficient video object segmentation and tracking, combining temporal-prior-guided routing with Importance-aware LoRA for an effective accuracy-speed trade-off.",
      venue: "CVPR 2026", year: 2026, oral: false,
      venueColor: "#3fb950",
      tags: ["video segmentation", "video tracking", "dynamic model", "SAM2"],
      stars: 0, forks: 0,
      links: {
        CVF: "https://openaccess.thecvf.com/content/CVPR2026/html/Tang_Efficient_Video_Object_Segmentation_and_Tracking_with_Recurrent_Dynamic_Submodel_CVPR_2026_paper.html",
        PDF: "https://openaccess.thecvf.com/content/CVPR2026/papers/Tang_Efficient_Video_Object_Segmentation_and_Tracking_with_Recurrent_Dynamic_Submodel_CVPR_2026_paper.pdf"
      },
      github: null,
      date: "2026-03-03"
    },
    {
      title: "GroupToM-Bench",
      fullTitle: "GroupToM-Bench: Benchmarking Group Theory of Mind and Nonlinear Social Emergence in MLLMs",
      desc: "The first multimodal benchmark for group-level Theory of Mind, auditing individual mental states, group tension, and nonlinear collective outcomes across seven cognitive levels.",
      venue: "ACL 2026", year: 2026, oral: false,
      venueColor: "#58a6ff",
      tags: ["multimodal", "theory of mind", "social reasoning", "benchmark"],
      stars: 0, forks: 0,
      links: {
        ACL: "https://aclanthology.org/2026.acl-long.1859/",
        arXiv: "https://arxiv.org/abs/2606.04184",
        Dataset: "https://huggingface.co/datasets/Twwwd/GroupToM-Bench"
      },
      github: null,
      date: "2026-04-07"
    },
    {
      title: "TMD-Bench",
      fullTitle: "TMD-Bench: A Multi-Level Evaluation Paradigm for Music–Dance Co-Generation",
      desc: "A multi-level benchmark for text-driven music–dance co-generation, evaluating unimodal quality, instruction adherence, and cross-modal rhythmic alignment alongside the RhyJAM baseline.",
      venue: "ICML 2026", year: 2026, oral: false,
      venueColor: "#d29922",
      tags: ["audio-visual generation", "music-dance", "benchmark", "rhythmic alignment"],
      stars: 0, forks: 0,
      links: {
        ICML: "https://icml.cc/virtual/2026/poster/65225",
        OpenReview: "https://openreview.net/forum?id=FcklDFAnzF",
        arXiv: "https://arxiv.org/abs/2605.01809"
      },
      github: "https://github.com/MM-Speech/TMD-Bench",
      date: "2026-05-03"
    },
    {
      title: "OpenING",
      fullTitle: "OpenING: A Comprehensive Benchmark for Judging Open-ended Interleaved Image-Text Generation",
      desc: "A comprehensive benchmark with 5,400 human-annotated instances across 56 real-world tasks for evaluating open-ended interleaved image-text generation models.",
      venue: "CVPR 2025", year: 2025, oral: true,
      venueColor: "#3fb950",
      tags: ["multimodal", "benchmark", "unified model"],
      stars: 58, forks: 14,
      links: { Homepage: "https://opening-benchmark.github.io/", arXiv: "https://arxiv.org/abs/2411.18499" },
      github: null,
      date: "2025-02-27"
    },
    {
      title: "LoongX",
      fullTitle: "Neural-Driven Image Editing",
      desc: "A hands-free image editing approach driven by multimodal neurophysiological signals (EEG, fNIRS, PPG, head motion) using diffusion models.",
      venue: "NeurIPS 2025", year: 2025, oral: false,
      venueColor: "#bc8cff",
      tags: ["brain-computer-interface", "diffusion model", "image editing"],
      stars: 35, forks: 8,
      links: { Homepage: "https://loongx1.github.io", arXiv: "https://arxiv.org/abs/2507.05397" },
      github: null,
      date: "2025-09-18"
    },
    {
      title: "FoodSky",
      fullTitle: "FoodSky: A Food-oriented Large Language Model that Passes the Chef and Dietetic Examination",
      desc: "Domain-specific LLM using FoodEarth corpus and TS3M + HTRAG modules, outperforming general LLMs in chef and dietetic exams.",
      venue: "Patterns (Cell Press)", year: 2025, oral: false,
      venueColor: "#f778ba",
      tags: ["food computing", "LLM", "domain research"],
      stars: 42, forks: 10,
      links: { Demo: "http://222.92.101.211:8200", arXiv: "https://arxiv.org/abs/2406.10261" },
      github: "https://github.com/LanceZPF/FoodSky",
      date: "2025-03-27"
    },
    {
      title: "ZSFDet",
      fullTitle: "Synthesizing Knowledge-enhanced Features for Real-world Zero-shot Food Detection",
      desc: "A framework leveraging multi-source graphs and KEFS for zero-shot food detection, introducing the FOWA dataset.",
      venue: "IEEE TIP", year: 2024, oral: false,
      venueColor: "#58a6ff",
      tags: ["multimodal", "food computing", "object detection"],
      stars: 28, forks: 6,
      links: { arXiv: "https://arxiv.org/abs/2402.09242" },
      github: "https://github.com/LanceZPF/KEFS",
      date: "2024-02-01"
    },
    {
      title: "SeeDS",
      fullTitle: "SeeDS: Semantic Separable Diffusion Synthesizer for Zero-shot Food Detection",
      desc: "Proposes the Zero-Shot Food Detection task with a Semantic Separable Synthesizing Module and Region Feature Denoising Diffusion Model.",
      venue: "ACM MM 2023", year: 2023, oral: false,
      venueColor: "#f0883e",
      tags: ["diffusion", "food computing", "object detection"],
      stars: 22, forks: 5,
      links: { arXiv: "https://arxiv.org/abs/2310.04689" },
      github: "https://github.com/LanceZPF/SeeDS",
      date: "2023-10-01"
    },
    {
      title: "MMGraph",
      fullTitle: "Self-supervised Enhancement for Named Entity Disambiguation via Multimodal Graph Convolution",
      desc: "Multimodal graph convolution for entity disambiguation in short texts with a self-supervised SimTri framework.",
      venue: "IEEE TNNLS", year: 2024, oral: false,
      venueColor: "#58a6ff",
      tags: ["multimodal", "graph convolution", "self-supervised"],
      stars: 18, forks: 4,
      links: { IEEE: "https://ieeexplore.ieee.org/document/9774860/", PDF: "./files/papers/mmgraph_tnnls_2022/mmgraph.pdf" },
      github: "https://github.com/LanceZPF/NNED_MMGraph",
      date: "2022-06-01"
    },
    {
      title: "CMRDF",
      fullTitle: "CMRDF: A Real-Time Food Alerting System Based on Multimodal Data",
      desc: "Cross-Modal Retrieval on Diabetogenic Food for real-time dietary monitoring via wearable devices.",
      venue: "IEEE IoTJ", year: 2022, oral: false,
      venueColor: "#58a6ff",
      tags: ["multimodal", "AIoT", "food computing"],
      stars: 12, forks: 3,
      links: { IEEE: "https://ieeexplore.ieee.org/document/9097272/", PDF: "./files/papers/cmrdf_iotj_2022/cmrdf.pdf" },
      github: "https://github.com/LanceZPF/CMRDF",
      date: "2022-01-01"
    },
    {
      title: "ISDA",
      fullTitle: "ISDA: Position-Aware Instance Segmentation with Deformable Attention",
      desc: "End-to-end Transformer-based instance segmentation achieving 38.7 mAP on MS COCO with ResNet-50.",
      venue: "ICASSP 2022", year: 2022, oral: true,
      venueColor: "#d29922",
      tags: ["instance segmentation", "transformer", "deformable-attention"],
      stars: 15, forks: 4,
      links: { arXiv: "https://arxiv.org/abs/2202.12251" },
      github: "https://github.com/yingkaining/isda",
      date: "2022-05-01"
    },
    {
      title: "MDK12-Bench",
      fullTitle: "MDK12-Bench: A Multi-Discipline Benchmark for Evaluating Reasoning in Multimodal Large Language Models",
      desc: "A multi-discipline benchmark for evaluating reasoning in multimodal large language models across K-12 subjects.",
      venue: "AAAI 2026", year: 2026, oral: false,
      venueColor: "#3fb950",
      tags: ["benchmark", "multimodal", "MLLM"],
      stars: 13, forks: 0,
      links: { AAAI: "https://ojs.aaai.org/index.php/AAAI/article/view/40134" },
      github: "https://github.com/LanceZPF/MDK12",
      date: "2025-11-08"
    }
  ];

  const PINNED_TITLES = [
    "Agent-as-a-Router: Agentic Model Routing for Coding Tasks",
    "OpenING: A Comprehensive Benchmark for Judging Open-ended Interleaved Image-Text Generation",
    "FoodSky: A Food-oriented Large Language Model that Passes the Chef and Dietetic Examination"
  ];

  const CHAOS_HIDDEN_TITLES = new Set(["SeeDS", "MMGraph", "CMRDF", "ISDA"]);

  function partitionPinnedPapers(source) {
    const papersByTitle = new Map(source.map(p => [p.fullTitle, p]));
    const pinned = PINNED_TITLES.map(title => papersByTitle.get(title)).filter(Boolean);
    const pinnedTitles = new Set(PINNED_TITLES);
    const rest = source.filter(p => !pinnedTitles.has(p.fullTitle));

    return { pinned, rest };
  }

  /* Per-paper icons (unique emoji for each paper) */
  const paperIcons = {
    "Agent-as-a-Router": "&#129302;",
    "RDS":      "&#127916;",
    "GroupToM-Bench": "&#128101;",
    "TMD-Bench": "&#127925;",
    "OpenING":  "&#128302;",
    "LoongX":   "&#129504;",
    "FoodSky":  "&#127859;",
    "ZSFDet":   "&#128269;",
    "SeeDS":    "&#127793;",
    "MMGraph":  "&#128296;",
    "CMRDF":    "&#9201;",
    "ISDA":     "&#129529;",
    "MDK12-Bench": "&#127891;"
  };

  /* Activity events for LanceHub timeline & contribution graph */
  const activities = [
    { type: "award", text: 'Passed the <strong>NUS PhD Qualification Exam (QE)</strong>', date: "2026-06-01", note: "Officially a PhD Candidate now. Congratulations!" },
    { type: "published", text: 'One paper accepted by <strong>ICML 2026</strong>', date: "2026-05-01", note: null },
    { type: "published", text: 'One paper accepted by <strong>ACL 2026</strong>', date: "2026-04-07", note: 'Congrats to intern <a href="https://wd7ang.github.io/" target="_blank">Weidong Tang</a>. Co-supervised with <a href="https://wangbo-zhao.github.io/" target="_blank">Dr. Zhao</a>.' },
    { type: "published", text: 'One paper accepted by <strong>CVPR 2026</strong>', date: "2026-03-03", note: null },
    { type: "published", text: 'One paper accepted by <strong>ICLR 2026</strong>', date: "2026-01-26", note: null },
    { type: "published", text: 'One paper accepted by <strong>IEEE Signal Processing Letters</strong>', date: "2025-12-29", note: null },
    { type: "published", text: 'Published <a>MDK12-Bench</a> at <strong>AAAI 2026</strong>', date: "2025-11-08", note: null },
    { type: "published", text: 'Published <a>LoongX</a> and one more in <strong>NeurIPS 2025</strong>', date: "2025-09-18", note: "Two papers accepted" },
    { type: "published", text: 'One paper accepted by <strong>ICCV 2025</strong>', date: "2025-07-23", note: null },
    { type: "published", text: 'One paper accepted by <strong>ACL 2025 Findings</strong>', date: "2025-05-15", note: null },
    { type: "award", text: 'Published <a>FoodSky</a> in <strong>Patterns (Cell Press)</strong>', date: "2025-03-27", note: "First food LLM in Cell sub-journal" },
    { type: "award", text: 'Published <a>OpenING</a> in <strong>CVPR 2025</strong> as <strong>Oral</strong>', date: "2025-02-27", note: "Oral presentation" },
    { type: "review", text: 'Reviewing for <strong>ICML 2025</strong>', date: "2025-01-15", note: null },
    { type: "review", text: 'Reviewing for <strong>NeurIPS 2024</strong>', date: "2024-06-01", note: null },
    { type: "published", text: 'Published <a>ZSFDet</a> in <strong>IEEE TIP</strong>', date: "2024-02-01", note: null },
    { type: "review", text: 'Reviewing for <strong>ICLR 2024</strong>', date: "2023-10-01", note: null },
    { type: "published", text: 'Published <a>SeeDS</a> in <strong>ACM MM 2023</strong>', date: "2023-10-01", note: null },
    { type: "published", text: 'Published <a>MMGraph</a> in <strong>IEEE TNNLS</strong>', date: "2022-06-01", note: null },
    { type: "published", text: 'Published <a>ISDA</a> in <strong>ICASSP 2022</strong>', date: "2022-05-01", note: "Oral presentation" }
  ];

  /* ==========================================================
     2. RANDOM WALK BACKGROUND
     ========================================================== */

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

  let walkRAF = null;
  function drawWalkers() {
    if (currentMode === "chaos" && !document.hidden) {
      for (const w of walkers) {
        const px = w.x;
        const py = w.y;
        w.x += (Math.random() - 0.5) * w.step * 3;
        w.y += (Math.random() - 0.5) * w.step * 3;
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
    }
    walkRAF = requestAnimationFrame(drawWalkers);
  }
  walkRAF = requestAnimationFrame(drawWalkers);

  /* ==========================================================
     3. CURSOR TRAIL (Chaos only)
     ========================================================== */

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
    if (currentMode === "chaos") {
      trail.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (trail.length > 80) trail.shift();
    }
  });

  function drawCursor() {
    cCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    if (currentMode === "chaos" && !document.hidden) {
      cCtx.beginPath();
      cCtx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
      cCtx.fillStyle = _accent;
      cCtx.fill();
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
    }
    requestAnimationFrame(drawCursor);
  }
  if (window.matchMedia("(pointer: fine)").matches) {
    requestAnimationFrame(drawCursor);
  }

  /* ==========================================================
     4. THREE.JS DICE
     ========================================================== */

  const diceContainer = document.getElementById("dice-container");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(200, 200);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  diceContainer.appendChild(renderer.domElement);

  function createFaceTexture(n) {
    const size = 256;
    const cv = document.createElement("canvas");
    cv.width = size; cv.height = size;
    const ctx = cv.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#dddddd";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, size - 4, size - 4);
    ctx.fillStyle = _accent;
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

  const faceOrder = [2, 5, 3, 4, 1, 6];
  const materials = faceOrder.map((n) =>
    new THREE.MeshStandardMaterial({ map: createFaceTexture(n) })
  );

  const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
  const dice = new THREE.Mesh(geometry, materials);
  scene.add(dice);

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(3, 4, 5);
  scene.add(dirLight);

  dice.rotation.x = Math.random() * Math.PI * 2;
  dice.rotation.y = Math.random() * Math.PI * 2;

  let isDragging = false;
  let isRolling = false;
  let prevMouse = { x: 0, y: 0 };
  let activePointerId = null;
  let pointerStart = { x: 0, y: 0 };
  let didDrag = false;
  const CLICK_DRAG_THRESHOLD = 8;

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
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;
    isDragging = false;
    if (diceContainer.hasPointerCapture(activePointerId)) {
      diceContainer.releasePointerCapture(activePointerId);
    }
    activePointerId = null;
    if (!didDrag && releasedOnDice) {
      toggleMode();
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

  /* Dice roll animation */
  function rollDice(callback) {
    if (isRolling) return;
    isRolling = true;
    const face = Math.floor(Math.random() * 6) + 1;
    const faceTargets = {
      1: { x: 0, y: 0 },
      2: { x: 0, y: -Math.PI / 2 },
      3: { x: Math.PI / 2, y: 0 },
      4: { x: -Math.PI / 2, y: 0 },
      5: { x: 0, y: Math.PI / 2 },
      6: { x: 0, y: Math.PI }
    };
    const target = faceTargets[face];
    const extraSpins = (2 + Math.floor(Math.random() * 2)) * Math.PI * 2;
    const targetX = target.x + extraSpins * (Math.random() > 0.5 ? 1 : -1);
    const targetY = target.y + extraSpins * (Math.random() > 0.5 ? 1 : -1);
    const startX = dice.rotation.x;
    const startY = dice.rotation.y;
    const startZ = dice.rotation.z;
    const duration = 1200;
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
        if (callback) callback();
      }
    }
    requestAnimationFrame(animateRoll);
  }

  /* Idle rotation */
  let lastAnchorW = 0, lastAnchorH = 0;
  function renderDice() {
    if (!document.hidden) {
      if (!isDragging && !isRolling) {
        dice.rotation.y += 0.003;
        dice.rotation.x += 0.001;
      }
      const anchor = document.getElementById("dice-anchor");
      const w = anchor.offsetWidth;
      const h = anchor.offsetHeight;
      if (w !== lastAnchorW || h !== lastAnchorH) {
        lastAnchorW = w;
        lastAnchorH = h;
        renderer.setSize(w, h);
      }
      renderer.render(scene, camera);
    }
    requestAnimationFrame(renderDice);
  }
  requestAnimationFrame(renderDice);

  /* ==========================================================
     5. MODE TOGGLE
     ========================================================== */

  function toggleMode() {
    rollDice(() => {
      setNewAccent();
      updateDiceTextures();
      if (!ENABLE_ORDER_MODE) {
        // Order disabled: just re-randomize Chaos
        wCtx.clearRect(0, 0, walkCanvas.width, walkCanvas.height);
        initWalkers();
        trail = [];
        renderChaosPapers();
        placeKeywords();
        buildLifePath();
        showQuote();
        return;
      }
      if (currentMode === "chaos") {
        switchToOrder();
      } else {
        switchToChaos();
      }
    });
  }

  function switchToOrder() {
    currentMode = "order";
    document.body.setAttribute("data-mode", "order");
    document.body.classList.remove("chaos-scrolled");
    document.getElementById("chaos-layer").classList.remove("active");
    document.getElementById("order-layer").classList.add("active");
    window.scrollTo(0, 0);
    // Initialize all LanceHub components
    initOrderMode();
  }

  function switchToChaos() {
    currentMode = "chaos";
    document.body.setAttribute("data-mode", "chaos");
    document.body.classList.remove("chaos-scrolled");
    document.getElementById("order-layer").classList.remove("active");
    document.getElementById("chaos-layer").classList.add("active");
    window.scrollTo(0, 0);
    // Re-randomize chaos content
    wCtx.clearRect(0, 0, walkCanvas.width, walkCanvas.height);
    initWalkers();
    trail = [];
    renderChaosPapers();
    placeKeywords();
    buildLifePath();
    showQuote();
  }

  function updateDiceTextures() {
    for (let i = 0; i < faceOrder.length; i++) {
      const oldTex = materials[i].map;
      materials[i].map = createFaceTexture(faceOrder[i]);
      materials[i].needsUpdate = true;
      if (oldTex) oldTex.dispose();
    }
  }

  /* Space bar */
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !e.repeat) {
      // Don't trigger if typing in search input
      if (document.activeElement && document.activeElement.tagName === "INPUT") return;
      e.preventDefault();
      toggleMode();
    }
  });

  /* Roll button in chaos */
  document.getElementById("roll-btn").addEventListener("click", toggleMode);

  /* Mode label click toggles */
  document.getElementById("mode-label-chaos").addEventListener("click", () => {
    if (currentMode !== "chaos") toggleMode();
  });
  document.getElementById("mode-label-order").addEventListener("click", () => {
    if (currentMode !== "order") toggleMode();
  });

  /* ==========================================================
     6. CHAOS: RESEARCH KEYWORDS
     ========================================================== */

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
    const shuffled = [...keywords].sort(() => Math.random() - 0.5);
    for (const kw of shuffled) {
      const el = document.createElement("span");
      el.className = `keyword ${kw.size}`;
      el.innerHTML = `${kw.text}<span class="kw-desc">${kw.desc}</span>`;
      el.style.visibility = "hidden";
      cloud.appendChild(el);
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      el.style.visibility = "";
      let attempts = 0;
      let x, y;
      do {
        x = Math.random() * (rect.width - w - 20) + 10;
        y = Math.random() * (rect.height - h - 30) + 10;
        attempts++;
      } while (
        attempts < 60 &&
        placed.some(
          (p) => x < p.x + p.w + 12 && x + w + 12 > p.x && y < p.y + p.h + 8 && y + h + 8 > p.y
        )
      );
      el.style.left = x + "px";
      el.style.top = y + "px";
      placed.push({ x, y, w, h });
    }
  }

  setTimeout(placeKeywords, 100);
  window.addEventListener("resize", () => { if (currentMode === "chaos") placeKeywords(); });

  /* ==========================================================
     7. CHAOS: PUBLICATIONS
     ========================================================== */

  function renderChaosPapers() {
    const list = document.getElementById("paper-list");
    const visiblePapers = papers.filter(p => !CHAOS_HIDDEN_TITLES.has(p.title));
    const { pinned, rest } = partitionPinnedPapers(visiblePapers);
    const shuffledRest = [...rest].sort(() => Math.random() - 0.5);
    const ordered = [...pinned, ...shuffledRest];
    list.innerHTML = "";
    for (const p of ordered) {
      const card = document.createElement("div");
      card.className = "chaos-paper-card";
      let metaLinks = "";
      for (const [label, url] of Object.entries(p.links)) {
        metaLinks += `<a href="${url}" target="_blank">[${label.toLowerCase()}]</a>`;
      }
      if (p.github) {
        metaLinks += `<a href="${p.github}" target="_blank">[github]</a>`;
      }
      const badge = p.oral ? `<span class="chaos-paper-badge">Oral</span>` : "";
      card.innerHTML = `
        <div class="chaos-paper-title">${p.fullTitle}${badge}</div>
        <div class="chaos-paper-venue">${p.venue}</div>
        <div class="chaos-paper-meta">${metaLinks}</div>
      `;
      list.appendChild(card);
    }
  }
  renderChaosPapers();

  /* ==========================================================
     8. CHAOS: LIFE RANDOM WALK SVG
     ========================================================== */

  function buildLifePath() {
    const container = document.getElementById("life-svg-container");
    const accent = _accent;
    const W = 760, H = 320;
    const padL = 50, padR = 40, padT = 40, padB = 50;

    const events = [
      { year: 2020, label: "First Pub", progress: 0.10 },
      { year: 2021, label: "B.E. @ ZJUT", progress: 0.26 },
      { year: 2022, label: "Multiple Papers", progress: 0.38 },
      { year: 2024, label: "M.E. @ ICT-CAS", progress: 0.46 },
      { year: 2025, label: "NUS PhD Enroll", progress: 0.55 },
      { year: 2025.8, label: "CVPR Oral + NeurIPS + Cell Patterns", progress: 0.86, labelDx: -24, labelDy: 12, labelAnchor: "end" },
      { year: 2026.3, label: "ICLR+CVPR+ACL+ICML", progress: 0.91, labelDx: -12, labelDy: -16, labelAnchor: "end" },
      { year: 2026.5, label: "PhD Candidate", progress: 0.95, labelDx: 14, labelDy: -14, labelAnchor: "start" }
    ];

    const yearMin = 2018, yearMax = 2028;
    const xScale = (yr) => padL + ((yr - yearMin) / (yearMax - yearMin)) * (W - padL - padR);
    const yScale = (p) => padT + (1 - p) * (H - padT - padB);

    let pathPoints = [];
    const firstX = xScale(events[0].year);
    const firstY = yScale(events[0].progress);
    /* Upward lead-in: start near zero progress at left edge, rise smoothly to first event */
    const leadStartY = yScale(0);
    const leadSteps = 18;
    for (let s = 0; s < leadSteps; s++) {
      const t = s / leadSteps;
      const ease = Math.pow(t, 1.4);
      const lx = padL + (firstX - padL) * t;
      const ly = leadStartY + (firstY - leadStartY) * ease + (Math.random() - 0.5) * 6;
      pathPoints.push({ x: lx, y: ly });
    }
    pathPoints.push({ x: firstX, y: firstY });

    for (let i = 1; i < events.length; i++) {
      const ev = events[i];
      const x = xScale(ev.year);
      const y = yScale(ev.progress);
      const prev = events[i - 1];
      const px = xScale(prev.year);
      const py = yScale(prev.progress);
      const steps = 20 + Math.floor(Math.random() * 10);
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const baseX = px + (x - px) * t;
        const baseY = py + (y - py) * t;
        const noise = (Math.random() - 0.5) * 28 * Math.sin(t * Math.PI);
        pathPoints.push({ x: baseX + (Math.random() - 0.5) * 4, y: baseY + noise });
      }
    }

    const lastEv = events[events.length - 1];
    let cx = xScale(lastEv.year);
    let cy = yScale(lastEv.progress);
    const futurePoints = [];
    for (let s = 0; s < 25; s++) {
      cx += (xScale(yearMax) - xScale(lastEv.year)) / 25;
      cy += (Math.random() - 0.5) * 12;
      futurePoints.push({ x: cx, y: cy });
    }

    let pathD = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      pathD += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
    }

    let futureD = `M ${pathPoints[pathPoints.length - 1].x} ${pathPoints[pathPoints.length - 1].y}`;
    for (const fp of futurePoints) {
      futureD += ` L ${fp.x} ${fp.y}`;
    }

    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<defs><linearGradient id="fade-future" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${accent}" stop-opacity="0.6"/><stop offset="100%" stop-color="${accent}" stop-opacity="0"/></linearGradient></defs>`;
    svg += `<line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" stroke="#333" stroke-width="1"/>`;
    for (let yr = 2018; yr <= 2026; yr += 2) {
      const x = xScale(yr);
      svg += `<line x1="${x}" y1="${H - padB}" x2="${x}" y2="${H - padB + 5}" stroke="#444" stroke-width="1"/>`;
      svg += `<text x="${x}" y="${H - padB + 20}" fill="#666" font-family="'JetBrains Mono',monospace" font-size="10" text-anchor="middle">${yr}</text>`;
    }
    svg += `<text x="12" y="${padT + (H - padT - padB) / 2}" fill="#444" font-family="'JetBrains Mono',monospace" font-size="10" text-anchor="middle" transform="rotate(-90 12 ${padT + (H - padT - padB) / 2})">progress(?)</text>`;
    svg += `<path d="${pathD}" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>`;
    svg += `<path d="${futureD}" fill="none" stroke="url(#fade-future)" stroke-width="2" stroke-dasharray="6 4" stroke-linecap="round"/>`;
    const lastFuture = futurePoints[futurePoints.length - 1];
    svg += `<text x="${lastFuture.x + 4}" y="${lastFuture.y}" fill="#555" font-family="'JetBrains Mono',monospace" font-size="12" font-style="italic">???</text>`;

    for (const ev of events) {
      const x = xScale(ev.year);
      const y = yScale(ev.progress);
      svg += `<circle cx="${x}" cy="${y}" r="4" fill="${accent}" opacity="0.9"/>`;
      svg += `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${accent}" stroke-width="1" opacity="0.3"/>`;
      const idx = events.indexOf(ev);
      const above = idx % 2 === 0;
      const labelX = x + (ev.labelDx || 0);
      const labelY = y + (ev.labelDy ?? (above ? -14 : 20));
      const labelAnchor = ev.labelAnchor || "middle";
      svg += `<text x="${labelX}" y="${labelY}" fill="#ccc" font-family="'JetBrains Mono',monospace" font-size="10" text-anchor="${labelAnchor}">${ev.label}</text>`;
    }

    svg += `</svg>`;
    container.innerHTML = svg;
  }
  buildLifePath();

  /* ==========================================================
     9. CHAOS: RANDOM QUOTE
     ========================================================== */

  const quotes = [
    { text: "When fortune smiles, heaven and earth conspire to help; when luck departs, even heroes lose their freedom.", author: "Luo Yin" },
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

  /* ==========================================================
     10. ORDER MODE: FULL LANCEHUB INTEGRATION
     ========================================================== */

  let orderInitialized = false;

  function initOrderMode() {
    // Rebuild dynamic content each time we enter order mode
    renderLanceHubCards();
    initLanceHubContribGraph();
    initLanceHubTimeline();

    if (!orderInitialized) {
      // One-time event binding
      initLanceHubTabs();
      initLanceHubSearch();
      initLanceHubDropdown();
      initLanceHubLogoEasterEgg();
      initLanceHubKonamiCode();
      orderInitialized = true;
    }
  }

  /* ---- Render LanceHub paper cards ---- */
  const TAG_ACRONYMS = new Map([
    ["ai", "AI"],
    ["aiot", "AIoT"],
    ["bci", "BCI"],
    ["iot", "IoT"],
    ["llm", "LLM"],
    ["mllm", "MLLM"],
    ["nlp", "NLP"],
    ["rlvr", "RLVR"]
  ]);

  function formatTagLabel(tag) {
    return String(tag).split(/([-\s]+)/).map(part => {
      if (/^[-\s]+$/.test(part)) return part;
      const lower = part.toLowerCase();
      if (TAG_ACRONYMS.has(lower)) return TAG_ACRONYMS.get(lower);
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join("");
  }

  function renderLanceHubPaperCard(p) {
    const linkEntries = Object.entries(p.links);
    const metaLinks = linkEntries.map(([k, v]) => `<a href="${v}" target="_blank" class="lh-meta-link">${k}</a>`).join(" ");
    const ghLink = p.github ? `<a href="${p.github}" target="_blank" class="lh-meta-link">&#128187; Code</a>` : "";
    const oralBadge = p.oral ? '<span class="lh-badge-oral">Oral</span>' : "";
    const icon = paperIcons[p.title] || "&#128196;";
    // Default link: arXiv > Homepage > AAAI > IEEE > Springer > first link > #
    const defaultLink = p.links.arXiv || p.links.Homepage || p.links.AAAI || p.links.IEEE || p.links.Springer || (linkEntries.length ? linkEntries[0][1] : "#");

    return `
      <div class="lh-paper-card" data-searchable="${(p.fullTitle + " " + p.title + " " + p.desc + " " + p.venue + " " + p.tags.join(" ") + " " + p.year).toLowerCase()}">
        <div class="lh-paper-card-header">
          <span class="lh-paper-icon">${icon}</span>
          <a href="${defaultLink}" target="_blank" class="lh-paper-title">${p.title}</a>
        </div>
        <div class="lh-paper-desc">${p.desc}</div>
        <div class="lh-paper-tags">${p.tags.map(t => `<span class="lh-paper-tag">${formatTagLabel(t)}</span>`).join("")}</div>
        <div class="lh-paper-meta-row">
          <span><span class="lh-venue-dot" style="background:${p.venueColor}"></span>${p.venue}</span>
          ${oralBadge}
          ${metaLinks}
          ${ghLink}
        </div>
      </div>`;
  }

  /* ---- Standalone repos (Code tab) ---- */
  const repos = [
    { name: "Agent-as-a-Router", desc: "Agentic model routing for coding tasks with ACRouter and CodeRouterBench.", url: "https://github.com/LanceZPF/agent-as-a-router", tags: ["agent", "model routing", "coding"], stars: "500+", forks: "10+" },
    { name: "EvalHall", desc: "Evaluation framework for hallucination detection in multimodal models.", url: "https://github.com/LanceZPF/EvalHall", tags: ["evaluation", "hallucination", "multimodal"], stars: "1+", forks: "0+" },
    { name: "MDK12", desc: "A comprehensive benchmark for evaluating multimodal document understanding across K-12 educational levels.", url: "https://github.com/LanceZPF/MDK12", tags: ["benchmark", "multimodal", "education"], stars: "13+", forks: "0+" },
    { name: "OpenING", desc: "Benchmark for open-ended interleaved image-text generation evaluation.", url: "https://github.com/LanceZPF/OpenING", tags: ["benchmark", "multimodal", "interleaved generation"], stars: "40+", forks: "0+" },
    { name: "LoongX", desc: "Neural-driven image editing via multimodal neurophysiological signals.", url: "https://github.com/LanceZPF/loongx", tags: ["BCI", "diffusion", "image editing"], stars: "67+", forks: "8+" },
    { name: "FoodSky", desc: "A food-oriented LLM that passes the chef and dietetic examination.", url: "https://github.com/LanceZPF/FoodSky", tags: ["food computing", "LLM", "domain research"], stars: "28+", forks: "1+" },
    { name: "KEFS", desc: "Knowledge-Enhanced Feature Synthesizer for zero-shot food detection.", url: "https://github.com/LanceZPF/KEFS", tags: ["multimodal", "food computing", "object detection"], stars: "2+", forks: "1+" },
    { name: "SeeDS", desc: "Semantic Separable Diffusion Synthesizer for zero-shot food detection.", url: "https://github.com/LanceZPF/SeeDS", tags: ["diffusion", "food computing", "object detection"], stars: "12+", forks: "3+" },
    { name: "NNED_MMGraph", desc: "Multimodal graph convolution for named entity disambiguation.", url: "https://github.com/LanceZPF/NNED_MMGraph", tags: ["multimodal", "graph convolution", "self-supervised"], stars: "4+", forks: "0+" },
    { name: "CMRDF", desc: "Cross-modal retrieval system for real-time food alerting.", url: "https://github.com/LanceZPF/CMRDF", tags: ["multimodal", "AIoT", "food computing"], stars: "1+", forks: "0+" }
  ];

  function renderRepoCard(r) {
    return `
      <div class="lh-paper-card">
        <div class="lh-paper-card-header">
          <span class="lh-paper-icon">&#128187;</span>
          <a href="${r.url}" target="_blank" class="lh-paper-title">${r.name}</a>
        </div>
        <div class="lh-paper-desc">${r.desc}</div>
        <div class="lh-paper-tags">${r.tags.map(t => `<span class="lh-paper-tag">${formatTagLabel(t)}</span>`).join("")}</div>
        <div class="lh-paper-meta-row">
          <span title="Stars">&#9733; ${r.stars}</span>
          <span title="Forks">&#127860; ${r.forks}</span>
          <a href="${r.url}" target="_blank" class="lh-meta-link">&#128187; GitHub</a>
        </div>
      </div>`;
  }

  function renderLanceHubCards() {
    const grid = document.getElementById("paperGrid");
    const gridPub = document.getElementById("paperGridPub");
    const codeGrid = document.getElementById("codeGrid");
    const { pinned, rest } = partitionPinnedPapers(papers);
    const representativePapers = [...pinned, ...rest];
    const orderPinnedPapers = representativePapers.filter(p => p.title !== "ISDA");

    if (grid) grid.innerHTML = orderPinnedPapers.map(renderLanceHubPaperCard).join("");
    if (gridPub) gridPub.innerHTML = representativePapers.map(renderLanceHubPaperCard).join("");
    if (codeGrid) codeGrid.innerHTML = repos.map(renderRepoCard).join("");
  }

  /* ---- LanceHub Tabs ---- */
  function initLanceHubTabs() {
    OLA(".lh-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        OLA(".lh-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const tab = btn.dataset.tab;
        OLA(".lh-tab-section").forEach(sec => sec.classList.remove("active"));

        if (tab === "all") {
          const secAll = document.getElementById("sec-all");
          if (secAll) secAll.classList.add("active");
        } else {
          const sec = document.getElementById("sec-" + tab);
          if (sec) sec.classList.add("active");
        }
      });
    });
  }

  /* ---- LanceHub Search ---- */
  function initLanceHubSearch() {
    const input = document.getElementById("searchInput");
    const countEl = document.getElementById("searchCount");
    if (!input) return;

    input.addEventListener("input", function () {
      const q = this.value.trim().toLowerCase();

      // Easter egg: search "hub"
      const premiumBanner = document.getElementById("premiumBanner");
      if (q === "hub") {
        premiumBanner.classList.add("visible");
      } else {
        premiumBanner.classList.remove("visible");
      }

      // Easter egg: search "food"
      if (q === "food") {
        triggerFoodRain();
      }

      // Easter egg: search "zh" or "中文"
      if (q === "zh" || q === "\u4e2d\u6587") {
        window.location.href = "zh.html";
        return;
      }

      // Filter cards
      const allCards = OLA("#paperGrid .lh-paper-card");
      let visible = 0;

      allCards.forEach(card => {
        const text = card.dataset.searchable;
        if (!q || text.includes(q)) {
          card.style.display = "";
          visible++;
        } else {
          card.style.display = "none";
        }
      });

      // Also filter in publications tab
      OLA("#paperGridPub .lh-paper-card").forEach(card => {
        const text = card.dataset.searchable;
        card.style.display = (!q || text.includes(q)) ? "" : "none";
      });

      // Show count
      if (q) {
        countEl.textContent = visible + " result" + (visible !== 1 ? "s" : "");
        countEl.classList.add("visible");
      } else {
        countEl.classList.remove("visible");
      }

      // No results
      const noRes = document.getElementById("noResults");
      if (q && visible === 0) {
        noRes.classList.add("visible");
      } else {
        noRes.classList.remove("visible");
      }
    });
  }

  /* ---- LanceHub Avatar Dropdown ---- */
  function initLanceHubDropdown() {
    const btn = document.getElementById("avatarBtn");
    const menu = document.getElementById("dropdownMenu");
    if (!btn || !menu) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      menu.classList.remove("open");
    });

    // Theme toggle button
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        document.getElementById("order-layer").classList.toggle("light-theme");
        // Update body bg for light theme
        if (document.getElementById("order-layer").classList.contains("light-theme")) {
          document.body.style.background = "#ffffff";
        } else {
          document.body.style.background = "#010409";
        }
      });
    }

    // Sign out button
    const signOutBtn = document.getElementById("signOutBtn");
    if (signOutBtn) {
      signOutBtn.addEventListener("click", () => {
        alert("Thanks for staying! \u{1F60A}");
      });
    }
  }

  /* ---- LanceHub Contribution Graph (SVG, green) ---- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function initLanceHubContribGraph() {
    const activityDates = {};
    activities.forEach(a => {
      const d = a.date;
      activityDates[d] = (activityDates[d] || 0) + 2;
      for (let offset = -3; offset <= 3; offset++) {
        const nd = new Date(d);
        nd.setDate(nd.getDate() + offset);
        const key = nd.toISOString().slice(0, 10);
        if (!activityDates[key]) activityDates[key] = 1;
      }
    });

    // Sparse random activity for realism
    const rng = mulberry32(42);
    // Sparse random fill for last 12 months
    const now = new Date();
    for (let mo = 0; mo < 12; mo++) {
      const d = new Date(now.getFullYear(), now.getMonth() - mo, 1);
      const y = d.getFullYear();
      const m = d.getMonth();
      for (let i = 0; i < 3; i++) {
        const day = Math.floor(rng() * 28) + 1;
        const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (!activityDates[key] && rng() > 0.6) {
          activityDates[key] = 1;
        }
      }
    }

    const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

    function getColor(level) {
      if (level <= 0) return colors[0];
      if (level === 1) return colors[1];
      if (level === 2) return colors[2];
      if (level === 3) return colors[3];
      return colors[4];
    }

    // Build SVG for last 12 months
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate() + 1);
    const cellSize = 11;
    const cellGap = 2;
    const totalSize = cellSize + cellGap;

    const oneDay = 86400000;
    const dayOfWeek = startDate.getDay();
    const adjustedStart = new Date(startDate.getTime() - dayOfWeek * oneDay);

    const totalDays = Math.ceil((endDate - adjustedStart) / oneDay);
    const totalWeeks = Math.ceil(totalDays / 7);

    const svgWidth = totalWeeks * totalSize + 40;
    const svgHeight = 7 * totalSize + 30;

    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" style="display:block;">`;

    const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
    dayLabels.forEach((label, i) => {
      if (label) {
        svg += `<text x="0" y="${i * totalSize + 22}" fill="#8b949e" font-size="9" font-family="Inter, sans-serif">${label}</text>`;
      }
    });

    let lastMonth = -1;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let w = 0; w < totalWeeks; w++) {
      const weekStart = new Date(adjustedStart.getTime() + w * 7 * oneDay);
      const m = weekStart.getMonth();
      if (m !== lastMonth) {
        lastMonth = m;
        svg += `<text x="${w * totalSize + 34}" y="8" fill="#8b949e" font-size="9" font-family="Inter, sans-serif">${monthNames[m]}</text>`;
      }
    }

    let totalContribs = 0;

    for (let w = 0; w < totalWeeks; w++) {
      for (let d = 0; d < 7; d++) {
        const date = new Date(adjustedStart.getTime() + (w * 7 + d) * oneDay);
        if (date > endDate || date < startDate) continue;

        const key = date.toISOString().slice(0, 10);
        const level = activityDates[key] || 0;
        if (level > 0) totalContribs++;

        const x = w * totalSize + 30;
        const y = d * totalSize + 14;
        const color = getColor(level);

        svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" ry="2" fill="${color}" data-date="${key}" data-level="${level}" class="lh-contrib-cell"/>`;
      }
    }

    svg += "</svg>";

    const graphEl = document.getElementById("contribGraph");
    if (graphEl) graphEl.innerHTML = svg;
    const yearLabel = document.getElementById("contribYearLabel");
    if (yearLabel) yearLabel.textContent = totalContribs + " contributions in the last year";
    const summary = document.getElementById("contribSummary");
    if (summary) summary.innerHTML = "<strong>" + totalContribs + "</strong> contributions across research activities";

    // Tooltip
    const tooltip = document.getElementById("contribTooltip");
    OLA(".lh-contrib-cell").forEach(cell => {
      cell.addEventListener("mouseenter", function (e) {
        const date = this.dataset.date;
        const level = parseInt(this.dataset.level);
        const text = level > 0
          ? level + " contribution" + (level > 1 ? "s" : "") + " on " + date
          : "No contributions on " + date;
        tooltip.textContent = text;
        tooltip.style.display = "block";
        const rect = this.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + "px";
        tooltip.style.top = (rect.top - 32) + "px";
      });
      cell.addEventListener("mouseleave", function () {
        tooltip.style.display = "none";
      });
      cell.style.cursor = "pointer";
    });
  }

  /* ---- LanceHub Activity Timeline ---- */
  function initLanceHubTimeline() {
    const container = document.getElementById("timeline");
    if (!container) return;

    const dotClasses = {
      published: "lh-dot-published",
      review: "lh-dot-review",
      award: "lh-dot-award"
    };

    container.innerHTML = activities.map(a => {
      const d = new Date(a.date);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const dateStr = months[d.getMonth()] + " " + d.getFullYear();
      const noteLine = a.note ? `<div class="lh-timeline-sub">${a.note}</div>` : "";

      return `
        <div class="lh-timeline-item">
          <div class="lh-timeline-dot ${dotClasses[a.type] || "lh-dot-published"}"></div>
          <div class="lh-timeline-content">
            <span class="lh-timeline-date">${dateStr}</span>
            <div class="lh-timeline-title">${a.text}</div>
            ${noteLine}
          </div>
        </div>`;
    }).join("");
  }

  /* ---- LanceHub Easter Eggs ---- */

  // Logo click x5 -> loading overlay
  function initLanceHubLogoEasterEgg() {
    let clickCount = 0;
    let clickTimer = null;
    const logo = document.getElementById("navLogo");
    if (!logo) return;

    logo.addEventListener("click", (e) => {
      e.preventDefault();
      clickCount++;

      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 2000);

      if (clickCount >= 5) {
        clickCount = 0;
        const overlay = document.getElementById("loadingOverlay");
        overlay.classList.add("active");
        setTimeout(() => {
          overlay.classList.remove("active");
        }, 2000);
      }
    });
  }

  // Food emoji rain
  function triggerFoodRain() {
    const container = document.getElementById("foodRain");
    if (!container) return;
    const emojis = ["\u{1F354}", "\u{1F355}", "\u{1F363}", "\u{1F35C}", "\u{1F369}", "\u{1F32E}", "\u{1F957}", "\u{1F370}", "\u{1F9C1}", "\u{1F35F}", "\u{1F95F}", "\u{1F371}", "\u{1F35D}", "\u{1F958}", "\u{1F35B}"];

    for (let i = 0; i < 40; i++) {
      const el = document.createElement("div");
      el.className = "lh-food-emoji";
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDelay = Math.random() * 2 + "s";
      el.style.fontSize = (20 + Math.random() * 24) + "px";
      container.appendChild(el);
    }

    setTimeout(() => {
      container.innerHTML = "";
    }, 5000);
  }

  // Konami code -> theme toggle (scoped to #order-layer)
  function initLanceHubKonamiCode() {
    const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
    let idx = 0;

    document.addEventListener("keydown", (e) => {
      if (currentMode !== "order") {
        idx = 0;
        return;
      }
      if (e.code === code[idx]) {
        idx++;
        if (idx === code.length) {
          idx = 0;
          const orderLayer = document.getElementById("order-layer");
          orderLayer.classList.toggle("light-theme");
          if (orderLayer.classList.contains("light-theme")) {
            document.body.style.background = "#ffffff";
          } else {
            document.body.style.background = "#010409";
          }
        }
      } else {
        idx = 0;
      }
    });
  }

  /* ==========================================================
     11. CHAOS MODE: "zh" KEYBOARD EASTER EGG
     ========================================================== */

  /* Pre-render Order mode content so it's ready before first switch (prevents black screen) */
  initOrderMode();

  /* ==========================================================
     SCROLL: shrink Chaos dice to top when scrolled past hero
     ========================================================== */
  const SCROLL_THRESHOLD = 160;
  function onChaosScroll() {
    if (currentMode !== "chaos") return;
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    document.body.classList.toggle("chaos-scrolled", scrolled);
  }
  window.addEventListener("scroll", onChaosScroll, { passive: true });
  onChaosScroll();

  let zhBuffer = "";
  let zhTimer = null;

  document.addEventListener("keydown", (e) => {
    if (currentMode !== "chaos") return;
    // Don't capture if typing in an input
    if (document.activeElement && document.activeElement.tagName === "INPUT") return;
    // Only track simple letter keys
    if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
      zhBuffer += e.key.toLowerCase();
      clearTimeout(zhTimer);
      zhTimer = setTimeout(() => { zhBuffer = ""; }, 1500);

      if (zhBuffer.includes("zh")) {
        zhBuffer = "";
        window.location.href = "zh.html";
      }
    }
  });

})();
