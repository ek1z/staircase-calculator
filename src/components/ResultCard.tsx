import * as stylex from "@stylexjs/stylex";
import { colors, fonts } from "../tokens.stylex";

type ResultCardProps = {
  label: string;
  value: string;
  ok: boolean;
  limit: string;
  advisory?: boolean;
};

const styles = stylex.create({
  card: {
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: colors.ink,
    backgroundColor: colors.surface,
    padding: "12px 14px",
  },
  label: {
    fontSize: 10.5,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: colors.inkSoft,
    marginBottom: 6,
  },
  value: {
    fontFamily: fonts.mono,
    fontSize: 24,
    fontWeight: 700,
    color: colors.ink,
    lineHeight: 1,
  },
  limitRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    display: "inline-block",
  },
  dotPass: { backgroundColor: colors.pass },
  dotWarn: { backgroundColor: colors.warn },
  dotFail: { backgroundColor: colors.fail },
  limit: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    color: colors.inkSoft,
  },
});

export function ResultCard({ label, value, ok, limit, advisory }: ResultCardProps) {
  const dotStatus = ok ? (advisory ? styles.dotWarn : styles.dotPass) : styles.dotFail;
  return (
    <div {...stylex.props(styles.card)}>
      <div {...stylex.props(styles.label)}>{label}</div>
      <div {...stylex.props(styles.value)}>{value}</div>
      <div {...stylex.props(styles.limitRow)}>
        <span {...stylex.props(styles.dot, dotStatus)} />
        <span {...stylex.props(styles.limit)}>{limit}</span>
      </div>
    </div>
  );
}
