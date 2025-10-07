import { Component } from '@angular/core';
import { Icon } from '../icon/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-wordbook',
  imports: [Icon, NgClass],
  templateUrl: './wordbook.html',
  styleUrl: './wordbook.scss',
})
export class Wordbook {
showHafen = false;
}
