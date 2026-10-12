import dogPhoto from '../assets/pets/dog.jpg';
import catPhoto from '../assets/pets/cat.jpg';
import type { Pet } from '../types/portal';

export const samplePets: Pet[] = [
  { id: 'doggy', name: 'Doggy', breed: 'Golden Retriever', species: 'Dog', age: '2 years', sex: 'Male', photo: dogPhoto },
  { id: 'catty', name: 'Catty', breed: 'Domestic Shorthair', species: 'Cat', age: '1 year', sex: 'Female', photo: catPhoto },
];

