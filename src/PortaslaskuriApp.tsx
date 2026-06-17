import { useMemo } from "react";
import { TYPES, STEP_MIN, STEP_MAX, MAX_RISERS_NO_LANDING } from "./config/stairTypes";
import { computeFor, recommend, boardGeometry, evaluateCompliance } from "./lib/geometry";
import { C, MONO, SANS, stepBtn } from "./theme";
import { useStairParams } from "./useUrlState";
import { NumberField } from "./components/NumberField";
import { StairSection } from "./components/StairSection";
import { ResultCard } from "./components/ResultCard";
import { Mini } from "./components/Mini";

export default function PortaslaskuriApp() {
  const { H, L, W, typeId, nOverride, update } = useStairParams();

  const type = TYPES.find((t) => t.id === typeId) ?? TYPES[0];
  const rec = useMemo(() => recommend(H, L, type), [H, L, type]);
  // Ilman käsin asetettua arvoa nousumäärä seuraa suositusta joka renderissä.
  const n = nOverride ?? rec;
  const touchedN = nOverride != null;

  const r = computeFor(n, H, L);
  const { riseOk, goingOk, comfortOk, tooMany, allOk } = evaluateCompliance(r, type);
  const { thetaDeg: theta, vt, bottomEdgeTop, minBoard, boardOk } = boardGeometry(H, W, r);

  const verdict = allOk
    ? comfortOk ? { c: C.pass, t: "Täyttää määräykset" } : { c: C.warn, t: "Täyttää raja-arvot — mukavuus rajalla" }
    : { c: C.fail, t: "Ei täytä määräyksiä" };

  const stepN = (d: number) => update({ n: Math.max(2, n + d) });

  return (
    <div style={{ background: C.paper, minHeight: "100vh", color: C.ink, fontFamily: SANS, padding: "20px 16px 48px",
      backgroundImage: "linear-gradient(rgba(22,38,63,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(22,38,63,0.035) 1px, transparent 1px)", backgroundSize: "22px 22px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ borderBottom: `2px solid ${C.ink}`, paddingBottom: 12, marginBottom: 20 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.22em", color: C.inkSoft, textTransform: "uppercase" }}>YM 1007/2017 · sisäportaiden mitoitus</div>
          <h1 style={{ margin: "6px 0 0", fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>Portaiden askelluslaskuri</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 16 }}>
          <NumberField label="Korkeus (y, x=0)" unit="mm" value={H} min={100} step={10} onChange={(v) => update({ h: v, n: null })} />
          <NumberField label="Lattiatila (x)" unit="mm" value={L} min={100} step={10} onChange={(v) => update({ l: v, n: null })} />
          <NumberField label="Reisilankun leveys" unit="mm" value={W} min={0} step={5} onChange={(v) => update({ w: v })} />
        </div>

        <label style={{ display: "block", marginBottom: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkSoft, marginBottom: 6 }}>Porrastyyppi</div>
          <select value={typeId} onChange={(e) => update({ t: e.target.value, n: null })}
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
              <button onClick={() => update({ n: null })} style={{ marginLeft: 10, border: "none", background: "none", color: C.line, fontSize: 12.5, textDecoration: "underline", cursor: "pointer", padding: 0 }}>palauta suositus ({rec})</button>
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
