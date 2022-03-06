import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Category} from "../../models/water_quality";
import {BehaviorSubject, combineLatestWith, filter, map, Observable, take} from "rxjs";

@Component({
  selector: 'app-zone-selector',
  templateUrl: './zone-selector.component.html',
  styleUrls: ['./zone-selector.component.scss']
})
export class ZoneSelectorComponent {

  @Input()
  public categories: Category[] = [];

  @Output()
  public zone = new EventEmitter<string | null>();

  public currentPosition: Category[] = [];
  public isLeaf: boolean = false;

  public searchResult$: Observable<Category[]> = new Observable<Category[]>();
  public searchText$ = new BehaviorSubject<string>("");
  public currentChildren$ = new BehaviorSubject<Category[]>([]);

  public searchText: string = "";

  ngOnInit(): void {
    console.log('categories', this.categories);
    if (this.categories !== undefined) {
      this.currentChildren$.next(this.categories);
    }
    this.searchResult$ = this.searchText$.pipe(
      map(val => val.toLowerCase()),
      combineLatestWith(this.currentChildren$),
      map(([searchText, elements]) => elements.filter(e => e.name.toLowerCase().indexOf(searchText) !== -1).slice(0, 5)),
    )
  }

  public search(searchText: string) {
    this.searchText$.next(searchText);
  }

  public selectChild(category: Category) {
    this.currentPosition.push(category);
    this.searchText$.next("");

    if ("children" in category) {
      this.currentChildren$.next(category.children);
      this.isLeaf = false;
    } else {
      this.currentChildren$.next([]);
      this.isLeaf = true;
    }

    if ("zone" in category) {
      this.zone.emit(category.zone);
    }
  }

  public selectParent(level: number) {
    this.searchText$.next("");

    while(this.currentPosition.length > level) {
      this.currentPosition.pop();
    }

    if (this.currentPosition.length === 0 && this.categories !== undefined) {
      this.currentChildren$.next(this.categories);
      return;
    }

    const lastPosition = this.currentPosition[this.currentPosition.length - 1];

    if ("children" in lastPosition) {
      this.currentChildren$.next(lastPosition.children);
      this.zone.emit(null);
      this.isLeaf = false;
      return;
    }

    this.currentChildren$.next([]);
    this.isLeaf = true;
  }

}
