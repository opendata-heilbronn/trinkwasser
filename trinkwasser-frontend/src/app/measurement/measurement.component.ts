import {Component, Input, OnInit} from '@angular/core';
import {Range} from "../../models/water_quality";

@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html',
  styleUrls: ['./measurement.component.scss']
})
export class MeasurementComponent implements OnInit {

  @Input()
  public name: string = "";

  @Input()
  public value: Range | number = 0;

  public type: "value" | "range" | "" = "";
  public numericValue: number = 0;
  public range: Range = {from: 0, to: 0};


  ngOnInit(): void {
    if (typeof this.value == "number") {
      this.numericValue = this.value;
      this.type = "range";
    } else {
      this.range = this.value;
      this.type = "value";
    }
  }

}
