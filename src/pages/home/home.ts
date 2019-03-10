// import { Network } from '@ionic-native/network';
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { LoadingController } from "ionic-angular";
import { default as cities } from "../../assets/data/cities";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userName;
  city;
  loading;

  constructor(public navCtrl: NavController, public socket: Socket, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
    this.chatFound().subscribe(data => {
      this.goChat(data);
    });
  }

  ionViewDidLoad() {
    // this.platform.ready().then(() => {
    //   console.log("REAAADYYY")
    //   let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    //     alert('network was disconnected :-(');
    //   });
    //   let connectSubscription = this.network.onConnect().subscribe(() => {
    //     console.log('network connected!');
    //     // We just got a connection but we need to wait briefly
    //     // before we determine the connection type. Might need to wait.
    //     // prior to doing any api requests as well.
    //     setTimeout(() => {
    //       if (this.network.type === 'wifi') {
    //         alert('we got a wifi connection, woohoo!');
    //       }
    //     }, 3000);
    //   });
    // })

    this.socket.connect();
    let city = cities.data[Math.floor(Math.random() * cities.data.length)];
    this.city = city;

  }

  rotary() {
    this.socket.emit("anonymous-name-change", this.city);
    this.socket.emit('rotary');
    this.showLoading();
  }

  chatFound() {
    let observable = new Observable(observer => {
      this.socket.on('chat-config', data => {
        observer.next(data);
        console.log(data);

      });
    });
    return observable;
  }

  goChat(chatConfig) {
    let modal = this.modalCtrl.create('RoomChatPage', chatConfig, {
      enableBackdropDismiss: false
    });
    this.dimissLoading();
    modal.onDidDismiss((data) => {
      if (data) {
        this.rotary();
      }
    });
    modal.present();
    // this.navCtrl.setRoot('RoomChatPage', chatConfig);
  }

  showLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: "Procurando um novo chat, aguarde...",
        spinner: "dots"
      });
      this.loading.present();
    }
  }
  dimissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
}
