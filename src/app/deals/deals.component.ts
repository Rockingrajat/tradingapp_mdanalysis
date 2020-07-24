import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/app'
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {

  constructor(public afs: AngularFirestore, public myapp: AppComponent, public route: ActivatedRoute, public router: Router) { }
  client_name=""
  price=""
  bank=""
  subs
  sector
  bank_num
  add_info=' '
  docid
  myclient = ""
  client_list: Array<any> = []
  my_clients : Array<any> = []
  rec_offers: Array<any> = []
  my_announced_clients: Array<any> = []
  pending_rec: Array<any> = []
  pending_sent: Array<any> = []
  deals: Array<any>=[]
  bank_list: Array<any>=[]
  sector_of_acq
  activate
  performance
  deal_dur
  async ngOnInit(){
    this.bank = localStorage.getItem('user');
    await this.afs.collection("Teacher").doc('Duration').valueChanges().subscribe((res: any) => {
      this.afs.collection("Teacher").doc('Duration').get().toPromise().then(doc=>{
        this.deal_dur = doc.data().val
        
      })
      
      // if(this.activate==true) alert('Game has stopped')
    });
    
    await this.afs.collection("Teacher").doc('Activation').valueChanges().subscribe((res: any) => {
      this.afs.collection("Teacher").doc('Activation').get().toPromise().then(doc=>{
        this.activate = doc.data().Activated
        this.performance = doc.data().ActivatePerformance
      })
      
      // if(this.activate==true) alert('Game has stopped')
    });
    

  this.afs.collection('Teacher').doc(this.bank).valueChanges().subscribe(() => {
    
    this.afs.collection("Teacher").doc(this.bank).get().toPromise().then(doc=>{
      this.my_clients = []
      if (doc.exists) {
          
        if (doc.data().messages && doc.data().messages.length>0) {
          for(const key in doc.data().messages){
            const index = this.my_announced_clients.indexOf(doc.data().messages[key].client_name, 0);
            if(index==-1){
            this.my_clients.push(doc.data().messages[key].client_name)
            }
          }
          
          
      } else {
          console.log("No such document!");
      }
    }
  }).catch(function(error) {
      console.log("Error getting my clients:", error);
  });

  })
  this.afs.collection('announcements').doc('announcement').valueChanges().subscribe((res:any) => {
    this.afs.collection('announcements').doc('announcement').get().toPromise().then(doc=>{
      this.my_announced_clients = []
      if (doc.data().messages && doc.data().messages.length>0) {
        for(const key in doc.data().messages){
          let val = doc.data().messages[key]
          if(val.bank_num==this.bank)
          
            this.my_announced_clients.push(val.client_name)
        }
        
        
    }
    })
    this.afs.collection("Teacher").doc(this.bank).get().toPromise().then(doc=>{
      this.my_clients = []
      if (doc.exists) {
          
        if (doc.data().messages && doc.data().messages.length>0) {
          for(const key in doc.data().messages){
            const index = this.my_announced_clients.indexOf(doc.data().messages[key].client_name, 0);
            if(index==-1){
            this.my_clients.push(doc.data().messages[key].client_name)
            }
          }
          
          
      } else {
          console.log("No such document!");
      }
    }
  }).catch(function(error) {
      console.log("Error getting my clients:", error);
  });

})

  this.afs.collection("Teacher").get().toPromise().then(querySnapshot=>{
    this.bank_list =[]
      
      querySnapshot.forEach(doc=>{
          if(doc.id!=this.bank && doc.id!='Activation' && doc.id!='Stop' && doc.id!='info' && doc.id!='Duration' ){
            this.bank_list.push(doc.id);
          }
          console.log('bank list', this.bank_list)
          
    })
   
  });
  setInterval(() => {
    
    
    this.pending_rec.forEach(key=>{
      if(key.start_timer==1){
        let time = new Date();
        key.time=this.deal_dur-Math.ceil((time.getTime()-key.init_time)/1000);
      }
      else{
        key.time = this.deal_dur
      }
    })
    this.pending_sent.forEach(key=>{
      if(key.start_timer==1){
        let time = new Date();
        key.time=this.deal_dur-Math.ceil((time.getTime()-key.init_time)/1000);
      }
      else{
        key.time = this.deal_dur
      }
    })
    
  }, 1000);
  this.afs.collection('pend_rec').doc(this.bank).valueChanges().subscribe(() => {
    this.pending_rec = []
    this.afs.collection("pend_rec").doc(this.bank).get().toPromise().then(doc=>{
      if (doc.exists) {
          
        if (doc.data().offer && doc.data().offer.length>0) {
          
            this.pending_rec = doc.data().offer
          
          
          
      } else {
          console.log("No such document!");
      }
    }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });

  this.rec_offers = []
      this.afs.collection('pend_rec').doc(this.bank).get().toPromise().then(doc => {
     
          if (doc.data().unannounced && doc.data().unannounced.length>0) {
            
            this.rec_offers= doc.data().unannounced

          }

      })
  })
  this.afs.collection('pend_sent').doc(this.bank).valueChanges().subscribe(() => {
    this.pending_sent = []
    this.afs.collection("pend_sent").doc(this.bank).get().toPromise().then(doc=>{
      if (doc.exists) {
          
        if (doc.data().offer && doc.data().offer.length>0) {
          
            this.pending_sent = doc.data().offer
          
          
          
      } else {
          console.log("No such document!");
      }
    }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
  })
   
    this.afs.collection('deals').doc(this.bank).valueChanges().subscribe(() => {
            
            this.afs.collection("deals").doc(this.bank).get().toPromise().then(doc=>{
              if (doc.exists) {
                  
                this.deals = doc.data().offer 
                  
              } else {
                  console.log("No such document!");
              }
            })
          
    });
  
    
    


  }
  async getClients(bank){
   let forbid = []
   
    await this.afs.collection('announcements').doc('announcement').get().toPromise().then(doc=>{
      if (doc.data().messages && doc.data().messages.length>0) {
        for(const key in doc.data().messages){
          let val = doc.data().messages[key]
          if(val.offer_made_by==bank)
          console.log(val.client_name)
            forbid.push(val.myclient)
        }
        
        
    }
    })
    console.log(forbid)
    this.client_list = []
    if(bank){
          this.afs.collection("Teacher").doc(bank).get().toPromise().then(doc=>{
            if (doc.exists) {
                
              if (doc.data().messages && doc.data().messages.length>0) {
                for(const key in doc.data().messages){
                  const index = forbid.indexOf(doc.data().messages[key].client_name, 0);
                  if(index==-1){
                    this.client_list.push(doc.data().messages[key].client_name)
                    console.log(doc.data().messages[key].client_name)
                  }
                 
                }
                
                
            } else {
                console.log("No such document!");
            }
          }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
  }
  else{
    alert('Enter correct bank number, refer market info')
  }
  console.log(this.client_list)
  }
  async SendOffer(){
    let val = (this.client_name!="") && (this.bank!="") && (this.price!="") && (this.myclient!="");
    console.log(val);
  if(val){
    await this.afs.collection("offers").doc(this.client_name).get().toPromise().then(doc=>{
      if (doc.exists) {
          this.sector = doc.data().sector;          
      } else {
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });

  await this.afs.collection("offers").doc(this.myclient).get().toPromise().then(doc=>{
    if (doc.exists) {
        this.sector_of_acq = doc.data().sector;          
    } else {
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
  
  
  let offere = {
    client_name: this.client_name,
    offer_made_by: this.bank,
    bank_num: this.bank_num,
    price: this.price,
    info:this.add_info,
    sector:this.sector,
    myclient: this.myclient,
    sector_of_acq:this.sector_of_acq,
    init_time:0 ,
    time:0,
    start_timer:0
  }
  
  
  
  this.afs.collection('pend_rec').doc(this.bank_num).set({
    unannounced: firebase.firestore.FieldValue.arrayUnion(offere)
  },{merge:true})
  
  this.afs.collection('pend_sent').doc(this.bank).set({
    offer: firebase.firestore.FieldValue.arrayUnion(offere)
  },{merge:true})

  alert('Offer sent succesfully to '+this.bank_num)
  }
else{
    alert('Fill in ALL Fields!')
}



}
CancelOffer(x){
  console.log('Here')
  x.time = 0
  this.afs.collection('pend_rec').doc(x.bank_num).update({
    unannounced: firebase.firestore.FieldValue.arrayRemove(x)
  })
  this.afs.collection('pend_rec').doc(x.bank_num).update({
    offer: firebase.firestore.FieldValue.arrayRemove(x)
  })
  this.afs.collection('pend_sent').doc(x.offer_made_by).update({
    offer: firebase.firestore.FieldValue.arrayRemove(x)
  })
  this.afs.firestore.collection('announcements').where('messages', 'array-contains',x ).get().then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }
    else{
        this.afs.collection('announcements').doc('announcement').update({
          
          messages: firebase.firestore.FieldValue.arrayRemove(x)
        })
        x.confirmed = 0
        x.cancelled_by = this.bank
        this.afs.collection('announcements2').doc('announcement').update({
          messages: firebase.firestore.FieldValue.arrayUnion(x)
        })
    }
  })

  
}
  
async ConfirmReceivedOffer(event){
  let client = event.client_name;
  let new_bank = event.offer_made_by;
  console.log(event)
  await this.afs.firestore.collection("announcements").get().then(querySnapshot=>{
    querySnapshot.forEach(doc=>{
        // doc.data() is never undefined for query doc snapshots
        
        if (doc.data().messages && doc.data().messages.length>0) {
        for(const key in doc.data().messages){
          if(doc.data().messages[key].client_name==client){
            console.log('Announcement Found',doc.data().messages[key]);
            
            this.afs.collection('announcements').doc('announcement').update({
            messages: firebase.firestore.FieldValue.arrayRemove(doc.data().messages[key])
            
            }).catch(function(error) {
              console.log("Error getting document:", error);
          });
          let val = doc.data().messages[key]
          const index = this.my_announced_clients.indexOf(val.client_name, 0);
            if (index > -1) {
              this.my_announced_clients.splice(index, 1);
            }
            val.confirmed = 0
            val.cancelled_by = this.bank
            this.afs.collection('announcements2').doc('announcement').update({
              messages: firebase.firestore.FieldValue.arrayUnion(val)
            })

            break
          }
        }
      }
    });
});

this.afs.firestore.collection("pend_rec").doc(event.bank_num).get().then(doc=>{
  
            
  if (doc.data().offer.length>0) {
  for(const key in doc.data().offer){
    
    if(doc.data().offer[key].client_name==event.client_name){
      
      
      this.afs.collection('pend_rec').doc(this.bank).update({
      offer: firebase.firestore.FieldValue.arrayRemove(doc.data().offer[key])
      
      }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    this.afs.collection('pend_sent').doc(doc.data().offer[key].offer_made_by).update({
      offer: firebase.firestore.FieldValue.arrayRemove(doc.data().offer[key])
    })
    }
  }
}

  });
  
  this.my_announced_clients.push(event.client_name)
  await this.afs.firestore.collection('pend_rec').doc(this.bank).update({
    unannounced: firebase.firestore.FieldValue.arrayRemove(event)
  });
  await this.afs.firestore.collection('pend_sent').doc(event.offer_made_by).update({
    offer: firebase.firestore.FieldValue.arrayRemove(event)
  })
  event.start_timer = 1;
  let time  = new Date();
  event.init_time = time.getTime();
  await this.afs.collection('pend_rec').doc(this.bank).set({
    offer: firebase.firestore.FieldValue.arrayUnion(event)
  },{merge:true})
  await this.afs.firestore.collection('pend_sent').doc(event.offer_made_by).update({
    offer: firebase.firestore.FieldValue.arrayUnion(event)
  })
  await this.afs.collection('announcements').doc('announcement').update({
    messages: firebase.firestore.FieldValue.arrayUnion(event)
  })
  console.log(event)
  
  //updating scores:
  var score
  await this.afs.collection('sector_fit').doc(event.sector).get().toPromise().then(doc=>{
    if (doc.exists) {
        score = doc.data()[event.sector_of_acq];          
        console.log('Score between cleints',doc.data()[event.sector_of_acq])
    } else {
        console.log("No such score!");
    }
  }).catch(err => {
    console.log('Error getting score', err);
  })
  console.log(score)
  var market_cap_client
  var market_cap_acq
  await this.afs.collection('Teacher').doc(event.bank_num).get().toPromise().then(doc=>{
      doc.data().messages.forEach(key=>{
        if(key.client_name==event.client_name){
          market_cap_client = key.market_cap
        }
      })
  })

  await this.afs.collection('Teacher').doc(event.offer_made_by).get().toPromise().then(doc=>{
    doc.data().messages.forEach(key=>{
      if(key.client_name==event.myclient){
        market_cap_acq = key.market_cap
      }
    })
})
var prevscore1
var prevscore2
    //upating score
  await this.afs.collection('deals').doc(event.bank_num).get().toPromise().then(doc=>{
    if (doc.exists) {
        console.log(doc.data())
        prevscore1 = doc.data()['score'];   
        // console.log('score1',event.sector_of_acq,doc.data()[event.sector_of_acq]) 
        for(const key in doc.data()){
         console.log(key)
        }
        //   if(key==event.sector_of_acq){
        //     prevscore1 = doc.data()[key]
        //   }
        // }
        console.log(prevscore1)      
    } else {
        console.log("No such document!");
    }
  })
  await this.afs.collection('deals').doc(event.offer_made_by).get().toPromise().then(doc=>{
    if (doc.exists) {
        prevscore2 = doc.data()['score']; 
        console.log('score2',doc.data().score)                
        console.log(prevscore2)
    } else {
        console.log("No such document!");
    }
  })
  console.log('prevscores',prevscore1,prevscore2)
  await setTimeout(() => {
    this.afs.firestore.collection('announcements').where('messages', 'array-contains',event ).get().then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
      else{
        this.afs.collection('announcements').doc('announcement').update({
          messages: firebase.firestore.FieldValue.arrayRemove(event)
        })
        this.afs.firestore.collection("pend_sent").doc(this.bank).get().then(doc=>{
  
      
          if (doc.data().offer && doc.data().offer.length>0) {
          for(const key in doc.data().offer){
            if(doc.data().offer[key].myclient==event.client_name){
              console.log('Client Found',doc.data().offer[key]);
              
              this.afs.collection('pend_sent').doc(this.bank).update({
              offer: firebase.firestore.FieldValue.arrayRemove(doc.data().offer[key])
              
              }).catch(function(error) {
                console.log("Error getting document:", error);
            });
            this.afs.collection('pend_rec').doc(doc.data().offer[key].bank_num).update({
              unannounced: firebase.firestore.FieldValue.arrayRemove(doc.data().offer[key])
            })  
            }
          }
        }
      
    });
        
          
          this.afs.collection('Teacher').doc(this.bank).get().toPromise().then(snapshot => {
          
            
            
              if (snapshot.data().messages) {
                for(const key in snapshot.data().messages){
                  console.log(snapshot.data().messages[key].client_name)
                  if(snapshot.data().messages[key].client_name==client){
                    let val = snapshot.data().messages[key]
                    this.afs.firestore.collection('Teacher').doc(snapshot.id).update({
                      messages: firebase.firestore.FieldValue.arrayRemove(val)
                    });
                    this.afs.firestore.collection('Teacher').doc(new_bank).update({
                      messages: firebase.firestore.FieldValue.arrayUnion(val)
                    });
                    break
                  }
                }
              }
            
        
          })
            .catch(err => {
              console.log('Error getting documents', err);
            })
      
      this.afs.collection('pend_rec').doc(this.bank).set({
        offer: firebase.firestore.FieldValue.arrayRemove(event)
      },{merge:true})
      this.afs.collection('pend_sent').doc(event.offer_made_by).set({
        offer: firebase.firestore.FieldValue.arrayRemove(event)
      },{merge:true})
      
      event.confirmed = 1
      this.afs.collection('announcements2').doc('announcement').set({
        
        messages: firebase.firestore.FieldValue.arrayUnion(event)
      },{merge:true})
       
          console.log(market_cap_acq,market_cap_client)
          let ratio = parseInt(market_cap_acq)/parseInt(market_cap_client)
          console.log('ratio',ratio)
          let size_fit_score
          if(ratio>=2){
            size_fit_score = 5
          }
          else if(ratio>=1.5){
            size_fit_score = 4
          }
          else if(ratio>=1){
            size_fit_score = 3
          }
          else if(ratio>=0.5){
            size_fit_score =2
          }
          else{
            size_fit_score = 1
          }
          score = 0.75*score+0.25*size_fit_score

        event.score = score
        this.afs.collection('deals').doc(event.bank_num).update({
          offer: firebase.firestore.FieldValue.arrayUnion(event)
        })
        this.afs.collection('deals').doc(event.offer_made_by).update({
          offer: firebase.firestore.FieldValue.arrayUnion(event)
        })
    
        
        this.afs.collection('deals').doc(event.bank_num).update({
          score : score+prevscore1
        })
        
        this.afs.collection('deals').doc(event.offer_made_by).update({
          score : score+prevscore2
        })
        
        this.afs.firestore.collection("pend_rec").doc(event.bank_num).get().then(doc=>{
  
          
          if (doc.data().unannounced.length>0) {
          for(const key in doc.data().unannounced){
            
            if(doc.data().unannounced[key].client_name==event.client_name){
              console.log('Client Found',doc.data().unannounced[key]);
              
              this.afs.collection('pend_rec').doc(this.bank).update({
              unannounced: firebase.firestore.FieldValue.arrayRemove(doc.data().unannounced[key])
              
              }).catch(function(error) {
                console.log("Error getting document:", error);
            });
            this.afs.collection('pend_sent').doc(doc.data().unannounced[key].offer_made_by).update({
              offer: firebase.firestore.FieldValue.arrayRemove(doc.data().unannounced[key])
            })
            }
          }
        }
      
          });

          
      
      }

    })
    
    
          
    }
    , (this.deal_dur-1)*1000)
  
  

}

async CancelReceivedOffer(event){
  console.log(event.client_name);
  
  this.afs.collection('pend_rec').doc(event.bank_num).update({
    
    unannounced: firebase.firestore.FieldValue.arrayRemove(event)
  })
  
  this.afs.collection('pend_sent').doc(event.offer_made_by).update({
    
    offer: firebase.firestore.FieldValue.arrayRemove(event)
  })
  // delete event.confirm;
  this.afs.collection('announcements').doc('announcement').set({
    
    messages: firebase.firestore.FieldValue.arrayRemove(event)
  },{merge:true})
  
}
async CancelPendingReceivedOffer(event){
  console.log(event)
 
  event.time = 0
  this.afs.collection('pend_rec').doc(event.bank_num).update({
    
    offer: firebase.firestore.FieldValue.arrayRemove(event)
  })
  this.afs.collection('pend_sent').doc(event.offer_made_by).update({
    
    offer: firebase.firestore.FieldValue.arrayRemove(event)
  })
  this.afs.collection('announcements').doc('announcement').update({
    
    messages: firebase.firestore.FieldValue.arrayRemove(event)
  })
  const index = this.my_announced_clients.indexOf(event.client_name, 0);
  if (index > -1) {
    this.my_announced_clients.splice(index, 1);
  }
  // event.init_time = 0;
  // this.afs.collection('offers').doc(event.client_name).update({
    
  //   offer: firebase.firestore.FieldValue.arrayRemove(event)
  // })
  
  event.confirmed = 0
  event.cancelled_by = this.bank
  this.afs.collection('announcements2').doc('announcement').update({
    
    messages: firebase.firestore.FieldValue.arrayUnion(event)
  })
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
