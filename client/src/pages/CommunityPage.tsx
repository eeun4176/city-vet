import { UsersRound } from 'lucide-react';
import { EmptyState, PageHeader } from '../components/ui/PageContent';
import { Panel } from '../components/ui/Card';

export default function CommunityPage() {
  return <><PageHeader title="Community" description="A space for local pet owners, community updates, and City Vet announcements." /><Panel title="Community feed"><EmptyState icon={UsersRound} title="No community updates yet" description="Community posts and announcements will appear here when available." /></Panel></>;
}
