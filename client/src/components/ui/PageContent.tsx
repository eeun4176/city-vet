import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="mb-8">
      <p className="mb-3 caption-12-700 text-primary-600">City Veterinary Office</p>
      <h1 className="h1-34-500 text-black-500">{title}</h1>
      <p className="mt-3 max-w-2xl small-body-15-400 text-black-300">{description}</p>
    </header>
  );
}

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-background px-5 py-12 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-100/40 text-primary-600"><Icon className="size-6" aria-hidden="true" /></span>
      <h3 className="font-semibold text-black-500">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-black-300">{description}</p>
    </div>
  );
}

export function PageLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={to} className="primary-button inline-flex items-center rounded-lg bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600">{children}</Link>;
}
