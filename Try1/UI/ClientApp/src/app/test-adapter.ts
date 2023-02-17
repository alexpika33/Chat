import { ChatAdapter, IChatGroupAdapter, User, Group, Message, ChatParticipantStatus, ParticipantResponse, ParticipantMetadata, ChatParticipantType, IChatParticipant } from 'ng-chat';
import { Observable, of } from 'rxjs';
import { delay } from "rxjs/operators";

export class TestAdapter extends ChatAdapter implements IChatGroupAdapter {
  public static mockedParticipants: IChatParticipant[] = [
    {
      participantType: ChatParticipantType.User,
      id: 1,
      displayName: "Arya Stark",
      avatar: "https://66.media.tumblr.com/avatar_9dd9bb497b75_128.pnj",
      status: ChatParticipantStatus.Online
    },
    {
      participantType: ChatParticipantType.User,
      id: 2,
      displayName: "Cersei Lannister",
      avatar: null,
      status: ChatParticipantStatus.Online
    },
    {
      participantType: ChatParticipantType.User,
      id: 3,
      displayName: "Daenerys Targaryen",
      avatar: "https://68.media.tumblr.com/avatar_d28d7149f567_128.png",
      status: ChatParticipantStatus.Busy
    },
    {
      participantType: ChatParticipantType.Group,
      id: 4,
      displayName: "Eddard Stark Group",
      avatar: "https://pbs.twimg.com/profile_images/600707945911844864/MNogF757_400x400.jpg",
      status: ChatParticipantStatus.Offline
    },
    {
      participantType: ChatParticipantType.User,
      id: 5,
      displayName: "Hodor",
      avatar: "https://pbs.twimg.com/profile_images/378800000449071678/27f2e27edd119a7133110f8635f2c130.jpeg",
      status: ChatParticipantStatus.Offline
    }
   ];

  listFriends(): Observable<ParticipantResponse[]> {
    return of(TestAdapter.mockedParticipants.map(user => {
      let participantResponse = new ParticipantResponse();

      participantResponse.participant = user;
      participantResponse.metadata = {
        totalUnreadMessages: Math.floor(Math.random() * 10)
      }

      return participantResponse;
    }));
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {
    let mockedHistory: Array<Message>;

    mockedHistory = [
      {
        fromId: 1,
        toId: 999,
        message: "Hi there, just type any message bellow to test this Angular module.",
        dateSent: new Date()
      }
    ];

    return of(mockedHistory).pipe(delay(2000));
  }

  sendMessage(message: Message): void {
    setTimeout(() => {
      let replyMessage = new Message();

      replyMessage.message = "You have typed '" + message.message + "'";
      replyMessage.dateSent = new Date();

      if (isNaN(message.toId)) {
        let group = TestAdapter.mockedParticipants.find(x => x.id == message.toId) as Group;

        // Message to a group. Pick up any participant for this
        let randomParticipantIndex = Math.floor(Math.random() * group.chattingTo.length);
        replyMessage.fromId = group.chattingTo[randomParticipantIndex].id;

        replyMessage.toId = message.toId;

        this.onMessageReceived(group, replyMessage);
      }
      else {
        replyMessage.fromId = message.toId;
        replyMessage.toId = message.fromId;

        let user = TestAdapter.mockedParticipants.find(x => x.id == replyMessage.fromId);
        if(user!=undefined){
            this.onMessageReceived(user, replyMessage);
        }
      }
    }, 1000);
  }

  groupCreated(group: Group): void {
    TestAdapter.mockedParticipants.push(group);

    TestAdapter.mockedParticipants = TestAdapter.mockedParticipants.sort((first, second) =>
      second.displayName > first.displayName ? -1 : 1
    );

    // Trigger update of friends list
    this.listFriends().subscribe(response => {
      this.onFriendsListChanged(response);
    });
  }
}