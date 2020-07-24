import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map } from "rxjs/operators";
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  constructor(public afs: AngularFirestore, public router: Router) { }
  Stopped
  i = 1
  x
  subs
  deal_dur = 30
  BalanceP
  BalanceS
  client_name:''
  index:''
  desc:''
  total_assets:''
  revenue:''
  ebit:''
  net_inc:''
  num_shares:''
  market_cap:''
  sector:''
  client_of_bank:''
  sector_list: Array<any> = []
  scores:  Array<any> = []
  bank_list:  Array<any> = []
  acq_basepremium
  acq_premiumcap
  basequality
  equity
  expenses
  fees
  sales_basepremium
  sales_premiumcap
  async ngOnInit() {
    await this.afs.collection("Teacher").doc('Duration').valueChanges().subscribe((res: any) => {
      this.afs.collection("Teacher").doc('Duration').get().toPromise().then(doc=>{
        this.deal_dur = doc.data().val
        
      })
      
      // if(this.activate==true) alert('Game has stopped')
    });
    this.afs.collection('Teacher').doc('Stop').valueChanges().subscribe((res: any) => {
      this.Stopped = res.Stopped
      this.afs.collection("Teacher").get().toPromise().then(querySnapshot=>{
        this.bank_list =[]
          
          querySnapshot.forEach(doc=>{
              if(doc.id!='Activation' && doc.id!='Stop' && doc.id!='info' && doc.id!='Duration' ){
                this.bank_list.push(doc.id);
              }
              console.log('bank list', this.bank_list)
              
        })
       
      });
      if (this.Stopped == true) {
        setTimeout(() => {
          this.afs.collection('Teacher').doc('BalanceP').valueChanges().subscribe((res: any) => {
            this.BalanceP = res
            console.log(this.BalanceP)
          })
          this.afs.collection('Teacher').doc('BalanceS').valueChanges().subscribe((res: any) => {
            this.BalanceS = res
            console.log(this.BalanceS)
          })
        }, 1000);
      }
    })
    this.afs.collection("Teacher").doc('info').get().toPromise().then(res=>{
      this.acq_basepremium = res.data().acq_basepremium
      
      this.acq_premiumcap = res.data().acq_premiumcap
      
      this.basequality = res.data().basequality
      
      this.equity  = res.data().equity
      
      this.expenses  = res.data().expenses
      
      this.fees = res.data().fees
      
      this.sales_basepremium = res.data().sales_basepremium
      
      this.sales_premiumcap  = res.data().sales_premiumcap
      
  });
    this.afs.collection("sector_fit").get().toPromise().then(querySnapshot=>{
      this.sector_list =[]
        
        querySnapshot.forEach(doc=>{
            
              this.sector_list.push(doc.id);
            
            
            
      })
     
    });
    
    await this.afs.collection('deals').valueChanges().subscribe(() => {
      
      this.afs.collection("deals").get().toPromise().then(querySnapshot=>{
        this.scores = []
        querySnapshot.forEach(doc=>{
            var t = {score:0,bank:"xyz"}
            t.score = doc.data().score
            t.bank = doc.id
            console.log(t)
            this.scores.push(t)
            //console.log(doc)
        }); 
      });
  })

  }
  ModifyInfo(){

    this.afs.collection('Teacher').doc('info').update({
      acq_basepremium: this.acq_basepremium,
      acq_premiumcap: this.acq_basepremium,
      basequality: this.basequality,
      equity: this.equity,
      expenses: this.expenses,
      fees: this.fees,
      sales_basepremium: this.sales_basepremium,
      sales_premiumcap: this.sales_premiumcap
    })
    alert('Changes saved successfully')
  }
  Activate() {
    this.afs.collection('Teacher').doc('Activation').set({
      Activated: true
    },{merge:true})
    alert('Activated')
  }
  
  // Pause() {
  //   this.afs.collection('Teacher').doc('Activation').set({
  //     Activfdeactivateated: false
  //   })
  //   clearInterval(this.x)
  //   alert('PAUSED');
  // }
  deleteQueryBatch(db, query, resolve, reject) {
    query.get()
      .then((snapshot) => {
        // When there are no documents left, we are done
        if (snapshot.size === 0) {
          return 0;
        }

        // Delete documents in a batch
        let batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        return batch.commit().then(() => {
          return snapshot.size;
        });
      }).then((numDeleted) => {
        if (numDeleted === 0) {
          resolve();
          return;
        }

        // Recurse on the next process tick, to avoid
        // exploding the stack.

      })
      .catch(reject);
  }

  Reset() {
    clearInterval(this.x)
    this.i = 1
  
    this.afs.collection('Teacher').doc('Activation').set({
      Activated: false,
      ActivatePerformance: false
    })

    this.afs.collection('Teacher').doc('Stop').set({
      Stopped: false
    })
    
    let chatsCollection:AngularFirestoreCollection<any>=this.afs.collection('chats')
    let x=chatsCollection.snapshotChanges().pipe(map(changes=>{
      return changes.map(a=>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data}
      })
    })).subscribe(items=>{
        items.forEach(chat=>{
            this.afs.collection('chats').doc(`${chat.id}`).update({messages:firebase.firestore.FieldValue.delete()});
        })

     });
    setInterval(()=>{
      x.unsubscribe()
    },10000)
    this.afs.collection('announcements').doc('announcement').update({
      messages:firebase.firestore.FieldValue.delete()
    })
    console.log('clearing announcements')
    this.afs.collection('announcements2').doc('announcement').update({
      messages:firebase.firestore.FieldValue.delete()
    })
    
    let dealsCollection:AngularFirestoreCollection<any>=this.afs.collection('deals')
    let y=dealsCollection.snapshotChanges().pipe(map(changes=>{
      return changes.map(a=>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data}
      })
    })).subscribe(items=>{
        items.forEach(deal=>{
            this.afs.collection('deals').doc(`${deal.id}`).update({offer:firebase.firestore.FieldValue.delete(),score:0,roe:-10});
        })

     });
     setInterval(()=>{
      y.unsubscribe()
    },10000)
  

    let pendingrecoffersCollection:AngularFirestoreCollection<any>=this.afs.collection('deals')
    let a=pendingrecoffersCollection.snapshotChanges().pipe(map(changes=>{
      return changes.map(a=>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data}
      })
    })).subscribe(items=>{
        items.forEach(deal=>{
            this.afs.collection('pend_sent').doc(`${deal.id}`).set({offer:firebase.firestore.FieldValue.delete()},{merge:true});
        })

     });
     setInterval(()=>{
      a.unsubscribe()
    },10000)

    let pendingsentoffersCollection:AngularFirestoreCollection<any>=this.afs.collection('deals')
    let b=pendingsentoffersCollection.snapshotChanges().pipe(map(changes=>{
      return changes.map(a=>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data}
      })
    })).subscribe(items=>{
        items.forEach(deal=>{
            this.afs.collection('pend_rec').doc(`${deal.id}`).set({offer:firebase.firestore.FieldValue.delete()},{merge:true});
        })

     });
     setInterval(()=>{
      b.unsubscribe()
    },10000)
    

    this.afs.collection('Teacher').get().toPromise().then(querysnapshot => {
          
      querysnapshot.forEach(snapshot=>{
        if (snapshot.data().messages) {
          for(const key in snapshot.data().messages){
            
            if(snapshot.data().messages[key].init_bank!=snapshot.id){
              let val = snapshot.data().messages[key]
              console.log(snapshot.id,"check")
              this.afs.firestore.collection('Teacher').doc(snapshot.id).update({
                messages: firebase.firestore.FieldValue.arrayRemove(val)
              });
              console.log(val.client_name,val.init_bank,snapshot.id);
              this.afs.firestore.collection('Teacher').doc(snapshot.data().messages[key].init_bank).update({
                messages: firebase.firestore.FieldValue.arrayUnion(val)
              });
            }
          }
        }

      })
  })
    .catch(err => {
      console.log('Error getting documents', err);
    })
    this.afs.collection('Teacher').doc('Activation').set({
      ActivatePerformance: false
    })
    alert('DATA HAS BEEN RESET')
  }

  Stop() {
    // this.afs.collection('Teacher').doc('Stop').set({
    //   Stopped: true
    // })
    this.afs.collection('Teacher').doc('Activation').set({
      Activated: false
    },{merge:true})

    clearInterval(this.x)
    alert('Game is stoppped')


    // setTimeout(() => {
    //   this.afs.collection('Teacher').doc('BalanceP').valueChanges().subscribe((res: any) => {
    //     this.BalanceP = res
    //     console.log(this.BalanceP)
    //   })
    //   this.afs.collection('Teacher').doc('BalanceS').valueChanges().subscribe((res: any) => {
    //     this.BalanceS = res
    //     console.log(this.BalanceS)
    //   })
    // }, 5000);
  }
  changeDuration(){
    this.afs.collection('Teacher').doc('Duration').set({
      val: Number(this.deal_dur)
    },{merge:true})
    alert("Duration changed")
  }
  Deactivateperformance(){
    this.afs.collection('Teacher').doc('Activation').set({
      ActivatePerformance: false
    },{merge:true})
    alert("Performance has been deactivated")
  }
  Activateperformance(){
    this.afs.collection('Teacher').doc('Activation').set({
      ActivatePerformance: true
    },{merge:true})
    alert('Performance Activated!')
    this.afs.collection("Teacher").doc('info').get().toPromise().then(res=>{
      this.acq_basepremium = res.data().acq_basepremium
      
      this.acq_premiumcap = res.data().acq_premiumcap
      
      this.basequality = res.data().basequality
      
      this.equity  = res.data().equity
      
      this.expenses  = res.data().expenses
      
      this.fees = res.data().fees
      
      this.sales_basepremium = res.data().sales_basepremium
      
      this.sales_premiumcap  = res.data().sales_premiumcap
      
    });
    this.afs.collection('deals').get().toPromise().then(querysnap => {
      querysnap.forEach(res=>{
      var num_acq = 0
      var acq_quality=0
      var acq_premium=(0)
      let acq_fees=0
      let num_sales=0
      let sales_quality=0
      let sales_premium=0
      let sales_fees=0
      try{
      res.data().offer.forEach(deal=>{
        if(deal.offer_made_by==res.id){
          num_acq+=1
          acq_quality+=Number(deal.score)
          acq_premium+=Number(deal.price)
        }
        else{
          num_sales+=1
          sales_quality+=Number(deal.score)
          sales_premium+=Number(deal.price)
        }
      })
    }catch(Err){
      console.log('no deals')
    }
      if(num_acq>0){
        
        acq_premium = (acq_premium)/(num_acq)
        acq_quality = (acq_quality)/(num_acq)
        
        acq_premium =  Number(acq_premium.toFixed(2))
        
        acq_quality = Number(acq_quality.toFixed(2))
        let base_fees = this.fees*num_acq
        
        acq_fees = Math.min(Math.max(0,this.acq_basepremium-acq_premium),this.acq_premiumcap)*(base_fees/100)+Math.max(0,acq_quality-this.basequality)/(num_acq)*base_fees+base_fees;
        acq_fees = Number(acq_fees.toFixed(2) )
      }
      if(num_sales>0){
        
          sales_premium = (sales_premium)/(num_sales)
          sales_quality = (sales_quality)/(num_sales)
          sales_premium = Number(sales_premium.toFixed(2))
          sales_quality = Number(sales_quality.toFixed(2))
          let base_fees = this.fees*num_sales
          sales_fees = Math.min(Math.max(0,sales_premium-this.sales_basepremium),this.sales_premiumcap)*(base_fees/100)+Math.max(0,sales_quality-this.basequality)/(num_sales)*base_fees+base_fees;
          sales_fees = Number(sales_fees.toFixed(2))
      }
      let total_acq_sales = acq_fees+sales_fees
      let net_income = total_acq_sales - this.expenses
      net_income =  Number(net_income.toFixed(2))
      let roe = (net_income)*100/this.equity
      roe = Number(roe.toFixed(2))
      
      this.afs.collection('deals').doc(res.id).update({
        roe: Number(roe)
      })
  })
})
  }
  addClient(){
    let text = {
      client_name: this.client_name,
      index: this.index,
      desc:this.desc,
      total_assets:this.total_assets,
      sector: this.sector,
      revenue: this.revenue,
      ebit:this.ebit,
      net_inc: this.net_inc,
      num_shares:this.num_shares,
      market_cap:this.market_cap,
      init_bank: this.client_of_bank
    }
    console.log(this.client_of_bank);
    try{
    this.afs.collection('Teacher').doc(this.client_of_bank).update({
      messages: firebase.firestore.FieldValue.arrayUnion(text)
    })
    this.afs.collection('offers').doc(this.client_name).set({
      sector:this.sector,
      bank: this.client_of_bank
    },{merge:true})
    alert('Client added to '+this.client_of_bank+" succesfully!")
  }
  catch(error){
    alert('Fill all fields')
  }
  }
  addNewClient(){
    this.client_name=''
    this.index=''
    this.desc=''
    this.total_assets=''
    this.revenue=''
    this.ebit=''
    this.net_inc=''
    this.num_shares=''
    this.market_cap=''
    this.sector=''
  
}
Logout() {
    
  if (this.subs != undefined)
    this.subs.unsubscribe();
  this.router.navigate(['/'])
  firebase.auth().signOut();
  localStorage.clear();
  // this.NewsSubs.unsubscribe();
  // this.ActivationsSub.unsubscribe();
  // this.LinksSubs.unsubscribe();
}
  
}

// let formMessage = firebase.database().ref('register');

//listen for submit event//(1)
// document
//   .getElementById('registrationform')
//   .addEventListener('submit', formSubmit);

//Submit form(1.2)
// function formSubmit(e) {
//   e.preventDefault();
//   // Get Values from the DOM
//   let name = document.querySelector('#name').value;
//   let email = document.querySelector('#email').value;
//   let password = document.querySelector('#password').value;
//   let bio = document.querySelector('#bio').value;
//   let job = document.querySelector('#job').value;
//   let interest = document.querySelector('#interest').value;

//   //send message values
//   sendMessage(name, email, password, bio, job, interest);

//   //Show Alert Message(5)
//   document.querySelector('.alert').style.display = 'block';

//   //Hide Alert Message After Seven Seconds(6)
//   setTimeout(function() {
//     document.querySelector('.alert').style.display = 'none';
//   }, 7000);

//   //Form Reset After Submission(7)
//   document.getElementById('registrationform').reset();
// }

//Send Message to Firebase(4)



