import { NavLink } from 'react-router-dom';
import type { NavLinkRenderProps } from 'react-router-dom';
import { defaultNavigationItems } from './Sidebar';

export default function BottomNavigation() {
  return <nav className="bottom-navigation" aria-label="Mobile main navigation">
    {defaultNavigationItems.filter(item => item.href).map(({ id, label, href, icon: Icon }) => (
      <NavLink key={id} to={href!} end className={({ isActive }: NavLinkRenderProps) => `bottom-navigation-link${isActive ? ' is-active' : ''}`}>
        <Icon size={18} aria-hidden="true" /><span>{label}</span>
      </NavLink>
    ))}
  </nav>;
}
