import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/app'
@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
 
  constructor(public afs: AngularFirestore, public route: ActivatedRoute, public router: Router) { }
  subs
  bank
  sort
  activate
  performance
  clients: Array<any> = []
  ngOnInit(): void {
    this.bank = localStorage.getItem('user');
    
    this.afs.collection("Teacher").valueChanges().subscribe((res: any) => {
      this.clients = res.messages
    });
    this.afs.collection("Teacher").doc('Activation').valueChanges().subscribe((res: any) => {
      this.afs.collection("Teacher").doc('Activation').get().toPromise().then(doc=>{
        this.activate = doc.data().Activated
        this.performance = doc.data().ActivatePerformance
      })
    });
  this.afs.collection("Teacher").get().toPromise().then(querySnapshot=>{
    let client_list : Array<any> =[]
    
      querySnapshot.forEach(doc=>{

         
           if(doc.data().messages){
            
            for(const key in doc.data().messages){
           
              let x = {}
              x = doc.data().messages[key]
              x['bank'] = doc.id
              client_list.push(x);
              
            }
            
           }
   
      });
      
      this.clients = client_list
      
      console.log(this.clients)
  });
   
  }
  async newValue(val){
    
    
    console.log(val.target.value)
    let sort = val.target.value;
    if(sort=='mark_cap'){
      console.log('Sorting according to market cap');
      this.clients.sort((b,a) => parseInt(a.market_cap)-parseInt(b.market_cap));

    }
    else if(sort=='sector'){
      console.log('Sorting according to Sector');
      this.clients.sort((a,b) => a.sector.localeCompare(b.sector));

    }
    else{
      this.afs.collection("Teacher").get().toPromise().then(querySnapshot=>{
        let client_list : Array<any> =[]
        
          querySnapshot.forEach(doc=>{
    
             
               if(doc.data().messages){
                
                for(const key in doc.data().messages){
               
                  let x = {}
                  x = doc.data().messages[key]
                  x['bank'] = doc.id
                  client_list.push(x);
                  
                }
                
               }
       
          });
          
          this.clients = client_list
          
          console.log(this.clients)
      });
    }
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
