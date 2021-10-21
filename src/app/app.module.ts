import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ScootersComponent } from './components/scooters/scooters.component';
import { ScooterComponent } from './components/scooter/scooter.component';
import { ScootersTableComponent } from './components/scooters-table/scooters-table.component';
import { ScooterTableComponent } from './components/scooter-table/scooter-table.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ScootersComponent,
    ScooterComponent,
    ScootersTableComponent,
    ScooterTableComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'scooters', component: ScootersComponent },
      { path: 'scooters/:id', component: ScooterComponent },
      { path: 'scooters-table', component: ScootersTableComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
