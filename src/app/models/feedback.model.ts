import { IBase } from './base.model';

export interface IFeedback extends IBase {
  from: string;
  text: string;
  respond?: string;
}
