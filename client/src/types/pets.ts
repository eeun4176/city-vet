export type RecordSource = 'Owner entered' | 'City Vet verified';
export type ActivityType = 'Walk' | 'Play' | 'Weight' | 'Vaccination' | 'Care' | 'Veterinary service' | 'Follow-up';

export interface PetActivity {
  id: string;
  petId: string;
  type: ActivityType;
  title: string;
  date: string;
  durationMinutes?: number;
  weightKg?: number;
  notes?: string;
  source: RecordSource;
}

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDue: string;
  source: RecordSource;
}

export interface PetDocument {
  id: string;
  name: string;
  category: 'Registration' | 'Vaccination' | 'Veterinary service' | 'Other';
  date: string;
  source: RecordSource;
  fileName?: string;
}

export interface VetService {
  id: string;
  name: string;
  date: string;
  source: RecordSource;
  kind: 'Spay / neuter' | 'Checkup' | 'Other';
}

export interface CareItem {
  id: string;
  title: string;
  dueDate: string;
  complete: boolean;
}

export interface PrivateHealth {
  allergies: string;
  medications: string;
  conditions: string;
  diet: string;
}

export interface PetRegistrationData {
  name: string;
  species: 'Dog' | 'Cat';
  breed: string;
  sex: string;
  birthdate: string;
  age: string;
  color: string;
  markings: string;
  weight: string;
  measurements: string;
  allergies: string;
  medications: string;
  conditions: string;
  diet: string;
  photo: string;
}

export interface PetDetails {
  birthdate: string;
  color: string;
  markings: string;
  measurements: string;
  privateHealth: PrivateHealth;
  neuterStatus: 'Not recorded' | 'Intact' | 'Spayed / neutered';
  microchip: string;
  vaccinations: Vaccination[];
  services: VetService[];
  documents: PetDocument[];
  careItems: CareItem[];
  careFlag: string;
}

export type AnalyticsPeriod = 'Today' | 'Week' | 'Month' | '3 Months' | '6 Months' | 'Year' | 'All';

export interface ServiceSuggestion {
  title: string;
  detail: string;
  section: 'profile' | 'passport' | 'care';
}
