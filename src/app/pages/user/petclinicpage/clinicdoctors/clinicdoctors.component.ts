import { Component, Input } from '@angular/core';
import { Petdoctor } from 'src/app/modules/petdoctor/interfaces/petdoctor.interface';
import { environment } from 'src/environments/environment.prod';

@Component({
	selector: 'app-clinicdoctors',
	standalone: false,
	templateUrl: './clinicdoctors.component.html',
	styleUrl: './clinicdoctors.component.scss'
})
export class ClinicdoctorsComponent {
	@Input() doctor: Petdoctor;

	apiUrl = environment.url;
}
