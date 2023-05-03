import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'jhi-mentor-module-selection',
  templateUrl: './mentee-module-selection.component.html',
  styleUrls: ['./mentee-module-selection.component.scss'],
})
export class MenteeModuleSelectionComponent {
  moduleSelect: any = 0;

  moduleData: any[] = [];

  /** Test data:
   *
   *
   * moduleData = [
    { id : 1, moduleName : "DSA" },
    { id : 2, moduleName : "OOP"},
    { id : 3, moduleName : "MLFCS"},
    { id : 4, moduleName : "AI1"},
    { id : 5, moduleName : "FSAD"},
    { id : 6, moduleName : "TOC"}
  ];**/

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('/api/user-modules').subscribe(data => {
      this.moduleData = data;
    });
    window.onscroll = this.setScroll;
  }

  setScroll(): void {
    if (window.scrollY > 0) document.getElementById('topScroller')!.style.display = 'flex';
    else document.getElementById('topScroller')!.style.display = 'none';
  }

  toTheTop() {
    window.scrollTo({ top: 0 });
    document.getElementById('topScroller')!.style.display = 'none';
  }

  home(): void {
    this.router.navigateByUrl('/home');
  }

  feed(): void {
    this.router.navigateByUrl('/connections-feed');
  }
}
