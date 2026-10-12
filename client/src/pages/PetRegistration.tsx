import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, ImagePlus, Printer, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePortal } from '../hooks/usePortal';
import type { Pet } from '../types/portal';
import type { PetRegistrationData } from '../types/pets';
import { emptyPetDetails } from '../data/mockPetRecords';
import { dateKey, formatPetDate } from '../lib/petInsights';
import { PageHeader } from '../components/ui/PageContent';
import { PetPhoto } from '../components/ui/Card';
import Input, { inputClasses } from '../components/ui/Input';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';
import { MockSyncState, PetFacts, PetSection, RegistrationBadge } from '../components/pets/PetUI';

export default function PetRegistration() {
  const { petId } = useParams();
  const { pets } = usePortal();
  const pet = pets.find(item => item.id === petId);
  if (petId && !pet) return <><PageHeader title="Pet not found" description="Session-only profiles reset on refresh." /><Link to="/my-pets">Back to My Pets</Link></>;
  return <RegistrationForm key={petId ?? 'new'} pet={pet} />;
}

function RegistrationForm({ pet }: { pet?: Pet }) {
  const { petDetails, activities, addPet, updatePet, updatePetDetails, addActivity } = usePortal();
  const existing = pet ? petDetails[pet.id] ?? emptyPetDetails() : emptyPetDetails();
  const latestWeight = activities.filter(record => record.petId === pet?.id && record.weightKg != null).sort((a, b) => b.date.localeCompare(a.date))[0]?.weightKg;
  const navigate = useNavigate();
  const [values, setValues] = useState<PetRegistrationData>({ name: pet?.name ?? '', species: pet?.species ?? 'Dog', breed: pet?.breed ?? '', sex: pet?.sex ?? 'Unknown', birthdate: existing.birthdate, age: pet?.age ?? '', color: existing.color, markings: existing.markings, weight: latestWeight?.toString() ?? '', measurements: existing.measurements, allergies: existing.privateHealth.allergies, medications: existing.privateHealth.medications, conditions: existing.privateHealth.conditions, diet: existing.privateHealth.diet, photo: pet?.photo ?? '' });
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState('');
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const change = (name: keyof typeof values, value: string) => setValues(current => ({ ...current, [name]: value }));
  function estimatedAge() {
    if (!values.birthdate) return values.age.trim();
    const birthdate = new Date(`${values.birthdate}T12:00:00`); const today = new Date();
    const months = Math.max(0, (today.getFullYear() - birthdate.getFullYear()) * 12 + today.getMonth() - birthdate.getMonth() - (today.getDate() < birthdate.getDate() ? 1 : 0));
    return months >= 12 ? `${Math.floor(months / 12)} year${months >= 24 ? 's' : ''}${months % 12 ? `, ${months % 12} months` : ''}` : `${months} month${months === 1 ? '' : 's'}`;
  }
  const preview: Pet = { id: pet?.id ?? 'preview', name: values.name.trim() || 'Unnamed pet', breed: values.breed.trim(), species: values.species === 'Cat' ? 'Cat' : 'Dog', sex: values.sex, age: estimatedAge(), photo: values.photo, registrationStatus: pet?.registrationStatus ?? 'Draft', registrationNumber: pet?.registrationNumber };
  function save(draft: boolean) {
    const id = pet?.id ?? crypto.randomUUID();
    const next: Pet = { ...preview, id, registrationStatus: pet?.registrationStatus === 'Registered' ? 'Registered' : draft ? 'Draft' : 'Pending Verification' };
    if (pet) updatePet(next); else addPet(next);
    updatePetDetails(id, { ...existing, birthdate: values.birthdate, color: values.color.trim(), markings: values.markings.trim(), measurements: values.measurements.trim(), privateHealth: { allergies: values.allergies.trim(), medications: values.medications.trim(), conditions: values.conditions.trim(), diet: values.diet.trim() } });
    const weight = Number(values.weight);
    if (weight > 0 && weight <= 200 && weight !== latestWeight) addActivity({ id: crypto.randomUUID(), petId: id, type: 'Weight', title: 'Weight recorded', date: dateKey(), weightKg: weight, source: 'Owner entered' });
    navigate(`/my-pets/${id}?saved=${draft ? 'draft' : pet?.registrationStatus === 'Registered' ? 'profile' : 'submitted'}`);
  }
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const intent = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value');
    if (intent === 'draft') { save(true); return; }
    if (!values.name.trim() || !values.breed.trim() || !values.color.trim() || (!values.birthdate && !values.age.trim())) { setError('Add a name, breed, color, and either a birthdate or an estimated age.'); return; }
    if (values.birthdate > dateKey()) { setError('Birthdate cannot be in the future.'); return; }
    setError(''); setReviewing(true);
  }
  function selectPhoto(file?: File) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('Choose a JPG, PNG, or WebP photo up to 5 MB.'); return; }
    setError(''); setLoadingPhoto(true);
    const reader = new FileReader(); reader.onload = () => { change('photo', String(reader.result)); setLoadingPhoto(false); }; reader.onerror = () => { setError('The photo could not be read. Please try another file.'); setLoadingPhoto(false); }; reader.readAsDataURL(file);
  }
  const textField = (key: keyof typeof values, label: string, required = false, placeholder = '') => <FormField key={key} label={label}><Input value={values[key]} onChange={event => change(key, event.target.value)} required={required} maxLength={key === 'name' ? 60 : 200} placeholder={placeholder} /></FormField>;
  return <div className="pets-page pet-registration-page"><Link className="pet-back-link" to={pet ? `/my-pets/${pet.id}` : '/my-pets'}><ArrowLeft size={16} />{pet ? 'Back to profile' : 'My Pets'}</Link><PageHeader title={pet ? 'Edit Pet Profile' : 'Add New Pet'} description="A few details to make your companion feel at home." /><div className="pet-registration-notice"><p><strong>₱100 pet registration fee</strong> — paid face-to-face at the barangay or through an authorized Paravet.</p><p>Registration must be verified before service pre-listing is permitted. This preview does not collect payment or grant official approval.</p></div>
    {reviewing ? <PetSection title="Review Information"><div className="pet-print-sheet"><h3>City Vet · Pet Registration Form</h3><p>Preview only — not an official registration or approval</p><PetFacts items={[[ 'Pet name', preview.name ], [ 'Species', preview.species ], [ 'Breed', preview.breed ], [ 'Sex', preview.sex ], [ 'Birthdate', values.birthdate ? formatPetDate(values.birthdate) : 'Estimated age provided' ], [ 'Age', preview.age ], [ 'Color', values.color ], [ 'Markings', values.markings ], [ 'Weight', values.weight ? `${values.weight} kg` : undefined ], [ 'Measurements', values.measurements ], [ 'Registration status', preview.registrationStatus ], [ 'Registration number', preview.registrationNumber ]]} /><p>Fee: ₱100, paid face-to-face at the barangay or through an authorized Paravet. Verification is required before service pre-listing.</p></div><div className="pet-private-review"><h3>Private — Owner Only</h3><PetFacts items={[[ 'Allergies', values.allergies ], [ 'Medications', values.medications ], [ 'Medical conditions', values.conditions ], [ 'Dietary restrictions', values.diet ]]} /><p className="pet-record-caption">Private health notes are omitted from the printable form.</p></div><div className="pets-button-row pet-no-print"><Button type="button" onClick={() => save(false)}>{pet?.registrationStatus === 'Registered' ? 'Save Profile Changes' : 'Submit Registration (mock)'}</Button><Button type="button" variant="outline" onClick={() => window.print()}><Printer size={16} />Printable Registration Form</Button><Button type="button" variant="outline" onClick={() => setReviewing(false)}>Back to edit</Button></div></PetSection> : <form onSubmit={review} className="pets-section-stack"><PetSection title="1. Pet identity"><div className="pet-form-photo-row"><PetPhoto pet={preview} className="pet-form-photo" /><FormField label="Pet photo (optional)"><input type="file" className="pets-file-input" accept="image/jpeg,image/png,image/webp" onChange={event => selectPhoto(event.target.files?.[0])} /><span className="pet-record-caption"><ImagePlus size={13} />JPG, PNG, or WebP · up to 5 MB · session preview</span></FormField></div><div className="pets-form-grid">{textField('name', 'Pet name', true, 'e.g. Bailey')}<FormField label="Species"><select className={inputClasses} value={values.species} onChange={event => change('species', event.target.value)}><option>Dog</option><option>Cat</option></select></FormField>{textField('breed', 'Breed', true, 'e.g. Mixed breed')}<FormField label="Sex"><select className={inputClasses} value={values.sex} onChange={event => change('sex', event.target.value)}><option>Unknown</option><option>Male</option><option>Female</option></select></FormField><FormField label="Birthdate (if known)"><Input type="date" value={values.birthdate} onChange={event => change('birthdate', event.target.value)} max={dateKey()} /></FormField>{textField('age', 'Estimated age (if birthdate unknown)', !values.birthdate, 'e.g. 2 years')}</div></PetSection><PetSection title="2. Physical information"><div className="pets-form-grid">{textField('color', 'Color', true, 'e.g. Golden')}{textField('markings', 'Markings (optional)', false, 'e.g. White paws')}<FormField label="Weight in kg (optional)"><Input type="number" min="0.1" max="200" step="0.1" value={values.weight} onChange={event => change('weight', event.target.value)} /></FormField>{textField('measurements', 'Body measurements (optional)')}</div></PetSection><PetSection title="3. Private health information"><div className="pet-private-label">Private — Owner Only</div><p className="pets-muted">Optional owner notes, excluded from staff-facing registration printouts.</p><div className="pets-form-grid">{textField('allergies', 'Allergies (optional)')}{textField('medications', 'Current medications (optional)')}{textField('conditions', 'Medical conditions (optional)')}{textField('diet', 'Dietary restrictions (optional)')}</div></PetSection><PetSection title="Registration Status"><RegistrationBadge status={pet?.registrationStatus} />{pet?.registrationStatus === 'Needs Correction' && <p className="pets-muted">Mock correction request: review the registration details and supporting documents before resubmitting.</p>}<p className="pet-record-caption">Saving a draft does not submit it. Mock submission sets Pending Verification; approval requires the future staff verification process.</p>{error && <p className="pets-error" role="alert">{error}</p>}<div className="pets-button-row"><Button type="submit" disabled={loadingPhoto}>Review Information</Button><Button type="submit" value="draft" name="intent" formNoValidate variant="outline" disabled={loadingPhoto}><Save size={15} />Save Draft</Button><Link className="pet-secondary-link" to={pet ? `/my-pets/${pet.id}` : '/my-pets'}>Cancel</Link></div></PetSection></form>}<MockSyncState /></div>;
}
