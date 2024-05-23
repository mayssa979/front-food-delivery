import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import * as L from 'leaflet';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EcommerceService implements Resolve<any> {
  // Public
  public productList: Array<any>;
  public menuList: Array<any>;
  public wishlist: Array<any>;
  public cartList: Array<any>;
  public selectedProduct;
  public relatedProducts;
  public menuI;
  public location;
  public onProductListChange: BehaviorSubject<any>;
  public onMenuListChange: BehaviorSubject<any>;
  public onLocationChange: BehaviorSubject<any>;
  public onRelatedProductsChange: BehaviorSubject<any>;
  public onWishlistChange: BehaviorSubject<any>;
  public onCartListChange: BehaviorSubject<any>;
  public onSelectedProductChange: BehaviorSubject<any>;

  // Private
  private idHandel;
  private map!: L.Map;
  private marker!: L.Marker;
  private selectedLocation: L.LatLng | null = null;
  private sortRef = key => (a, b) => {
    const fieldA = a[key];
    const fieldB = b[key];

    let comparison = 0;
    if (fieldA > fieldB) {
      comparison = 1;
    } else if (fieldA < fieldB) {
      comparison = -1;
    }
    return comparison;
  };

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.onProductListChange = new BehaviorSubject({});
    this.onMenuListChange = new BehaviorSubject({});
    this.onLocationChange = new BehaviorSubject({});
    this.onRelatedProductsChange = new BehaviorSubject({});
    this.onWishlistChange = new BehaviorSubject({});
    this.onCartListChange = new BehaviorSubject({});
    this.onSelectedProductChange = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.idHandel = route.params.id;

    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getProducts(), this.getLocation(),this.getMenus(),this.getWishlist(), this.getCartList(), this.getSelectedProduct()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get Products
   */
  getProducts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('http://localhost:8080/api/v1/restaurants').subscribe(
        (response: any) => {
          console.log("Restaurant data:", response);
          this.productList = response;
          this.sortProduct('featured'); // Default sorting
          resolve(this.productList);
        },
        (error: any) => {
          console.error('Error fetching restaurants:', error);
          reject(error); // Reject the promise if there's an error
        }
      );
    });
  }
 /********************************************************* */
 getMenus(): Promise<any[]> {
  if (!this.idHandel) {
    // If idHandel is undefined, return the result of getProducts()
    return this.getProducts();
  }

  const url = `http://localhost:8080/api/v1/restaurants/getMenus/` + this.idHandel;

  return new Promise((resolve, reject) => {
    this._httpClient.get(url).subscribe(
      (response: any) => {
        console.log("Menus :", response);
        this.menuList = response;
        this.onMenuListChange.next(this.menuList); // Emit the menuList via behavior subject
        resolve(this.menuList);
      },
      (error: any) => {
        console.error('Error fetching menus:', error);
        reject(error);
      }
    );
  });
}
/****************************************************************** */

private initMap(): void {
  this.map = L.map('map').setView([36.8065, 10.1815], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(this.map);
}

afficherLocalisation(location: any): void {
  this.initMap();
  console.log(location.longitude);
  this.selectedLocation= L.latLng(location.longitude, location.latitude);
  console.log("before init"+this.selectedLocation);
  if (!this.map) {
    console.error('Map is not initialized.');
    return;
  }

  if (this.marker) {
    this.map.removeLayer(this.marker);
  }

  const customIcon = L.icon({iconUrl: 'assets/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41], shadowUrl: 'assets/images/marker-shadow.png' });
  this.marker = L.marker(this.selectedLocation, { icon: customIcon });

  // Check if map is initialized and add the marker
  if (this.map) {
    this.marker.addTo(this.map);
    this.selectedLocation = location;
  } else {
    console.error('Map is not initialized.');
  }
} 

getLocation(): Promise<any[]> {
  if (!this.idHandel) {
    // If idHandel is undefined, return the result of getProducts()
    return this.getProducts();
  }

  const url = `http://localhost:8080/api/v1/restaurants/getLocation/` + this.idHandel;

  return new Promise((resolve, reject) => {
    this._httpClient.get(url).subscribe(
      (response: any) => {
        console.log("Location :", response);
        this.location = response;
        this.onLocationChange.next(this.location); // Emit the menuList via behavior subject
        resolve(this.location);
      },
      (error: any) => {
        console.error('Error fetching menus:', error);
        reject(error);
      }
    );
  });
}

 /*********************************************************** */
   /* return new Promise((resolve, reject) => {
      this._httpClient.get('api/ecommerce-products').subscribe((response: any) => {
        this.productList = response;
        this.sortProduct('featured'); // Default shorting
        resolve(this.productList);
      }, reject);
    });*/
  /**
   * Get Wishlist
   */
  getWishlist(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/ecommerce-userWishlist').subscribe((response: any) => {
        this.wishlist = response;
        this.onWishlistChange.next(this.wishlist);
        resolve(this.wishlist);
      }, reject);
    });
  }

  /**
   * Get CartList
   */
  getCartList(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/ecommerce-userCart').subscribe((response: any) => {
        this.cartList = response;

        this.onCartListChange.next(this.cartList);
        resolve(this.cartList);
      }, reject);
    });
  }

  /**
   * Get Selected Product
   */

  getSelectedProduct(): Promise<any> {
    if (!this.idHandel) {
      // If idHandel is undefined, return the result of getProducts()
      return this.getProducts();
    }
  
    const url = `http://localhost:8080/api/v1/restaurants/getRestaurant/` + this.idHandel;
  
    return new Promise((resolve, reject) => {
      this._httpClient.get(url).subscribe(
        (response: any) => {
          console.log("Response:", response);
          this.selectedProduct = response;
          this.onSelectedProductChange.next(this.selectedProduct); // Assuming onSelectedProductChange is a Subject
          resolve(this.selectedProduct);
        },
        (error: any) => {
          console.error('Error fetching selected product:', error);
          reject(error);
        }
      );
    });
  }
  
  /**
   * Get Related Products
   */
  getRelatedProducts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/ecommerce-relatedProducts').subscribe((response: any) => {
        this.relatedProducts = response;
        this.onRelatedProductsChange.next(this.relatedProducts);
        resolve(this.relatedProducts);
      }, reject);
    });
  }

  /**
   * Sort Product
   *
   * @param sortBy
   */
  sortProduct(sortBy) {
    let sortDesc = false;

    const sortByKey = (() => {
      if (sortBy === 'price-desc') {
        sortDesc = true;
        return 'price';
      }
      if (sortBy === 'price-asc') {
        return 'price';
      }
      sortDesc = true;
      return 'id';
    })();

    const sortedData = this.productList.sort(this.sortRef(sortByKey));
    if (sortDesc) sortedData.reverse();
    this.productList = sortedData;
    this.onProductListChange.next(this.productList);
  }

  /**
   * Add In Wishlist
   *
   * @param id
   */
  addToWishlist(id) {
    return new Promise<void>((resolve, reject) => {
      const lengthRef = this.wishlist.length + 1;
      const wishRef = { id: lengthRef, productId: id };

      this._httpClient.post('api/ecommerce-userWishlist/' + lengthRef, { ...wishRef }).subscribe(response => {
        this.getWishlist();
        resolve();
      }, reject);
    });
  }

  /**
   * Remove From Wishlist
   *
   * @param id
   */
  removeFromWishlist(id) {
    const indexRef = this.wishlist.findIndex(wishlistRef => wishlistRef.productId === id); // Get the index ref
    const indexId = this.wishlist[indexRef].id; // Get the product wishlist id from indexRef
    return new Promise<void>((resolve, reject) => {
      this._httpClient.delete('api/ecommerce-userWishlist/' + indexId).subscribe((response: any) => {
        this.getWishlist();
        resolve();
      }, reject);
    });
  }

  /**
   * Add In Cart
   *
   * @param id
   */
  addToCart(menuId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Fetch the menu details first
      this._httpClient.get(`http://localhost:8080/menu/menuById/${menuId}`).subscribe(
        (menuResponse: any) => {
          console.log("Fetched menu:", menuResponse);
  
          // Check if menuResponse is valid
          if (!menuResponse || !menuResponse.id) {
            reject('Invalid menu data'); // Reject the Promise if menu data is invalid
            return;
          }
  
          // Prepare the command payload
          const command = {
            commandLines: [
              {
                menu: {
                  id: menuResponse.id
                },
                quantity: 2
              }
            ],
            user: {
              id: 52 // Assuming user ID is known
            }
          };
          console.log('Command payload:', command);
  
          // Send POST request to add command
          this._httpClient.post('http://localhost:8080/commands/addCommand', command).subscribe(
            (response: any) => {
              console.log('Command added successfully:', response);
              resolve(); // Resolve the Promise when the command is added
            },
            (error: any) => {
              console.error('Error adding command:', error);
              reject('Error adding command'); // Reject the Promise with a generic error message
            }
          );
        },
        (error: any) => {
          console.error('Error fetching menu:', error);
          reject('Error fetching menu'); // Reject the Promise with an error message if fetching menu fails
        }
      );
    });
  }
  
  
  
/*return new Promise<void>((resolve, reject) => {
      const maxValueId = 1;
      const cartRef = { id: maxValueId, productId: id, qty: 1 };
      var cartId: any = '';

      // If cart is not Empty
      if (maxValueId !== 1) {
        cartId = maxValueId;
      }
      this._httpClient.post('api/ecommerce-userCart/' + cartId, { ...cartRef }).subscribe(response => {
        this.getCartList();
        resolve();
      }, reject);
    });**/
  /**
   * Remove From Cart
   *
   * @param id
   */
  removeFromCart(id) {
    const indexRef = this.cartList.findIndex(cartListRef => cartListRef.productId === id); // Get the index ref
    const indexId = this.cartList[indexRef].id; // Get the product wishlist id from indexRef

    return new Promise<void>((resolve, reject) => {
      this._httpClient.delete('api/ecommerce-userCart/' + indexId).subscribe((response: any) => {
        this.getCartList();
        resolve();
      }, reject);
    });
  }
}
