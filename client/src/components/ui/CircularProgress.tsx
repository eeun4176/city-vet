export default function CircularProgress({ completed, total }: { completed: number; total: number }) {
  const percentage = total > 0 ? Math.round(completed / total * 100) : 0;
  return <div className="circular-progress" role="progressbar" aria-label="Account setup progress" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${completed} of ${total} steps complete`}>
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle className="circular-progress-track" cx="50" cy="50" r="43" />
      <circle className="circular-progress-value" cx="50" cy="50" r="43" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - percentage} />
    </svg>
    <span className="circular-progress-label" aria-hidden="true">{percentage}<span>%</span></span>
  </div>;
}
