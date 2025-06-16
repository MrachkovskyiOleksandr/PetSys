import { Injectable } from '@angular/core';
import { Pet } from '../interfaces/pet.interface';
import { CrudService } from 'wacom';
import { UserService } from '../../user/services/user.service';

@Injectable({
	providedIn: 'root'
})
export class PetService extends CrudService<Pet> {
	pets: Pet[] = this.getDocs();

	petsByAuthor: Record<string, Pet[]> = {};

	constructor(private _userService: UserService) {
		super({
			name: 'pet'
		});

		this.get({}, _userService.role('admin') ? { name: 'public' } : {});

		this.filteredDocuments(this.petsByAuthor);
	}
}
