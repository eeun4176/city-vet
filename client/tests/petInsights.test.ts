import assert from 'node:assert/strict';
import test from 'node:test';
import { emptyPetDetails } from '../src/data/mockPetRecords.ts';
import { needsAttention, petAnalytics, petSuggestions, upcomingAppointments, withinPeriod } from '../src/lib/petInsights.ts';
import type { PetActivity } from '../src/types/pets.ts';
import type { Pet, ServiceRequest } from '../src/types/portal.ts';

const now = new Date('2026-10-13T12:00:00');
const pet: Pet = { id: 'one', name: 'Bailey', species: 'Dog', breed: 'Mixed', age: '2 years', sex: 'Male', registrationStatus: 'Registered' };
const activity = (id: string, date: string, durationMinutes?: number, weightKg?: number): PetActivity => ({ id, petId: 'one', date, type: weightKg ? 'Weight' : 'Walk', title: id, source: 'Owner entered', durationMinutes, weightKg });

test('period boundaries include local today and exclude future records', () => {
  assert.equal(withinPeriod('2026-10-13', 'Today', now), true);
  assert.equal(withinPeriod('2026-10-12', 'Today', now), false);
  assert.equal(withinPeriod('2026-10-07', 'Week', now), true);
  assert.equal(withinPeriod('2026-10-06', 'Week', now), false);
  assert.equal(withinPeriod('2026-09-14', 'Month', now), true);
  assert.equal(withinPeriod('2026-09-13', 'Month', now), false);
  assert.equal(withinPeriod('2026-10-14', 'All', now), false);
});

test('totals, chart buckets, weight and care use the same selected pet and period', () => {
  const details = emptyPetDetails();
  details.careItems = [{ id: 'due', title: 'Due', dueDate: '2026-10-15', complete: false }, { id: 'later', title: 'Later', dueDate: '2026-11-01', complete: false }, { id: 'done', title: 'Done', dueDate: '2026-10-15', complete: true }, { id: 'old', title: 'Old', dueDate: '2026-10-01', complete: false }];
  const records = [activity('a', '2026-10-13', 25), activity('b', '2026-10-13', 15), activity('c', '2026-10-07', 10), activity('old', '2026-10-06', 90), activity('weight', '2026-10-12', undefined, 12.5), { ...activity('other', '2026-10-13', 100), petId: 'two' }];
  const result = petAnalytics(records, details, 'one', 'Week', now);
  assert.equal(result.totalActivities, 4);
  assert.equal(result.totalMinutes, 50);
  assert.equal(result.latestWeight, 12.5);
  assert.equal(result.activityTime.reduce((sum, bucket) => sum + bucket.minutes, 0), result.totalMinutes);
  assert.equal(result.breakdown.reduce((sum, bucket) => sum + bucket.minutes, 0), result.totalMinutes);
  assert.deepEqual(result.careItems.map(item => item.id), ['due']);
  assert.equal(petAnalytics(records, details, 'one', 'Today', now).latestWeight, undefined);
});

test('long periods group durations without changing totals and empty pets stay empty', () => {
  const details = emptyPetDetails();
  const records = [activity('a', '2026-10-13', 20), activity('b', '2026-10-01', 15), activity('c', '2026-09-30', 10)];
  const result = petAnalytics(records, details, 'one', 'All', now);
  assert.deepEqual(result.activityTime, [{ date: '2026-09-01', minutes: 10 }, { date: '2026-10-01', minutes: 35 }]);
  const empty = petAnalytics(records, details, 'new', 'All', now);
  assert.equal(empty.totalActivities, 0); assert.equal(empty.totalMinutes, 0); assert.equal(empty.latestWeight, undefined); assert.deepEqual(empty.weights, []);
});

test('newer same-day weight entries win regardless of random record IDs', () => {
  const result = petAnalytics([activity('zz-old', '2026-10-13', undefined, 12.5), activity('aa-new', '2026-10-13', undefined, 12.8)], emptyPetDetails(), 'one', 'Today', now);
  assert.equal(result.latestWeight, 12.8);
});

test('only the latest vaccination entry controls record attention', () => {
  const details = { ...emptyPetDetails(), color: 'Golden' };
  details.vaccinations = [{ id: 'old', name: 'Rabies', date: '2025-01-01', nextDue: '2026-01-01', source: 'Owner entered' }, { id: 'new', name: 'Rabies', date: '2026-08-01', nextDue: '2027-08-01', source: 'Owner entered' }];
  assert.equal(needsAttention(pet, details, '2026-10-13'), false);
  details.vaccinations[1].nextDue = '2026-10-10';
  assert.equal(needsAttention(pet, details, '2026-10-13'), true);
  assert.equal(petSuggestions(pet, details, '2026-10-13').filter(item => item.title.includes('date has passed')).length, 1);
});

test('upcoming appointments count approved future visits, not pending requests', () => {
  const request = (id: string, status: ServiceRequest['status'], date: string): ServiceRequest => ({ id, status, date, petId: 'one', service: 'Visit', time: '9:00 AM', location: 'City Vet' });
  assert.deepEqual(upcomingAppointments([request('approved', 'Approved', '2026-10-13'), request('past', 'Approved', '2026-10-12'), request('pending', 'Pending', '2026-10-14'), request('review', 'Under review', '2026-10-14')], '2026-10-13').map(item => item.id), ['approved']);
});
