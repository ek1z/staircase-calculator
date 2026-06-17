import * as stylex from "@stylexjs/stylex";
import { colors, fonts } from "../tokens.stylex";

type NumberFieldProps = {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
};

const styles = stylex.create({
  label: { display: "block" },
  caption: {
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: colors.inkSoft,
    marginBottom: 6,
  },
  field: {
    display: "flex",
    alignItems: "center",
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: colors.ink,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderStyle: "none",
    outline: {
      default: "none",
      ":focus": `1.5px solid ${colors.line}`,
    },
    outlineOffset: -3,
    backgroundColor: "transparent",
    padding: "10px 12px",
    fontFamily: fonts.mono,
    fontSize: 18,
    color: colors.ink,
    width: "100%",
    minWidth: 0,
  },
  unit: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.inkSoft,
    padding: "0 12px",
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: colors.hint,
    alignSelf: "stretch",
    display: "flex",
    alignItems: "center",
  },
});

export function NumberField({ label, unit, value, onChange, min, step }: NumberFieldProps) {
  return (
    <label {...stylex.props(styles.label)}>
      <div {...stylex.props(styles.caption)}>{label}</div>
      <div {...stylex.props(styles.field)}>
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          {...stylex.props(styles.input)}
        />
        <span {...stylex.props(styles.unit)}>{unit}</span>
      </div>
    </label>
  );
}
