import { signal, computed } from '@angular/core';
import { ILink } from '../models/link.model';

export const _videoLinks = signal<ILink[]>([])

function parseDateString(dateStr: string): Date {
  if (!dateStr) return new Date(0);

  const iso = Date.parse(dateStr);
  if (!isNaN(iso)) return new Date(iso);

  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8,
    oct: 9, nov: 10, dec: 11, Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
     Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const [mon, day, year] = dateStr.toLowerCase().split('-');
  const month = months[mon];
  const dayNum = parseInt(day, 10);
  const yearNum = parseInt(year, 10);

  return new Date(yearNum, month ?? 0, dayNum);
}

export const videoLinks = computed(() =>
  [..._videoLinks()].sort(
    (a, b) => {
      if(a.group === 'films' && b.group === 'films')  return a.title.localeCompare(b.title);
     else return parseDateString(b.sentOn).getTime() - parseDateString(a.sentOn).getTime()} 
  )
);
