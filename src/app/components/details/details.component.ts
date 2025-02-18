import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  styleUrl: './details.component.css',
})
export class DetailsComponent {

//Crear un modelo de cliente
  client!: ClientM;

  //Llamar al servicio para poder acceder a toodo los metodos que tiene (hace lo mismo o casi lo mismo que si lo llamas en el constructor)
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  formService = inject(FormService);

  //Crear un modelo de propiedad
  housingLocation: Housinglocation | undefined;
  
  //Una forma de validar un formulario
  applyForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
  });

  //Obtienes la id que se encuntra en la url y facer que la funcion te la busque
  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId).then((housingLocation) => {
      this.housingLocation = housingLocation;
    });
  }

  //Funcion que le pasa a la funcion del service los parametros necesearios.
  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? '',
    );
  }

  //funcion que crea
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

}
