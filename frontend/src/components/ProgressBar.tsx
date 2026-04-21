type ProgressBarProps = {
  value: number;
};

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div aria-label={`Progress ${value}%`} role="progressbar" style={{
      background: "rgba(148,163,184,0.2)",
      borderRadius: 999,
      overflow: "hidden",
      height: 14
    }}>
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: "linear-gradient(120deg, #22d3ee, #fbbf24)",
          transition: "width 0.3s ease"
        }}
      />
    </div>
  );
}
