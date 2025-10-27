import { IBase } from './base.model';

export interface IUser extends IBase {
  name: string;
  email?: string;
}
