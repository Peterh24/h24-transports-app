import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appSmoothScroll]',
})
export class SmoothScrollDirective implements OnInit, OnChanges {
  @Input() domReady: boolean;
  private data = {
    ease: 0.1,
    curr: 0,
    prev: 0,
    rounded: 0,
  };

  private parentNodeStyles = {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  } as CSSStyleDeclaration;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    requestAnimationFrame(() => this.smoothScroll());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.domReady) {
      setTimeout(() => {
        this.initScrollStyles();
        this.setBodyHeight();
      }, 100);
    }
  }

  private initScrollStyles(): void {
    (this.document.body.style as any).overscrollBehaviorY = 'none';

    if (this.elementInitialized) {
      const appRootStyleObj: CSSStyleDeclaration = (this.el.nativeElement.parentNode as HTMLElement).style;

      // because style object is marked as read-only, we have to iterate and manually assign styles
      for (const key in this.parentNodeStyles) {
        // check wether key exists in obj
        if (Object.prototype.hasOwnProperty.call(appRootStyleObj, key)) {
          appRootStyleObj[key] = this.parentNodeStyles[key];
        }
      }
    }
  }

  private get elementInitialized(): boolean {
    return !!(this.el && this.el.nativeElement);
  }

  private setBodyHeight(): void {
    if (this.elementInitialized) {
      this.document.body.style.height = this.el.nativeElement.getBoundingClientRect().height + 'px';
    }
  }

  private smoothScroll(): void {
    if (this.elementInitialized) {
      this.data.curr = window.scrollY;
      this.data.prev += (this.data.curr - this.data.prev) * this.data.ease;
      this.data.rounded = Math.round(this.data.prev * 100) / 100;

      this.el.nativeElement.style.transform = `translate3d(0, -${this.data.rounded}px, 0)`;

      requestAnimationFrame(() => this.smoothScroll());
    }
  }
}
