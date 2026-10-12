import { useState } from 'react';
import type { ReactNode } from 'react';
import { PortalContext } from './PortalContext';
import { samplePets } from '../data/mockPets';
import { serviceRequests } from '../data/mockAppointments';
import type { Pet, ServiceRequest } from '../types/portal';

export default function PortalProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState(samplePets);
  const [requests, setRequests] = useState(serviceRequests);
  const addPet = (pet: Pet) => setPets(current => [...current, pet]);
  const addRequest = (request: ServiceRequest) => setRequests(current => [...current, request]);
  return <PortalContext.Provider value={{ pets, addPet, requests, addRequest }}>{children}</PortalContext.Provider>;
}
