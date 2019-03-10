import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';

@Injectable()
export class OnesignalProvider {

  constructor(public http: HttpClient, public oneSignal: OneSignal) { }

  init() {
    this.oneSignal.startInit('21dfd049-b794-4677-8154-6df2f97eec8c', '867694832037');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    // this.oneSignal.handleNotificationReceived().subscribe(() => {
    //   // do something when notification is received
    // });

    // this.oneSignal.handleNotificationOpened().subscribe(() => {

    // });

    this.oneSignal.endInit();
  }
  createNotification() {

    const apiUrl = "https://onesignal.com/api/v1/notifications";
    const headers = new HttpHeaders().set(
      "Authorization", "Basic Y2I0MmNmZGUtMjJlMC00MDBmLWFkZTAtZDQ4NTk3MWM1ZTc2"
    );
    var message = {
      app_id: "21dfd049-b794-4677-8154-6df2f97eec8c",
      contents: { "en": "English Message", "pt": "Mensagem Portugês" },
      included_segments: ["Test"],
      small_icon: "default_icon",
      priority: "High",
      // big_picture: "https://img.onesignal.com/t/7bd6d0b3-ffda-4473-a38f-ffbe8e7589b4.png",
      // include_player_ids: "b536cd3f-ea9c-427d-982c-d38303dce191"
    };

    this.http.post(apiUrl, message, { headers: headers }).subscribe((res) => {
      console.log(res);

    }, (err) => {
      console.log(err);
    });

  }

}
