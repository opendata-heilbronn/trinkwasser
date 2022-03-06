import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneSelectorComponent } from './zone-selector.component';

describe('ZoneSelectorComponent', () => {
  let component: ZoneSelectorComponent;
  let fixture: ComponentFixture<ZoneSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
