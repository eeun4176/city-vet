import type { Pet, ServiceRequest } from '../types/portal';
import type { AnalyticsPeriod, PetActivity, PetDetails, ServiceSuggestion } from '../types/pets';

export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function formatPetDate(date: string) {
  return date ? new Date(`${date}T12:00:00`).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not recorded';
}

export function withinPeriod(date: string, period: AnalyticsPeriod, now = new Date()) {
  const end = dateKey(now);
  if (date > end) return false;
  if (period === 'All') return true;
  const start = new Date(now);
  if (period === 'Today') return date === end;
  if (period === 'Week') start.setDate(start.getDate() - 6);
  if (period === 'Month') start.setDate(start.getDate() - 29);
  if (period === '3 Months') start.setMonth(start.getMonth() - 3);
  if (period === '6 Months') start.setMonth(start.getMonth() - 6);
  if (period === 'Year') start.setFullYear(start.getFullYear() - 1);
  return date >= dateKey(start);
}

export function upcomingAppointments(requests: ServiceRequest[], today = dateKey()) {
  return requests.filter(request => request.status === 'Approved' && request.date >= today);
}

export function petSuggestions(pet: Pet, details: PetDetails, today = dateKey()): ServiceSuggestion[] {
  const suggestions: ServiceSuggestion[] = [];
  if (!pet.breed || !pet.age || pet.sex === 'Unknown' || !details.color || pet.registrationStatus !== 'Registered') suggestions.push({ title: 'Complete your pet profile', detail: 'Review identity details and registration verification.', section: 'profile' });
  if (!details.vaccinations.length) suggestions.push({ title: 'Missing vaccination record', detail: 'Add existing vaccination documentation to the passport.', section: 'passport' });
  const limit = new Date(`${today}T12:00:00`); limit.setDate(limit.getDate() + 30);
  // Only the latest entry for each vaccine determines its recorded next date.
  const latest = new Map<string, typeof details.vaccinations[number]>();
  for (const record of details.vaccinations) { const key = record.name.toLowerCase().trim(); if (!latest.has(key) || latest.get(key)!.date < record.date) latest.set(key, record); }
  for (const record of latest.values()) if (record.nextDue && record.nextDue <= dateKey(limit)) suggestions.push({ title: record.nextDue < today ? `${record.name} date has passed` : `${record.name} due soon`, detail: `Recorded next date: ${formatPetDate(record.nextDue)}. Confirm with City Vet.`, section: 'passport' });
  if (details.neuterStatus === 'Intact') suggestions.push({ title: 'Kapon readiness checklist', detail: 'Gather registration, records, and questions for a veterinary consultation.', section: 'care' });
  if (details.careFlag) suggestions.push({ title: 'Care record needs attention', detail: details.careFlag, section: 'care' });
  for (const item of details.careItems.filter(item => !item.complete && /follow-up/i.test(item.title))) suggestions.push({ title: 'Upcoming follow-up', detail: `${item.title} · ${formatPetDate(item.dueDate)}`, section: 'care' });
  return suggestions;
}

export function needsAttention(pet: Pet, details: PetDetails, today = dateKey()) {
  return petSuggestions(pet, details, today).some(item => item.title !== 'Kapon readiness checklist');
}

export function petAnalytics(activities: PetActivity[], details: PetDetails, petId: string, period: AnalyticsPeriod, now = new Date()) {
  const records = activities.filter(item => item.petId === petId && withinPeriod(item.date, period, now)).sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map<string, number>();
  const byType = new Map<string, number>();
  for (const record of records) {
    if (record.durationMinutes != null) {
      let bucket = record.date;
      if (period === '3 Months' || period === '6 Months') { const day = new Date(`${record.date}T12:00:00`); day.setDate(day.getDate() - (day.getDay() + 6) % 7); bucket = dateKey(day); }
      if (period === 'Year' || period === 'All') bucket = `${record.date.slice(0, 7)}-01`;
      byDate.set(bucket, (byDate.get(bucket) ?? 0) + record.durationMinutes);
      byType.set(record.type, (byType.get(record.type) ?? 0) + record.durationMinutes);
    }
  }
  const weights = records.filter(item => item.weightKg != null).map(item => ({ date: item.date, weight: item.weightKg! }));
  const futureEnd = new Date(now);
  if (period === 'Week') futureEnd.setDate(futureEnd.getDate() + 6);
  if (period === 'Month') futureEnd.setDate(futureEnd.getDate() + 29);
  if (period === '3 Months') futureEnd.setMonth(futureEnd.getMonth() + 3);
  if (period === '6 Months') futureEnd.setMonth(futureEnd.getMonth() + 6);
  if (period === 'Year') futureEnd.setFullYear(futureEnd.getFullYear() + 1);
  const careItems = details.careItems.filter(item => !item.complete && item.dueDate >= dateKey(now) && (period === 'All' || item.dueDate <= dateKey(futureEnd)));
  return {
    records, totalActivities: records.length, totalMinutes: records.reduce((sum, item) => sum + (item.durationMinutes ?? 0), 0), latestWeight: weights[weights.length - 1]?.weight,
    weights, careItems, activityTime: [...byDate].map(([date, minutes]) => ({ date, minutes })), breakdown: [...byType].map(([type, minutes]) => ({ type, minutes })),
    vaccinations: details.vaccinations.filter(item => withinPeriod(item.date, period, now)).sort((a, b) => b.date.localeCompare(a.date)),
  };
}
