import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar, { defaultAccountItems, defaultNavigationItems } from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import BottomNavigation from '../components/layout/BottomNavigation';

const accountItems = defaultAccountItems;

export default function OwnerLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const activeItem = [...defaultNavigationItems, ...accountItems].find(item => item.href === pathname)?.id ?? '';

  useEffect(() => {
    document.title = `${[...defaultNavigationItems, ...accountItems].find(item => item.id === activeItem)?.label ?? 'Page not found'} | City Vet`;
    const reduceMotion = document.documentElement.dataset.reduceMotion === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, activeItem]);

  return (
    <div className="portal-layout min-h-dvh bg-background">
      <a href="#main-content" className="sr-only z-50 rounded-lg bg-white p-3 text-primary-700 focus:not-sr-only focus:fixed focus:left-20 focus:top-3">Skip to content</a>
      <Sidebar activeItem={activeItem} accountItems={accountItems} />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="portal-main min-h-dvh outline-none">
        <div className="portal-grid"><div className="portal-content"><Header /><div key={pathname} className="portal-page-enter"><Outlet /></div></div></div>
      </main>
      <BottomNavigation />
    </div>
  );
}
