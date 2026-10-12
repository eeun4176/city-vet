import { useState } from 'react';
import { CalendarDays, Heart, House, LogOut, PawPrint, Settings, UserRound, UsersRound, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import cityVetLogo from '../../assets/cityvet-logo.png';

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  iconSize?: number;
  href?: string;
}

export const defaultNavigationItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: House, iconSize: 24, href: '/' },
  { id: 'pets', label: 'My Pets', icon: PawPrint, iconSize: 26, href: '/my-pets' },
  { id: 'appointments', label: 'Appointment', icon: CalendarDays, iconSize: 24, href: '/appointment' },
  { id: 'care', label: 'Care', icon: Heart, iconSize: 24, href: '/care' },
  { id: 'assistant', label: 'Assistant', icon: MessageCircle, iconSize: 22, href: '/assistant' },
  { id: 'community', label: 'Community', icon: UsersRound, iconSize: 26, href: '/community' },
];

export const defaultAccountItems: SidebarItem[] = [
  { id: 'account', label: 'Account', icon: UserRound, iconSize: 24, href: '/account' },
  { id: 'settings', label: 'Settings', icon: Settings, iconSize: 24, href: '/settings' },
  { id: 'logout', label: 'Logout', icon: LogOut, iconSize: 22 },
];

export interface SidebarProps {
  activeItem?: string;
  navigationItems?: SidebarItem[];
  accountItems?: SidebarItem[];
  onItemSelect?: (item: SidebarItem) => void;
  logoSrc?: string;
  officeName?: string;
  officeSubtitle?: string;
  className?: string;
}

export default function Sidebar({
  activeItem = 'home',
  navigationItems = defaultNavigationItems,
  accountItems = defaultAccountItems,
  onItemSelect,
  logoSrc = cityVetLogo,
  officeName = 'City Veterinary Office',
  officeSubtitle = 'City of San Jose del Monte',
  className = '',
}: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const labelClasses = 'sidebar-label whitespace-nowrap';
  const focusClasses = 'focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:-outline-offset-2';

  const renderItem = (item: SidebarItem) => {
    const isActive = item.id === activeItem;
    const Icon = item.icon;
    const content = <><span className="sidebar-icon"><Icon size={item.iconSize ?? 24} strokeWidth={1.65} aria-hidden="true" /></span><span className={labelClasses}>{item.label}</span></>;
    const sharedProps = {
      className: `flex h-12 w-full box-border cursor-pointer items-center gap-3 rounded-lg border-0 px-3.5 text-left text-sm no-underline transition-colors duration-160 hover:bg-primary-100/40 [@media(max-height:600px)]:h-10 motion-reduce:transition-none ${focusClasses} ${isActive ? 'bg-primary-100/40 font-medium text-primary-700' : 'bg-transparent text-inherit'}`,
      'aria-label': item.label,
      onClick: () => onItemSelect?.(item),
    };

    return (
      <li key={item.id}>
        {item.href ? (
          <Link {...sharedProps} to={item.href} aria-current={isActive ? 'page' : undefined}>{content}</Link>
        ) : (
          <button {...sharedProps} type="button" aria-current={isActive ? 'page' : undefined}>{content}</button>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`portal-sidebar group/sidebar fixed inset-y-0 left-0 z-40 flex h-dvh box-border flex-col overflow-x-hidden overflow-y-auto px-3 py-8 text-black-500 [@media(max-height:600px)]:py-4 ${className}`}
      data-expanded={expanded}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setExpanded(true); }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setExpanded(false); }}
      onFocusCapture={event => { if (event.target.matches(':focus-visible')) setExpanded(true); }}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false); }}
      aria-label="City Vet sidebar"
    >
      <button
        className={`flex min-h-11 w-[222px] shrink-0 cursor-pointer items-center gap-3 border-0 bg-transparent px-2 py-0 text-left ${focusClasses}`}
        type="button"
        onClick={() => { if (window.matchMedia('(hover: none)').matches) setExpanded(!expanded); }}
        aria-label="City Vet navigation"
        aria-expanded={expanded}
      >
        <img className="size-8 shrink-0 object-contain" src={logoSrc} alt="" />
        <span className={`flex flex-col gap-[3px] ${labelClasses}`}>
          <strong className="text-sm font-semibold text-primary-500">{officeName}</strong>
          <span className="text-[10px] text-black-300">{officeSubtitle}</span>
        </span>
      </button>

      <nav className="mt-[clamp(32px,16vh,140px)] [@media(max-height:600px)]:mt-6" aria-label="Main navigation">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">{navigationItems.map(renderItem)}</ul>
      </nav>

      <nav className="mt-auto pt-6" aria-label="Account navigation">
        <ul className="m-0 flex list-none flex-col gap-1 rounded-lg bg-white p-0">{accountItems.map(renderItem)}</ul>
      </nav>
    </aside>
  );
}
