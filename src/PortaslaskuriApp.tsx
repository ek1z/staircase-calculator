import { useMemo } from "react";
import * as stylex from "@stylexjs/stylex";
// Tuodaan globaali resetti islandin (client) build-graafiin, jotta StyleX
// liittää käännetyt tyylinsä tähän CSS-assettiin ja Astro linkittää sen.
import "./index.css";

// Kehityksessä StyleX tarjoaa tyylit virtuaalimoduulin kautta (CSS + HMR).
// Tuotannossa tyylit liitetään index.css-assettiin buildin aikana. Lataus
// tehdään vain selaimessa, jotta Astron palvelinrenderöinti ei kaadu.
if (import.meta.env.DEV && typeof document !== "undefined") {
  import("virtual:stylex:runtime");
}
import { TYPES, STEP_MIN, STEP_MAX, MAX_RISERS_NO_LANDING } from "./config/stairTypes";
import { computeFor, recommend, boardGeometry, evaluateCompliance } from "./lib/geometry";
import { colors, fonts } from "./tokens.stylex";
import { darkTheme, type ThemeName } from "./themes";
import { useStairParams } from "./useUrlState";
import { NumberField } from "./components/NumberField";
import { StairSection } from "./components/StairSection";
import { ResultCard } from "./components/ResultCard";
import { Mini } from "./components/Mini";

const styles = stylex.create({
  page: {
    backgroundColor: colors.paper,
    minHeight: "100vh",
    color: colors.ink,
    fontFamily: fonts.sans,
    padding: "20px 16px 48px",
    backgroundImage: `linear-gradient(${colors.grid} 1px, transparent 1px), linear-gradient(90deg, ${colors.grid} 1px, transparent 1px)`,
    backgroundSize: "22px 22px",
  },
  shell: { maxWidth: 760, margin: "0 auto" },

  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: colors.ink,
    paddingBottom: 12,
    marginBottom: 20,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: "0.22em",
    color: colors.inkSoft,
    textTransform: "uppercase",
  },
  title: { margin: "6px 0 0", fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" },

  // Teemavalitsin
  themeSwitch: {
    display: "flex",
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: colors.ink,
  },
  themeBtn: {
    borderStyle: "none",
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "7px 12px",
    cursor: "pointer",
  },
  themeBtnOn: { backgroundColor: colors.ink, color: colors.paper },
  themeBtnOff: { backgroundColor: colors.surface, color: colors.inkSoft },

  fields: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 14,
    marginBottom: 16,
  },

  selectLabel: { display: "block", marginBottom: 20 },
  selectCaption: {
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: colors.inkSoft,
    marginBottom: 6,
  },
  select: {
    width: "100%",
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: colors.ink,
    backgroundColor: colors.surface,
    padding: "11px 12px",
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
  },
  note: { fontSize: 12.5, color: colors.inkSoft, marginTop: 6, lineHeight: 1.45 },

  diagram: {
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: colors.ink,
    backgroundColor: colors.surface,
    padding: "18px 16px 10px",
    marginBottom: 18,
  },

  stepBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  stepInfo: { fontSize: 13, color: colors.inkSoft },
  stepCount: { color: colors.ink, fontFamily: fonts.mono, fontSize: 16 },
  resetBtn: {
    marginLeft: 10,
    borderStyle: "none",
    backgroundColor: "transparent",
    color: colors.line,
    fontSize: 12.5,
    textDecoration: "underline",
    cursor: "pointer",
    padding: 0,
  },
  stepBtns: { display: "flex", gap: 8 },
  stepBtn: {
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: colors.ink,
    backgroundColor: colors.surface,
    color: colors.ink,
    fontFamily: fonts.mono,
    fontSize: 13,
    padding: "9px 14px",
    cursor: "pointer",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 16,
  },

  boardPanel: {
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: colors.board,
    backgroundColor: colors.surface,
    padding: "14px 16px",
    marginBottom: 16,
  },
  boardHeading: {
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: colors.board,
    marginBottom: 12,
    fontWeight: 700,
  },
  boardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 14,
  },
  boardText: { fontSize: 12.5, color: colors.inkSoft, marginTop: 12, lineHeight: 1.5 },

  verdict: {
    borderWidth: 2,
    borderStyle: "solid",
    backgroundColor: colors.surface,
    padding: "14px 16px",
    marginBottom: 8,
  },
  verdictPass: { borderColor: colors.pass },
  verdictWarn: { borderColor: colors.warn },
  verdictFail: { borderColor: colors.fail },
  verdictRow: { display: "flex", alignItems: "center", gap: 10 },
  dot: { width: 12, height: 12, borderRadius: "50%", display: "inline-block", flexShrink: 0 },
  dotPass: { backgroundColor: colors.pass },
  dotWarn: { backgroundColor: colors.warn },
  dotFail: { backgroundColor: colors.fail },
  verdictText: { fontSize: 16 },
  verdictTextPass: { color: colors.pass },
  verdictTextWarn: { color: colors.warn },
  verdictTextFail: { color: colors.fail },
  list: { margin: "10px 0 0", paddingLeft: 20, fontSize: 13.5, lineHeight: 1.6, color: colors.ink },

  footnote: { fontSize: 11.5, color: colors.inkSoft, lineHeight: 1.5, marginTop: 16 },
});

type Status = "pass" | "warn" | "fail";
const VERDICT_STYLE = {
  pass: { box: styles.verdictPass, dot: styles.dotPass, text: styles.verdictTextPass },
  warn: { box: styles.verdictWarn, dot: styles.dotWarn, text: styles.verdictTextWarn },
  fail: { box: styles.verdictFail, dot: styles.dotFail, text: styles.verdictTextFail },
} satisfies Record<Status, unknown>;

export default function PortaslaskuriApp() {
  const { H, L, W, typeId, nOverride, theme, update } = useStairParams();

  const type = TYPES.find((t) => t.id === typeId) ?? TYPES[0];
  const rec = useMemo(() => recommend(H, L, type), [H, L, type]);
  // Ilman käsin asetettua arvoa nousumäärä seuraa suositusta joka renderissä.
  const n = nOverride ?? rec;
  const touchedN = nOverride != null;

  const r = computeFor(n, H, L);
  const { riseOk, goingOk, comfortOk, tooMany, allOk } = evaluateCompliance(r, type);
  const { thetaDeg: theta, vt, bottomEdgeTop, minBoard, boardOk } = boardGeometry(H, W, r);

  const verdict: { s: Status; t: string } = allOk
    ? comfortOk
      ? { s: "pass", t: "Täyttää määräykset" }
      : { s: "warn", t: "Täyttää raja-arvot — mukavuus rajalla" }
    : { s: "fail", t: "Ei täytä määräyksiä" };
  const vStyle = VERDICT_STYLE[verdict.s];

  const stepN = (d: number) => update({ n: Math.max(2, n + d) });
  const setTheme = (next: ThemeName) => update({ theme: next });

  return (
    <div {...stylex.props(theme === "dark" && darkTheme, styles.page)}>
      <div {...stylex.props(styles.shell)}>
        <div {...stylex.props(styles.header)}>
          <div>
            <div {...stylex.props(styles.eyebrow)}>YM 1007/2017 · sisäportaiden mitoitus</div>
            <h1 {...stylex.props(styles.title)}>Portaiden askelluslaskuri</h1>
          </div>
          <div {...stylex.props(styles.themeSwitch)} role="group" aria-label="Teema">
            <button
              {...stylex.props(styles.themeBtn, theme === "light" ? styles.themeBtnOn : styles.themeBtnOff)}
              aria-pressed={theme === "light"}
              onClick={() => setTheme("light")}
            >
              Vaalea
            </button>
            <button
              {...stylex.props(styles.themeBtn, theme === "dark" ? styles.themeBtnOn : styles.themeBtnOff)}
              aria-pressed={theme === "dark"}
              onClick={() => setTheme("dark")}
            >
              Tumma
            </button>
          </div>
        </div>

        <div {...stylex.props(styles.fields)}>
          <NumberField label="Korkeus (y, x=0)" unit="mm" value={H} min={100} step={10} onChange={(v) => update({ h: v, n: null })} />
          <NumberField label="Lattiatila (x)" unit="mm" value={L} min={100} step={10} onChange={(v) => update({ l: v, n: null })} />
          <NumberField label="Reisilankun leveys" unit="mm" value={W} min={0} step={5} onChange={(v) => update({ w: v })} />
        </div>

        <label {...stylex.props(styles.selectLabel)}>
          <div {...stylex.props(styles.selectCaption)}>Porrastyyppi</div>
          <select value={typeId} onChange={(e) => update({ t: e.target.value, n: null })} {...stylex.props(styles.select)}>
            {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}  ·  n ≤ {t.rise} / e ≥ {t.go} mm</option>)}
          </select>
          {type.note && <div {...stylex.props(styles.note)}>{type.note}</div>}
        </label>

        <div {...stylex.props(styles.diagram)}>
          <StairSection H={Math.max(1, H)} L={Math.max(1, L)} n={n} W={Math.max(0, W)} />
        </div>

        <div {...stylex.props(styles.stepBar)}>
          <div {...stylex.props(styles.stepInfo)}>
            Nousuja (askelmia): <strong {...stylex.props(styles.stepCount)}>{r.risers}</strong>
            {touchedN && n !== rec && (
              <button onClick={() => update({ n: null })} {...stylex.props(styles.resetBtn)}>palauta suositus ({rec})</button>
            )}
          </div>
          <div {...stylex.props(styles.stepBtns)}>
            <button onClick={() => stepN(-1)} {...stylex.props(styles.stepBtn)}>− askelma</button>
            <button onClick={() => stepN(1)} {...stylex.props(styles.stepBtn)}>+ askelma</button>
          </div>
        </div>

        <div {...stylex.props(styles.resultGrid)}>
          <ResultCard label="Askelkorkeus (nousu)" value={`${r.rise.toFixed(1)} mm`} ok={riseOk} limit={`max ${type.rise} mm`} />
          <ResultCard label="Etenemä" value={`${r.going.toFixed(1)} mm`} ok={goingOk} limit={`min ${type.go} mm`} />
          <ResultCard label="Mukavuussääntö 2·n + e" value={`${r.blondel.toFixed(0)} mm`} ok={comfortOk} advisory limit={`tavoite ${STEP_MIN}–${STEP_MAX} mm`} />
          <ResultCard label="Nousuja yhteensä" value={`${r.risers} kpl`} ok={!tooMany} limit={`≤ ${MAX_RISERS_NO_LANDING} ilman tasannetta`} />
        </div>

        {/* ── Reisilankku-paneeli ── */}
        <div {...stylex.props(styles.boardPanel)}>
          <div {...stylex.props(styles.boardHeading)}>Reisilankku</div>
          <div {...stylex.props(styles.boardGrid)}>
            <Mini label="Portaan kaltevuus" value={`${theta.toFixed(1)}°`} note={theta > 45 ? "jyrkkä — yli 45°" : "loiva"} warn={theta > 45} />
            <Mini label="Lankun pystykorkeus" value={`${vt.toFixed(0)} mm`} note={`W / cos(${theta.toFixed(0)}°), pystysahaus`} />
            <Mini label="Alareuna yläpäässä" value={`${bottomEdgeTop.toFixed(0)} mm`} note="alatasosta, kun kerroskorkeus saavutettu" warn={bottomEdgeTop < 0} />
            <Mini label="Vähimmäisleveys askelmalle" value={`${minBoard.toFixed(0)} mm`} note={boardOk ? `riittää (+${(W - minBoard).toFixed(0)} mm)` : "lankku liian kapea"} warn={!boardOk} />
          </div>
          <div {...stylex.props(styles.boardText)}>
            Yläpäässä (kerroskorkeus {H} mm saavutettu) reisilankun yläreuna on tasolla {H} mm ja alareuna {bottomEdgeTop.toFixed(0)} mm alatasosta — eli lankku ulottuu {vt.toFixed(0)} mm ylätason alapuolelle.
          </div>
        </div>

        <div {...stylex.props(styles.verdict, vStyle.box)}>
          <div {...stylex.props(styles.verdictRow)}>
            <span {...stylex.props(styles.dot, vStyle.dot)} />
            <strong {...stylex.props(styles.verdictText, vStyle.text)}>{verdict.t}</strong>
          </div>
          <ul {...stylex.props(styles.list)}>
            {!riseOk && <li>Nousu {r.rise.toFixed(0)} mm ylittää rajan {type.rise} mm — <strong>lisää askelmia</strong> tai pienennä korkeutta.</li>}
            {!goingOk && <li>Etenemä {r.going.toFixed(0)} mm alittaa rajan {type.go} mm — tarvitset <strong>lisää lattiatilaa</strong> (n. {Math.ceil(type.go * r.treads - L)} mm) tai vähemmän askelmia / välitasanteen.</li>}
            {tooMany && <li>Yli {MAX_RISERS_NO_LANDING} nousua — tarvitaan <strong>välitasanne</strong>.</li>}
            {!boardOk && <li>Reisilankku {W} mm on liian kapea valitulle askelmalle (väh. {minBoard.toFixed(0)} mm).</li>}
            {allOk && !comfortOk && <li>Raja-arvot täyttyvät, mutta askelkaava ({r.blondel.toFixed(0)} mm) on suositusalueen ulkopuolella — porras tuntuu {r.blondel < STEP_MIN ? "lyhyeltä askeleelta" : "jyrkältä"}.</li>}
            {allOk && comfortOk && boardOk && <li>Nousu, etenemä, askelkaava ja reisilankun leveys ovat kaikki kunnossa.</li>}
          </ul>
        </div>

        <p {...stylex.props(styles.footnote)}>
          Raja-arvot: YM:n asetus rakennuksen käyttöturvallisuudesta 1007/2017. Reisilankun pystykorkeus = leveys / cos(kaltevuuskulma) (pystysahattu yläpääty); alareunan korkeus yläpäässä = kerroskorkeus − pystykorkeus. Vähimmäisleveys on kohtisuora etäisyys nousulinjasta askelman sisäkulmaan ((nousu·etenemä)/√(nousu²+etenemä²)); lankku tehdään käytännössä tätä leveämmäksi lujuuden vuoksi. Laskuri olettaa suoran syöksyn. Tarkista aina paikallisen rakennusvalvonnan tulkinta.
        </p>
      </div>
    </div>
  );
}
