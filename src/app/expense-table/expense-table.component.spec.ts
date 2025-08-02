import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensetableComponent } from './expense-table.component';

describe('ExpenseTableComponent', () => {
  let component: ExpensetableComponent;
  let fixture: ComponentFixture<ExpensetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensetableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpensetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});