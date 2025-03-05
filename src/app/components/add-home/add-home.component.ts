import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Housinglocation } from '../../models/housinglocation';
import { CommonModule } from '@angular/common';
import { HousingService } from '../../services/housing.service';
import { HomeComponent } from '../home/home.component';



@Component({
  selector: 'app-add-home',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-home.component.html',
  styleUrl: './add-home.component.css',

})
export class AddHomeComponent {

  eventForm: FormGroup;
  houseService = inject(HousingService);

  listaCasas : Housinglocation[] = []

  constructor(
    private fb: FormBuilder,
  ){
    this.eventForm = this.fb.group({
      name: ['Los Torres', Validators.required],
      city: ['Málaga', Validators.required],
      state: ['ES', Validators.required],
      photo: [''],
      availableUnits: ['2'],
      wifi: ['true'],
      laundry: ['false'],
      security: ['', Validators.required],
    })
    this.houseService.getAllHousingLocations().then((housingLocationList: Housinglocation[]) =>{
      this.listaCasas = housingLocationList;
    })
  }


  onSubmit(): void{
    if(this.eventForm.valid){
      const idMayor = Math.max(...this.listaCasas.map(l => l.id));
      const nuevaCasa: Housinglocation = {
        id: idMayor + 1,
        name : this.eventForm.value.name,
        city: this.eventForm.value.city,
        state: this.eventForm.value.state,
        photo: this.eventForm.value.photo,
        availableUnits: this.eventForm.value.availableUnits,
        wifi: this.eventForm.value.wifi,
        laundry: this.eventForm.value.laundry,
        security: this.eventForm.value.security,
        coordinates: {latitude: 0, longitude: 0}
      }
      this.houseService.addEvento(nuevaCasa).subscribe(
        () => {
         console.log(nuevaCasa);
       }
      );
      this.eventForm.reset();
    }
  }
}
