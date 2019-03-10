import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { AdMobFree } from '@ionic-native/admob-free';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Network } from '@ionic-native/network';
import { HeaderColor } from '@ionic-native/header-color';
import { OneSignal } from '@ionic-native/onesignal';
import { OnesignalProvider } from '../providers/onesignal/onesignal';


const config: SocketIoConfig = {
  url: "http://10.0.0.9:3001",
  // url: "https://rotarychat.herokuapp.com/",
  options: {
    path: '/socket.io',
    // transports: ['websocket'],
    // secure: true,
    port: 8080,
    // reconnectionDelay: 1000,
    reconnection: false,
    reconnection delay: 500,
    reconnection limit: Infinity,
    max reconnection attempts: Infinity
    // reconnectionAttempts: 10,
    // transports: ['websocket', 'polling'],
    // agent: false, // [2] Please don't set this to true
    // upgrade: false,
    // rejectUnauthorized: false
  }
}

// const config: SocketIoConfig = {
//   url: "https://rotary-chat-215100.appspot.com",
//   options: {}
// }

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    AdMobFree,
    StatusBar,
    SplashScreen,
    Network,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HeaderColor,
    OneSignal,
    OnesignalProvider
  ]
})
export class AppModule { }
