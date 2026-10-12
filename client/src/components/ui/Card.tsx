import type { ReactNode } from 'react';
import { StatusBadge } from './Badge';
import { ArrowUpRight, Cat, Check, ChevronRight, Dog, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Pet, ServiceRequest } from '../../types/portal';

export function PetPhoto({ pet, className = '' }: { pet: Pet; className?: string }) {
  const [failed, setFailed] = useState(false);
  const Icon = pet.species === 'Dog' ? Dog : Cat;
  return <div className={`relative flex items-center justify-center overflow-hidden bg-primary-100/30 ${className}`}>
    {pet.photo && !failed ? <img src={pet.photo} alt={pet.name} className="size-full object-cover" onError={() => setFailed(true)} /> : <Icon className="size-16 text-primary-400" aria-label={pet.species} />}
  </div>;
}

export function PetCard({ pet }: { pet: Pet }) {
  return <Link to={`/my-pets?pet=${pet.id}`} className="pet-card group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
    <PetPhoto pet={pet} className="pet-card-photo" />
    <div className="pet-card-nameplate">
      <div className="min-w-0 flex-1"><h3 className="truncate text-card font-semibold">{pet.name} <span className="font-normal text-primary-700">{pet.sex === 'Male' ? '♂' : pet.sex === 'Female' ? '♀' : ''}</span></h3><p className="mt-1 text-[11px] leading-4 text-black-300">{pet.breed} · {pet.age}</p></div>
      <span className="pet-card-arrow"><ChevronRight className="size-5" aria-hidden="true" /></span>
    </div>
  </Link>;
}

export function AppointmentRow({ request, pet }: { request: ServiceRequest; pet: Pet }) {
  const date = new Date(`${request.date}T12:00:00`);
  return <Link to={`/appointment?request=${request.id}`} className="appointment-row group rounded-xl focus-visible:outline-2 focus-visible:outline-primary-600">
    <div className="appointment-date"><span className="text-[10px] uppercase text-black-300">{date.toLocaleDateString('en', { month: 'short' })}</span><span className="text-xl font-semibold leading-7">{date.getDate()}</span><span className="text-[10px] text-black-300">{request.time}</span></div>
    <div className="appointment-body group-hover:shadow-sm">
      <PetPhoto pet={pet} className="size-8 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1"><div className="mb-1 flex items-center gap-1.5"><span className="text-xs text-black-300">{pet.name}</span>{request.status === 'Approved' && <Check className="size-3 text-primary-600" aria-hidden="true" />}</div><h3 className="text-sm font-medium">{request.service}</h3></div>
      <span className="appointment-location"><MapPin className="size-3 shrink-0" aria-hidden="true" />{request.location}</span>
      <div className="flex items-center gap-2"><StatusBadge status={request.status} /><ArrowUpRight className="size-4 text-black-200" aria-hidden="true" /></div>
    </div>
  </Link>;
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border border-border bg-white p-5 sm:p-7"><h2 className="mb-5 subheading-22-600 text-black-500">{title}</h2>{children}</section>;
}

