import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Content, Platform } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';
// import { Network } from '@ionic-native/network';
import { AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';


@IonicPage()
@Component({
    selector: 'page-room-chat',
    templateUrl: 'room-chat.html',

})

export class RoomChatPage {
    @ViewChild(Content) content: Content;
    @ViewChild('inputRef') inputRef: ElementRef;
    anonymousId;
    room: String = "";
    anonymousName: String = "";
    messages = [];
    message;
    status = "online";
    public alertPresented: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, private socket: Socket, public alertCtrl: AlertController, public viewCtrl: ViewController, public admob: AdMobFree, public platform: Platform) {
        this.config();
    }


    config() {
        this.statusChat();
        this.getMessage().subscribe(message => {
            this.messages.push(message);
            this.scrollToBottom(this.inputRef);
        });
        this.getStatusChat().subscribe(data => {
            if (data == "pause") {
                this.status = "ausente";
            } else {
                this.status = "online";
            }
        });
        this.getTyping().subscribe((data) => {
            this.status = "Digitando...";
            setTimeout(() => {
                this.status = "online";
            }, 2000);
        })

        this.leaveRoom().subscribe(() => {
            this.alertExit(this.anonymousName);
        });

        this.getStatusChat().subscribe((data) => {
            console.log(data);
        });

        this.alertPresented = false;

        this.platform.registerBackButtonAction(() => {
            this.alertToLeave();
            return false;
        });
    }


    ionViewDidLoad() {
        this.showIntersticial();
    }
    ionViewDidEnter() {
        this.room = this.navParams.get('room');
        this.anonymousId = this.navParams.get('anonymousId');
        this.anonymousName = this.navParams.get('anonymousName');
        console.log(this.anonymousId + " " + this.anonymousName);
    }
    verifyConnection(socketId) {
        this.socket.on('connect', function () {
            console.log('check 2', this.socket.connected);
        });
    }
    sendMessage() {
        let data = {
            room: this.room,
            text: this.message.trim()
        }
        this.socket.emit('new-message', data);
        this.message = '';
    }

    getMessage() {
        let observable = new Observable(observer => {
            this.socket.on('message', data => {
                observer.next(data);
            });
        });
        return observable;
    }

    typing() {
        this.socket.emit('typing', this.room);
    }

    getTyping() {
        let observable = new Observable(observer => {
            this.socket.on('typing', (data) => {
                observer.next(data);
            });
        });
        return observable;
    }

    leavingRoom(otherRoom?) {
        this.socket.emit('leave-room', this.room);
        this.anonymousId = "";
        this.room = "";
        this.anonymousName = "";
        this.alertPresented = true;
        this.admob.interstitial.show().then(() => {
            document.addEventListener('admob.interstitial.events.CLOSE', () => {
                this.viewCtrl.dismiss(otherRoom);
            });
        }).catch(() => {
            this.viewCtrl.dismiss(otherRoom);
        });
    }

    leaveRoom() {
        let observable = new Observable(observer => {
            this.socket.on('leave-room', (data) => {
                observer.next(data);
            });
        });
        return observable;
    }

    scrollToBottom(elREf?) {
        if (this.content._scroll) {
            let itemTop = elREf._elementRef.nativeElement.getBoundingClientRect().top;
            var itemPositionY = this.content.getContentDimensions().scrollTop + itemTop - 80;
            this.content.scrollTo(null, itemPositionY, 500, () => {
                //     elREf.setFocus();
            });
        }
    }
    alertExit(anonymousName) {
        let vm = this;
        if (!vm.alertPresented) {
            vm.alertPresented = true
            this.alertCtrl.create({
                title: anonymousName + ' Saiu da sala!',
                message: 'Deseja procurar uma nova conversa?',
                enableBackdropDismiss: false,
                buttons: [
                    {
                        text: 'Sim!',
                        handler: () => {
                            this.leavingRoom(true);
                        }
                    },
                    {
                        text: 'Não!',
                        handler: () => {
                            this.leavingRoom();
                        }
                    }
                ]
            }).present();
        }
    }

    alertToLeave() {
        let vm = this;
        if (!vm.alertPresented) {
            vm.alertPresented = true
            this.alertCtrl.create({
                title: 'Deseja realmente sair da sala?',
                enableBackdropDismiss: false,
                buttons: [
                    {
                        text: 'Sim!',
                        handler: () => {
                            this.leavingRoom();
                        }
                    },
                    {
                        text: 'Não!',
                        handler: () => {
                            vm.alertPresented = false;
                        }
                    }
                ]
            }).present();
        }
    }

    showIntersticial() {
        const interstitialConfig: AdMobFreeInterstitialConfig = {
            id: 'ca-app-pub-8909867616323511/3398473478',
            isTesting: false,
            autoShow: false
        };
        this.admob.interstitial.config(interstitialConfig);

        this.admob.interstitial.prepare()
            .then(() => {
                // banner Ad is ready
                // if we set autoShow to false, then we will need to call the show method here
            })
            .catch(e => console.log(e));
    }

    statusChat() {
        this.platform.pause.subscribe(() => {
            let data = {
                room: this.room,
                status: 'pause'
            }
            this.socket.emit('status-chat', data);
        });
        this.platform.resume.subscribe(() => {
            let data = {
                room: this.room,
                status: 'resume '
            }
            this.socket.emit('status-chat', data);
        })
    }

    getStatusChat() {
        let observable = new Observable(observer => {
            this.socket.on('status-chat', (data) => {
                observer.next(data);
            });
        });
        return observable;
    }
}

