import {
  STEP_TARGET,
  STEP_MIN,
  STEP_MAX,
  MAX_RISERS_NO_LANDING,
  type StairType,
} from "../config/stairTypes";

const EPS = 1e-6;

// ── Portaan perusmitat annetulle nousumäärälle ──────────────────────────
export type StairDimensions = {
  /** Nousujen (askelmien) lukumäärä. */
  risers: number;
  /** Etenemien lukumäärä = risers − 1. */
  treads: number;
  /** Askelkorkeus, mm. */
  rise: number;
  /** Etenemä, mm. */
  going: number;
  /** Askelkaava 2·nousu + etenemä, mm. */
  blondel: number;
};

export function computeFor(n: number, H: number, L: number): StairDimensions {
  const risers = Math.max(2, n);
  const treads = risers - 1;
  const rise = H / risers;
  const going = L / treads;
  return { risers, treads, rise, going, blondel: 2 * rise + going };
}

/**
 * Etsii nousumäärän, jonka askelkaava osuu lähimmäs mukavuustavoitetta ja
 * joka täyttää valitun porrastyypin raja-arvot (raja-arvojen rikkomista
 * sakotetaan voimakkaasti).
 */
export function recommend(H: number, L: number, type: StairType): number {
  if (H <= 0 || L <= 0) return 13;
  let best: number | null = null, bestScore = Infinity;
  for (let n = 2; n <= 60; n++) {
    const { rise, going, blondel } = computeFor(n, H, L);
    let score = Math.abs(blondel - STEP_TARGET);
    if (rise > type.rise + EPS) score += 100000 + (rise - type.rise) * 50;
    if (going < type.go - EPS) score += 100000 + (type.go - going) * 50;
    if (score < bestScore) { bestScore = score; best = n; }
  }
  return best ?? 13;
}

// ── Reisilankun geometria ─────────────────────────────────────────────────
export type BoardGeometry = {
  /** Portaan kaltevuuskulma (nousulinjaa pitkin) radiaaneina. */
  thetaRad: number;
  /** Portaan kaltevuuskulma (nousulinjaa pitkin) asteina. */
  thetaDeg: number;
  /** Lankun pystykorkeus (pystysahattu yläpääty), mm. */
  vt: number;
  /** Lankun alareunan korkeus alatasosta yläpäässä, mm. */
  bottomEdgeTop: number;
  /** Askelman vaatima lankun vähimmäisleveys, mm. */
  minBoard: number;
  /** Onko lankku riittävän leveä. */
  boardOk: boolean;
};

export function boardGeometry(H: number, W: number, dims: StairDimensions): BoardGeometry {
  // Kaltevuus mitataan nousulinjaa (askelmien nokkia) pitkin, ei lattiadiagonaalia.
  const thetaRad = Math.atan2(dims.rise, dims.going);
  const thetaDeg = (thetaRad * 180) / Math.PI;
  const vt = W / Math.cos(thetaRad);
  const bottomEdgeTop = H - vt;
  const minBoard = (dims.rise * dims.going) / Math.hypot(dims.rise, dims.going);
  return { thetaRad, thetaDeg, vt, bottomEdgeTop, minBoard, boardOk: W >= minBoard };
}

// ── Määräystenmukaisuus ───────────────────────────────────────────────────
export type Compliance = {
  riseOk: boolean;
  goingOk: boolean;
  comfortOk: boolean;
  tooMany: boolean;
  allOk: boolean;
};

export function evaluateCompliance(dims: StairDimensions, type: StairType): Compliance {
  const riseOk = dims.rise <= type.rise + EPS;
  const goingOk = dims.going >= type.go - EPS;
  const comfortOk = dims.blondel >= STEP_MIN && dims.blondel <= STEP_MAX;
  const tooMany = dims.risers > MAX_RISERS_NO_LANDING;
  return { riseOk, goingOk, comfortOk, tooMany, allOk: riseOk && goingOk && !tooMany };
}
