import { useState } from 'react';
import { Check, Plus, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';
import { usePortal } from '../../hooks/usePortal';
import type { Pet } from '../../types/portal';
import { emptyPetDetails } from '../../data/mockPetRecords';
import { dateKey, formatPetDate } from '../../lib/petInsights';
import { PetSection } from './PetUI';

export default function PetCare({ pet, onAdd }: { pet: Pet; onAdd: () => void }) {
  const { petDetails, updatePetDetails, addActivity } = usePortal();
  const details = petDetails[pet.id] ?? emptyPetDetails();
  const [checkIn, setCheckIn] = useState('');
  const [saved, setSaved] = useState('');
  const hasOperation = details.services.some(service => service.kind === 'Spay / neuter');
  function saveCheckIn() {
    addActivity({ id: crypto.randomUUID(), petId: pet.id, type: 'Care', title: 'Post-operative check-in', date: dateKey(), notes: `Owner response: ${checkIn}`, source: 'Owner entered' });
    updatePetDetails(pet.id, { careFlag: checkIn === 'Normal' ? '' : `Owner requested follow-up: ${checkIn}` });
    setSaved('Check-in recorded in this session.');
  }
  return <div className="pets-section-stack"><PetSection title="Care plan" action={<Button type="button" size="sm" onClick={onAdd}><Plus size={15} />Add reminder</Button>}><p className="pets-muted">Your recorded reminders and follow-ups.</p><div className="pet-care-list">{details.careItems.map(item => <div className={`pet-care-item ${item.complete ? 'is-complete' : ''}`} key={item.id}><button className="pet-care-check" type="button" aria-label={`${item.complete ? 'Reopen' : 'Complete'} ${item.title}`} aria-pressed={item.complete} onClick={() => { updatePetDetails(pet.id, { careItems: details.careItems.map(record => record.id === item.id ? { ...record, complete: !record.complete } : record) }); if (!item.complete) addActivity({ id: crypto.randomUUID(), petId: pet.id, type: 'Follow-up', title: `Completed: ${item.title}`, date: dateKey(), source: 'Owner entered' }); }}>{item.complete && <Check size={14} />}</button><div><h3>{item.title}</h3><p>{item.complete ? 'Completed' : `Due ${formatPetDate(item.dueDate)}`}</p></div></div>)}</div>{!details.careItems.length && <p className="pets-muted">No care items yet. Add a reminder to get started.</p>}{details.careFlag && <div className="pet-notice"><p>{details.careFlag}</p><Button type="button" variant="outline" size="sm" onClick={() => updatePetDetails(pet.id, { careFlag: '' })}>Mark flag resolved</Button></div>}</PetSection>
    {details.neuterStatus === 'Intact' && <PetSection title="Kapon readiness checklist"><ul className="pet-checklist"><li>Have your pet registration verified.</li><li>Bring vaccination and existing service records.</li><li>Prepare questions for a veterinary consultation.</li></ul><p className="pet-record-caption">A planning checklist only. A veterinarian determines medical eligibility.</p></PetSection>}
    {hasOperation && <PetSection title="Post-Operative Care"><p className="pet-care-question">How is {pet.name} doing today?</p><div role="group" aria-label="Daily recovery check-in" className="pet-checkin-options">{['Normal', 'Something seems unusual', "I'm concerned"].map(option => <button type="button" key={option} aria-pressed={checkIn === option} onClick={() => { setCheckIn(option); setSaved(''); }}>{option}</button>)}</div>{checkIn && <div className="pet-guidance-placeholder"><ShieldCheck size={20} /><div><h3>{checkIn === 'Normal' ? 'Routine recovery guidance' : checkIn === 'Something seems unusual' ? 'Follow-up guidance' : 'Veterinary contact guidance'}</h3><p>Veterinarian-approved care instructions: awaiting City Vet content.</p><p>Warning signs and when to seek veterinary attention: awaiting City Vet review.</p><p>City Vet contact: phone, office hours, and emergency contact placeholders.</p><p>This check-in records your observation only. It does not assess or diagnose your pet.</p></div></div>}<div className="pets-button-row"><Button type="button" disabled={!checkIn || !!saved} onClick={saveCheckIn}>Save check-in</Button></div><p role="status" className="pet-record-caption">{saved || 'Guidance placeholders are not medical instructions.'}</p></PetSection>}
  </div>;
}
