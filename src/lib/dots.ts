/** Shapes and illustrations that the dot layers (Portrait.tsx, DotStage.tsx) morph between. */

export type Palette = { fg: string; accent: string };
type Ctx = CanvasRenderingContext2D;

const W = 960;
const H = 600;
const TAU = Math.PI * 2;
const rnd = (a = -1, b = 1) => a + Math.random() * (b - a);

// ---------- 3D forms (unit-ish space, centred on 0) ----------

export const FORMS = {
  torus: { tilt: 1.05, spin: 0.18, alpha: 0.32, slotScale: 1.2 },
  wave: { tilt: 0.95, spin: 0.06, alpha: 0.45, slotScale: 1.15 },
  cloud: { tilt: 0, spin: 0.03, alpha: 0.3, slotScale: 1 },
  vinyl: { tilt: 0.95, spin: 0.55, alpha: 0.45, slotScale: 1.2 },
} as const;
export type FormName = keyof typeof FORMS;

export function form(name: FormName, n: number) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let p: [number, number, number];
    if (name === 'torus') {
      const a = Math.random() * TAU;
      const b = Math.random() * TAU;
      const r = 0.33 + 0.11 * Math.cos(b);
      p = [r * Math.cos(a), 0.11 * Math.sin(b), r * Math.sin(a)];
    } else if (name === 'wave') {
      const side = Math.ceil(Math.sqrt(n));
      const x = ((i % side) / side - 0.5) * 1.1;
      const z = (Math.floor(i / side) / side - 0.5) * 1.1;
      p = [x, 0.06 * Math.sin(x * 9) + 0.06 * Math.cos(z * 7), z];
    } else if (name === 'cloud') {
      const v = [rnd(), rnd(), rnd()];
      const k = (Math.cbrt(Math.random()) * 1.2) / (Math.hypot(...v) || 1);
      p = [v[0] * k, v[1] * k, v[2] * k];
    } else {
      // vinyl: label disc plus grooves, with three gaps between tracks
      const a = Math.random() * TAU;
      let r = 0.17 + (Math.round(Math.random() * 60) / 60) * 0.28;
      if (i % 6 === 0) r = 0.035 + Math.sqrt(Math.random()) * 0.12;
      else if ([0.3, 0.36, 0.41].some((g) => Math.abs(r - g) < 0.006)) r += 0.012;
      p = [r * Math.cos(a), rnd() * 0.004, r * Math.sin(a)];
    }
    out.set(p, i * 3);
  }
  return out;
}

// ---------- flat illustrations, drawn on a 960x600 canvas then sampled into dots ----------

function line(c: Ctx, pts: [number, number][], w = 5) {
  c.lineWidth = w;
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.stroke();
}
function box(c: Ctx, x: number, y: number, w: number, h: number, r = 10, fill = false) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  if (fill) c.fill();
  else c.stroke();
}
function browser(c: Ctx, x: number, y: number, w: number, h: number) {
  box(c, x, y, w, h, 16);
  line(c, [
    [x, y + 42],
    [x + w, y + 42],
  ]);
  for (const k of [0, 1, 2]) {
    c.beginPath();
    c.arc(x + 26 + k * 24, y + 21, 6, 0, TAU);
    c.fill();
  }
}
function card(c: Ctx, x: number, y: number, w: number, h: number, color: string) {
  c.strokeStyle = c.fillStyle = color;
  box(c, x, y, w, h, 12);
  c.fillRect(x + 16, y + h - 58, w * 0.6, 12);
  c.fillRect(x + 16, y + h - 34, w * 0.34, 12);
}
function hub(c: Ctx, labels: string[], { fg, accent }: Palette) {
  const cx = W / 2;
  const cy = H / 2;
  const at: [number, number][] = [
    [160, 110],
    [800, 110],
    [125, 300],
    [835, 300],
    [160, 490],
    [800, 490],
  ];
  c.strokeStyle = accent;
  for (const p of at) line(c, [[cx, cy], p]);
  c.font = 'bold 32px sans-serif';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  labels.forEach((label, i) => {
    const [x, y] = at[i];
    c.globalCompositeOperation = 'destination-out';
    box(c, x - 92, y - 38, 184, 76, 38, true);
    c.globalCompositeOperation = 'source-over';
    c.strokeStyle = c.fillStyle = fg;
    box(c, x - 92, y - 38, 184, 76, 38);
    c.fillText(label, x, y);
  });
  c.fillStyle = accent;
  c.beginPath();
  c.arc(cx, cy, 72, 0, TAU);
  c.fill();
}
function codeLines(c: Ctx, rows: [string, string][]) {
  c.font = 'bold 34px ui-monospace, Menlo, monospace';
  c.textBaseline = 'middle';
  c.textAlign = 'left';
  rows.forEach(([text, color], i) => {
    c.fillStyle = color;
    c.fillText(text, 40, 150 + i * 76);
  });
}
function check(c: Ctx, x: number, y: number, s: number) {
  line(
    c,
    [
      [x - s * 0.45, y],
      [x - s * 0.1, y + s * 0.35],
      [x + s * 0.5, y - s * 0.35],
    ],
    s * 0.18,
  );
}

export const DRAWINGS: Record<string, (c: Ctx, p: Palette) => void> = {
  // what I do
  product(c, { fg, accent }) {
    browser(c, 90, 30, 780, 540);
    c.strokeStyle = c.fillStyle = accent;
    box(c, 120, 95, 720, 170, 12);
    c.fillRect(150, 150, 300, 22);
    c.fillRect(150, 188, 180, 22);
    for (const k of [0, 1, 2, 3]) card(c, 120 + k * 184, 290, 168, 250, fg);
  },
  refactor(c, { fg, accent }) {
    // tangled block on the left, tidy block on the right
    c.strokeStyle = fg;
    box(c, 70, 90, 330, 420, 14);
    for (let k = 0; k < 9; k++) {
      c.fillStyle = fg;
      c.fillRect(100 + (k % 3) * 30, 125 + k * 40, 120 + ((k * 53) % 140), 14);
    }
    c.strokeStyle = accent;
    line(
      c,
      [
        [430, 300],
        [520, 300],
      ],
      10,
    );
    line(
      c,
      [
        [495, 270],
        [530, 300],
        [495, 330],
      ],
      10,
    );
    c.strokeStyle = fg;
    box(c, 560, 90, 330, 420, 14);
    for (let k = 0; k < 3; k++) {
      c.fillStyle = k === 1 ? accent : fg;
      box(c, 590, 125 + k * 125, 270, 95, 10, true);
    }
  },
  coverage(c, { fg, accent }) {
    [0.5, 0.72, 0.85, 0.93, 0.98].forEach((v, k) => {
      const x = 140 + k * 140;
      const h = 380 * v;
      c.fillStyle = k === 4 ? accent : fg;
      c.globalAlpha = k === 4 ? 1 : 0.8;
      box(c, x, 500 - h, 96, h, 8, true);
    });
    c.globalAlpha = 1;
    c.strokeStyle = fg;
    line(c, [
      [100, 506],
      [860, 506],
    ]);
    c.strokeStyle = accent;
    check(c, 748, 60, 90);
  },
  // process
  call(c, { accent }) {
    c.fillStyle = accent;
    for (let k = 0; k < 44; k++) {
      const t = k / 43;
      const h = 30 + Math.abs(Math.sin(k * 0.7) * Math.sin(k * 0.19 + 1) * Math.sin(t * Math.PI)) * 430;
      box(c, 60 + k * 19.5, 300 - h / 2, 11, h, 5, true);
    }
  },
  wireframe(c) {
    browser(c, 90, 30, 780, 540);
    c.setLineDash([16, 12]);
    c.lineWidth = 4;
    c.strokeRect(120, 95, 720, 170);
    line(
      c,
      [
        [120, 95],
        [840, 265],
      ],
      3,
    );
    line(
      c,
      [
        [840, 95],
        [120, 265],
      ],
      3,
    );
    for (const k of [0, 1, 2]) c.strokeRect(120 + k * 245, 290, 230, 250);
    c.setLineDash([]);
  },
  system(c, p) {
    hub(c, ['UI', 'API', 'Auth', 'Cache', 'Queries', 'CI'], p);
  },
  code(c, { fg, accent }) {
    codeLines(c, [
      ['const { data } = useQuery({', accent],
      ['  queryKey: ["courses", id],', fg],
      ['  queryFn: () => getCourse(id),', fg],
      ['});', accent],
      ['return <Course data={data} />;', fg],
    ]);
  },
  checklist(c, { fg, accent }) {
    for (let k = 0; k < 4; k++) {
      const y = 110 + k * 120;
      c.strokeStyle = k < 3 ? accent : fg;
      box(c, 140, y - 40, 80, 80, 12);
      if (k < 3) check(c, 180, y, 56);
      c.fillStyle = fg;
      c.fillRect(260, y - 10, 300 + ((k * 97) % 260), 20);
    }
  },
  pulse(c, { accent }) {
    c.strokeStyle = accent;
    c.lineJoin = 'round';
    const beat = (x: number): [number, number][] => [
      [x, 300],
      [x + 50, 300],
      [x + 72, 250],
      [x + 96, 300],
      [x + 118, 300],
      [x + 140, 340],
      [x + 170, 110],
      [x + 204, 470],
      [x + 230, 300],
      [x + 290, 300],
    ];
    line(c, [[40, 300], ...beat(70), ...beat(360), ...beat(650).slice(0, 8)], 11);
    c.fillStyle = '#3ddc84';
    c.beginPath();
    c.arc(880, 300, 24, 0, TAU);
    c.fill();
  },
  // side projects, two frames each
  cardsDown(c, { fg }) {
    for (let k = 0; k < 5; k++) {
      c.strokeStyle = fg;
      box(c, 110 + k * 150, 170, 120, 180, 14);
      c.globalAlpha = 0.35;
      c.fillStyle = fg;
      box(c, 126 + k * 150, 186, 88, 148, 8, true);
      c.globalAlpha = 1;
    }
    c.fillStyle = fg;
    c.fillRect(110, 430, 720, 12);
  },
  cardsUp(c, { fg, accent }) {
    c.font = 'bold 72px sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    ['3', '5', '5', '8', '5'].forEach((v, k) => {
      c.strokeStyle = c.fillStyle = k === 2 ? accent : fg;
      box(c, 110 + k * 150, 170, 120, 180, 14);
      c.fillText(v, 170 + k * 150, 262);
    });
    c.fillStyle = accent;
    c.fillRect(110, 430, 520, 12);
  },
  calendar(c, { fg }) {
    c.strokeStyle = fg;
    for (let r = 0; r < 4; r++)
      for (let k = 0; k < 6; k++) box(c, 120 + k * 125, 110 + r * 105, 105, 85, 10);
  },
  booked(c, { fg, accent }) {
    for (let r = 0; r < 4; r++)
      for (let k = 0; k < 6; k++) {
        const on = (r * 6 + k) % 5 === 1;
        c.strokeStyle = c.fillStyle = on ? accent : fg;
        box(c, 120 + k * 125, 110 + r * 105, 105, 85, 10, on);
      }
  },
  catalog(c, { fg }) {
    for (let k = 0; k < 8; k++) card(c, 110 + (k % 4) * 190, 70 + Math.floor(k / 4) * 240, 170, 220, fg);
  },
  order(c, { fg, accent }) {
    c.strokeStyle = fg;
    box(c, 250, 50, 460, 500, 14);
    for (let k = 0; k < 6; k++) {
      c.fillStyle = fg;
      c.fillRect(290, 110 + k * 55, 220, 14);
      c.fillRect(600, 110 + k * 55, 70, 14);
    }
    c.fillStyle = accent;
    box(c, 290, 450, 380, 60, 10, true);
  },
};

/** Random points weighted by the drawing's alpha, coloured like the drawing; positions are 0..1. */
export function sampleDrawing(name: string, palette: Palette, n: number) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext('2d', { willReadFrequently: true })!;
  c.strokeStyle = c.fillStyle = palette.fg;
  c.lineJoin = 'round';
  DRAWINGS[name](c, palette);
  const { data } = c.getImageData(0, 0, W, H);
  const to = new Float32Array(n * 2);
  const color = new Float32Array(n * 3);
  let got = 0;
  for (let tries = 0; got < n && tries < n * 400; tries++) {
    const x = Math.floor(Math.random() * W);
    const y = Math.floor(Math.random() * H);
    const i = (y * W + x) * 4;
    if (Math.random() * 255 >= data[i + 3]) continue;
    to[got * 2] = (x + Math.random()) / W;
    to[got * 2 + 1] = (y + Math.random()) / H;
    color.set([data[i] / 255, data[i + 1] / 255, data[i + 2] / 255], got * 3);
    got++;
  }
  return { to, color };
}

export const GRID_W = 320;
export const GRID_H = 200;

/** One dot per grid cell of the image (shuffled so morphs scatter), highlights compressed so text stays legible. */
export async function sampleImage(src: string) {
  const img = new Image();
  img.src = src;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = GRID_W;
  canvas.height = GRID_H;
  const c = canvas.getContext('2d', { willReadFrequently: true })!;
  // cover-fit
  const s = Math.max(GRID_W / img.naturalWidth, GRID_H / img.naturalHeight);
  const w = img.naturalWidth * s;
  const h = img.naturalHeight * s;
  c.drawImage(img, (GRID_W - w) / 2, (GRID_H - h) / 2, w, h);
  const { data } = c.getImageData(0, 0, GRID_W, GRID_H);
  const n = GRID_W * GRID_H;
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const to = new Float32Array(n * 2);
  const color = new Float32Array(n * 3);
  const KNEE = 0.42;
  order.forEach((cell, k) => {
    to[k * 2] = ((cell % GRID_W) + 0.5) / GRID_W;
    to[k * 2 + 1] = (Math.floor(cell / GRID_W) + 0.5) / GRID_H;
    const [r, g, b] = [data[cell * 4], data[cell * 4 + 1], data[cell * 4 + 2]].map((v) => (v / 255) * 1.3);
    const lum = Math.min(1, 0.3 * r + 0.59 * g + 0.11 * b);
    const k2 = lum > KNEE ? (KNEE + (lum - KNEE) * 0.22) / lum : 1;
    color.set([Math.min(1, r) * k2, Math.min(1, g) * k2, Math.min(1, b) * k2], k * 3);
  });
  return { to, color };
}

/** A 3D form flattened at its tilt into 0..1 positions, one colour, for the 2D stage layer. */
export function flatForm(name: FormName, n: number, rgb: [number, number, number]) {
  const pts = form(name, n);
  const { tilt } = FORMS[name];
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const to = new Float32Array(n * 2);
  const color = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    to[i * 2] = pts[i * 3] + 0.5;
    to[i * 2 + 1] = 0.5 - (pts[i * 3 + 1] * ct - pts[i * 3 + 2] * st);
    color.set(rgb, i * 3);
  }
  return { to, color };
}
