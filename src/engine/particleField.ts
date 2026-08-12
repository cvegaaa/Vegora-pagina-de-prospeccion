// Canvas2D particle system — "del caos al sistema".
// `order` (0..1) is the single external control: 0 = disperse/gray/hero,
// 1 = structured network revealing the Vegora V/result. The caller (React
// wrapper) tweens `order` with GSAP; this class just renders whatever value
// it's given, so it never owns timing/easing itself.

interface Vec2 {
  x: number;
  y: number;
}

interface Particle {
  wx: number; // wander position, normalized [-1, 1]
  wy: number;
  homeX: number; // structured/home position, normalized [-1, 1]
  homeY: number;
  angle: number;
  angleSpeed: number;
  radius: number;
  seed: number;
  settleDelay: number; // per-particle stagger so the settle isn't robotic
  isCore: boolean; // part of the V-shape reveal
  isAmbient: boolean; // never fully organizes — the "living noise" subset
  strand: 0 | 1 | -1; // 0 = left stroke (white/gray), 1 = right stroke (blue→turquoise)
  strandT: number;
  colorBias: number;
  px: number; // last rendered pixel position, kept for connection lines
  py: number;
}

interface Label {
  word: string;
  particleIndex: number;
  alpha: number;
  target: number;
  nextChangeAt: number;
}

const LABEL_WORDS = ['sistemas', 'datos', 'procesos', 'decisiones', 'conexión', 'estructura'];

const GRAY = { r: 148, g: 163, b: 184 };
const AZUL = { r: 37, g: 99, b: 235 };
const TURQUESA = { r: 20, g: 184, b: 166 };
const BLANCO = { r: 248, g: 250, b: 252 };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function mixColor(c1: typeof GRAY, c2: typeof GRAY, t: number) {
  const k = clamp01(t);
  return {
    r: Math.round(lerp(c1.r, c2.r, k)),
    g: Math.round(lerp(c1.g, c2.g, k)),
    b: Math.round(lerp(c1.b, c2.b, k)),
  };
}

function buildVStrokes(count: number): Array<{ x: number; y: number; strand: 0 | 1; t: number }> {
  // Approximates the isotipo: a long left stroke (white/gray) and a shorter
  // right stroke (blue→turquoise) that deliberately stops short — "sin
  // cerrar la V", echoing the brand's transformación-incompleta concept.
  const left = { a: { x: -0.3, y: -0.62 }, b: { x: -0.02, y: 0.62 } };
  const right = { a: { x: 0.32, y: -0.62 }, b: { x: 0.06, y: 0.06 } };
  const leftCount = Math.round(count * 0.55);
  const rightCount = count - leftCount;
  const points: Array<{ x: number; y: number; strand: 0 | 1; t: number }> = [];

  const sample = (seg: { a: Vec2; b: Vec2 }, n: number, strand: 0 | 1) => {
    const dx = seg.b.x - seg.a.x;
    const dy = seg.b.y - seg.a.y;
    const len = Math.hypot(dx, dy);
    const nx = -dy / len;
    const ny = dx / len;
    for (let i = 0; i < n; i++) {
      const t = Math.random();
      const width = 0.05 + 0.05 * Math.sin(t * Math.PI); // tapered edges
      const off = (Math.random() - 0.5) * width;
      points.push({
        x: seg.a.x + dx * t + nx * off,
        y: seg.a.y + dy * t + ny * off,
        strand,
        t,
      });
    }
  };

  sample(left, leftCount, 0);
  sample(right, rightCount, 1);
  return points;
}

function scatterNetwork(count: number): Vec2[] {
  const pts: Vec2[] = [];
  let attempts = 0;
  const minDist = Math.max(0.09, 1.3 / Math.sqrt(count));
  while (pts.length < count && attempts < count * 40) {
    attempts++;
    const c = { x: (Math.random() * 2 - 1) * 0.92, y: (Math.random() * 2 - 1) * 0.92 };
    if (pts.every((p) => Math.hypot(p.x - c.x, p.y - c.y) > minDist)) {
      pts.push(c);
    }
  }
  while (pts.length < count) {
    pts.push({ x: (Math.random() * 2 - 1) * 0.92, y: (Math.random() * 2 - 1) * 0.92 });
  }
  return pts;
}

export interface ParticleFieldOptions {
  reducedMotion?: boolean;
}

export class ParticleField {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private labels: Label[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private order = 0;
  private displayOrder = 0;
  private raf = 0;
  private frame = 0;
  private lastTime = 0;
  private reducedMotion: boolean;
  private isMobile: boolean;
  private neighborCache: number[][] = [];

  constructor(canvas: HTMLCanvasElement, opts: ParticleFieldOptions = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D no soportado');
    this.ctx = ctx;
    this.reducedMotion = !!opts.reducedMotion;
    this.isMobile =
      typeof window !== 'undefined' &&
      (window.matchMedia('(max-width: 768px)').matches ||
        (navigator.hardwareConcurrency ?? 8) <= 4);
    this.buildParticles();
  }

  private buildParticles() {
    const total = this.isMobile ? 60 : 150;
    const ambientCount = Math.round(total * 0.18);
    const formationCount = total - ambientCount;
    const coreCount = Math.round(formationCount * 0.4);
    const networkCount = formationCount - coreCount;

    const vPoints = buildVStrokes(coreCount);
    const networkPoints = scatterNetwork(networkCount);

    const particles: Particle[] = [];

    vPoints.forEach((p) => {
      particles.push(this.makeParticle({ homeX: p.x, homeY: p.y, isCore: true, isAmbient: false, strand: p.strand, strandT: p.t }));
    });

    networkPoints.forEach((p) => {
      particles.push(this.makeParticle({ homeX: p.x, homeY: p.y, isCore: false, isAmbient: false, strand: -1, strandT: 0 }));
    });

    for (let i = 0; i < ambientCount; i++) {
      const wx = (Math.random() * 2 - 1) * 0.95;
      const wy = (Math.random() * 2 - 1) * 0.95;
      particles.push(this.makeParticle({ homeX: wx, homeY: wy, isCore: false, isAmbient: true, strand: -1, strandT: 0 }));
    }

    this.particles = particles;
    this.labels = [];
  }

  private makeParticle(base: {
    homeX: number;
    homeY: number;
    isCore: boolean;
    isAmbient: boolean;
    strand: 0 | 1 | -1;
    strandT: number;
  }): Particle {
    return {
      wx: (Math.random() * 2 - 1) * 0.95,
      wy: (Math.random() * 2 - 1) * 0.95,
      homeX: base.homeX,
      homeY: base.homeY,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.006,
      radius: base.isCore ? 1.6 + Math.random() * 1.2 : 1.1 + Math.random() * 1.3,
      seed: Math.random() * 1000,
      settleDelay: Math.random() * 0.35,
      isCore: base.isCore,
      isAmbient: base.isAmbient,
      strand: base.strand,
      strandT: base.strandT,
      colorBias: Math.random(),
      px: 0,
      py: 0,
    };
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.5 : 2);
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  setOrder(value: number) {
    this.order = clamp01(value);
    if (this.reducedMotion) this.displayOrder = this.order;
  }

  start() {
    if (this.raf) return;
    this.lastTime = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(48, t - this.lastTime) / 16.6667;
      this.lastTime = t;
      this.frame++;
      this.update(dt);
      this.render();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  destroy() {
    this.stop();
  }

  private update(dt: number) {
    if (!this.reducedMotion) {
      this.displayOrder = lerp(this.displayOrder, this.order, 0.06 * dt);
    }
    const order = this.displayOrder;
    const scale = Math.min(this.width, this.height) * 0.44;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const t = this.frame * 0.016;

    for (const p of this.particles) {
      p.angle += p.angleSpeed * dt * (this.reducedMotion ? 0.15 : 1);
      const driftAmp = this.reducedMotion ? 0.002 : 0.01;
      p.wx += Math.cos(p.angle + p.seed) * driftAmp * dt;
      p.wy += Math.sin(p.angle * 1.3 + p.seed) * driftAmp * dt;
      p.wx = Math.max(-1, Math.min(1, p.wx));
      p.wy = Math.max(-1, Math.min(1, p.wy));

      const pull = p.isAmbient ? order * 0.12 : clamp01((order - p.settleDelay * 0.5) / (1 - p.settleDelay * 0.5));
      const eased = pull * pull * (3 - 2 * pull);

      const breathe = this.reducedMotion
        ? 0
        : Math.sin(t * 0.9 + p.seed) * 0.012 * (1 - eased * 0.7);

      const nx = lerp(p.wx, p.homeX, eased) + breathe;
      const ny = lerp(p.wy, p.homeY, eased) + breathe * 0.6;

      p.px = cx + nx * scale;
      p.py = cy + ny * scale;
    }

    if (!this.isMobile && !this.reducedMotion && this.frame % 6 === 0) {
      this.updateNeighborCache();
    } else if (this.neighborCache.length === 0) {
      this.updateNeighborCache();
    }

    this.updateLabels(order);
  }

  private updateNeighborCache() {
    const n = this.particles.length;
    const maxDist = Math.min(this.width, this.height) * lerp(0.09, 0.22, this.displayOrder);
    const cache: number[][] = new Array(n);
    for (let i = 0; i < n; i++) {
      const pi = this.particles[i];
      if (pi.isAmbient) {
        cache[i] = [];
        continue;
      }
      const dists: Array<[number, number]> = [];
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const pj = this.particles[j];
        if (pj.isAmbient) continue;
        const d = Math.hypot(pi.px - pj.px, pi.py - pj.py);
        if (d < maxDist) dists.push([j, d]);
      }
      dists.sort((a, b) => a[1] - b[1]);
      cache[i] = dists.slice(0, 4).map(([idx]) => idx);
    }
    this.neighborCache = cache;
  }

  private updateLabels(order: number) {
    if (this.isMobile || this.reducedMotion || order < 0.35) {
      this.labels = [];
      return;
    }
    const now = this.frame;
    for (const l of this.labels) {
      l.alpha = lerp(l.alpha, l.target, 0.05);
      if (now >= l.nextChangeAt) {
        if (l.target > 0) {
          l.target = 0;
          l.nextChangeAt = now + 90;
        } else {
          this.labels = this.labels.filter((x) => x !== l);
        }
      }
    }
    if (this.labels.length < 2 && Math.random() < 0.01) {
      const idx = Math.floor(Math.random() * this.particles.length);
      const word = LABEL_WORDS[Math.floor(Math.random() * LABEL_WORDS.length)];
      this.labels.push({
        word,
        particleIndex: idx,
        alpha: 0,
        target: 0.3,
        nextChangeAt: now + 150,
      });
    }
  }

  private drawGrid() {
    const { ctx, width, height } = this;
    const step = Math.max(48, Math.min(width, height) / 14);
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  private particleColor(p: Particle, order: number) {
    if (p.isAmbient) {
      return mixColor(GRAY, AZUL, order * 0.3);
    }
    if (p.isCore && p.strand === 0) {
      return mixColor(GRAY, BLANCO, order);
    }
    if (p.isCore && p.strand === 1) {
      const strandColor = mixColor(AZUL, TURQUESA, p.strandT);
      return mixColor(GRAY, strandColor, order);
    }
    const target = mixColor(AZUL, TURQUESA, p.colorBias);
    return mixColor(GRAY, target, order);
  }

  private render() {
    const { ctx, width, height } = this;
    const order = this.displayOrder;
    ctx.clearRect(0, 0, width, height);
    this.drawGrid();

    ctx.lineWidth = 1;
    for (let i = 0; i < this.particles.length; i++) {
      const neighbors = this.neighborCache[i];
      if (!neighbors) continue;
      const pi = this.particles[i];
      for (const j of neighbors) {
        if (j < i) continue;
        const pj = this.particles[j];
        const d = Math.hypot(pi.px - pj.px, pi.py - pj.py);
        const maxDist = Math.min(width, height) * lerp(0.09, 0.22, order);
        const proximity = 1 - d / maxDist;
        if (proximity <= 0) continue;
        const alpha = proximity * lerp(0.04, 0.24, order);
        const c1 = this.particleColor(pi, order);
        const c2 = this.particleColor(pj, order);
        const c = mixColor(c1, c2, 0.5);
        ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(pi.px, pi.py);
        ctx.lineTo(pj.px, pj.py);
        ctx.stroke();
      }
    }

    for (const p of this.particles) {
      const c = this.particleColor(p, order);
      const alpha = p.isAmbient ? 0.35 + order * 0.15 : 0.45 + order * 0.4;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha.toFixed(3)})`;
      ctx.arc(p.px, p.py, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.labels.length) {
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      for (const l of this.labels) {
        if (l.alpha <= 0.01) continue;
        const p = this.particles[l.particleIndex];
        if (!p) continue;
        ctx.fillStyle = `rgba(248, 250, 252, ${l.alpha.toFixed(3)})`;
        ctx.fillText(l.word, p.px, p.py - 14);
      }
    }
  }
}
