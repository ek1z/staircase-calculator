import * as stylex from "@stylexjs/stylex";
import { colors, fonts } from "../tokens.stylex";
import { computeFor } from "../lib/geometry";

// Token-muuttujat ovat `var(--hash)`-merkkijonoja, joten ne käyvät suoraan
// SVG:n fill/stroke/fontFamily-attribuutteihin — sama lähde kuin CSS:ssä,
// ja teemanvaihto värittää leikkauksen mukana.
const styles = stylex.create({
  svg: { width: "100%", height: "auto", display: "block" },
});

type StairSectionProps = { H: number; L: number; n: number; W: number };

export function StairSection({ H, L, n, W }: StairSectionProps) {
  const { rise, going, risers, treads } = computeFor(n, H, L);
  const theta = Math.atan2(rise, going);     // portaan kaltevuus nousulinjaa (askelmien nokkia) pitkin
  const vt = W / Math.cos(theta);            // lankun pystykorkeus (pystypäätysahaus)
  const noseEndY = treads * rise;            // nousulinjan taso alapäässä (alimman askelman nokka)
  const boardBottom = noseEndY + vt;
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
    <svg viewBox={`${-mL} ${-mT} ${vbW} ${vbH}`} {...stylex.props(styles.svg)} preserveAspectRatio="xMidYMid meet">
      {/* reisilankku, pystysahatut päädyt */}
      <polygon points={`0,0 ${L},${noseEndY} ${L},${boardBottom} 0,${vt}`} fill={colors.boardFill} stroke={colors.board} strokeWidth={sw} />
      {/* tasot */}
      <line x1={xa - tick} y1={0} x2={0} y2={0} stroke={colors.ink} strokeWidth={sw} />
      <line x1={L} y1={H} x2={L + mR} y2={H} stroke={colors.ink} strokeWidth={sw} />
      {/* porraslinja */}
      <polyline points={poly} fill="none" stroke={colors.ink} strokeWidth={sw * 1.5} strokeLinejoin="miter" />

      {/* korkeusmitta (kerroskorkeus) */}
      <line x1={xa} y1={0} x2={xa} y2={H} stroke={colors.line} strokeWidth={sw} />
      <line x1={xa - tick} y1={0} x2={xa + tick} y2={0} stroke={colors.line} strokeWidth={sw} />
      <line x1={xa - tick} y1={H} x2={xa + tick} y2={H} stroke={colors.line} strokeWidth={sw} />
      <text x={xa - tick * 1.6} y={H / 2} fill={colors.line} fontFamily={fonts.mono} fontSize={fs} textAnchor="middle" transform={`rotate(-90 ${xa - tick * 1.6} ${H / 2})`}>{Math.round(H)} mm</text>

      {/* reisilankun alareunan korkeus yläpäässä */}
      <line x1={0} y1={vt} x2={xa} y2={vt} stroke={colors.board} strokeWidth={sw} strokeDasharray={`${tick * 0.8} ${tick * 0.8}`} />
      <line x1={xa - tick} y1={vt} x2={xa + tick} y2={vt} stroke={colors.board} strokeWidth={sw} />
      <text x={xa + tick * 2.2} y={vt - fs * 0.4} fill={colors.board} fontFamily={fonts.mono} fontSize={fs * 0.85} textAnchor="start">↥ {Math.round(bottomEdgeTop)} mm</text>

      {/* etenemämitta */}
      <line x1={0} y1={edimY} x2={L} y2={edimY} stroke={colors.line} strokeWidth={sw} />
      <line x1={0} y1={edimY - tick} x2={0} y2={edimY + tick} stroke={colors.line} strokeWidth={sw} />
      <line x1={L} y1={edimY - tick} x2={L} y2={edimY + tick} stroke={colors.line} strokeWidth={sw} />
      <text x={L / 2} y={edimY + fs * 1.4} fill={colors.line} fontFamily={fonts.mono} fontSize={fs} textAnchor="middle">{Math.round(L)} mm</text>

      {/* reisilankun leveys (kohtisuora) */}
      {(() => {
        const mx = L * 0.62, my = mx * (rise / going);
        return (
          <g stroke={colors.board} strokeWidth={sw} fill={colors.board} fontFamily={fonts.mono} fontSize={fs * 0.85}>
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
          <g fontFamily={fonts.mono} fontSize={fs * 0.82} fill={colors.callout}>
            <text x={cx + going / 2} y={cy + fs * 1.05} textAnchor="middle">e {Math.round(going)}</text>
            <text x={cx + going + fs * 0.4} y={cy + rise / 2} textAnchor="start" dominantBaseline="middle">n {Math.round(rise)}</text>
          </g>
        );
      })()}
    </svg>
  );
}
