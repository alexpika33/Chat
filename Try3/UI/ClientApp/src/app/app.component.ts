import { Component, OnInit } from '@angular/core';
import { SignalrService } from './services/signalr.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'chat-ui';
  text: string = "";

  constructor(public signalRService: SignalrService) {

  }

  ngOnInit(): void {
    this.signalRService.connect();
  }

  sendMessage(): void {
    // this.signalRService.sendMessageToApi(this.text).subscribe({
    //   next: _ => this.text = '',
    //   error: (err) => console.error(err)
    // });

    this.signalRService.sendMessageToHub(this.text).subscribe({
      next: _ => this.text = '',
      error: (err) => console.error(err)
    });
  }
}