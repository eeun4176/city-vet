import { useState } from 'react';
import type { FormEvent } from 'react';
import { usePortal } from '../../hooks/usePortal';
import { emptyPetDetails } from '../../data/mockPetRecords';
import { dateKey } from '../../lib/petInsights';
import type { Pet } from '../../types/portal';
import FormField from '../ui/FormField';
import Input, { inputClasses } from '../ui/Input';
import Button from '../ui/Button';
import { PetModal } from './PetUI';

export default function PetRecordEditor({ pet, onClose, initialType = 'Weight' }: { pet: Pet; onClose: () => void; initialType?: string }) {
  const { petDetails, updatePetDetails, addActivity } = usePortal();
  const details = petDetails[pet.id] ?? emptyPetDetails();
  const [type, setType] = useState(initialType);
  const [error, setError] = useState('');
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const date = String(values.get('date'));
    const nextDue = String(values.get('nextDue') ?? '');
    if (date > dateKey() || (nextDue && nextDue < date)) { setError('Use a record date up to today and a next due date after the record date.'); return; }
    const title = String(values.get('title') ?? '').trim();
    const notes = String(values.get('notes') ?? '').trim();
    const id = crypto.randomUUID();
    if (type === 'Vaccination') updatePetDetails(pet.id, { vaccinations: [...details.vaccinations, { id, name: title, date, nextDue, source: 'Owner entered' }] });
    if (type === 'Care reminder') { updatePetDetails(pet.id, { careItems: [...details.careItems, { id, title, dueDate: nextDue, complete: false }] }); }
    addActivity({ id, petId: pet.id, type: type === 'Care reminder' ? 'Care' : type === 'Activity' ? (values.get('activityType') === 'Play' ? 'Play' : 'Walk') : type === 'Weight' ? 'Weight' : type === 'Vaccination' ? 'Vaccination' : 'Care', title: type === 'Weight' ? 'Weight recorded' : title, date, notes, source: 'Owner entered', ...(type === 'Weight' ? { weightKg: Number(values.get('weight')) } : {}), ...(type === 'Activity' ? { durationMinutes: Number(values.get('duration')) } : {}) });
    onClose();
  }
  return <PetModal title={`Add a record for ${pet.name}`} onClose={onClose}><p className="pets-muted">Owner-entered records are separate from mock City Vet-verified records.</p><form onSubmit={save} className="pets-form"><FormField label="Record type"><select className={inputClasses} value={type} onChange={event => { setType(event.target.value); setError(''); }}><option>Weight</option><option>Vaccination</option><option>Activity</option><option>Care note</option><option>Care reminder</option></select></FormField><div className="pets-form-grid"><FormField label="Recorded date"><Input type="date" name="date" defaultValue={dateKey()} max={dateKey()} required /></FormField>{type === 'Weight' && <FormField label="Weight (kg)"><Input type="number" name="weight" min="0.1" max="200" step="0.1" required /></FormField>}{type !== 'Weight' && <FormField label={type === 'Vaccination' ? 'Vaccine name' : 'Title'}><Input name="title" maxLength={120} required pattern=".*\S.*" /></FormField>}{type === 'Activity' && <><FormField label="Activity"><select className={inputClasses} name="activityType"><option>Walk</option><option>Play</option></select></FormField><FormField label="Duration (minutes)"><Input type="number" name="duration" min="1" max="1440" required /></FormField></>}{(type === 'Vaccination' || type === 'Care reminder') && <FormField label="Next due date"><Input type="date" name="nextDue" required min={type === 'Care reminder' ? dateKey() : undefined} /></FormField>}</div><FormField label="Notes (optional)"><textarea name="notes" className="pets-textarea" maxLength={500} rows={3} /></FormField>{error && <p role="alert" className="pets-error">{error}</p>}<div className="pets-button-row"><Button type="submit">Save record</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></div></form></PetModal>;
}
