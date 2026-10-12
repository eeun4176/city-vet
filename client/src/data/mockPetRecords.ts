import type { PetActivity, PetDetails } from '../types/pets';

// Relative dates keep this mock preview useful whenever it is opened.
export function mockDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function emptyPetDetails(): PetDetails {
  return { birthdate: '', color: '', markings: '', measurements: '', privateHealth: { allergies: '', medications: '', conditions: '', diet: '' }, neuterStatus: 'Not recorded', microchip: '', vaccinations: [], services: [], documents: [], careItems: [], careFlag: '' };
}

export const mockPetDetails: Record<string, PetDetails> = {
  doggy: {
    ...emptyPetDetails(), birthdate: mockDate(-730), color: 'Golden', markings: 'Cream chest and paws', measurements: 'Shoulder height: 54 cm', neuterStatus: 'Spayed / neutered', microchip: '',
    privateHealth: { allergies: 'Chicken (owner reported)', medications: 'None recorded', conditions: 'None recorded', diet: 'Chicken-free meals (owner preference)' },
    vaccinations: [{ id: 'dog-rabies', name: 'Anti-rabies', date: mockDate(-340), nextDue: mockDate(25), source: 'City Vet verified' }, { id: 'dog-combo', name: 'Canine combination vaccine', date: mockDate(-180), nextDue: mockDate(185), source: 'Owner entered' }],
    services: [{ id: 'dog-neuter', name: 'Neuter service', date: mockDate(-8), source: 'City Vet verified', kind: 'Spay / neuter' }, { id: 'dog-checkup', name: 'Routine veterinary visit', date: mockDate(-40), source: 'City Vet verified', kind: 'Checkup' }],
    documents: [{ id: 'dog-registration', name: 'Pet registration record', category: 'Registration', date: mockDate(-365), source: 'City Vet verified' }, { id: 'dog-certificate', name: 'Anti-rabies certificate', category: 'Vaccination', date: mockDate(-340), source: 'City Vet verified' }, { id: 'dog-service-document', name: 'Neuter service record', category: 'Veterinary service', date: mockDate(-8), source: 'City Vet verified' }],
    careItems: [{ id: 'dog-followup', title: 'Post-operative follow-up', dueDate: mockDate(2), complete: false }, { id: 'dog-vaccine-care', title: 'Review vaccination due date', dueDate: mockDate(25), complete: false }],
  },
  catty: {
    ...emptyPetDetails(), birthdate: mockDate(-365), color: 'Orange and white', markings: 'White paws', neuterStatus: 'Intact', careFlag: 'Missing vaccination documentation',
    documents: [{ id: 'cat-draft', name: 'Registration information draft', category: 'Registration', date: mockDate(-3), source: 'Owner entered' }],
    careItems: [{ id: 'cat-record', title: 'Add a vaccination record', dueDate: mockDate(1), complete: false }, { id: 'cat-profile', title: 'Bring registration documents for verification', dueDate: mockDate(7), complete: false }],
  },
};

export const mockPetActivities: PetActivity[] = [
  ...[0, -1, -2, -4, -6, -10, -18, -28, -45, -75, -120, -210].map((offset, i): PetActivity => ({ id: `dog-walk-${i}`, petId: 'doggy', type: 'Walk', title: 'Evening walk', date: mockDate(offset), durationMinutes: [25, 20, 30, 15][i % 4], source: 'Owner entered' })),
  ...[0, -3, -8, -15, -35].map((offset, i): PetActivity => ({ id: `cat-play-${i}`, petId: 'catty', type: 'Play', title: 'Indoor play session', date: mockDate(offset), durationMinutes: 10 + i * 5, source: 'Owner entered' })),
  ...[-180, -90, -30, -7, 0].map((offset, i): PetActivity => ({ id: `dog-weight-${i}`, petId: 'doggy', type: 'Weight', title: 'Weight recorded', date: mockDate(offset), weightKg: [25.2, 26.1, 26.8, 27, 27.2][i], source: 'Owner entered' })),
  ...[-60, -14].map((offset, i): PetActivity => ({ id: `cat-weight-${i}`, petId: 'catty', type: 'Weight', title: 'Weight recorded', date: mockDate(offset), weightKg: [3.5, 3.7][i], source: 'Owner entered' })),
  { id: 'dog-care', petId: 'doggy', type: 'Care', title: 'Recovery care note', date: mockDate(-1), notes: 'Owner recorded a daily check-in.', source: 'Owner entered' },
  ...Object.entries(mockPetDetails).flatMap(([petId, details]) => [
    ...details.vaccinations.map((record): PetActivity => ({ id: `activity-${record.id}`, petId, type: 'Vaccination', title: record.name, date: record.date, source: record.source })),
    ...details.services.map((record): PetActivity => ({ id: `activity-${record.id}`, petId, type: 'Veterinary service', title: record.name, date: record.date, source: record.source })),
  ]),
];
