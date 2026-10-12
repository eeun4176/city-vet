import { CheckCircle2, Circle, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader, PageLink } from '../components/ui/PageContent';
import { Panel } from '../components/ui/Card';
import { setupSteps } from '../data/dashboard';

export default function AccountPage() {
  return <>
    <PageHeader title="Account" description="Your pet owner profile, contact details, and account setup." />
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Panel title="Owner profile">
        <div className="mb-7 flex items-center gap-4"><span className="flex size-16 items-center justify-center rounded-2xl bg-primary-100/50 text-primary-700"><UserRound className="size-7" aria-hidden="true" /></span><div><h3 className="text-lg font-semibold">Juan</h3><p className="mt-1 text-xs text-black-300">Pet owner · Preview account</p></div></div>
        <dl className="space-y-5 text-sm"><div className="flex flex-wrap justify-between gap-2 border-b border-border pb-4"><dt className="text-black-300">Portal</dt><dd className="font-medium">City Veterinary Office</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-border pb-4"><dt className="text-black-300">Contact details</dt><dd className="text-warning-800">Not completed</dd></div><div className="flex flex-wrap justify-between gap-2"><dt className="text-black-300">City</dt><dd>San Jose del Monte</dd></div></dl>
        <p className="mt-7 rounded-lg bg-background p-3 text-xs leading-6 text-black-300">This is a sample owner profile for the layout preview.</p>
      </Panel>
      <div className="space-y-6"><Panel title="Complete your account"><p className="mb-5 text-xs text-black-300">2 of 4 setup steps complete in this preview.</p><ul className="space-y-4">{setupSteps.map(step => <li key={step.label}><Link to={step.to} className="flex items-center gap-3 rounded text-sm hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-primary-600">{step.complete ? <CheckCircle2 className="size-4 text-primary-600" aria-label="Complete" /> : <Circle className="size-4 text-black-200" aria-label="Incomplete" />}{step.label}</Link></li>)}</ul></Panel><Panel title="Your preferences"><p className="mb-5 text-sm leading-6 text-black-300">Personalize your workspace and accessibility options.</p><PageLink to="/settings">Open settings</PageLink></Panel></div>
    </div>
  </>;
}
