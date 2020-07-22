import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MarketComponent } from './market/market.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { ClientsComponent } from './clients/clients.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import * as firebase from 'firebase';
import { AngularFireModule, FirebaseApp } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { TeacherComponent } from './teacher/teacher.component';
import { DealsComponent } from './deals/deals.component';
import { PerformanceComponent } from './performance/performance.component';
import { SiminfoComponent } from './siminfo/siminfo.component';

const firebaseconfig = {
  apiKey: "AIzaSyC9l_-Jn4FDEm82BpBDlnuCXNEmaJVMco0",
  authDomain: "acquisitions-b8594.firebaseapp.com",
  databaseURL: "https://acquisitions-b8594.firebaseio.com",
  projectId: "acquisitions-b8594",
  storageBucket: "acquisitions-b8594.appspot.com",
  messagingSenderId: "395778460905",
  appId: "1:395778460905:web:2b6fa0c02766ef2220b478",
  measurementId: "G-WL0GFB6TP5"
};

firebase.initializeApp(firebaseconfig); 

@NgModule({
  declarations: [
    AppComponent,
    MarketComponent,
    AnnouncementsComponent,
    ClientsComponent,
    LoginComponent,
    TeacherComponent,
    DealsComponent,
    PerformanceComponent,
    SiminfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseconfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
