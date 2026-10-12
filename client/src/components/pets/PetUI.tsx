import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Activity, ArrowUpRight, Check, FileCheck2, Wifi, WifiOff, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../ui/PageContent';
import type { PetActivity, RecordSource } from '../../types/pets';
import type { RegistrationStatus } from '../../types/portal';
import { formatPetDate } from '../../lib/petInsights';

export function PetSection({ title, children, action, className = '' }: { title: string; children: ReactNode; action?: ReactNode; className?: string }) {
  return <section className={`pets-surface ${className}`}><div className="pets-section-heading"><h2>{title}</h2>{action}</div>{children}</section>;
}

export function RegistrationBadge({ status = 'Draft' }: { status?: RegistrationStatus }) {
  return <span className={`pet-registration-badge ${status === 'Registered' ? 'is-registered' : status === 'Needs Correction' ? 'needs-correction' : ''}`}>{status === 'Registered' && <Check size={12} aria-hidden="true" />}{status}</span>;
}

export function SourceBadge({ source }: { source: RecordSource }) {
  return <span className={`pet-source ${source === 'City Vet verified' ? 'is-verified' : ''}`}>{source === 'City Vet verified' && <FileCheck2 size={12} aria-hidden="true" />}{source}{source === 'City Vet verified' && ' · mock'}</span>;
}

export function PetStat({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string | number; detail: string }) {
  return <div className="pet-stat pets-surface"><span className="pet-stat-icon"><Icon size={19} aria-hidden="true" /></span><span className="pet-stat-value">{value}</span><h3>{label}</h3><p>{detail}</p></div>;
}

export function PetFacts({ items }: { items: [string, string | undefined][] }) {
  return <dl className="pet-facts">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not recorded'}</dd></div>)}</dl>;
}

export function PetTextLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link className="pet-text-link" to={to}>{children}<ArrowUpRight size={15} aria-hidden="true" /></Link>;
}

export function ActivityTimeline({ records, empty = 'No activities recorded', compact = false, limit }: { records: PetActivity[]; empty?: string; compact?: boolean; limit?: number }) {
  if (!records.length) return <EmptyState icon={Activity} title={empty} description="Try another filter or add a record for this pet." />;
  const ordered = [...records].sort((a, b) => a.date.localeCompare(b.date)).reverse();
  return <ol className={`pet-timeline ${compact ? 'is-compact' : ''}`}>{ordered.slice(0, limit ?? ordered.length).map(record => <li key={record.id}><span className="pet-timeline-dot" /><div><div className="pet-timeline-title"><h3>{record.title}</h3><time dateTime={record.date}>{formatPetDate(record.date)}</time></div><p>{record.type}{record.durationMinutes != null && ` · ${record.durationMinutes} min`}{record.weightKg != null && ` · ${record.weightKg} kg`}</p>{record.notes && <p>{record.notes}</p>}<SourceBadge source={record.source} /></div></li>)}</ol>;
}

export function PetModal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();
  useEffect(() => { const dialog = ref.current; const previous = document.activeElement as HTMLElement | null; dialog?.showModal(); return () => { dialog?.close(); previous?.focus(); }; }, []);
  return <dialog ref={ref} className="pet-modal" aria-labelledby={heading} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose(); } }}><div className="pets-section-heading"><h2 id={heading}>{title}</h2><button className="pet-icon-button" type="button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></div>{children}</dialog>;
}

export function MockSyncState() {
  const [offline, setOffline] = useState(false);
  return <div className="pet-sync-state"><button type="button" className="pet-sync-toggle" onClick={() => setOffline(value => !value)} aria-pressed={offline} title="Toggle mock connection state">{offline ? <WifiOff size={13} /> : <Wifi size={13} />}{offline ? 'Offline' : 'Online'} <span>· mock</span></button><span>Saved Locally / Not Yet Submitted · demo</span><span>Last Synced: not connected</span>{offline && <span className="pet-cache-notice">Cached Information May Be Outdated</span>}<p>Frontend preview only. Changes stay in this session and reset on refresh.</p></div>;
}
