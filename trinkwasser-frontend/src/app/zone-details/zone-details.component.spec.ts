import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneDetailsComponent } from './zone-details.component';

describe('ZoneDetailsComponent', () => {
  let component: ZoneDetailsComponent;
  let fixture: ComponentFixture<ZoneDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
