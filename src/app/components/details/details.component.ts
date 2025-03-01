import { AfterViewInit, Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { Housinglocation } from '../../models/housinglocation';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { ClientM } from '../../models/client';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements AfterViewInit {

  client!: ClientM;
  private isBrowser: boolean;
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  formService = inject(FormService);

  housingLocation: Housinglocation | undefined;

  applyForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId).then((housingLocation) => {
      this.housingLocation = housingLocation;
    });

    this.isBrowser = isPlatformBrowser(platformId);
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

  ngAfterViewInit(): void {
    if (this.isBrowser && this.housingLocation) {
      this.loadLeafletAndInitializeMap();
    }
  }

  loadLeafletAndInitializeMap(): void {
    if (this.isBrowser) {
      import('leaflet').then((L) => {
        const { latitude, longitude } = this.housingLocation?.coordinates || {};
        
        if (latitude && longitude) {
          const map = L.map('map').setView([latitude, longitude], 13); 

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

          L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`<b>${this.housingLocation?.name}</b><br>${this.housingLocation?.city}, ${this.housingLocation?.state}`)
            .openPopup();
        } else {
          console.error('Las coordenadas no son válidas para el mapa.');
        }
      }).catch((error) => {
        console.error('Error cargando Leaflet:', error);
      });
    }
  }
}
