import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  
  bank
  docid
  reciever
  messagelistbanks
  new_message_btwnbanks
  Stopped
  chatop
  clients
  subs
  activate
  performance

  Unread = [0, 0, 0, 0, 0, 0, 0,0,0,0,0,0]
  constructor(public afs: AngularFirestore, public route: ActivatedRoute, public router: Router) { }
  ngOnInit(){
    
    this.route.queryParams.subscribe((res) => {
      this.bank = res.name
    })
    this.bank = localStorage.getItem('user');
    this.afs.collection("Teacher").doc('Activation').valueChanges().subscribe((res: any) => {
      this.afs.collection("Teacher").doc('Activation').get().toPromise().then(doc=>{
        this.activate = doc.data().Activated
        this.performance = doc.data().ActivatePerformance
        console.log("performance",this.performance==true)
      })
    });


    this.afs.collection('Teacher').doc(this.bank).valueChanges().subscribe((res: any) => {
      console.log(res)
      this.clients = res.messages
      
    })
    this.afs.collection('chats').doc(this.bank).valueChanges().subscribe((res: any) => {
      this.messagelistbanks = res.messages
      if (res.messages)
        res.messages.forEach(message => {
          
            if (message.opened == false) {
              let text = {
                sender: message.sender,
                reciever: message.reciever,
                body: message.body,
                opened: true
              }
              this.afs.collection('chats').doc(this.bank).update({
                messages: firebase.firestore.FieldValue.arrayRemove(message),
              })
              this.afs.collection('chats').doc(this.bank).update({
                messages: firebase.firestore.FieldValue.arrayUnion(text)
              })
            }
          
        })
    })


    this.CountUnread();

  
  }

  async chatOpenbanks(event) {
    let id = event.target.id
    let username = this.bank;
    this.reciever = 'bank' + id

    if (this.chatop) {
      this.chatop.unsubscribe()
    }
    await this.afs.firestore.collection('chats').where('Involved', 'in', [[this.reciever, username], [username, this.reciever]]).get().then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        this.docid = undefined
        return

      }
      snapshot.forEach(doc => {
        this.docid = doc.id
        console.log(doc.id)
      })
    })
      .catch(err => {
        console.log('Error getting documents', err);
      })
    if (this.docid) {
      this.chatop = await this.afs.collection('chats').doc(this.docid).valueChanges().subscribe((res: any) => {
        this.messagelistbanks = res.messages
        if (res.messages)
          res.messages.forEach(message => {
            if (message.reciever == username) {
              if (message.opened == false) {
                let text = {
                  sender: message.sender,
                  reciever: message.reciever,
                  body: message.body,
                  opened: true
                }
                this.afs.collection('chats').doc(this.docid).update({
                  messages: firebase.firestore.FieldValue.arrayRemove(message),
                })
                this.afs.collection('chats').doc(this.docid).update({
                  messages: firebase.firestore.FieldValue.arrayUnion(text)
                })
              }
            }
          })
      })
    }
  }
  Submitbtwnbanks(){
    let username = this.bank;
    let text = {
      sender: username,
      reciever: this.reciever,
      body: this.new_message_btwnbanks,
      opened: false
    }

    this.afs.collection('chats').doc(this.docid).update({
      messages: firebase.firestore.FieldValue.arrayUnion(text)
    })
    this.new_message_btwnbanks = ''
  }
  clearChatbtwnbanks() {
    this.afs.collection('chats').doc(this.bank).update({
      messages: firebase.firestore.FieldValue.delete()
    })
    alert('Chat is cleared');
  }
  CountUnread() {
    this.afs.collection('chats').valueChanges().subscribe(() => {
      this.afs.firestore.collection('chats').where('Involved', 'array-contains', this.bank).get().then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }
        this.Unread = [0, 0, 0, 0, 0, 0, 0,0,0,0,0,0]
        snapshot.forEach(doc => {
          if (doc.data().messages) {
            doc.data().messages.forEach(message => {
              if (message.reciever == this.bank) {

                let i = (message.sender.split('k')[1]).split('b')[0]
                if (message.opened == false)
                  this.Unread[i] += 1
              }
            })
          }
        });

      })
        .catch(err => {
          console.log('Error getting documents', err);
        })
    })
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
