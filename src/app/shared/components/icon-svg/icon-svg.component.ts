import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { IconSize } from '../../../core/type/icon-size';
import { IconName } from '../../../core/type/icon-name';
import { IconColor } from '../../../core/type/icon-color';

@Component({
  selector: 'icon-svg',
  templateUrl: './icon-svg.component.html',
  styleUrl: './icon-svg.component.scss'
})
export class IconSvgComponent implements OnInit{
  @HostBinding('style.-webkit-mask-image') private _path!: string;
  @HostBinding('style.width') private _width!: string;
  @HostBinding('style.height') private _height!: string;
  @HostBinding('style.display') private _display!: string;

  @Input() public path!: IconName | string;;
  @Input() public size: IconSize = '3x';
  @Input() public color: IconColor = 'white';


  ngOnInit(): void {
    if (this.path) {
      this._path = `url("assets/icons/${this.path}.svg")`;
      this._display = 'inline-block';
    }
  }

}
