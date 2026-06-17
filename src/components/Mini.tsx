import { C, MONO } from "../theme";

type MiniProps = {
  label: string;
  value: string;
  note: string;
  warn?: boolean;
};

export function Mini({ label, value, note, warn }: MiniProps) {
  return (
    <div>
      <div style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkSoft, marginBottom: 5 }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: warn ? C.fail : C.ink, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: MONO, fontSize: 11, color: warn ? C.fail : C.inkSoft, marginTop: 5 }}>{note}</div>
    </div>
  );
}
