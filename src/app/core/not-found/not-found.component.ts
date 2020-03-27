import { Component, OnInit } from '@angular/core';
import {TitleService} from '../title-service.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  constructor(private titleService: TitleService) {}

  ngOnInit() {
    this.titleService.setTitle(); // устанавливаем дефолтный заголовок, чтобы убрать заголовок предыдущей страницы
  }
}
