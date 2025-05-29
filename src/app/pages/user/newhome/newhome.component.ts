import { Component } from '@angular/core';
import { Value } from 'src/app/core/modules/input/input.component';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { Pet } from 'src/app/modules/pet/interfaces/pet.interface';
import { PetService } from 'src/app/modules/pet/services/pet.service';

@Component({
	templateUrl: './newhome.component.html',
	styleUrls: ['./newhome.component.scss'],
	standalone: false
})
export class NewhomeComponent {
	availablePets: Pet[] = [];
	speciesList: { _id: string; name: string }[] = [];
	breedList: { _id: string; name: string }[] = [];

	species = '';
	breed = '';
	gender = '';
	search = '';

	genderList = [
		{ _id: 'Male', name: this.getTranslatedText('Pet.Male') },
		{
			_id: 'Female',
			name: this.getTranslatedText('Pet.Female')
		}
	];

	isMenuOpen = false;
	filtersInitialized = false;

	constructor(
		private _petService: PetService,
		private translateService: TranslateService
	) {
		this.load();
	}

	setSearch(value: Value): void {
		this.search = (value as string) || '';
	}

	getTranslatedText(toTranslate: string) {
		return this.translateService.translate(toTranslate);
	}

	load(): void {
		this._petService
			.get({ query: this._query() }, { name: 'public' })
			.subscribe((availablePets) => {
				this.availablePets.splice(0, this.availablePets.length);
				this.availablePets.push(...availablePets);

				if (!this.filtersInitialized) {
					this.speciesList = [
						...new Set(this.availablePets.map((pet) => pet.species))
					].map((species) => ({
						_id: species,
						name: this.getTranslatedText('Pet.' + species)
					}));

					this.breedList = [
						...new Set(this.availablePets.map((pet) => pet.breed))
					].map((breed) => ({
						_id: breed,
						name: this.getTranslatedText('Pet.' + breed)
					}));

					this.filtersInitialized = true;
				}
			});
	}

	private _query(): string {
		let query = '';

		if (this.availablePets) {
			query += (query ? '&' : '') + 'adoptable=' + true;

			if (this.species) {
				query += (query ? '&' : '') + 'species=' + this.species;
			}
			if (this.breed) {
				query += (query ? '&' : '') + 'breed=' + this.breed;
			}
			if (this.gender) {
				query += (query ? '&' : '') + 'gender=' + this.gender;
			}
		}

		if (this.search) {
			query += (query ? '&' : '') + 'search=' + this.search;
		}

		return query;
	}
}
