import { Component, OnInit, Optional } from '@angular/core';
import { Room } from '../models/room';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetService } from '../services/meet.service';

import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { Timespan } from '../models/timespan';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import { UserInfo } from '../models/user-info';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { TimespanResponseData } from '../services/timespan-response-data';
import { BesttimeResponseData } from '../services/besttime-response-data';
import { Besttime } from '../models/besttime';

@Component({
  selector : 'app-room-detail',
  templateUrl : './room-detail.component.html',
  styles : []
})
export class RoomDetailComponent implements OnInit {
  room: Room;
  members: UserInfo[];
  availableTime: Besttime[];

  shareableLink: string;
  linkCopied: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private meetService: MeetService,
              private location: Location) {
    this.route.params
      .flatMap(params => {
        let roomId = +params[ 'id' ];
        this.shareableLink = `http://localhost:4200/link/${roomId}`;
        return this.meetService.getRoomById(roomId);
      })
      .flatMap(room => {
        this.room = room;
        console.log(room);
        let getMembers = this.meetService.getUsersInRoom(this.room.id)
          .then(members => {
            this.members = members.filter(user => user.id !== room.owner.id);
            this.members.unshift(members.filter(user => user.id === room.owner.id)[ 0 ]);
          });
        let getBestTime = this.meetService.getBestTime(this.room.id)
          .then(bestTime => {
            this.availableTime = bestTime.map(bestTimeResponse => BesttimeResponseData.responseToBestTime(bestTimeResponse));
            console.log(this.availableTime);
          });
        return Observable.forkJoin(getMembers, getBestTime);
      })
      .subscribe();
  }

  ngOnInit() {
  }

  goBack(): void {
    this.router.navigate([ 'dashboard' ]);
  }

  goTimeSelectPage(): void {
    this.router.navigate([ 'room', this.room.id, 'time' ]);
  }


}
