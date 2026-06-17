import React, { useState, useEffect, useMemo } from "react";

// ── Porrastyypit ja niiden raja-arvot (YM asetus 1007/2017) ───────────────
const TYPES = [
  { id: "asunto", label: "Asuinhuoneiston / majoitustilan sisäporras", rise: 190, go: 250, note: "Tavallisin kotiporras kerrosten välillä." },
  { id: "kayttotila", label: "Muiden varsinaisten käyttötilojen sisäporras", rise: 180, go: 270, note: "Esim. teollisuus- ja työtilat ilman asiakasliikennettä." },
  { id: "parvi", label: "Varatie / parvi- tai ullakkoporras (asumista palvelematon)", rise: 220, go: 220, note: "Asunnossa muihin kuin asumista palveleviin välttämättömiin tiloihin (ullakko, parvi, kellari). Ei saa olla varsinaisten asuintilojen uloskäytävän reitillä." },
  { id: "aula", label: "Hallinto-, palvelu- ja liiketilat, kokoontumistilat", rise: 160, go: 300, note: "Aulat, muut sisätilat ja kokoontumistilat." },
  { id: "uloskaytava", label: "Uloskäytävä (poistumistie)", rise: 180, go: 270, note: "Tavanomaisessa sisäisessä liikenteessä oleva uloskäytävä." },
  { id: "ulkokatettu", label: "Katettu tai lämmitetty ulkoporras", rise: 160, go: 300, note: "" },
  { id: "ulkokattamaton", label: "Kattamaton, lämmittämätön ulkoporras", rise: 130, go: 390, note: "Tiukin mitoitus liukkauden vuoksi." },
];

const STEP_TARGET = 630, STEP_MIN = 600, STEP_MAX = 660;
const MAX_RISERS_NO_LANDING = 20;

const C = {
  paper: "#F7F5EF", ink: "#16263F", inkSoft: "#5B6B82", line: "#2C5C8A",
  hint: "rgba(22,38,63,0.10)", pass: "#2E7D52", fail: "#B23A3A", warn: "#B5791F",
  board: "#B07A3C", boardFill: "rgba(176,122,60,0.16)",
};
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function computeFor(n, H, L) {
  const risers = Math.max(2, n);
  const treads = risers - 1;
  const rise = H / risers;
  const going = L / treads;
  return { risers, treads, rise, going, blondel: 2 * rise + going };
}

function recommend(H, L, type) {
  if (H <= 0 || L <= 0) return 13;
  let best = null, bestScore = Infinity;
  for (let n = 2; n <= 60; n++) {
    const { rise, going, blondel } = computeFor(n, H, L);
    let score = Math.abs(blondel - STEP_TARGET);
    if (rise > type.rise + 1e-6) score += 100000 + (rise - type.rise) * 50;
    if (going < type.go - 1e-6) score += 100000 + (type.go - going) * 50;
    if (score < bestScore) { bestScore = score; best = n; }
  }
  return best ?? 13;
}

function NumberField({ label, unit, value, onChange, min, step }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkSoft, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.ink}`, background: "#fff" }}>
        <input type="number" value={value} min={min} step={step} onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", padding: "10px 12px", fontFamily: MONO, fontSize: 18, color: C.ink, width: "100%", minWidth: 0 }} />
        <span style={{ fontFamily: MONO, fontSize: 13, color: C.inkSoft, padding: "0 12px", borderLeft: `1px solid ${C.hint}`, alignSelf: "stretch", display: "flex", alignItems: "center" }}>{unit}</span>
      </div>
    </label>
  );
}

function StairSection({ H, L, n, W }) {
  const { rise, going, risers, treads } = computeFor(n, H, L);
  const theta = Math.atan2(H, L);
  const vt = W / Math.cos(theta);            // lankun pystykorkeus (pystypäätysahaus)
  const boardBottom = H + vt;
  const bottomEdgeTop = H - vt;              // lankun alareunan korkeus alatasosta yläpäässä

  const mL = Math.max(440, H * 0.2), mT = H * 0.1, mR = L * 0.06;
  const belowBoard = Math.max(380, H * 0.16);
  const mB = vt + belowBoard;
  const vbW = L + mL + mR, vbH = H + mT + mB;
  const edimY = boardBottom + belowBoard * 0.45;
  const xa = -mL * 0.5;                       // korkeusakselin x

  const pts = [[0, 0]]; let x = 0, y = 0;
  for (let i = 1; i <= risers; i++) { y += rise; pts.push([x, y]); if (i < risers) { x += going; pts.push([x, y]); } }
  const poly = pts.map((p) => `${p[0]},${p[1]}`).join(" ");

  const sw = vbW * 0.0035, fs = vbW * 0.026, tick = vbW * 0.012;
  const perpx = -W * Math.sin(theta), perpy = W * Math.cos(theta);

  return (
    <svg viewBox={`${-mL} ${-mT} ${vbW} ${vbH}`} style={{ width: "100%", height: "auto", display: "block" }} preserveAspectRatio="xMidYMid meet">
      {/* reisilankku, pystysahatut päädyt */}
      <polygon points={`0,0 ${L},${H} ${L},${boardBottom} 0,${vt}`} fill={C.boardFill} stroke={C.board} strokeWidth={sw} />
      {/* tasot */}
      <line x1={xa - tick} y1={0} x2={0} y2={0} stroke={C.ink} strokeWidth={sw} />
      <line x1={L} y1={H} x2={L + mR} y2={H} stroke={C.ink} strokeWidth={sw} />
      {/* porraslinja */}
      <polyline points={poly} fill="none" stroke={C.ink} strokeWidth={sw * 1.5} strokeLinejoin="miter" />

      {/* korkeusmitta (kerroskorkeus) */}
      <line x1={xa} y1={0} x2={xa} y2={H} stroke={C.line} strokeWidth={sw} />
      <line x1={xa - tick} y1={0} x2={xa + tick} y2={0} stroke={C.line} strokeWidth={sw} />
      <line x1={xa - tick} y1={H} x2={xa + tick} y2={H} stroke={C.line} strokeWidth={sw} />
      <text x={xa - tick * 1.6} y={H / 2} fill={C.line} fontFamily={MONO} fontSize={fs} textAnchor="middle" transform={`rotate(-90 ${xa - tick * 1.6} ${H / 2})`}>{Math.round(H)} mm</text>

      {/* reisilankun alareunan korkeus yläpäässä */}
      <line x1={0} y1={vt} x2={xa} y2={vt} stroke={C.board} strokeWidth={sw} strokeDasharray={`${tick * 0.8} ${tick * 0.8}`} />
      <line x1={xa - tick} y1={vt} x2={xa + tick} y2={vt} stroke={C.board} strokeWidth={sw} />
      <text x={xa + tick * 2.2} y={vt - fs * 0.4} fill={C.board} fontFamily={MONO} fontSize={fs * 0.85} textAnchor="start">↥ {Math.round(bottomEdgeTop)} mm</text>

      {/* etenemämitta */}
      <line x1={0} y1={edimY} x2={L} y2={edimY} stroke={C.line} strokeWidth={sw} />
      <line x1={0} y1={edimY - tick} x2={0} y2={edimY + tick} stroke={C.line} strokeWidth={sw} />
      <line x1={L} y1={edimY - tick} x2={L} y2={edimY + tick} stroke={C.line} strokeWidth={sw} />
      <text x={L / 2} y={edimY + fs * 1.4} fill={C.line} fontFamily={MONO} fontSize={fs} textAnchor="middle">{Math.round(L)} mm</text>

      {/* reisilankun leveys (kohtisuora) */}
      {(() => {
        const mx = L * 0.62, my = H * 0.62;
        return (
          <g stroke={C.board} strokeWidth={sw} fill={C.board} fontFamily={MONO} fontSize={fs * 0.85}>
            <line x1={mx} y1={my} x2={mx + perpx} y2={my + perpy} />
            <text x={mx + perpx * 0.5 - tick} y={my + perpy * 0.5} textAnchor="end" dominantBaseline="middle" stroke="none">reisi {Math.round(W)}</text>
          </g>
        );
      })()}

      {/* askelman callout */}
      {(() => {
        const k = Math.min(treads - 1, Math.floor(risers / 2));
        const cx = k * going, cy = (k + 1) * rise;
        return (
          <g fontFamily={MONO} fontSize={fs * 0.82} fill="#9A3B2E">
            <text x={cx + going / 2} y={cy + fs * 1.05} textAnchor="middle">e {Math.round(going)}</text>
            <text x={cx + going + fs * 0.4} y={cy + rise / 2} textAnchor="start" dominantBaseline="middle">n {Math.round(rise)}</text>
          </g>
        );
      })()}
    </svg>
  );
}

export default function PortaslaskuriApp() {
  const [H, setH] = useState(2300);
  const [L, setL] = useState(3000);
  const [W, setW] = useState(250);
  const [typeId, setTypeId] = useState("asunto");
  const [n, setN] = useState(13);
  const [touchedN, setTouchedN] = useState(false);

  const type = TYPES.find((t) => t.id === typeId);
  const rec = useMemo(() => recommend(H, L, type), [H, L, type]);
  useEffect(() => { setN(rec); setTouchedN(false); }, [rec]);

  const r = computeFor(n, H, L);
  const riseOk = r.rise <= type.rise + 1e-6;
  const goingOk = r.going >= type.go - 1e-6;
  const comfortOk = r.blondel >= STEP_MIN && r.blondel <= STEP_MAX;
  const tooMany = r.risers > MAX_RISERS_NO_LANDING;
  const allOk = riseOk && goingOk && !tooMany;

  // ── Reisilankku ──
  const thetaRad = Math.atan2(H, L);
  const theta = (thetaRad * 180) / Math.PI;
  const vt = W / Math.cos(thetaRad);                 // pystykorkeus yläpään pystysahauksella
  const bottomEdgeTop = H - vt;                      // alareunan korkeus alatasosta yläpäässä
  const minBoard = (r.rise * r.going) / Math.hypot(r.rise, r.going);
  const boardOk = W >= minBoard;

  const verdict = allOk
    ? comfortOk ? { c: C.pass, t: "Täyttää määräykset" } : { c: C.warn, t: "Täyttää raja-arvot — mukavuus rajalla" }
    : { c: C.fail, t: "Ei täytä määräyksiä" };

  const stepN = (d) => { setN((v) => Math.max(2, v + d)); setTouchedN(true); };

  return (
    <div style={{ background: C.paper, minHeight: "100vh", color: C.ink, fontFamily: SANS, padding: "20px 16px 48px",
      backgroundImage: "linear-gradient(rgba(22,38,63,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(22,38,63,0.035) 1px, transparent 1px)", backgroundSize: "22px 22px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ borderBottom: `2px solid ${C.ink}`, paddingBottom: 12, marginBottom: 20 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.22em", color: C.inkSoft, textTransform: "uppercase" }}>YM 1007/2017 · sisäportaiden mitoitus</div>
          <h1 style={{ margin: "6px 0 0", fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>Portaiden askelluslaskuri</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 16 }}>
          <NumberField label="Korkeus (y, x=0)" unit="mm" value={H} min={100} step={10} onChange={setH} />
          <NumberField label="Lattiatila (x)" unit="mm" value={L} min={100} step={10} onChange={setL} />
          <NumberField label="Reisilankun leveys" unit="mm" value={W} min={0} step={5} onChange={setW} />
        </div>

        <label style={{ display: "block", marginBottom: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkSoft, marginBottom: 6 }}>Porrastyyppi</div>
          <select value={typeId} onChange={(e) => setTypeId(e.target.value)}
            style={{ width: "100%", border: `1.5px solid ${C.ink}`, background: "#fff", padding: "11px 12px", fontFamily: SANS, fontSize: 15, color: C.ink }}>
            {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}  ·  n ≤ {t.rise} / e ≥ {t.go} mm</option>)}
          </select>
          {type.note && <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 6, lineHeight: 1.45 }}>{type.note}</div>}
        </label>

        <div style={{ border: `1.5px solid ${C.ink}`, background: "#fff", padding: "18px 16px 10px", marginBottom: 18 }}>
          <StairSection H={Math.max(1, H)} L={Math.max(1, L)} n={n} W={Math.max(0, W)} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, color: C.inkSoft }}>
            Nousuja (askelmia): <strong style={{ color: C.ink, fontFamily: MONO, fontSize: 16 }}>{r.risers}</strong>
            {touchedN && n !== rec && (
              <button onClick={() => { setN(rec); setTouchedN(false); }} style={{ marginLeft: 10, border: "none", background: "none", color: C.line, fontSize: 12.5, textDecoration: "underline", cursor: "pointer", padding: 0 }}>palauta suositus ({rec})</button>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => stepN(-1)} style={stepBtn}>− askelma</button>
            <button onClick={() => stepN(1)} style={stepBtn}>+ askelma</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <ResultCard label="Askelkorkeus (nousu)" value={`${r.rise.toFixed(1)} mm`} ok={riseOk} limit={`max ${type.rise} mm`} />
          <ResultCard label="Etenemä" value={`${r.going.toFixed(1)} mm`} ok={goingOk} limit={`min ${type.go} mm`} />
          <ResultCard label="Mukavuussääntö 2·n + e" value={`${r.blondel.toFixed(0)} mm`} ok={comfortOk} advisory limit={`tavoite ${STEP_MIN}–${STEP_MAX} mm`} />
          <ResultCard label="Nousuja yhteensä" value={`${r.risers} kpl`} ok={!tooMany} limit={`≤ ${MAX_RISERS_NO_LANDING} ilman tasannetta`} />
        </div>

        {/* ── Reisilankku-paneeli ── */}
        <div style={{ border: `1.5px solid ${C.board}`, background: "#fff", padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.board, marginBottom: 12, fontWeight: 700 }}>Reisilankku</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
            <Mini label="Portaan kaltevuus" value={`${theta.toFixed(1)}°`} note={theta > 45 ? "jyrkkä — yli 45°" : "loiva"} warn={theta > 45} />
            <Mini label="Lankun pystykorkeus" value={`${vt.toFixed(0)} mm`} note={`W / cos(${theta.toFixed(0)}°), pystysahaus`} />
            <Mini label="Alareuna yläpäässä" value={`${bottomEdgeTop.toFixed(0)} mm`} note="alatasosta, kun kerroskorkeus saavutettu" warn={bottomEdgeTop < 0} />
            <Mini label="Vähimmäisleveys askelmalle" value={`${minBoard.toFixed(0)} mm`} note={boardOk ? `riittää (+${(W - minBoard).toFixed(0)} mm)` : "lankku liian kapea"} warn={!boardOk} />
          </div>
          <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 12, lineHeight: 1.5 }}>
            Yläpäässä (kerroskorkeus {H} mm saavutettu) reisilankun yläreuna on tasolla {H} mm ja alareuna {bottomEdgeTop.toFixed(0)} mm alatasosta — eli lankku ulottuu {vt.toFixed(0)} mm ylätason alapuolelle.
          </div>
        </div>

        <div style={{ border: `2px solid ${verdict.c}`, background: "#fff", padding: "14px 16px", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: verdict.c, display: "inline-block", flexShrink: 0 }} />
            <strong style={{ fontSize: 16, color: verdict.c }}>{verdict.t}</strong>
          </div>
          <ul style={{ margin: "10px 0 0", paddingLeft: 20, fontSize: 13.5, lineHeight: 1.6, color: C.ink }}>
            {!riseOk && <li>Nousu {r.rise.toFixed(0)} mm ylittää rajan {type.rise} mm — <strong>lisää askelmia</strong> tai pienennä korkeutta.</li>}
            {!goingOk && <li>Etenemä {r.going.toFixed(0)} mm alittaa rajan {type.go} mm — tarvitset <strong>lisää lattiatilaa</strong> (n. {Math.ceil(type.go * r.treads - L)} mm) tai vähemmän askelmia / välitasanteen.</li>}
            {tooMany && <li>Yli {MAX_RISERS_NO_LANDING} nousua — tarvitaan <strong>välitasanne</strong>.</li>}
            {!boardOk && <li>Reisilankku {W} mm on liian kapea valitulle askelmalle (väh. {minBoard.toFixed(0)} mm).</li>}
            {allOk && !comfortOk && <li>Raja-arvot täyttyvät, mutta askelkaava ({r.blondel.toFixed(0)} mm) on suositusalueen ulkopuolella — porras tuntuu {r.blondel < STEP_MIN ? "lyhyeltä askeleelta" : "jyrkältä"}.</li>}
            {allOk && comfortOk && boardOk && <li>Nousu, etenemä, askelkaava ja reisilankun leveys ovat kaikki kunnossa.</li>}
          </ul>
        </div>

        <p style={{ fontSize: 11.5, color: C.inkSoft, lineHeight: 1.5, marginTop: 16 }}>
          Raja-arvot: YM:n asetus rakennuksen käyttöturvallisuudesta 1007/2017. Reisilankun pystykorkeus = leveys / cos(kaltevuuskulma) (pystysahattu yläpääty); alareunan korkeus yläpäässä = kerroskorkeus − pystykorkeus. Vähimmäisleveys on kohtisuora etäisyys nousulinjasta askelman sisäkulmaan ((nousu·etenemä)/√(nousu²+etenemä²)); lankku tehdään käytännössä tätä leveämmäksi lujuuden vuoksi. Laskuri olettaa suoran syöksyn. Tarkista aina paikallisen rakennusvalvonnan tulkinta.
        </p>
      </div>
    </div>
  );
}

const stepBtn = { border: `1.5px solid ${C.ink}`, background: "#fff", color: C.ink, fontFamily: MONO, fontSize: 13, padding: "9px 14px", cursor: "pointer" };

function ResultCard({ label, value, ok, limit, advisory }) {
  const col = ok ? (advisory ? C.warn : C.pass) : C.fail;
  return (
    <div style={{ border: `1.5px solid ${C.ink}`, background: "#fff", padding: "12px 14px" }}>
      <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: C.inkSoft, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.ink, lineHeight: 1 }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: col, display: "inline-block" }} />
        <span style={{ fontFamily: MONO, fontSize: 11.5, color: C.inkSoft }}>{limit}</span>
      </div>
    </div>
  );
}

function Mini({ label, value, note, warn }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkSoft, marginBottom: 5 }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: warn ? C.fail : C.ink, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: MONO, fontSize: 11, color: warn ? C.fail : C.inkSoft, marginTop: 5 }}>{note}</div>
    </div>
  );
}
