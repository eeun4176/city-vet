import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarPlus, Check, ChevronLeft, ChevronRight, Circle, Heart, PawPrint, Quote, Undo2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortal } from '../hooks/usePortal';
import { dailyTips, initialActivities, setupSteps } from '../data/dashboard';
import type { PetTask } from '../types/portal';
import { AppointmentRow, PetCard, PetPhoto } from '../components/ui/Card';
import CircularProgress from '../components/ui/CircularProgress';
import TaskRow from '../components/ui/TaskRow';

const actions = [
  { label: 'Book Service', description: 'A little care goes a long way', to: '/appointment?view=request', icon: CalendarPlus },
  { label: 'Register Pet', description: 'Make them part of the family', to: '/my-pets?view=register', icon: PawPrint },
  { label: 'Plan Care', description: 'Stay one step ahead', to: '/care', icon: Heart },
];
const textLink = 'dashboard-text-link';
const reducedMotion = () => document.documentElement.dataset.reduceMotion === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Home() {
  const { pets, requests: serviceRequests } = usePortal();
  const [activities, setActivities] = useState(initialActivities);
  const [activityPet, setActivityPet] = useState('all');
  const [removedTask, setRemovedTask] = useState<{ task: PetTask; index: number } | null>(null);
  const [message, setMessage] = useState('');
  const [petScroll, setPetScroll] = useState({ previous: false, next: false });
  const petRailRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const completedSteps = setupSteps.filter(step => step.complete).length;
  const completedActivities = activities.filter(activity => activity.complete).length;
  const filteredActivities = activities.filter(activity => activityPet === 'all' || activity.petId === activityPet);
  const tip = dailyTips[today.getDate() % dailyTips.length];
  const upcomingRequests = serviceRequests.filter(request => request.status !== 'Declined');

  function updatePetScroll() {
    const rail = petRailRef.current;
    if (!rail) return;
    const previous = rail.scrollLeft > 2;
    const next = rail.scrollWidth - rail.clientWidth - rail.scrollLeft > 2;
    setPetScroll(current => current.previous === previous && current.next === next ? current : { previous, next });
  }

  function scrollPets(direction: number) {
    const rail = petRailRef.current;
    if (!rail) return;
    const cardWidth = rail.firstElementChild?.getBoundingClientRect().width ?? rail.clientWidth;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    rail.scrollBy({ left: direction * (cardWidth + gap), behavior: reducedMotion() ? 'instant' : 'smooth' });
  }

  useEffect(() => {
    const rail = petRailRef.current;
    if (!rail) return;
    const observer = new ResizeObserver(updatePetScroll);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [pets.length]);

  const toggleActivity = (id: string) => setActivities(current => current.map(item => item.id === id ? { ...item, complete: !item.complete } : item));

  function editTask(task: PetTask) {
    setActivities(current => current.map(item => item.id === task.id ? task : item));
    setMessage('Task updated.');
  }

  function removeTask(task: PetTask) {
    setRemovedTask({ task, index: activities.findIndex(item => item.id === task.id) });
    setActivities(current => current.filter(item => item.id !== task.id));
    setMessage('Task removed.');
  }

  function undoRemoval() {
    if (!removedTask) return;
    setActivities(current => {
      const restored = [...current];
      restored.splice(Math.min(removedTask.index, current.length), 0, removedTask.task);
      return restored;
    });
    setRemovedTask(null);
    setMessage('Task restored.');
  }

  return <div className="dashboard-grid">
    <section className="dashboard-hero" aria-label="Your pets">
      <div className="dashboard-pet-section">
        <div className="dashboard-section-topline"><h2 className="dashboard-section-heading">Your companions <span className="dashboard-count">{pets.length.toString().padStart(2, '0')}</span></h2><Link to="/my-pets" className={textLink}>View all <ArrowRight size={13} aria-hidden="true" /></Link></div>
        <div className="dashboard-pets" ref={petRailRef} onScroll={updatePetScroll} aria-label="Your pet cards">{pets.map(pet => <PetCard key={pet.id} pet={pet} />)}</div>
        {(petScroll.previous || petScroll.next) && <div className="dashboard-pet-pages" aria-label="Pet card navigation"><span className="dashboard-pet-hint">A little more to love</span><button type="button" className="secondary-button dashboard-icon-button" disabled={!petScroll.previous} onClick={() => scrollPets(-1)} aria-label="Previous pets"><ChevronLeft size={16} /></button><button type="button" className="secondary-button dashboard-icon-button" disabled={!petScroll.next} onClick={() => scrollPets(1)} aria-label="Next pets"><ChevronRight size={16} /></button></div>}
      </div>
    </section>

    <section className="dashboard-featured" aria-labelledby="quick-actions-heading">
      <div className="dashboard-section-topline"><h2 id="quick-actions-heading" className="dashboard-section-heading">Quick Actions</h2><span className="dashboard-overline">A LITTLE EVERYDAY CARE</span></div>
      <div className="dashboard-quick-actions">{actions.map(({ label, description, to, icon: Icon }) => <Link key={label} to={to} className="dashboard-quick-action"><span className="dashboard-quick-action-icon"><Icon size={28} strokeWidth={1.5} aria-hidden="true" /></span><span className="dashboard-quick-action-label">{label}</span><span className="dashboard-quick-action-description">{description}</span></Link>)}</div>
    </section>

    <aside className="dashboard-aside" aria-label="Account progress, pet tips, and activities">
    <section aria-labelledby="setup-heading" className="dashboard-setup-panel dashboard-surface">
      <div className="dashboard-setup-header"><div><p className="dashboard-overline">YOUR NEXT CHAPTER</p><h2 id="setup-heading" className="dashboard-section-heading">Make yourself at home</h2><p className="dashboard-helper">{completedSteps} of {setupSteps.length} small steps complete.</p></div><CircularProgress completed={completedSteps} total={setupSteps.length} /></div>
      <ul className="dashboard-setup-steps">{setupSteps.map(step => <li key={step.label}><Link to={step.to}><span className={`setup-step-icon ${step.complete ? 'is-complete' : ''}`}>{step.complete ? <Check size={11} aria-label="Complete" /> : <Circle size={15} aria-label="Incomplete" />}</span><span>{step.label}</span>{!step.complete && <ChevronRight size={12} aria-hidden="true" />}</Link></li>)}</ul>
    </section>

      <section aria-labelledby="tips-heading" className="dashboard-tip">
        <div>
          <div className="dashboard-tip-heading"><span className="dashboard-tip-icon"><Quote size={18} aria-hidden="true" /></span><div><p className="dashboard-overline">A MOMENT OF WISDOM</p><h2 id="tips-heading">Daily Pet Tip</h2></div></div>
          <div className="dashboard-tip-divider" />
          <h3>{tip.title}</h3><p className="dashboard-tip-description">{tip.description}</p>
          {tip.source && <a href={tip.source} target="_blank" rel="noreferrer" className="dashboard-tip-source">Read more from the AVMA <ArrowRight size={12} aria-hidden="true" /></a>}
        </div>
      </section>
      <section aria-labelledby="activity-heading" className="dashboard-tasks dashboard-surface">
        <div className="dashboard-section-topline"><h2 id="activity-heading" className="dashboard-section-heading">Today's Activity</h2><span className="dashboard-completion">{completedActivities}/{activities.length}</span></div>
        <div className="dashboard-pet-filters" aria-label="Filter activity by pet">{[{ id: 'all', name: 'All pets' }, ...pets].map(pet => <button type="button" key={pet.id} onClick={() => setActivityPet(pet.id)} aria-pressed={activityPet === pet.id} className="secondary-button dashboard-pet-filter">{'species' in pet && <PetPhoto pet={pet} className="size-5 shrink-0 rounded-full" />}{pet.name}</button>)}</div>
        <div className="dashboard-task-list">{filteredActivities.map(task => <TaskRow key={task.id} task={task} onToggle={toggleActivity} onEdit={editTask} onRemove={removeTask} />)}{filteredActivities.length === 0 && <div className="dashboard-empty-state"><span className="dashboard-empty-check"><Check size={18} aria-hidden="true" /></span><p>All clear for today.</p><span>A little breathing room for you and your pet.</span></div>}</div>
        {removedTask && <div className="dashboard-task-feedback"><span>Task removed.</span><button type="button" className="secondary-button" onClick={undoRemoval}><Undo2 size={14} aria-hidden="true" />Undo</button></div>}
        <span role="status" className="sr-only">{message}</span>
      </section>
    </aside>
    <section aria-labelledby="appointments-heading" className="dashboard-appointments">
      <div className="dashboard-section-topline"><h2 id="appointments-heading" className="dashboard-section-heading" style={{ fontSize: '20px' }}>Upcoming Appointments</h2><Link to="/appointment" className={textLink}>View appointments <ArrowRight size={13} aria-hidden="true" /></Link></div>
      <div className="dashboard-appointment-list">{upcomingRequests.map(request => <AppointmentRow key={request.id} request={request} pet={pets.find(pet => pet.id === request.petId)!} />)}{upcomingRequests.length === 0 && <p className="dashboard-empty-state">No upcoming appointments. A little care starts with your next booking.</p>}</div>
      <p className="dashboard-appointment-note">Pending and under-review requests show your preferred date. Visits are confirmed after approval.</p>
    </section>
    <p className="dashboard-preview-note">Layout preview · Pet profiles, account progress, and service requests shown here are sample data.</p>
  </div>;
}
