import { Bell, Download, PawPrint, Search, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { defaultAccountItems, defaultNavigationItems } from './Sidebar';
import { usePortal } from '../../hooks/usePortal';

const iconButton = 'portal-icon-button flex shrink-0 cursor-pointer items-center justify-center rounded-full text-primary-600 focus-visible:outline-2 focus-visible:outline-primary-600';

export default function Header() {
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState('');
  const notificationRef = useRef<HTMLDetailsElement>(null);
  const { pets, requests: serviceRequests } = usePortal();
  const normalizedQuery = query.trim().toLowerCase();
  const results = [
    ...[...defaultNavigationItems, ...defaultAccountItems].filter(item => item.href).map(item => ({ label: item.label, description: 'Page', to: item.href! })),
    ...pets.map(pet => ({ label: pet.name, description: pet.breed, to: `/my-pets?pet=${pet.id}` })),
    ...serviceRequests.map(request => ({ label: request.service, description: `${pets.find(pet => pet.id === request.petId)?.name} · ${request.status}`, to: `/appointment?request=${request.id}` })),
  ].filter(item => `${item.label} ${item.description}`.toLowerCase().includes(normalizedQuery));

  function downloadSummary() {
    const escapeCell = (value: string) => `"${value.replace(/"/g, '""').replace(/^[=+@-]/, "'")}"`;
    const rows = [
      ['City Vet preview report'],
      ['Pet', 'Breed', 'Species', 'Age'],
      ...pets.map(pet => [pet.name, pet.breed, pet.species, pet.age]),
      [],
      ['Request', 'Pet', 'Service', 'Date', 'Time', 'Application status'],
      ...serviceRequests.map(request => [request.id, pets.find(pet => pet.id === request.petId)?.name ?? '', request.service, request.date, request.time, request.status]),
    ];
    const url = URL.createObjectURL(new Blob(['\uFEFF' + rows.map(row => row.map(escapeCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'city-vet-preview-summary.csv';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloadMessage('Preview summary downloaded.');
  }

  return <header className="portal-header">
    <div className="portal-search relative min-w-0" onFocus={() => setSearchFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setSearchFocused(false); }}>
      <label className="flex h-10 items-center gap-2 rounded-xl border border-transparent bg-primary-100/35 px-3 focus-within:border-primary-400">
        <Search className="size-4 shrink-0 text-primary-700" aria-hidden="true" /><span className="sr-only">Search pages, pets, and appointments</span>
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Escape') { setQuery(''); setSearchFocused(false); } }} placeholder="Search pets, appointments..." className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-black-300" aria-controls="portal-search-results" aria-expanded={searchFocused && !!normalizedQuery} />
      </label>
      {searchFocused && normalizedQuery && <div id="portal-search-results" className="absolute top-12 z-30 max-h-80 w-full overflow-auto rounded-xl border border-border bg-white p-2 shadow-lg"><p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-black-300">Search results</p>{results.length ? results.map(item => <Link key={item.to} to={item.to} onClick={() => { setQuery(''); setSearchFocused(false); }} className="block rounded-lg px-3 py-2 text-xs hover:bg-primary-100/30 focus-visible:outline-2 focus-visible:outline-primary-600"><span className="block font-medium">{item.label}</span><span className="mt-1 block text-[10px] text-black-300">{item.description}</span></Link>) : <p className="px-3 py-4 text-xs text-black-300">No matching pages or records.</p>}</div>}
    </div>
    <div className="portal-header-actions flex flex-wrap items-center justify-end gap-2">
      <details ref={notificationRef} className="relative" onKeyDown={event => { if (event.key === 'Escape' && notificationRef.current) { notificationRef.current.open = false; notificationRef.current.querySelector('summary')?.focus(); } }}>
        <summary className={`${iconButton} relative list-none [&::-webkit-details-marker]:hidden`} aria-label="Notifications"><Bell className="size-4" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary-500" /></summary>
        <div className="absolute right-0 top-12 z-30 w-[min(300px,calc(100vw-104px))] rounded-xl border border-border bg-white p-4 shadow-lg"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold">Notifications</h2><button className="cursor-pointer rounded p-1 hover:bg-background" aria-label="Close notifications" onClick={() => { if (notificationRef.current) notificationRef.current.open = false; }}><X className="size-4" /></button></div><p className="mb-3 text-[11px] text-black-300">Sample service request updates</p>{serviceRequests.map(request => <Link key={request.id} to={`/appointment?request=${request.id}`} onClick={() => { if (notificationRef.current) notificationRef.current.open = false; }} className="block rounded-lg p-2 hover:bg-background"><p className="text-xs font-medium">{request.service}</p><p className="mt-1 text-[11px] text-black-300">Application status: {request.status}</p></Link>)}</div>
      </details>
      <button type="button" className={iconButton} aria-label="Download dashboard summary" title="Download summary" onClick={downloadSummary}><Download className="size-4" /></button>
      <Link to="/my-pets?view=register" className="primary-button inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"><PawPrint className="size-4" aria-hidden="true" /><span>Register Pet</span></Link>
    </div>
    <span className="sr-only" role="status">{downloadMessage}</span>
  </header>;
}
