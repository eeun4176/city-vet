import { useState } from 'react';
import { ArrowLeft, BarChart3, CalendarDays, FileText, HeartPulse, LockKeyhole, Pencil, Plus, Scale } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { usePortal } from '../hooks/usePortal';
import { emptyPetDetails } from '../data/mockPetRecords';
import { formatPetDate, petSuggestions, upcomingAppointments } from '../lib/petInsights';
import { PetPhoto } from '../components/ui/Card';
import Button, { primaryButtonClasses } from '../components/ui/Button';
import { ActivityTimeline, MockSyncState, PetFacts, PetSection, PetTextLink, RegistrationBadge } from '../components/pets/PetUI';
import HealthPassport from '../components/pets/HealthPassport';
import DocumentVault from '../components/pets/DocumentVault';
import PetCare from '../components/pets/PetCare';
import PetRecordEditor from '../components/pets/PetRecordEditor';

const sections = [{ id: 'profile', label: 'Profile' }, { id: 'passport', label: 'Health Passport' }, { id: 'documents', label: 'Documents' }, { id: 'timeline', label: 'Timeline' }, { id: 'care', label: 'Care Plan' }];

export default function PetProfile() {
  const { petId } = useParams();
  const { pets, petDetails, activities, requests } = usePortal();
  const [params, setParams] = useSearchParams();
  const [editorType, setEditorType] = useState('Vaccination');
  const pet = pets.find(item => item.id === petId);
  if (!pet) return <div className="pets-page"><h1 className="h1-34-500">Pet not found</h1><p className="pets-muted">Session-only profiles reset when the page is refreshed.</p><PetTextLink to="/my-pets">Back to My Pets</PetTextLink></div>;
  const details = petDetails[pet.id] ?? emptyPetDetails();
  const records = activities.filter(item => item.petId === pet.id);
  const weights = records.filter(item => item.weightKg != null).sort((a, b) => a.date.localeCompare(b.date)).reverse();
  const section = sections.some(item => item.id === params.get('section')) ? params.get('section') : 'profile';
  const suggestions = petSuggestions(pet, details);
  function openEditor(type: string) { setEditorType(type); setParams(current => { const next = new URLSearchParams(current); next.set('record', 'add'); return next; }); }
  function closeEditor() { setParams(current => { const next = new URLSearchParams(current); next.delete('record'); return next; }, { replace: true }); }
  return <div className="pets-page"><Link className="pet-back-link" to={`/my-pets?pet=${pet.id}`}><ArrowLeft size={16} />My Pets</Link><section className="pets-surface pet-profile-identity"><PetPhoto pet={pet} className="pet-profile-photo" /><div className="pet-profile-heading"><div className="pet-profile-name"><h1 className="h1-34-500">{pet.name}</h1><span className="pet-species-tag">{pet.species}</span></div><p>{pet.breed} · {pet.sex} · {pet.age}</p><RegistrationBadge status={pet.registrationStatus} /><p className="pet-record-caption">{pet.registrationNumber ? `Registration no. ${pet.registrationNumber} · sample` : 'Registration number not yet issued'}</p></div><div className="pets-button-row"><Link className={primaryButtonClasses} to={`/my-pets/${pet.id}/edit`}><Pencil size={15} />Edit Profile</Link><Link className="pet-secondary-link" to={`/my-pets/${pet.id}/analytics`}><BarChart3 size={16} />Pet Analytics</Link></div></section>
    <nav className="pet-profile-tabs" aria-label="Pet profile sections">{sections.map(item => <Link key={item.id} to={`?section=${item.id}`} aria-current={section === item.id ? 'page' : undefined}>{item.label}</Link>)}</nav>
    {params.has('saved') && <p role="status" className="pet-save-feedback">{params.get('saved') === 'draft' ? 'Draft saved in this session. Registration has not been submitted.' : params.get('saved') === 'submitted' ? 'Mock registration submitted — Pending Verification. No payment was collected or approval issued.' : 'Profile changes saved in this session.'}</p>}
    <div className="pet-profile-grid"><div className="pets-section-stack">
      {section === 'profile' && <><PetSection title="Basic & Physical Information"><PetFacts items={[[ 'Date of birth', details.birthdate ? formatPetDate(details.birthdate) : `Estimated age: ${pet.age}` ], [ 'Color', details.color ], [ 'Markings', details.markings ], [ 'Latest weight', weights[0] ? `${weights[0].weightKg} kg · ${formatPetDate(weights[0].date)}` : undefined ], [ 'Measurements (optional)', details.measurements ]]} /><div className="pets-button-row"><Button type="button" variant="outline" size="sm" onClick={() => openEditor('Weight')}><Scale size={15} />Log weight</Button><PetTextLink to={`/my-pets/${pet.id}/analytics`}>Weight history</PetTextLink></div></PetSection><PetSection title="Private Health Information"><div className="pet-private-label"><LockKeyhole size={15} />Private — Owner Only</div><p className="pets-muted">Your personal notes. These are excluded from the printable registration form and summary exports. Backend privacy enforcement will be added later.</p><PetFacts items={[[ 'Allergies', details.privateHealth.allergies ], [ 'Current medications', details.privateHealth.medications ], [ 'Medical conditions', details.privateHealth.conditions ], [ 'Dietary restrictions', details.privateHealth.diet ]]} /><PetTextLink to={`/my-pets/${pet.id}/edit`}>Edit private notes</PetTextLink></PetSection><PetSection title="Recent health & care timeline" action={<PetTextLink to="?section=timeline">View all</PetTextLink>}><ActivityTimeline records={records} compact limit={4} /></PetSection></>}
      {section === 'passport' && <HealthPassport details={details} onAdd={() => openEditor('Vaccination')} />}
      {section === 'documents' && <DocumentVault petId={pet.id} />}
      {section === 'timeline' && <PetSection title="Health & Care Timeline" action={<Button type="button" size="sm" onClick={() => openEditor('Activity')}><Plus size={15} />Log activity</Button>}><ActivityTimeline records={records} /></PetSection>}
      {section === 'care' && <PetCare key={pet.id} pet={pet} onAdd={() => openEditor('Care reminder')} />}
    </div><aside className="pets-section-stack pet-profile-aside"><PetSection title="Quick Actions"><div className="pet-quick-actions"><Link to={`/appointment?view=request&pet=${pet.id}`}><CalendarDays size={18} />Book Appointment</Link><button type="button" onClick={() => openEditor('Vaccination')}><HeartPulse size={18} />Update Health Record</button><Link to="?section=documents"><FileText size={18} />Open Document Vault</Link></div></PetSection><PetSection title="Smart Service Suggestions"><p className="pet-record-caption">Information prompts only. No health scores or medical eligibility decisions.</p><div className="pet-suggestions">{suggestions.map((suggestion, index) => <Link key={`${suggestion.title}-${index}`} to={`?section=${suggestion.section}`}><h3>{suggestion.title}</h3><p>{suggestion.detail}</p></Link>)}</div>{!suggestions.length && <p className="pets-muted">No record prompts at the moment.</p>}</PetSection><PetSection title="Upcoming visits">{upcomingAppointments(requests).filter(item => item.petId === pet.id).map(request => <Link key={request.id} className="pet-upcoming-visit" to={`/appointment?request=${request.id}`}><h3>{request.service}</h3><p>{formatPetDate(request.date)} · {request.time}</p></Link>)}{!upcomingAppointments(requests).some(item => item.petId === pet.id) && <p className="pets-muted">No approved upcoming visits.</p>}</PetSection></aside></div><MockSyncState />{params.get('record') === 'add' && <PetRecordEditor pet={pet} initialType={editorType} onClose={closeEditor} />}</div>;
}
