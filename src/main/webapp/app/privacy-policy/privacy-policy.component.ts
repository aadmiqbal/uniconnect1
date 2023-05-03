import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
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
}
