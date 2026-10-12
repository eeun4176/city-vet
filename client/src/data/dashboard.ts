import type { PetTask } from '../types/portal';

export const setupSteps = [
  { label: 'Create your account', complete: true, to: '/account' },
  { label: 'Register your first pet', complete: true, to: '/my-pets' },
  { label: 'Complete contact details', complete: false, to: '/account' },
  { label: 'Set your preferences', complete: false, to: '/settings' },
];

export const initialActivities: PetTask[] = [
  { id: 'records', petId: 'doggy', title: 'Review vaccination records', detail: 'Get ready for the upcoming visit', complete: false },
  { id: 'profile', petId: 'catty', title: 'Update pet profile', detail: 'Check Catty’s information', complete: false },
  { id: 'contact', petId: 'doggy', title: 'Check owner contact details', detail: 'Keep your information current', complete: true },
];

export const dailyTips = [
  { title: 'A small update. A safer pet.', description: 'If your pet is microchipped, keep the registry’s phone number and address current, especially after a move.', source: 'https://www.avma.org/microchipping-animals-faq' },
  { title: 'Keep their records together.', description: 'Store visit notes and vaccination records in one place so they are easy to find for your next appointment.' },
  { title: 'Make room for a little organization.', description: 'Add clear names and recent photos to your pet profiles to make your records easier to recognize.' },
];
