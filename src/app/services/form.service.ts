import { Injectable } from '@angular/core';
import { ClientM } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  saveToLocalStorage(client: ClientM): void {
    let clients: ClientM[] = JSON.parse(localStorage.getItem('apply') || '[]'); 
    clients.push(client);
    localStorage.setItem('apply', JSON.stringify(clients));
  }

  getClientsFromLocalStorage(): ClientM[] {
    return JSON.parse(localStorage.getItem('apply') || '[]'); 
  }
}
