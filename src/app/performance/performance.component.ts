import { Component, AfterContentInit, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app'
import { Router } from '@angular/router';
import * as CanvasJS from '../../assets/canvasjs.min';
import { SelectControlValueAccessor } from '@angular/forms';
@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css']
})
export class PerformanceComponent implements OnInit {

  constructor(public afs: AngularFirestore, public router: Router) { }
  id 
  num_acq
  acq_quality
  acq_premium
  acq_fees
  num_sales
  sales_quality
  sales_premium
  sales_fees
  TeamDetails
  IsTeacher
  subs
  max_bank
  acq_basepremium
  acq_premiumcap
  basequality
  equity
  expenses
  fees
  sales_basepremium
  sales_premiumcap
  total_acq_sales
  net_income
  roe
  bank
  activate
  performance
  async ngOnInit() {
    console.log('Entering Init')
    this.IsTeacher = localStorage.getItem('IsTeacher')
    this.bank = localStorage.getItem('user');
    this.afs.collection("Teacher").doc('Activation').valueChanges().subscribe((res: any) => {
      this.afs.collection("Teacher").doc('Activation').get().toPromise().then(doc=>{
        this.activate = doc.data().Activated
        this.performance = doc.data().ActivatePerformance
      })
    });
    if (this.IsTeacher == 'false') {
      this.id = Number(localStorage.getItem('user').substr(4))
      console.log(Number(localStorage.getItem('user').substr(4)))
    }
    else{
      this.id = 1
    }
    this.afs.collection("deals").get().toPromise().then(querySnapshot=>{
      
        
        querySnapshot.forEach(doc=>{
            this.max_bank = Number(doc.id.substr(4))
            
      })
     
    });
    await this.afs.collection("Teacher").doc('info').get().toPromise().then(res=>{
      this.acq_basepremium = res.data().acq_basepremium
      
      this.acq_premiumcap = res.data().acq_premiumcap
      
      this.basequality = res.data().basequality
      
      this.equity  = res.data().equity
      
      this.expenses  = res.data().expenses
      
      this.fees = res.data().fees
      
      this.sales_basepremium = res.data().sales_basepremium
      
      this.sales_premiumcap  = res.data().sales_premiumcap
      
    });

    await this.afs.collection('deals').doc('bank'+this.id).snapshotChanges().subscribe((res: any) => {

      this.afs.collection('deals').doc('bank'+this.id).get().toPromise().then((res: any) => {
        this.num_acq = 0
        this.acq_quality=0
        this.acq_premium=0
        this.acq_fees=0
        this.num_sales=0
        this.sales_quality=0
        this.sales_premium=0
        this.sales_fees=0
        try{
        res.data().offer.forEach(deal=>{
          if(deal.offer_made_by=='bank'+this.id){
            this.num_acq+=1
            this.acq_quality+=Number(deal.score)
            this.acq_premium+=Number(deal.price)
          }
          else{
            this.num_sales+=1
            this.sales_quality+=Number(deal.score)
            this.sales_premium+=Number(deal.price)
          }
        })
      }catch(Err){
        console.log('no deals')
      }
      if(this.num_acq>0){
          
        this.acq_premium = (this.acq_premium)/(this.num_acq)
        this.acq_quality = (this.acq_quality)/(this.num_acq)
        
        this.acq_premium =  Number(this.acq_premium.toFixed(2))
        
        this.acq_quality = Number(this.acq_quality.toFixed(2))
        let base_fees = this.fees*this.num_acq
        this.acq_fees = Math.min(Math.max(0,this.acq_basepremium-this.acq_premium),this.acq_premiumcap)*base_fees/100+Math.max(0,this.acq_quality-this.basequality)/(this.num_acq)*base_fees+base_fees;
        this.acq_fees = Number(this.acq_fees.toFixed(2) )
      }
      if(this.num_sales>0){
        
          this.sales_premium = (this.sales_premium)/(this.num_sales)
          this.sales_quality = (this.sales_quality)/(this.num_sales)
          this.sales_premium = Number(this.sales_premium.toFixed(2))
          this.sales_quality = Number(this.sales_quality.toFixed(2))
          let base_fees = this.fees*this.num_sales
          this.sales_fees = Math.min(Math.max(0,this.sales_basepremium-this.sales_premium),this.sales_premiumcap)*base_fees/100+Math.max(0,this.sales_quality-this.basequality)/(this.num_sales)*base_fees+base_fees;
          this.sales_fees = Number(this.sales_fees.toFixed(2))
        }
      this.total_acq_sales = this.acq_fees+this.sales_fees
      this.net_income = this.total_acq_sales - this.expenses
      this.net_income =  Number(this.net_income.toFixed(2))
      this.roe = (this.net_income)*100/this.equity
      this.roe = Number(this.roe.toFixed(2))
        this.afs.collection('deals').doc('bank'+this.id).set({
          roe : this.roe
        },{merge:true})
        this.PlotGraph()
    })
      })
  }
  
 async PlotGraph(){
    let data : Array<any> = []
   
    await this.afs.collection('deals').get().toPromise().then(querysnap=>{
      
      querysnap.forEach(res=>{
        if(res.data().roe!=-10){
        data.push({y:res.data().roe, label:res.id})
        }
        
        
        
      })
    })
    
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "LeaderBoard"
      },
      dataPointWidth: 30,
      
      
      data: [{
        type: "column",
        color: 'rgb(90, 220, 0)',
        dataPoints: data
      }]

    });
    this.setColor(chart)
    chart.render();

  }
  setColor(chart){
    for(var i = 0; i < chart.options.data.length; i++) {
      let dataSeries = chart.options.data[i];
      for(var j = 0; j < dataSeries.dataPoints.length; j++){
        if(dataSeries.dataPoints[j].y <= 0)
          dataSeries.dataPoints[j].color = 'rgb(170, 0, 0)';
      }
    }
  }
   Change(num) {
     if(!(this.id==this.max_bank && Number(num)==1) && !(this.id==1 && Number(num)==-1) ){
    try {
      this.id += Number(num)
      this.afs.collection('deals').doc('bank'+this.id).get().toPromise().then((res: any) => {
            this.num_acq = 0
            this.acq_quality=0
            this.acq_premium=0
            this.acq_fees=0
            this.num_sales=0
            this.sales_quality=0
            this.sales_premium=0
            this.sales_fees=0
            try{
            res.data().offer.forEach(deal=>{
              if(deal.offer_made_by=='bank'+this.id){
                this.num_acq+=1
                this.acq_quality+=Number(deal.score)
                this.acq_premium+=Number(deal.price)
              }
              else{
                this.num_sales+=1
                this.sales_quality+=Number(deal.score)
                this.sales_premium+=Number(deal.price)
              }
            })
              }catch(Err){
        console.log('no deals')
      }
            if(this.num_acq>0){
          
              this.acq_premium = (this.acq_premium)/(this.num_acq)
              this.acq_quality = (this.acq_quality)/(this.num_acq)
              
              this.acq_premium =  Number(this.acq_premium.toFixed(2))
              
              this.acq_quality = Number(this.acq_quality.toFixed(2))
              let base_fees = this.fees*this.num_acq
              this.acq_fees = Math.min(Math.max(0,this.acq_basepremium-this.acq_premium),this.acq_premiumcap)*base_fees/100+Math.max(0,this.acq_quality-this.basequality)/(this.num_acq)*base_fees+base_fees;
              this.acq_fees = Number(this.acq_fees.toFixed(2) )
            }
            if(this.num_sales>0){
              
                this.sales_premium = (this.sales_premium)/(this.num_sales)
                this.sales_quality = (this.sales_quality)/(this.num_sales)
                this.sales_premium = Number(this.sales_premium.toFixed(2))
                this.sales_quality = Number(this.sales_quality.toFixed(2))
                let base_fees = this.fees*this.num_sales
                this.sales_fees = Math.min(Math.max(0,this.sales_basepremium-this.sales_premium),this.sales_premiumcap)*base_fees/100+Math.max(0,this.sales_quality-this.basequality)/(this.num_sales)*base_fees+base_fees;
                this.sales_fees = Number(this.sales_fees.toFixed(2))
              }
            this.total_acq_sales = this.acq_fees+this.sales_fees
            this.net_income = this.total_acq_sales - this.expenses
            this.net_income =  Number(this.net_income.toFixed(2))
            this.roe = (this.net_income)*100/this.equity
            this.roe = Number(this.roe.toFixed(2))
            this.PlotGraph()
        })

    }
    catch (Err) {
      console.log(Err)
    }

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
