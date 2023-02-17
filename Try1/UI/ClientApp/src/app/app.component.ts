import { Component } from '@angular/core';
import { ChatAdapter } from 'ng-chat';
import { TestAdapter } from './test-adapter';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  userId=99;
  public adapter: ChatAdapter = new TestAdapter() ;
  

}
