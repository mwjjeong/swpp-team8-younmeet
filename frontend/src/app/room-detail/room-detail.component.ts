import { Component, OnInit, Optional } from '@angular/core';
import { Room } from '../models/room';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetService } from '../services/meet.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import { UserInfo } from '../models/user-info';
import { Location } from '@angular/common';
import { BesttimeResponseData } from '../services/besttime-response-data';
import { Besttime } from '../models/besttime';

@Component({
  selector : 'app-room-detail',
  templateUrl : './room-detail.component.html',
  styleUrls : ['./room-detail.component.css']
})
export class RoomDetailComponent implements OnInit {
  room: Room;
  members: UserInfo[];
  availableTime: Timespan[];
  zoom: number;
  isRoomOwner: boolean;

  shareableLink: string;
  linkCopied: boolean = false;
  _popupOpen: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private meetService: MeetService,
              private location: Location,
              private accountService: AccountService) {
    this.route.params
      .flatMap(params => {
        let roomId = +params[ 'id' ];
        console.log(roomId);
        this.shareableLink = `http://localhost:4200/link/${roomId}`;
        return this.meetService.getRoomById(roomId);
      })
      .flatMap(room => {
        this.room = room;
        let getMembers = this.meetService.getUsersInRoom(this.room.id)
          .then(members => {
            this.members = members.filter(user => user.id !== room.owner.id);
            this.members.unshift(members.filter(user => user.id === room.owner.id)[ 0 ]);
          });
        let getBestTime = this.meetService.getBestTime(this.room.id)
          .then(bestTime => {
            this.availableTime = bestTime.map(bestTimeResponse => BesttimeResponseData.responseToBestTime(bestTimeResponse));
            console.log(this.availableTime);
        this.accountService.getUserDetail().then(currUser => {
          if (currUser.id === this.room.owner.id)
            this.isRoomOwner = true;
          else
            this.isRoomOwner = false;
          console.log(this.isRoomOwner);
        });
        let getAvailableTime = this.meetService.getAvailableTime(this.room.id)
          .then(availableTime => {
            this.availableTime = availableTime.map(
              timeSpanData => TimespanResponseData.responseToFreetime(timeSpanData));
          });
        return Observable.forkJoin(getMembers, getBestTime);
      })
      .subscribe();

  }

  ngOnInit() {
    this.zoom = 15;
  }

  goBack(): void {
    this.router.navigate([ 'dashboard' ]);
  }

  goTimeSelectPage(): void {
    this.router.navigate([ 'room', this.room.id, 'time' ]);
  }
}
