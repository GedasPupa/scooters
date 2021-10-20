import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IScooter } from 'src/app/models/Scooter';
import { ScootersService } from 'src/app/services/scooters.service';

@Component({
  selector: 'app-scooters',
  template: `
  <form #newScooter="ngForm" class="newScooter">
    <h5>Pridėk naują paspirtuką:</h5>
    <p *ngIf="newScooter.invalid && newScooter.submitted" class="alert alert-danger">
      The form is not valid. Please check all fields!
    </p>
    <div>Registracijos numeris: <input type="text" #regNumeris="ngModel" ngModel name="name" required minlength="8" maxlength="8"/>
      <span class="alert alert-warning" *ngIf="regNumeris.invalid && newScooter.submitted">Not valid</span>
    </div>
    <div>
      Paskutinis naudojimas:
      <input
        type="date"
        max={{today}}
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
      <span class="alert alert-warning" *ngIf="visoKm.invalid && newScooter.submitted">Not valid</span>
    </div>
    <button type="submit" (click)="addScooter()" class="btn btn-success">Pridėti</button>
  </form>

  <div class="statistika">
    <h5>Statistika:</h5>
    <p>Iš viso paspirtukų: {{total_records}}</p>
    <p>Iš viso kilometrų: {{total_kilometers}}</p>
  </div>

  <div class="filter">
    <h5>Filtras:</h5>
    <div>
      <label>Find scooter by name:</label>
      <input type="text" (input)="onFilter($event)" class="filter-input"/>
    </div>
    <div>
      <button (click)="onSort('total_ride')" class="btn btn-primary">Rūšiuoti pagal KM</button>
      <button (click)="onSort('last_use')" class="btn btn-secondary">Rūšiuoti pagal DATĄ</button>
    </div>
  </div>

  <table class="table table-success">
    <thead>
      <tr>
        <th style="width: 10px">Nr.</th>
        <th>Vardas</th>
        <th>Užimtumas</th>
        <th >Data</th>
        <th>Nauja Data</th>
        <th style="text-align: center;">Km</th>
        <th style="text-align: center;">Plius Km</th>
        <th >Veiksmai</th>
      </tr>
    </thead>
  </table>
  <ol>
    <li *ngFor="let s of filteredScooters">
      <app-scooter [scooterFromParent]="s" (onDelFromChild)="onDelete($event)"></app-scooter>
    </li>
  </ol>
  `,
  styleUrls: ['./scooters.component.css'],
})
export class ScootersComponent implements OnInit {
  constructor(
    private _scootersService: ScootersService,
    private _router: Router
  ) {}

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

  @ViewChild('newScooter') newScooter!: NgForm;
  @ViewChild('regNumeris') regNumeris!: NgForm;

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
      // this.formValid = true;
    } else {
      // this.formValid = false;
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
}
