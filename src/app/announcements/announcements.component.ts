import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/app'
import { Timestamp } from '@firebase/firestore-types';
@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {

  announcements
  bank
  subs
  IsTeacher
  announcements2
  activate
  performance
  deal_dur
  constructor(public afs: AngularFirestore, public route: ActivatedRoute, public router: Router) { }
  
  ngOnInit(): void {
    this.IsTeacher = localStorage.getItem('IsTeacher')
    console.log(this.IsTeacher)
    this.route.queryParams.subscribe((res) => {
      this.bank = res.name
    })
    this.afs.collection("Teacher").doc('Activation').valueChanges().subscribe((res: any) => {
      this.afs.collection("Teacher").doc('Activation').get().toPromise().then(doc=>{
        this.activate = doc.data().Activated
        this.performance = doc.data().ActivatePerformance
      })
    });
    
    this.bank = localStorage.getItem('user');
    
    this.afs.collection('announcements2').doc('announcement').valueChanges().subscribe((res:any) => {
      this.announcements2 = res.messages
    })
    
    this.afs.collection('announcements').doc('announcement').valueChanges().subscribe((res: any) => {
      console.log(res)
      this.announcements = res.messages
    })
    this.afs.collection("Teacher").doc('Duration').valueChanges().subscribe((res: any) => {
      this.afs.collection("Teacher").doc('Duration').get().toPromise().then(doc=>{
        this.deal_dur = doc.data().val
        
      })
    });
 
    setInterval(() => {
      
      this.announcements?.forEach(key=>{
        let time  = new Date();
        key.time=this.deal_dur-Math.floor((time.getTime()-key.init_time)/1000);
      })

      
    }, 1000);
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
