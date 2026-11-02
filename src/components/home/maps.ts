/**
 * Procedural surface maps for the 3D: a tiling random height field, turned into a
 * normal map and a roughness map. They are baked in Web Workers, so building them
 * never stalls the page or the entrance playing over it.
 */

export interface MapJob {
  size: number;
  /** [blur radius, gain] for each layer of noise. */
  layers: number[][];
  /** Smear the noise sideways only, into long streaks. */
  alongX: boolean;
  /** How deep the relief reads in the normal map. */
  strength: number;
  /** Roughness byte: clamp(base + height * gain, min, max). */
  rough: [number, number, number, number];
}

export interface BakedMap {
  size: number;
  normal: Uint8Array<ArrayBuffer>;
  rough: Uint8Array<ArrayBuffer>;
}

// Self-contained on purpose: its source is also the code the worker runs.
function mapsKit() {
  return function bake(job: MapJob): BakedMap {
    const { size, layers, alongX, strength } = job;
    const [base, gain, lo, hi] = job.rough;
    const n = size * size;
    const height = new Float32Array(n);
    const blur = (src: Float32Array, r: number) => {
      const a = new Float32Array(n);
      const out = new Float32Array(n);
      const w = 2 * r + 1;
      for (let y = 0; y < size; y++) {
        let sum = 0;
        for (let k = -r; k <= r; k++) sum += src[y * size + ((k + size) % size)];
        for (let x = 0; x < size; x++) {
          a[y * size + x] = sum / w;
          sum += src[y * size + ((x + r + 1) % size)] - src[y * size + ((x - r + size) % size)];
        }
      }
      if (alongX) return a;
      for (let x = 0; x < size; x++) {
        let sum = 0;
        for (let k = -r; k <= r; k++) sum += a[((k + size) % size) * size + x];
        for (let y = 0; y < size; y++) {
          out[y * size + x] = sum / w;
          sum += a[((y + r + 1) % size) * size + x] - a[((y - r + size) % size) * size + x];
        }
      }
      return out;
    };
    for (const [r, g] of layers) {
      const raw = new Float32Array(n);
      for (let i = 0; i < n; i++) raw[i] = Math.random() - 0.5;
      const b = blur(raw, r);
      for (let i = 0; i < n; i++) height[i] += b[i] * g;
    }
    const normal = new Uint8Array(n * 4);
    const rough = new Uint8Array(n * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = y * size + x;
        const dx = (height[y * size + ((x + 1) % size)] - height[y * size + ((x - 1 + size) % size)]) * strength;
        const dy = (height[((y + 1) % size) * size + x] - height[((y - 1 + size) % size) * size + x]) * strength;
        const len = Math.hypot(dx, dy, 1);
        // Rows written bottom-up: the same orientation a canvas texture gets.
        const o = ((size - 1 - y) * size + x) * 4;
        normal[o] = (-dx / len + 1) * 127.5;
        normal[o + 1] = (-dy / len + 1) * 127.5;
        normal[o + 2] = (1 / len + 1) * 127.5;
        normal[o + 3] = 255;
        const v = Math.max(lo, Math.min(hi, base + height[i] * gain));
        rough[o] = rough[o + 1] = rough[o + 2] = v;
        rough[o + 3] = 255;
      }
    }
    return { size, normal, rough };
  };
}

/** Bakes every job in parallel, one worker each; on the main thread where workers fail. */
export function bakeMaps(jobs: MapJob[]): Promise<BakedMap[]> {
  const local = mapsKit();
  let url: string | null = null;
  try {
    const source = `const bake=(${mapsKit.toString()})();self.onmessage=function(e){var r=bake(e.data);self.postMessage(r,[r.normal.buffer,r.rough.buffer])}`;
    url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
  } catch {}
  const run = (job: MapJob) =>
    new Promise<BakedMap>((resolve) => {
      let worker: Worker;
      try {
        if (!url) throw new Error("no worker");
        worker = new Worker(url);
      } catch {
        resolve(local(job));
        return;
      }
      worker.onmessage = (e: MessageEvent<BakedMap>) => {
        worker.terminate();
        resolve(e.data);
      };
      worker.onerror = () => {
        worker.terminate();
        resolve(local(job));
      };
      worker.postMessage(job);
    });
  return Promise.all(jobs.map(run)).finally(() => {
    if (url) URL.revokeObjectURL(url);
  });
}
