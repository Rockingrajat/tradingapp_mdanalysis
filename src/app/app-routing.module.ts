import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {AnnouncementsComponent} from './announcements/announcements.component';
import {ClientsComponent} from './clients/clients.component';
import {MarketComponent} from './market/market.component';
import {TeacherComponent} from './teacher/teacher.component';
import {DealsComponent} from './deals/deals.component';
import {SiminfoComponent} from './siminfo/siminfo.component';
import {PerformanceComponent} from './performance/performance.component';
const routes: Routes = [
  {path:'' ,component:LoginComponent},
  { path:'teacher',component:TeacherComponent},
  { path:'announcements',component:AnnouncementsComponent},
  { path :'clients',component:ClientsComponent},
  { path:'market',component:MarketComponent},
  { path:'performance',component:PerformanceComponent},
  {path:'deals',component:DealsComponent},
  {path:'siminfo',component:SiminfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
