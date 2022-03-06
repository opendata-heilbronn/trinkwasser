import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WaterQuality} from "../models/water_quality";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public waterQuality$: Observable<WaterQuality> | undefined;

  public zone: string | null = null;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.waterQuality$ = this.http.get<WaterQuality>('/assets/data/water_quality.json');
  }
}
