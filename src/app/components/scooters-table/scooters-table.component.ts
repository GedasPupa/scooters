import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IScooter } from 'src/app/models/Scooter';
import { ScootersService } from 'src/app/services/scooters.service';

@Component({
  selector: 'app-scooters-table',
  template: `
    <form #newScooter="ngForm" class="newScooter">
      <h5>Pridėk naują paspirtuką:</h5>
      <p
        *ngIf="newScooter.invalid && newScooter.submitted"
        class="alert alert-danger"
      >
        The form is not valid. Please check all fields!
      </p>
      <div>
        Registracijos numeris:
        <input
          type="text"
          #regNumeris="ngModel"
          ngModel
          name="name"
          required
          minlength="8"
          maxlength="8"
        />
        <span
          class="alert alert-warning"
          *ngIf="regNumeris.invalid && newScooter.submitted"
          >Not valid</span
        >
      </div>
      <div>
        Paskutinis naudojimas:
        <input
          type="date"
          max="{{ today }}"
          [(ngModel)]="today"
          name="last_use"
          required
        />
      </div>
      <div>
        Viso km:
        <input
          type="number"
          min="0"
          max="9999.99"
          #visoKm="ngModel"
          ngModel
          name="total_ride"
          required
        />
        <span
          class="alert alert-warning"
          *ngIf="visoKm.invalid && newScooter.submitted"
          >Not valid</span
        >
      </div>
      <button type="submit" (click)="addScooter()" class="btn btn-success">
        Pridėti
      </button>
    </form>

    <div class="statistika">
      <h5>Statistika:</h5>
      <p>Iš viso paspirtukų: {{ total_records }}</p>
      <p>Iš viso kilometrų: {{ total_kilometers }}</p>
    </div>

    <div class="filter">
      <h5>Filtras:</h5>
      <div>
        <label>Find scooter by name:</label>
        <input type="text" (input)="onFilter($event)" class="filter-input" />
      </div>
      <div>
        <button (click)="onSort('total_ride')" class="btn btn-primary">
          Rūšiuoti pagal KM
        </button>
        <button (click)="onSort('last_use')" class="btn btn-secondary">
          Rūšiuoti pagal DATĄ
        </button>
      </div>
    </div>

    <table class='table table-light' *ngIf="filteredScooters.length > 0; else noScootersWarning">
      <thead class="table-success">
        <tr>
          <th>ID <i (click)="onSort('id')" class="fa fa-angle-{{this.field === 'id' ? (this.sortAsc ? 'down' : 'up') : 'down'}}"></i></th>
          <th>Name <i (click)="onSort('name')" class="fa fa-angle-{{this.field === 'name' ? (this.sortAsc ? 'down' : 'up') : 'down'}}"></i></th>
          <th>Busy <i (click)="onSort('busy')" class="fa fa-angle-{{this.field === 'busy' ? (this.sortAsc ? 'down' : 'up') : 'down'}}"></i></th>
          <th>Last use <i (click)="onSort('last_use')" class="fa fa-angle-{{this.field === 'last_use' ? (this.sortAsc ? 'down' : 'up') : 'down'}}"></i></th>
          <th>Total km <i (click)="onSort('total_ride')" class="fa fa-angle-{{this.field === 'total_ride' ? (this.sortAsc ? 'down' : 'up') : 'down'}}"></i></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of filteredScooters">
          <td>{{item.id}}</td>
          <td><a [routerLink]="['/scooters', item.id]">{{item.name}}</a></td>
          <td>{{item.busy ? "užimtas" : "laisvas"}}<input type="checkbox" [(ngModel)]="item.busy" id="checkbox"/></td>
          <td>{{item.last_use | date}}<input type="date" #dateInput="ngModel" name="last_use" id="last_use" [(ngModel)]="item.last_use" max={{maxToday}}></td>
          <td id="kmInput">{{item.total_ride}} <input type="number" min="0" max="9999"  name="kmInput" #kmInput="ngModel" [(ngModel)]="item.extra"></td>
          <td>
            <!-- <button [routerLink]="['/scooters', item.id]" class="btn btn-outline-success action">Update</button> -->
            <button (click)="onUpdate(item)" class="btn btn-outline-success action">Update</button>
            <button (click)="onDelete(item.id)" class="btn btn-outline-danger action">Delete</button>
          </td>
        </tr>
      </tbody>
      <tfoot class="table-success">
        <tr>
          <td>Total scooters: {{total_records}}</td>
          <td></td>
          <td></td>
          <td></td>
          <td *ngIf="recordsLoaded">Total kilometers: {{total_kilometers}}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
    <ng-template #noScootersWarning>
      <p *ngIf="dataLoaded" class="alert alert-warning">Sorry, no data!</p>
    </ng-template>

  `,
  styleUrls: ['./scooters-table.component.css'],
})
export class ScootersTableComponent implements OnInit {
  constructor(private _scootersService: ScootersService) {}

  scooters: IScooter[] = [];
  filteredScooters: IScooter[] = [];
  field: string = '';
  sortAsc: boolean = true;
  dataLoaded: boolean = false;
  total_records: number = 0;
  total_kilometers: number = 0;
  recordsLoaded: boolean = false;
  stateError: any = undefined;
  today: string = new Date().toISOString().slice(0, 10);
  maxToday: string = new Date().toISOString().slice(0, 10);

  @ViewChild('newScooter') newScooter!: NgForm;
  @ViewChild('regNumeris') regNumeris!: NgForm;
  @ViewChild('kmInput') kmInput!: NgForm;
  @ViewChild('dateInput') dateInput!: NgForm;

  ngOnInit() {
    if (this.stateError) {
      alert(`${this.stateError} Please choose scooter from a list.`);
    }
    this._scootersService.getAllScooters().subscribe(
      (res) => {
        this.scooters = res;
        this.filteredScooters = this.scooters;
        this.dataLoaded = true;
      },
      (err) => {
        console.log(err);
        this.dataLoaded = true;
      }
    );
    this.getScootersSum();
    this.getTotalKilometers();
  }

  onFilter($event: any): void {
    let inp = $event.target.value.toLocaleLowerCase();
    this.filteredScooters = this.scooters.filter(
      (sc) => sc.name.toLocaleLowerCase().indexOf(inp) != -1
    );
  }

  onSort(field: string): void {
    let fieldAsKey = field as keyof IScooter;
    this.field = field;
    if (this.sortAsc) {
      this.filteredScooters.sort((a, b) => {
        return a[fieldAsKey] < b[fieldAsKey] ? -1 : 0;
      });
      this.sortAsc = !this.sortAsc;
    } else {
      this.filteredScooters.sort((a, b) => {
        return a[fieldAsKey] > b[fieldAsKey] ? -1 : 0;
      });
      this.sortAsc = !this.sortAsc;
    }
  }

  addScooter() {
    if (this.newScooter.valid) {
      this._scootersService
        .createScooter({ busy: 0, ...this.newScooter.value })
        .subscribe(
          (res) => {
            this.scooters.push(res);
            this.filteredScooters = this.scooters;
            this.getScootersSum();
            this.getTotalKilometers();
          },
          (err) => console.log(err)
        );
    }
  }

  onDelete(id: number): void {
    this._scootersService.deleteScooter(id).subscribe(
      (res) => {
        alert(
          `Scooter ${
            this.scooters.find((c) => c.id == id)?.name
          } successfuly deleted from DB!`
        );
        this.scooters = this.scooters.filter((sc) => sc.id !== id);
        this.filteredScooters = this.scooters;
        this.getScootersSum();
        this.getTotalKilometers();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onUpdate(scooter: IScooter): void {
    if (this.kmInput.valid && scooter.extra != undefined) {
      let temp_total_ride = scooter.total_ride;
      scooter.total_ride += scooter.extra;
      
      this._scootersService.updateScooter(scooter).subscribe(
        res => {
          alert(
            `Scooter ${
              this.scooters.find((c) => c.id == scooter.id)?.name
            } successfuly updated in DB!`
          );
          console.log(res)
        },
        err => {
          scooter.total_ride = temp_total_ride;
          alert(err.error.errors[0].msg);
        }
      )
    }
  }

  getScootersSum() {
    this._scootersService.getRecordsSum().subscribe(
      (res) => {
        this.total_records = res.total_scooters;
        this.recordsLoaded = true;
      },
      (err) => console.log(err)
    );
  }

  getTotalKilometers() {
    this._scootersService.getTotalKilometers().subscribe(
      (res) => {
        this.total_kilometers = res.total_kilometers;
      },
      (err) => console.log(err)
    );
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
    return dformat;
  }
}
