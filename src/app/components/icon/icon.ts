import { Component, computed, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SVG_CONSTANT } from '../../constants/svg.constant';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-icon',
  imports: [NgClass],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  name = input<string>('');
  class = input<string>(''); // tailwind classes

  constructor(private sanitizer: DomSanitizer) {}

  sanitizedSvg = computed<SafeHtml>(() => {
    const raw = SVG_CONSTANT[this.name()] ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  });

  customClass = computed(() => this.class());
}
