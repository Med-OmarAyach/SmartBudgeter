import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RappelsConseilsComponent } from './rappel-conseils.component';

describe('RappelsConseilsComponent', () => {
  let component: RappelsConseilsComponent;
  let fixture: ComponentFixture<RappelsConseilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RappelsConseilsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RappelsConseilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});