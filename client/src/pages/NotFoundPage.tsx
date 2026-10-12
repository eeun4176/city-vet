import { PageHeader, PageLink } from '../components/ui/PageContent';

export default function NotFoundPage() {
  return <><PageHeader title="Page not found" description="This page doesn’t exist. Return to your dashboard to continue." /><PageLink to="/">Back to dashboard</PageLink></>;
}
