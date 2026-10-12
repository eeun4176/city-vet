import { useState } from 'react';
import { PageHeader } from '../components/ui/PageContent';
import { Panel } from '../components/ui/Card';

export default function SettingsPage() {
  const [reduceMotion, setReduceMotion] = useState(() => {
    try { return localStorage.getItem('cityvet-reduce-motion') === 'true'; } catch { return false; }
  });
  const [message, setMessage] = useState('');

  function updateMotion(checked: boolean) {
    setReduceMotion(checked);
    document.documentElement.dataset.reduceMotion = String(checked);
    try {
      localStorage.setItem('cityvet-reduce-motion', String(checked));
      setMessage('Preference saved on this device.');
    } catch {
      setMessage('Preference applied for this session. Device storage is unavailable.');
    }
  }

  return <><PageHeader title="Settings" description="Make your City Vet workspace feel right for you." /><Panel title="Accessibility"><label className="flex cursor-pointer items-center justify-between gap-6"><span><span className="block text-sm font-semibold text-black-500">Reduce motion</span><span className="mt-2 block text-sm leading-6 text-black-300">Turn off interface transitions. Your device’s accessibility preference is also respected.</span></span><input type="checkbox" checked={reduceMotion} onChange={event => updateMotion(event.target.checked)} className="size-5 shrink-0 accent-primary-600" /></label><p aria-live="polite" className="mt-5 min-h-5 text-sm text-primary-700">{message}</p></Panel></>;
}
