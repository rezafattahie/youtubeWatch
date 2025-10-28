import { Component, computed, ElementRef, input, OnDestroy, signal } from '@angular/core';
import { Overlay, OverlayRef, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SVG_CONSTANT } from '../../constants/svg.constant';
import { NgClass } from '@angular/common';
import { Tooltip } from '../tooltip/tooltip';

@Component({
  selector: 'app-icon',
  imports: [NgClass],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon implements OnDestroy {
  private overlayRef?: OverlayRef; // for show tooltio
  name = input<string>('');
  class = input<string>(''); // tailwind classes
  customClass = computed(() => this.class());
  title = input<string>();

  constructor(
    private sanitizer: DomSanitizer,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef
  ) {}

  sanitizedSvg = computed<SafeHtml>(() => {
    const raw = SVG_CONSTANT[this.name()] ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  });

  showTooltip() {
    if (this.overlayRef) return; // prevent to open tooltip several times

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8,
        },
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 8,
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'tooltip-panel',
    });

    const tooltipPortal = new ComponentPortal(Tooltip);
    const tooltipRef = this.overlayRef.attach(tooltipPortal);
    tooltipRef.instance.text = this.title;
  }

  hideTooltip() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  ngOnDestroy() {
    this.hideTooltip();
  }
}
