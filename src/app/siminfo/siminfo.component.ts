import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map } from "rxjs/operators";
import * as firebase from 'firebase/app'
@Component({
  selector: 'app-siminfo',
  templateUrl: './siminfo.component.html',
  styleUrls: ['./siminfo.component.css']
})
export class SiminfoComponent implements OnInit {

  constructor(public afs: AngularFirestore, public router: Router) { }
  clients: Array<any>=[]
  id = 1
  max_bank
  subs
  abc
  ngOnInit(): void {
    
    this.afs.collection("deals").get().toPromise().then(querySnapshot=>{
      
        
      querySnapshot.forEach(doc=>{
          this.max_bank = Number(doc.id.substr(4))
          
    })
   
  });
  this.afs.collection('Teacher').doc('bank'+this.id).snapshotChanges().subscribe((res: any) => {
    
    console.log(this.clients)
    this.afs.collection('Teacher').doc('bank'+this.id).get().toPromise().then(res=>{
        this.clients = res.data().messages
    });
  });
  }
  Change(num) {
    if(!(this.id==this.max_bank && Number(num)==1) && !(this.id==1 && Number(num)==-1) ){
                  try {
                    this.clients = []
                    this.id+=Number(num)
                    this.afs.collection('Teacher').doc('bank'+this.id).get().toPromise().then(res=>{
                      for(const key in res.data().messages){
                        this.clients.push(res.data().messages[key])
                      }
                  });    
                      

                  }
                  catch (Err) {
                    console.log(Err)
                  }

      }
 }
 ModifyInfo(event){
console.log(event)
this.afs.collection('Teacher').doc('bank'+this.id).get().toPromise().then(res=>{
  for(const key in res.data().messages){
    if(res.data().messages[key].client_name==event.client_name){
      console.log('found')
      this.afs.collection('Teacher').doc('bank'+this.id).update({
        messages: firebase.firestore.FieldValue.arrayRemove(res.data().messages[key])
      })
      console.log(res.data().messages[key])
      break
    }
  }
});
  let client ={
    client_name: event.client_name,
    desc: event.desc,

    ebit:event.ebit,

    index: event.index,

    market_cap:event.market_cap,

    net_inc:event.net_inc,

    num_shares:event.num_shares,

    revenue:event.revenue,

    sector:event.sector,

    total_assets:event.total_assets
  }
  this.afs.collection('Teacher').doc('bank'+this.id).update({
    messages: firebase.firestore.FieldValue.arrayUnion(client)

  })
  alert('Changes saved successfully')
}
DeleteClient(client){
  console.log(client)
  this.afs.collection('Teacher').doc('bank'+this.id).get().toPromise().then(res=>{
    for(const key in res.data().messages){
      console.log(res.data().messages[key],res.data().messages[key]==String(client))
      if(res.data().messages[key].client_name==client.client_name){
        console.log('found')
        this.afs.collection('Teacher').doc('bank'+this.id).update({
          messages: firebase.firestore.FieldValue.arrayRemove(res.data().messages[key])
        })
        
        break
      }
    }
  });
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
