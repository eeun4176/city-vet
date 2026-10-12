import { createContext } from 'react';
import type { Pet, ServiceRequest } from '../types/portal';
import type { PetActivity, PetDetails } from '../types/pets';

export interface PortalState {
  pets: Pet[];
  addPet: (pet: Pet) => void;
  updatePet: (pet: Pet) => void;
  requests: ServiceRequest[];
  addRequest: (request: ServiceRequest) => void;
  petDetails: Record<string, PetDetails>;
  updatePetDetails: (petId: string, update: Partial<PetDetails>) => void;
  activities: PetActivity[];
  addActivity: (activity: PetActivity) => void;
}

export const PortalContext = createContext<PortalState | null>(null);

