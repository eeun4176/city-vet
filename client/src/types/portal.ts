export interface Pet {
  id: string;
  name: string;
  breed: string;
  species: 'Dog' | 'Cat';
  age: string;
  sex: string;
  photo?: string;
}

export type ApplicationStatus = 'Approved' | 'Pending' | 'Under review' | 'Declined';

export interface ServiceRequest {
  id: string;
  petId: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: ApplicationStatus;
}

export interface PetTask {
  id: string;
  petId: string;
  title: string;
  detail: string;
  complete: boolean;
}

