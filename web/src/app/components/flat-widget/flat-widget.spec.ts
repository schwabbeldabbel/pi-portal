import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlatWidget } from '../flat-widget';

describe('FlatWidget', () => {
  let component: FlatWidget;
  let fixture: ComponentFixture<FlatWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlatWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(FlatWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
