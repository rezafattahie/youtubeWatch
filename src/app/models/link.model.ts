import { IBase } from './base.model';
import { Groups } from './group.model';

export interface ILink extends IBase {
  title: string;
  address: string;
  subtitle: string;
  sentOn:string;
  group: Groups;
}
