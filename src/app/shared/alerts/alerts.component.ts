import { Component, Input, input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-alerts',
  imports: [],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss'
})
export class AlertsComponent {
  @Input() controlName !:string;

@Input() formName !:FormGroup;
}

