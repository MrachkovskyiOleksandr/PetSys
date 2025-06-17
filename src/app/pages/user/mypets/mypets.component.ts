import { Component } from '@angular/core';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { Value } from 'src/app/core/modules/input/input.component';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { petFormComponents } from 'src/app/modules/pet/formcomponents/pet.formcomponents';
import { Pet } from 'src/app/modules/pet/interfaces/pet.interface';
import { PetService } from 'src/app/modules/pet/services/pet.service';
import { PetallergyService } from 'src/app/modules/petallergy/services/petallergy.service';
import { UserService } from 'src/app/modules/user/services/user.service';
import { environment } from 'src/environments/environment.prod';
import { CoreService } from 'wacom';

@Component({
	templateUrl: './mypets.component.html',
	styleUrls: ['./mypets.component.scss'],
	standalone: false
})
export class MypetsComponent {
	mypets: Pet[] = [];
	speciesList: { _id: string; name: string }[] = [];
	breedList: { _id: string; name: string }[] = [];

	constructor(
		public _userService: UserService,
		private _petService: PetService,
		private _form: FormService,
		private _core: CoreService,
		private _petallergyService: PetallergyService,
		private translateService: TranslateService
	) {
		this._core.onComplete('pet_loaded').then(() => {
			this.mypets =
				this._petService.petsByAuthor[this._userService.user._id];

			this.speciesList = [
				...new Set(this.mypets.map((pet) => pet.species))
			].map((species) => ({
				_id: species,
				name: this.getTranslatedText('Pet.' + species)
			}));

			this.breedList = [
				...new Set(this.mypets.map((pet) => pet.breed))
			].map((breed) => ({
				_id: breed,
				name: this.getTranslatedText('Pet.' + breed)
			}));
		});
	}

	isMenuOpen = false;

	species = '';
	breed = '';
	gender = '';
	adoptable = '';

	search = '';

	genderList = [
		{ _id: 'Male', name: this.getTranslatedText('Pet.Male') },
		{
			_id: 'Female',
			name: this.getTranslatedText('Pet.Female')
		}
	];

	adoptableList = [
		{ _id: 'Adoptable', name: this.getTranslatedText('Pet.Is adoptable') },
		{
			_id: 'Not adoptable',
			name: this.getTranslatedText('Pet.Not adoptable')
		}
	];

	form: FormInterface = this._form.getForm('pet', petFormComponents);

	setSearch(value: Value): void {
		this.search = (value as string) || '';
	}

	getTranslatedText(toTranslate: string) {
		return this.translateService.translate(toTranslate);
	}

	create(): void {
		this._form.modal<Pet>(this.form, {
			label: 'Create',
			click: (created: unknown, close: () => void) => {
				this._petService.create(created as Pet);

				close();
			}
		});
	}

	load(): void {
		this._petService.get({ query: this._query() }).subscribe((mypets) => {
			this.mypets.splice(0, this.mypets.length);
			this.mypets.push(...mypets);
		});
	}

	private _query(): string {
		let query = '';

		if (this.species) {
			query += (query ? '&' : '') + 'species=' + this.species;
		}
		if (this.breed) {
			query += (query ? '&' : '') + 'breed=' + this.breed;
		}
		if (this.gender) {
			query += (query ? '&' : '') + 'gender=' + this.gender;
		}
		if (this.adoptable) {
			if (this.adoptable === 'Adoptable') {
				query += (query ? '&' : '') + 'adoptable=' + true;
			} else {
				query += (query ? '&' : '') + 'adoptable=' + false;
			}
		}
		if (this.search) {
			query += (query ? '&' : '') + 'search=' + this.search;
		}

		return query;
	}
}
