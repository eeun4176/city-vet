import { CheckCheck, Clock3, ScanSearch, XCircle } from 'lucide-react';
import type { ApplicationStatus } from '../../types/portal';

const statusColors: Record<ApplicationStatus, string> = {
  Approved: 'bg-success-100 text-success-700',
  Pending: 'bg-warning-100 text-warning-800',
  'Under review': 'bg-info-100 text-info-800',
  Declined: 'bg-error-100 text-error-700',
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const Icon = { Approved: CheckCheck, Pending: Clock3, 'Under review': ScanSearch, Declined: XCircle }[status];
  return <span className={`status-badge inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusColors[status]}`}><Icon className="size-3 shrink-0" aria-hidden="true" />{status}</span>;
}

