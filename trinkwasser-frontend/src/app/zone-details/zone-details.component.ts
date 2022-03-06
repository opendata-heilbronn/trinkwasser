import {Component, Input, OnInit} from '@angular/core';
import {Measurements, Zone} from '../../models/water_quality';

@Component({
  selector: 'app-zone-details',
  templateUrl: './zone-details.component.html',
  styleUrls: ['./zone-details.component.scss']
})
export class ZoneDetailsComponent implements OnInit {

  @Input()
  public zoneInfo: Zone[] = [];

  @Input()
  public zoneID: string | undefined;

  public zone: Zone | undefined;
  public currentMeasurements: Measurements | undefined;


  ngOnInit(): void {
    console.log(this.zoneInfo);
    const result = this.zoneInfo.filter(z => z.id == this.zoneID);
    if (result.length !== 1) {
      console.error("did not find zone", this.zoneID);
    }

    this.zone = result[0];

    this.currentMeasurements = this.zone.measurements.reduce((latest, current) => {
      if (latest.year.localeCompare(current.year) > 0) {
        return latest;
      }
      return current;
    });
  }

}
