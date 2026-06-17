import { C, MONO } from "../theme";

type NumberFieldProps = {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
};

export function NumberField({ label, unit, value, onChange, min, step }: NumberFieldProps) {
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
