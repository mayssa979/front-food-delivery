import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from '../models/Menu';
import { Restaurant } from '../models/Restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
 

  restaurantURL: string = "localhost:8080/api/v1/restaurants";
  menussURL: string = "localhost:8080/menu";

  selectedData: any;

  constructor(private httpClient : HttpClient) {
  }


  getAllRestaurants():Observable<Restaurant[]> {

   return this.httpClient.get<Restaurant[]>(this.restaurantURL);
  }

  getByIdRestaurant(id: any):Observable<Restaurant> {
    console.log("id serv +++++ " , id);
   
    return this.httpClient.get<Restaurant>(`${this.restaurantURL}/getRestaurant/${id}`);
  }
  createRestaurant(restaurant: any) {

    return this.httpClient.post(this.restaurantURL,restaurant);
  }
  updateRestaurant(restaurant: any) {
    return this.httpClient.put(`${this.restaurantURL}`, restaurant);
  }
  deleteRestaurant(id:any) {
    return this.httpClient.delete(`${this.restaurantURL}/delete/${id}`);
  }

  

  getMenus() :Observable<any>{
    return this.httpClient.get<any>(`${this.menussURL}/get`)
  }

 /*addMenu(id: string, patientmenudiseases: Disease[]) {
    return this.httpClient.post<any>("http://localhost:8081/diseases/save/" + id ,patientdiseases)
  }

  getByIdPrescripion(prescriptionid: string): Observable<any> {
    return this.httpClient.get<any>("http://localhost:8081/prescription/list/"+prescriptionid)
  }

  getByIdAppointment(appointmentid: string): Observable<any> {
    return this.httpClient.get<any>("http://localhost:8081/rdv/list/"+appointmentid)
  }*/

}
