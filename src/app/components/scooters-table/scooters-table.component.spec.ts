import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScootersTableComponent } from './scooters-table.component';

describe('ScootersTableComponent', () => {
  let component: ScootersTableComponent;
  let fixture: ComponentFixture<ScootersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScootersTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScootersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
