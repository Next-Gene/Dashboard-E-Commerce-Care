import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerfiycodeComponent } from './verfiycode.component';

describe('VerfiycodeComponent', () => {
  let component: VerfiycodeComponent;
  let fixture: ComponentFixture<VerfiycodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerfiycodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerfiycodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
