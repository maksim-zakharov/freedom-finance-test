import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {TitleService} from '../../core/title-service.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor(
    private router: Router,
    private titleService: TitleService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Главная страница');
  }
}
