import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly defaultTitle = 'Freedom Finance HR';
  private pageTitle$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  constructor(private title: Title) {}

  setTitle(title: string = '') {
    if (title) {
      this.title.setTitle(title + ' | ' + this.defaultTitle);
    } else {
      this.title.setTitle(this.defaultTitle);
    }
    this.pageTitle$.next(title);
  }

  getTitle(): Observable<string> {
    return this.pageTitle$;
  }
}
