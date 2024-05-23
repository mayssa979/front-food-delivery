import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';

@Component({
  selector: 'app-ecommerce-item-menu',
  templateUrl: './ecommerce-item-menu.component.html',
  styleUrls: ['./ecommerce-item-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class EcommerceItemMenuComponent implements OnInit {
  // Input Decorotor
  @Input() menu;
  @Input() isWishlistOpen = false;

  // Public
  public isInCart = false;

  /**
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Wishlist
   *
   * @param menu
   */
  toggleWishlist(menu) {
    if (menu.isInWishlist === true) {
      this._ecommerceService.removeFromWishlist(menu.id).then(res => {
        menu.isInWishlist = false;
      });
    } else {
      this._ecommerceService.addToWishlist(menu.id).then(res => {
        menu.isInWishlist = true;
      });
    }
  }

  /**
   * Add To Cart
   *
   * @param menu
   */
  addToCart(menu) {
    console.log("menu id before");
    this._ecommerceService.addToCart(menu.id).then(res => {
      console.log("menu id ", menu.id);
      menu.isInCart = true;
    });
  }
  getBase64ImageSrc(base64Data: string): string {
    return `data:image/jpeg;base64,${base64Data}`;
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): any {

    }
   
}
