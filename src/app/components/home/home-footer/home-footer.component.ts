import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.scss']
})
export class HomeFooterComponent {

  public links: FooterLink[] = [
    { title: 'Twitter', url: 'https://twitter.com/Myjulot' },
    { title: 'GitHub', url: 'https://github.com/julesrx/glory.report' }
  ];

  constructor() { }

}

export interface FooterLink {
  title: string;
  url: string;
}
