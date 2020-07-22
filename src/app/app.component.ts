import { Component,OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/app'
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'reverse' })

export class ReversePipe implements PipeTransform {
  transform(value) {
    return value.slice().reverse();
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  subs
  bank
  pending_rec: Array<any>=[]
  pending_sent: Array<any>=[]
  constructor(public afs: AngularFirestore, public route: ActivatedRoute, public router: Router) { }
  title = 'tradingapp';
  ngOnInit() {
    
      this.bank =localStorage.getItem('user');
  
    console.log('yayy erj')
    
   
  }

  Logout() {
    if (this.subs != undefined)
      this.subs.unsubscribe();
    this.router.navigate(['/'])
    firebase.auth().signOut();
    // this.NewsSubs.unsubscribe();
    // this.ActivationsSub.unsubscribe();
    // this.LinksSubs.unsubscribe();
  }
}
