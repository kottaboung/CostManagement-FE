import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleChartComponent } from './circle-chart.component';

describe('CircleChartComponent', () => {
  let component: CircleChartComponent;
  let fixture: ComponentFixture<CircleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircleChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
