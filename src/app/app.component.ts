import { Component } from '@angular/core';
import { App } from '@capacitor/app';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: false
})
export class AppComponent {
	// constructor() {
	// 	this.setupListener();
	// }
	// async setupListener() {
	// 	App.addListener('appStateChange', ({ isActive }) => {
	// 		if (!isActive) {
	// 			// App went to background
	// 			// Save anything you fear might be lost
	// 		} else {
	// 			// App went to foreground
	// 			// restart things like sound playing
	// 		}
	// 	});
	// 	App.addListener('backButton', (data) => {
	// 		console.log('back button click:', JSON.stringify(data));
	// 		if (data.canGoBack) {
	// 			window.history.back();
	// 		} else {
	// 			// Maybe show alert before closing app?
	// 			App.exitApp();
	// 		}
	// 	});
	// }
}
