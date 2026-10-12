import type { ServiceRequest } from '../types/portal';

function futureDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export const serviceRequests: ServiceRequest[] = [
  { id: 'CV-2026-001', petId: 'doggy', service: 'Anti-rabies vaccination', date: futureDate(3), time: '10:00 AM', location: 'City Veterinary Office', status: 'Approved' },
  { id: 'CV-2026-002', petId: 'catty', service: 'Spay / neuter consultation', date: futureDate(7), time: '9:30 AM', location: 'City Veterinary Office', status: 'Pending' },
  { id: 'CV-2026-003', petId: 'doggy', service: 'Microchipping', date: futureDate(12), time: '11:00 AM', location: 'City Veterinary Office', status: 'Under review' },
];

