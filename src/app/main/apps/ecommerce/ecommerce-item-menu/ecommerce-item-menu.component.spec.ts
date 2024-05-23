import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcommerceItemMenuComponent } from './ecommerce-item-menu.component';

describe('EcommerceItemMenuComponent', () => {
  let component: EcommerceItemMenuComponent;
  let fixture: ComponentFixture<EcommerceItemMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcommerceItemMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcommerceItemMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
