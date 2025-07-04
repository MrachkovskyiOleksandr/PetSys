import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { petclinicFormComponents } from 'src/app/modules/petclinic/formcomponents/petclinic.formcomponents';
import { Petclinic } from 'src/app/modules/petclinic/interfaces/petclinic.interface';
import { PetclinicService } from 'src/app/modules/petclinic/services/petclinic.service';
import { Petdoctor } from 'src/app/modules/petdoctor/interfaces/petdoctor.interface';
import { PetdoctorService } from 'src/app/modules/petdoctor/services/petdoctor.service';
import { UserService } from 'src/app/modules/user/services/user.service';
import { CoreService, AlertService } from 'wacom';

@Component({
	templateUrl: './petclinicpage.component.html',
	styleUrls: ['./petclinicpage.component.scss'],
	standalone: false
})
export class PetclinicpageComponent {
	petclinic = this._petclinicService.doc(
		this._router.url.replace('/petclinicpage/', '')
	);

	petdoctors: Petdoctor[] = [];

	clinic_id = '';

	constructor(
		private _petclinicService: PetclinicService,
		private _petdoctorService: PetdoctorService,
		private _router: Router,
		private _route: ActivatedRoute,
		private _form: FormService,
		private _core: CoreService,
		private _alert: AlertService,
		private _translate: TranslateService,
		private translateService: TranslateService,
		public us: UserService
	) {
		this._route.paramMap.subscribe((params) => {
			this.clinic_id = params.get('clinic_id') || '';
		});
		this.load();
	}

	isMenuOpen = false;

	getTranslatedText(toTranslate: string) {
		return this.translateService.translate(toTranslate);
	}

	form: FormInterface = this._form.getForm(
		'petclinic',
		petclinicFormComponents
	);

	update(doc: Petclinic): void {
		this._form
			.modal<Petclinic>(this.form, [], doc)
			.then((updated: Petclinic) => {
				this._core.copy(updated, doc);

				this._petclinicService.update(doc);
			});
	}

	delete(doc: Petclinic): void {
		this._alert.question({
			text: this._translate.translate(
				'Common.Are you sure you want to delete this pet?'
			),
			buttons: [
				{
					text: this._translate.translate('Common.No')
				},
				{
					text: this._translate.translate('Common.Yes'),
					callback: (): void => {
						this._petclinicService.delete(doc);
						this._router.navigateByUrl('/petclinics');
					}
				}
			]
		});
	}

	load(): void {
		this._petdoctorService
			.get({ query: this._query() }, { name: 'public' })
			.subscribe((petdoctors) => {
				this.petdoctors.splice(0, this.petdoctors.length);
				this.petdoctors.push(...petdoctors);
			});
	}

	private _query(): string {
		let query = '';

		if (this.clinic_id) {
			query += (query ? '&' : '') + 'clinic=' + this.clinic_id;
		}

		return query;
	}
}
