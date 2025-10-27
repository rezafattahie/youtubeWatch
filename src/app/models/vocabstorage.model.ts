import { ILink } from './link.model';
import { IWord } from './word.model';

export interface IVocab {
  owner: string;
  linkId: string;
  words: IWord[];
}
