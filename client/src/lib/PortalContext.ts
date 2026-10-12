import { createContext } from 'react';
import type { Pet, ServiceRequest } from '../types/portal';

export const PortalContext = createContext<{ pets: Pet[]; addPet: (pet: Pet) => void; requests: ServiceRequest[]; addRequest: (request: ServiceRequest) => void } | null>(null);

