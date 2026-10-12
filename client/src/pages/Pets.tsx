import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, PawPrint, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageContent';
import { Panel } from '../components/ui/Card';
import { PetCard } from '../components/ui/Card';
import FormField from '../components/ui/FormField';
import Input, { inputClasses } from '../components/ui/Input';
import Button, { primaryButtonClasses } from '../components/ui/Button';
import { usePortal } from '../hooks/usePortal';

export default function Pets() {
  const { pets, addPet } = usePortal();
  const [params, setParams] = useSearchParams();
  const [error, setError] = useState('');
  const selectedPet = pets.find(pet => pet.id === params.get('pet'));
  const registering = params.get('view') === 'register';

  function registerPet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name')).trim();
    const breed = String(data.get('breed')).trim();
    const age = String(data.get('age')).trim();
    if (!name || !breed || !age) { setError('Enter a pet name, breed, and age.'); return; }
    const id = crypto.randomUUID();
    addPet({ id, name, breed, age, species: data.get('species') === 'Cat' ? 'Cat' : 'Dog', sex: String(data.get('sex')) });
    setError('');
    setParams({ pet: id });
  }

  return <>
    <div className="flex flex-wrap items-start justify-between gap-4"><PageHeader title="My Pets" description="Your companions, their profiles, and the little details that matter." />{!registering && <Link to="/my-pets?view=register" className={primaryButtonClasses}><Plus className="size-4" aria-hidden="true" />Register pet</Link>}</div>
    {registering ? <Panel title="Register a pet">
      <p className="mb-6 text-xs leading-6 text-black-300">Try adding a pet to this preview. Profiles stay in this session and are not submitted to the City Veterinary Office.</p>
      <form onSubmit={registerPet} className="max-w-2xl space-y-5">
        <div className="grid gap-5 sm:grid-cols-2"><FormField label="Pet name"><Input name="name" required maxLength={60} autoFocus placeholder="e.g. Bailey" /></FormField><FormField label="Species"><select name="species" className={inputClasses}><option>Dog</option><option>Cat</option></select></FormField><FormField label="Breed"><Input name="breed" required maxLength={80} placeholder="e.g. Golden Retriever" /></FormField><FormField label="Age"><Input name="age" required maxLength={30} placeholder="e.g. 2 years" /></FormField><FormField label="Sex"><select name="sex" className={inputClasses}><option>Male</option><option>Female</option><option>Unknown</option></select></FormField></div>
        {error && <p role="alert" className="text-xs text-error-700">{error}</p>}
        <div className="flex flex-wrap items-center gap-4"><Button type="submit" ><PawPrint className="size-4" />Add preview pet</Button><Link to="/my-pets" className="secondary-button inline-flex items-center text-xs text-black-300 hover:text-primary-700">Cancel</Link></div>
      </form>
    </Panel> : <>
      {selectedPet && <div className="mb-6"><Panel title={`${selectedPet.name}'s profile`}><Link to="/my-pets" className="secondary-button mb-5 inline-flex items-center gap-1 text-xs text-primary-700"><ArrowLeft className="size-3" />All pets</Link><dl className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">{[['Species', selectedPet.species], ['Breed', selectedPet.breed], ['Age', selectedPet.age], ['Sex', selectedPet.sex]].map(([label, value]) => <div key={label}><dt className="text-xs text-black-300">{label}</dt><dd className="mt-2 font-medium">{value}</dd></div>)}</dl></Panel></div>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{pets.map(pet => <PetCard key={pet.id} pet={pet} />)}</div>
      <p className="mt-6 text-xs text-black-300">Preview pet profiles · New pets are kept until this page is refreshed.</p>
    </>}
  </>;
}
