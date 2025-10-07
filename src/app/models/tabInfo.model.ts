import { Groups } from "./group.model";

export interface ITabInfo {
  type: Groups;
  label: string;
  hoverClass: string;
  activeClass: string;
}