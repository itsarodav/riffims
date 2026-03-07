import { Component, Input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

export type IconSize = 10 | 12 | 14 | 16 | 24 | 32 | 40 | 48;

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [
    AngularSvgIconModule,
  ],
  template:  `
    <svg-icon
      [src]="'assets/icons/' + name + '.svg'"
      [style.width.px]="size"
      [style.height.px]="size"
    ></svg-icon>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    svg-icon ::ng-deep svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `],
})

export class IconComponent {
  @Input() name: string = '';
  @Input() size: IconSize = 24;
}
