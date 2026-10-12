import { useState } from 'react';
import type { FormEvent } from 'react';
import { CalendarPlus } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader, EmptyState } from '../components/ui/PageContent';
import { Panel } from '../components/ui/Card';
import { AppointmentRow } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import FormField from '../components/ui/FormField';
import Input, { inputClasses } from '../components/ui/Input';
import Button, { primaryButtonClasses } from '../components/ui/Button';
import { usePortal } from '../hooks/usePortal';
import type { ApplicationStatus } from '../types/portal';

export default function Appointments() {
  const { pets, requests, addRequest } = usePortal();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState<ApplicationStatus | 'All'>('All');
  const [error, setError] = useState('');
  const selected = requests.find(request => request.id === params.get('request'));
  const requesting = params.get('view') === 'request';
  const date = new Date();
  const minDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const filtered = requests.filter(request => filter === 'All' || request.status === filter);

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestedDate = String(data.get('date'));
    const petId = String(data.get('pet'));
    if (requestedDate < minDate || !pets.some(pet => pet.id === petId)) { setError('Choose a pet and a date from today onward.'); return; }
    const id = `PREVIEW-${crypto.randomUUID().slice(0, 8)}`;
    addRequest({ id, petId, service: String(data.get('service')), date: requestedDate, time: String(data.get('time')), location: 'City Veterinary Office', status: 'Pending' });
    setParams({ request: id });
    setFilter('All');
    setError('');
  }

  return <>
    <div className="flex flex-wrap items-start justify-between gap-4"><PageHeader title="Appointment" description="View your visits and track the application status of each service request." />{!requesting && <Link to="/appointment?view=request" className={primaryButtonClasses}><CalendarPlus className="size-4" />Book a service</Link>}</div>
    {requesting ? <Panel title="Request a service">
      <p className="mb-6 text-xs leading-6 text-black-300">This creates a preview request only. It is not sent to the City Veterinary Office or reserved on their calendar.</p>
      <form className="max-w-2xl space-y-5" onSubmit={submitRequest}><div className="grid gap-5 sm:grid-cols-2"><FormField label="Your pet"><select required name="pet" className={inputClasses}>{pets.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>)}</select></FormField><FormField label="Service"><select required name="service" className={inputClasses}><option>Anti-rabies vaccination</option><option>Spay / neuter consultation</option><option>Microchipping</option></select></FormField><FormField label="Preferred date"><Input name="date" type="date" required min={minDate} /></FormField><FormField label="Preferred time"><select name="time" className={inputClasses}><option>9:00 AM</option><option>9:30 AM</option><option>10:00 AM</option><option>10:30 AM</option><option>11:00 AM</option></select></FormField></div>{error && <p role="alert" className="text-xs text-error-700">{error}</p>}<div className="flex items-center gap-4"><Button  type="submit">Create preview request</Button><Link to="/appointment" className="secondary-button inline-flex items-center text-xs text-black-300">Cancel</Link></div></form>
    </Panel> : <>
      {selected && <div className="mb-6"><Panel title="Service request details"><div className="mb-5 flex flex-wrap items-center gap-3"><p className="text-xs text-black-300">{selected.id}</p><StatusBadge status={selected.status} /></div><dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[['Pet', pets.find(pet => pet.id === selected.petId)?.name], ['Service', selected.service], ['Preferred date', new Date(`${selected.date}T12:00:00`).toLocaleDateString()], ['Preferred time', selected.time]].map(([label, value]) => <div key={label}><dt className="text-xs text-black-300">{label}</dt><dd className="mt-2 text-sm font-medium">{value}</dd></div>)}</dl><p className="mt-5 text-xs leading-6 text-black-300">{selected.status === 'Approved' ? 'This sample request is approved for the displayed date and time.' : 'This request is not a confirmed appointment. The preferred date and time remain tentative.'}</p></Panel></div>}
      <Panel title="Your service requests"><div className="mb-5 flex flex-wrap gap-2">{(['All', 'Approved', 'Pending', 'Under review', 'Declined'] as const).map(status => <button key={status} onClick={() => setFilter(status)} aria-pressed={filter === status} className={`secondary-button cursor-pointer rounded-full border px-3 text-xs focus-visible:outline-2 focus-visible:outline-primary-600 ${filter === status ? 'border-primary-200 bg-primary-100/50 font-medium text-primary-700' : 'border-border text-black-300 hover:bg-background'}`}>{status}</button>)}</div><div className="space-y-3">{filtered.map(request => <AppointmentRow key={request.id} request={request} pet={pets.find(pet => pet.id === request.petId)!} />)}</div>{filtered.length === 0 && <EmptyState icon={CalendarPlus} title="No matching service requests" description="Choose another status to view your requests." />}</Panel>
      <p className="mt-6 text-xs leading-6 text-black-300">Preview service requests · New requests are kept for this session. Pending requests are not confirmed bookings.</p>
    </>}
  </>;
}
