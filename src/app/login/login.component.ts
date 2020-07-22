import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Email=""
  Password=""
  name=""
  constructor(public router:Router,public zone:NgZone) {
  
   }
 
  
  ngOnInit() {
  }
  SignIn(){
    if(this.Email.includes("bank")){
      localStorage.setItem('IsTeacher', 'false')
      if(this.Email=="bank1@gmail.com" && this.Password=="bank1"){
        this.name=this.Email.split('@')[0]
        // firebase.auth().signInAnonymously().catch(function(error) {
        //   var errorCode = error.code;
        //   var errorMessage = error.message;
        //   console.log(error)
        // });
       
         this.zone.run(()=>{ 
           this.router.navigate(['clients'],{queryParams:{name:name}})})
      }
      else if(this.Email=="bank2@gmail.com" && this.Password=="bank2"){
        this.name=this.Email.split('@')[0]
        firebase.auth().signInAnonymously().catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error)
        });
         this.zone.run(()=>{ 
           this.router.navigate(['clients'],{queryParams:{name:name}})})
      }
      else if(this.Email=="bank3@gmail.com" && this.Password=="bank3"){
        this.name=this.Email.split('@')[0]
        firebase.auth().signInAnonymously().catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error)
        });
         this.zone.run(()=>{ 
           this.router.navigate(['clients'],{queryParams:{name:name}})})
      }
      else if(this.Email=="bank4@gmail.com" && this.Password=="bank4"){
        this.name=this.Email.split('@')[0]
        firebase.auth().signInAnonymously().catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error)
        });
         this.zone.run(()=>{ 
           this.router.navigate(['clients'],{queryParams:{name:name}})})
      }
      else if(this.Email=="bank5@gmail.com" && this.Password=="bank5"){
        this.name=this.Email.split('@')[0]
        firebase.auth().signInAnonymously().catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error)
        });
         this.zone.run(()=>{ 
           this.router.navigate(['clients'],{queryParams:{name:name}})})
         }
    else if(this.Email=="bank6@gmail.com" && this.Password=="bank6"){
      this.name=this.Email.split('@')[0]
      firebase.auth().signInAnonymously().catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error)
      });
       this.zone.run(()=>{ 
         this.router.navigate(['clients'],{queryParams:{name:name}})})
    }
  }
  else if(this.Email=='teacher@gmail.com' && this.Password=='teacher'){
    localStorage.setItem('IsTeacher', 'true')
      this.name=this.Email.split('@')[0]
      firebase.auth().signInAnonymously().catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error)
      });
      this.zone.run(()=>{ 
        this.router.navigate(['teacher'],{queryParams:{name:name}})})
   }
      else{
        alert("WRONG EMAIL OR PASSWORD")
      }
      localStorage.setItem('user', this.name);
      
  }
  
}
