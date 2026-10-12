import { Heart, ClipboardList } from 'lucide-react';
import { EmptyState, PageHeader, PageLink } from '../components/ui/PageContent';
import { Panel } from '../components/ui/Card';

export default function Care() {
  return <><PageHeader title="Care" description="Keep track of your pets’ care records and visit notes." /><div className="grid gap-6 xl:grid-cols-2"><Panel title="Care records"><EmptyState icon={Heart} title="No care records yet" description="Your pets’ care records will appear here when available." /></Panel><Panel title="Stay organized"><ClipboardList className="mb-4 size-8 text-primary-600" aria-hidden="true" /><p className="mb-6 text-sm leading-7 text-black-300">Find your pet profiles and appointment history using the links below.</p><div className="flex flex-wrap gap-3"><PageLink to="/my-pets">View my pets</PageLink><PageLink to="/appointment">View appointments</PageLink></div></Panel></div></>;
}
