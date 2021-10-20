import { ScootersService } from './../../services/scooters.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { IScooter } from 'src/app/models/Scooter';

@Component({
  selector: 'app-scooter',
  templateUrl: './scooter.component.html',
  styleUrls: ['./scooter.component.css'],
})
export class ScooterComponent implements OnInit {
  @Input() scooterFromParent!: IScooter;
  @Output() onDelFromChild: EventEmitter<number> = new EventEmitter<number>();
  date!: string;
  today: string = new Date().toISOString().slice(0, 10);
  scooter!: IScooter;

  @ViewChild('updateScooter') updateScooter!: NgForm;
  @ViewChild('check') check!: NgForm;
  @ViewChild('dateInput') dateInput!: NgForm;
  @ViewChild('kmInput') kmInput!: NgForm;

  constructor(private _scootersService: ScootersService) {}

  ngOnInit(): void {
    this.date = new Date(this.scooterFromParent.last_use).toISOString().slice(0,10);
  }

  onUpdate(): void {
    if (this.updateScooter.dirty && this.updateScooter.valid) {
      this.scooterFromParent.last_use =
        this.dateInput.value == ''
          ? new Date().toDateString().slice(0, 10)
          : this.dateInput.value;
      this.kmInput.value != ''
        ? (this.scooterFromParent!.total_ride += +this.kmInput.value)
        : undefined;
      this._scootersService.updateScooter(this.scooterFromParent).subscribe(
        (res) => {
          alert(`Scooter ${this.scooterFromParent.name} successfully updated!`);
          // this._router.navigate([`/scooters/${this.scooter.id}`]);
        },
        (err) => console.log(err)
      );
    } else {
      // this.formValid = false;
    }
  }

  onDelete(id: number): void {
    this.onDelFromChild.emit(id);
  }
  //   this._scootersService.deleteScooter(id).subscribe(
  //     (res) => {
  //       alert(
  //         `Cow ${this.scooter.name} successfully deleted from DB!`
  //       );
  //       // this._router.navigate(['/scooters']);
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }
}
