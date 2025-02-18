import { Injectable } from '@angular/core';
import { ClientM } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  //Funcion que guarda el modelo Client con los datos que se le pasen en el localStore
  saveToLocalStorage(client: ClientM): void {
    let clients: ClientM[] = JSON.parse(localStorage.getItem('apply') || '[]'); 
    clients.push(client);
    localStorage.setItem('apply', JSON.stringify(clients));
  }

  //Funcion en la que obtienes los datos del localStorage 
  getClientsFromLocalStorage(): ClientM[] {
    return JSON.parse(localStorage.getItem('apply') || '[]'); 
  }
}
