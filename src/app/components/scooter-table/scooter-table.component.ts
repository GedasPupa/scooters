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
import { ScootersService } from 'src/app/services/scooters.service';

@Component({
  selector: 'app-scooter-table',
  template: `
    <!-- <form #updateScooter="ngForm"> -->
    <td>{{ scooterFromParent.name }}</td>
    <td>
      <label for="busy" id="for_busy">{{
        scooterFromParent.busy ? 'užimtas' : 'laisvas'
      }}</label>
      <input
        type="checkbox"
        #check="ngModel"
        name="busy"
        id="busy"
        [(ngModel)]="scooterFromParent.busy"
        ngModel
      />
    </td>
    <td>
      <label for="last_use" id="for_last_use">{{
        scooterFromParent.last_use | date
      }}</label>

      <input
        type="date"
        #dateInput="ngModel"
        name="last_use"
        id="last_use"
        [(ngModel)]="today"
        max="{{ maxToday }}"
      /><br /><span *ngIf="dateInput.invalid">Not Valid</span>
    </td>
    <td>
      <label for="total_ride" id="for_total_ride">{{
        scooterFromParent.total_ride
      }}</label>
      <input
        type="number"
        #kmInput="ngModel"
        name="total_ride"
        id="total_ride"
        min="0"
        max="9999.99"
        [(ngModel)]="kmInp"
      /><br /><span *ngIf="kmInput.invalid" style="color: salmon;"
        >Not valid</span
      >
    </td>
    <td>
      <button type="submit" (click)="onUpdate()" class="btn btn-warning action">
        Update
      </button>
      <button
        type="button"
        (click)="onDelete(scooterFromParent.id)"
        class="btn btn-danger action"
      >
        DELETE
      </button>
    </td>
    <!-- </form> -->
    <!-- <hr /> -->
  `,
  styleUrls: ['./scooter-table.component.css'],
})
export class ScooterTableComponent implements OnInit {
  @Input() scooterFromParent!: IScooter;
  @Output() onDelFromChild: EventEmitter<number> = new EventEmitter<number>();
  date!: string;
  maxToday: string;
  today: string = new Date().toISOString().slice(0, 10);
  scooter!: IScooter;
  kmInp: number | string = '';

  @ViewChild('updateScooter') updateScooter!: NgForm;
  @ViewChild('check') check!: NgForm;
  @ViewChild('dateInput') dateInput!: NgForm;
  @ViewChild('kmInput') kmInput!: NgForm;

  constructor(private _scootersService: ScootersService) {
    this.maxToday = this.today;
  }

  ngOnInit(): void {
    this.date = new Date(this.scooterFromParent.last_use)
      .toISOString()
      .slice(0, 10);
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
          this.today = this.maxToday;
          this.kmInp = '';
        },
        (err) => console.log(err)
      );
    }
  }

  onDelete(id: number): void {
    this.onDelFromChild.emit(id);
  }
}
