import {Injectable } from '@angular/core';
import { Housinglocation } from '../models/housinglocation';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  //constructor( private http : HttpClient){}

  //Funcion en la que obtiene del json el array de las propiedades
  url = 'http://localhost:3000/locations';
  async getAllHousingLocations(): Promise<Housinglocation[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }
  //Funcion en la que obtienes una casa por su id
  async getHousingLocationById(id: number): Promise<Housinglocation | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return (await data.json()) ?? {};
  }

  //Funcion en la que muestrar por consola los datos que te ha metido el usuario en el formulario
  submitApplication(firstName: string, lastName: string, email: string) {
    // tslint:disable-next-line
    console.log(firstName, lastName, email);
  }

  addEvento(casa: Housinglocation) { 
    this.getAllHousingLocations().then((housingLocationList: Housinglocation[]) =>{
      housingLocationList.push(casa);
    })
    console.log(casa);
  }
}
