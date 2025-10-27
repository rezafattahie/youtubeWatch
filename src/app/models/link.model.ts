import { IBase } from './base.model';
import { Groups } from './group.model';

export interface ILink extends IBase {
  title: string;
  youtubeId: string;
  sentOn: string;
  group: Groups;
  subGroup?: string;
  viewer: string;
  subtitle: { subtitle: string; start: number }[];
}

export interface ILink_request {
  title?: string;
  youtubeId?: string;
  sentOn?: string;
  group?: Groups;
  subGroup?: string;
  viewer?: string;
  subtitle?: { subtitle: string; start: number }[];
}
