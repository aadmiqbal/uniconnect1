import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-mentor-module-selection',
  templateUrl: './mentee-module-selection.component.html',
  styleUrls: ['./mentee-module-selection.component.scss'],
})
export class MenteeModuleSelectionComponent {
  constructor(private router: Router) {}

  home(): void {
    this.router.navigateByUrl('/');
  }

  feed(): void {
    this.router.navigateByUrl('/connections-feed');
  }
}
