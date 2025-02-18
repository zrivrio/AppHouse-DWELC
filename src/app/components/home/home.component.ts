import { Component, inject } from '@angular/core';
import { Housinglocation } from '../../models/housinglocation';
import { HousingService } from '../../services/housing.service';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HousingLocationComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Fixed typo
})
export class HomeComponent {
  //crea un array de propiedades
  housingLocationList: Housinglocation[] = [];
  //llama al servicio
  housingService: HousingService = inject(HousingService);
  //crea un array de propiedades
  filteredLocationList: Housinglocation[] = [];
  constructor() {
    //llamas para que te muestre todo los datos
    this.housingService.getAllHousingLocations().then((housingLocationList: Housinglocation[]) => {
      this.housingLocationList = housingLocationList;
      this.filteredLocationList = housingLocationList;
    });
  }
  //filtra por lo que se busque
  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
      return;
    }
    this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
      housingLocation?.city.toLowerCase().includes(text.toLowerCase()),
    );
  }
}

