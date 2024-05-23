import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute , Router } from '@angular/router';

interface DeliveryLocation {
  latitude: number;
  longitude: number;
}
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements AfterViewInit {
  private map!: L.Map;
  private loc1 : any;
  private marker!: L.Marker;
  private selectedLocation: L.LatLng | null = null;
  private commandId: number | null = null;

  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router) {}
  
  ngAfterViewInit(): void {
    this.initMap();
	//this.route.params.subscribe(params => {this.commandId = +params['commandId'];});
	//this.map.on('click', this.onMapClick.bind(this));
	}
	
  private initMap(): void {
    this.map = L.map('map').setView([36.8065, 10.1815], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  private addMarkerToMap(location: L.LatLng): void {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
	const customIcon = L.icon({iconUrl: 'assets/images/marker-icon.png',iconSize: [25, 41], iconAnchor: [12, 41],shadowUrl: 'assets/images/marker-shadow.png' });
    this.marker = L.marker(location, { icon: customIcon }).addTo(this.map);
    this.selectedLocation = location;
  }

  
  



 
}