import {Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { Housinglocation } from '../../models/housinglocation';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { ClientM } from '../../models/client';
import * as L from 'leaflet'

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent {

  client!: ClientM;
  map!: L.Map;
  isBrowser: boolean;

  housingLocation: Housinglocation | undefined;

  applyForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private route: ActivatedRoute,
    private housingService: HousingService,
    private formService: FormService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId).then((housingLocation) => {
      this.housingLocation = housingLocation;
    });
  }

  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? '',
    );
  }

  createClient(): ClientM {
    return {
      id: Number(new Date()),
      firstName: this.applyForm.value.firstName || '',
      lastName: this.applyForm.value.lastName || '',
      email: this.applyForm.value.email || ''
    };
  }

  saveApply(): void {
    this.client = this.createClient();
    this.formService.saveToLocalStorage(this.client);
  }


  async ngAfterViewInit(): Promise<void> {
    if (this.isBrowser) {
      const L = await import('leaflet');
  
      this.housingService.getHousingLocationById(parseInt(this.route.snapshot.params['id'], 10))
        .then((housingLocation) => {
          this.housingLocation = housingLocation;
          if (this.housingLocation) {
            this.initMap(L);
          }
        });
    }
  }
  

  private initMap(L: any): void {
    if (!this.housingLocation) return;
  
    setTimeout(() => {
      this.map = L.map('map').setView(
        [this.housingLocation?.coordinates.latitude, this.housingLocation?.coordinates.longitude], 
        13
      );
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);
  
      // 🔹 Definir un icono personalizado
      const customIcon = L.icon({
        iconUrl: 'assets/marcador.png',  
        iconSize: [40, 40], 
        iconAnchor: [20, 40], 
        popupAnchor: [0, -40] 
      });
  
      L.marker([this.housingLocation?.coordinates.latitude, this.housingLocation?.coordinates.longitude], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`<b>${this.housingLocation?.name}</b><br>${this.housingLocation?.city}, ${this.housingLocation?.state}`)
        .openPopup();
    }, 100);
  }
  
}
