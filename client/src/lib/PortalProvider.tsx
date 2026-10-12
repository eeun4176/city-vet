import { useState } from 'react';
import type { ReactNode } from 'react';
import { PortalContext } from './PortalContext';
import { samplePets } from '../data/mockPets';
import { serviceRequests } from '../data/mockAppointments';
import type { Pet, ServiceRequest } from '../types/portal';
import type { PetActivity, PetDetails } from '../types/pets';
import { emptyPetDetails, mockPetActivities, mockPetDetails } from '../data/mockPetRecords';

export default function PortalProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState(samplePets);
  const [requests, setRequests] = useState(serviceRequests);
  const [petDetails, setPetDetails] = useState(mockPetDetails);
  const [activities, setActivities] = useState(mockPetActivities);
  const addPet = (pet: Pet) => setPets(current => [...current, pet]);
  const updatePet = (pet: Pet) => setPets(current => current.map(item => item.id === pet.id ? pet : item));
  const updatePetDetails = (petId: string, update: Partial<PetDetails>) => setPetDetails(current => ({ ...current, [petId]: { ...(current[petId] ?? emptyPetDetails()), ...update } }));
  const addActivity = (activity: PetActivity) => setActivities(current => [...current, activity]);
  const addRequest = (request: ServiceRequest) => setRequests(current => [...current, request]);
  return <PortalContext.Provider value={{ pets, addPet, updatePet, requests, addRequest, petDetails, updatePetDetails, activities, addActivity }}>{children}</PortalContext.Provider>;
}
