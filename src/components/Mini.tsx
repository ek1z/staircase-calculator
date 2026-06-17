import * as stylex from "@stylexjs/stylex";
import { colors, fonts } from "../tokens.stylex";

type MiniProps = {
  label: string;
  value: string;
  note: string;
  warn?: boolean;
};

const styles = stylex.create({
  label: {
    fontSize: 10.5,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.inkSoft,
    marginBottom: 5,
  },
  value: {
    fontFamily: fonts.mono,
    fontSize: 20,
    fontWeight: 700,
    color: colors.ink,
    lineHeight: 1,
  },
  valueWarn: { color: colors.fail },
  note: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.inkSoft,
    marginTop: 5,
  },
  noteWarn: { color: colors.fail },
});

export function Mini({ label, value, note, warn }: MiniProps) {
  return (
    <div>
      <div {...stylex.props(styles.label)}>{label}</div>
      <div {...stylex.props(styles.value, warn && styles.valueWarn)}>{value}</div>
      <div {...stylex.props(styles.note, warn && styles.noteWarn)}>{note}</div>
    </div>
  );
}
