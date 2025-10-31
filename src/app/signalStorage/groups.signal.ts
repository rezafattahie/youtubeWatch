import { signal } from '@angular/core';
import { Groups } from '../models/group.model';

export const groupsSignal = signal<{ group: Groups; subGroups: string[]; label: string }[]>([]);
