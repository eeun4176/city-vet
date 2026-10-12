import { CalendarDays, PawPrint, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageContent';
import { Panel } from '../components/ui/Card';

const shortcuts = [
  { title: 'Manage your pets', description: 'Register a pet or review their profile.', to: '/my-pets', icon: PawPrint },
  { title: 'Book a service', description: 'Request an appointment and track its status.', to: '/appointment', icon: CalendarDays },
  { title: 'Review pet care', description: 'Find your care and health records.', to: '/care', icon: Heart },
];

export default function Assistant() {
  return <>
    <PageHeader title="Assistant" description="Find the next step for your pets and appointments." />
    <Panel title="How can we help?">
      <div className="grid gap-4 sm:grid-cols-3">
        {shortcuts.map(({ title, description, to, icon: Icon }) => (
          <Link key={to} to={to} className="rounded-xl border border-border p-5 hover:bg-primary-100/30 focus-visible:outline-2 focus-visible:outline-primary-600">
            <Icon className="mb-3 size-6 text-primary-600" aria-hidden="true" />
            <h2 className="text-sm font-semibold">{title}</h2>
            <p className="mt-2 text-xs leading-6 text-black-300">{description}</p>
          </Link>
        ))}
      </div>
    </Panel>
  </>;
}
