import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-mentor-module-selection',
  templateUrl: './mentor-module-selection.component.html',
  styleUrls: ['./mentor-module-selection.component.scss'],
})
export class MentorModuleSelectionComponent {
  constructor(private router: Router) {}

  home(): void {
    this.router.navigateByUrl('/');
  }

  feed(): void {
    this.router.navigateByUrl('/connections-feed');
  }
}
