import { C, MONO } from "../theme";

type ResultCardProps = {
  label: string;
  value: string;
  ok: boolean;
  limit: string;
  advisory?: boolean;
};

export function ResultCard({ label, value, ok, limit, advisory }: ResultCardProps) {
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
