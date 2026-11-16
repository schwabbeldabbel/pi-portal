import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PvDataChartComponent } from './pv-data-chart.component';

describe('PvDataChart', () => {
  let component: PvDataChartComponent;
  let fixture: ComponentFixture<PvDataChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PvDataChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PvDataChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
