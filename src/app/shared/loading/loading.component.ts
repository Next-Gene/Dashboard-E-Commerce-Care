import { Component } from '@angular/core';
import { LoadingService } from '../../core/services/loading-service.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  constructor(public _loadingService: LoadingService) {}
}
