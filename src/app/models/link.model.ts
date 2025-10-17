import { IBase } from './base.model';
import { Groups } from './group.model';

export interface ILink extends IBase {
  title: string;
  youtubeId: string;
  sentOn: string;
  group: Groups;
  subGroup?: string;
  subtitle: { subtitle: string; start: number }[];
}
