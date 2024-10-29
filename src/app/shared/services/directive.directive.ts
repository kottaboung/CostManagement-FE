import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, OnDestroy } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { log } from 'console';

@Directive({
  selector: '[ngx-datatable-resize-watcher]'
})
export class NgxDatatableResizeWatcherDirective implements AfterViewInit, OnDestroy {
  private resizeObserver!: ResizeObserver;

  constructor(private dataTableEl: DatatableComponent, private changeDetectorRef: ChangeDetectorRef, private el: ElementRef) {}

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      //console.log('Width changed:', this.dataTableEl.element.clientWidth);
      this.dataTableEl.recalculate();
      if (this.dataTableEl.rowDetail) {
        this.dataTableEl.rowDetail.collapseAllRows();                
      }
      this.changeDetectorRef.markForCheck();
    });
    this.resizeObserver.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
