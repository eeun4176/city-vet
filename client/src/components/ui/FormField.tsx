import type { ReactNode } from 'react';

export default function FormField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-xs font-medium text-black-400">{label}{children}</label>;
}
