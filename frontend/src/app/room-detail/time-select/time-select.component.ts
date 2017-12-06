import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import * as $ from 'jquery';
import { Freetime } from '../../models/freetime';
import { FreetimeService } from '../../services/freetime.service';
import { MeetService } from '../../services/meet.service';
import { Timespan } from '../../models/timespan';
import { ActivatedRoute, Router } from '@angular/router';
import { FreetimeResponseData } from '../../services/freetime-response-data';
import { Schedule } from '../../models/schedule';
import { GoogleScheduleService } from '../../services/google-schedule.service';
import { Room } from '../../models/room';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector : 'app-time-select',
  templateUrl : './time-select.component.html',
  styleUrls : [ './time-select.component.css' ],
})

export class TimeSelectComponent implements OnInit, OnDestroy {
  private timeSpan: Timespan;
  public previousFreeTimes: Freetime[];
  public calendarOptions: Object;
  public schedules: Schedule[];

  private syncButton: HTMLElement;
  private cancelButton: HTMLElement;

  currentRoom: Room;

  constructor(private location: Location,
              private route: ActivatedRoute,
              private router: Router,
              private freetimeService: FreetimeService,
              private meetService: MeetService,
              private googleScheduleService: GoogleScheduleService) {
  }

  ngOnInit() {
    // For sync with Google Calendar API
    this.syncButton = document.getElementById('authorize-button');
    this.cancelButton = document.getElementById('signout-button');

    // Option Set for calendar display
    this.meetService.getCurrentRoom(this.route)
      .flatMap(room => {
        console.log(room);
        this.currentRoom = room;
        this.timeSpan = new Timespan(room.timespan.start, room.timespan.end);
        this.timeSpan.end.setDate(this.timeSpan.end.getDate() + 1);
        console.log(this.timeSpan);
        return Observable.fromPromise(this.freetimeService.getFreeTimes(room.id));
      })
      .subscribe(freeTimes => {
        this.previousFreeTimes = freeTimes.map(freetimeDate => FreetimeResponseData.responseToFreetime(freetimeDate));
        console.log(this.previousFreeTimes);
        this.setCalendarOptions();
      });

    this.googleButtonInitializer();
  }

  ngOnDestroy() {
    this.googleScheduleService.signOutGoogle();
  }

  public deleteEvent(): void {
    $('#calendar').fullCalendar('removeEvents', localStorage.getItem('deleteButtonId'));
    document.getElementById('deleteButton').style.display = 'none';
  }

  public deleteAllEvent(): void {
    $('#calendar').fullCalendar('removeEvents');
  }

  public collectFreeTimes(): void {
    // Collect all events and return array of [start_time, end_time] pair
    const freeTimes: Freetime[] = [];
    const selectedAreas = $('#calendar').fullCalendar('clientEvents',
      function(event) { return event.name !== 'googleSchedule' });
    for (let index in selectedAreas) {
      freeTimes.push(new Freetime(selectedAreas[ index ][ 'start' ][ '_d' ],
        selectedAreas[ index ][ 'end' ][ '_d' ]));
    }
    console.log(JSON.stringify(freeTimes));

    this.freetimeService.postFreeTimes(freeTimes, this.currentRoom.id)
      .then(isSuccessToPost => {
        if (isSuccessToPost) {
          this.router.navigate([ 'room', this.currentRoom.hashid ]);
        }
      });
  }

  // For Google Calendar API
  googleButtonInitializer(): void {
    if (typeof gapi === 'undefined') {
      // Wait until gapi is defined by GoogleScheduleService.
      setTimeout(() => { this.googleButtonInitializer(); }, 500);
    } else {
      // this.changeGoogleButtonState(gapi.auth2.getAuthInstance().isSignedIn.get());
      this.changeGoogleButtonState(false);
      // gapi.auth2.getAuthInstance().isSignedIn.listen(this.changeGoogleButtonState.bind(this));
    }
  }

  private changeGoogleButtonState(isSynchronized): void {
    if (isSynchronized) {
      this.syncButton.style.display = 'none';
      this.cancelButton.style.display = 'block';
    } else {
      this.syncButton.style.display = 'block';
      this.cancelButton.style.display = 'none';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  handleSyncClick(): void {
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      this.googleScheduleService.signInGoogle();
    }
    this.getSchedules();
  }

  private getSchedules(): void {
    if (!this.googleScheduleService.isInit) {
      setTimeout(() => { this.getSchedules();}, 500);
    } else {
      this.googleScheduleService.getSchedules().then(schedules => {
        this.schedules = schedules;
        const calendar = $('#calendar');

        for (const schedule of schedules) {
          const event = {
            name: 'googleSchedule',
            title: schedule.title,
            start: schedule.start,
            end: schedule.end,
            color: 'rgb(230, 0, 0)',
            overlap: true,
          };

          calendar.fullCalendar('renderEvent', event);
        }

      });

      this.changeGoogleButtonState(true);
    }
  }

  /**
   *  Sign out the user upon button click.
   */
  handleCancelClick(): void {
    this.changeGoogleButtonState(false);
    this.schedules = [];
    $('#calendar').fullCalendar('removeEvents',
      function(event) { return event.name === 'googleSchedule'});
  }

  private setCalendarOptions() {
    this.calendarOptions = {
      locale : 'ko',
      slotDuration : '00:10:00', // set slot duration
      scrollTime : '09:00:00', // start scroll from 9AM
      height : 650,
      // Do not Modify Below This Comment
      eventOverlap: function (stillEvent, movingEvent) {
        return stillEvent.name === 'googleSchedule';
      },
      eventRender: function(event, element) {
        if (event.name === 'googleSchedule') {
          element.append('from Google Calendar');
        }
      },
      visibleRange : {
        'start' : this.timeSpan.start.toJSON().split('T')[ 0 ]
        , 'end' : this.timeSpan.end.toJSON().split('T')[ 0 ]
      },
      events : this.previousFreeTimes,
      timezone : 'local',
      defaultView : 'agenda',
      allDaySlot : false,
      editable : true,
      selectable : true,
      selectHelper : true,
      selectOverlap: function (stillEvent, movingEvent) {
        return stillEvent.name === 'googleSchedule';
      },
      longPressDelay : 10,
      select : function (start, end) {
        document.getElementById('deleteButton').style.display = 'none';
        let eventData;
        eventData = {
          title : '',
          start : start,
          end : end,
          overlap: false,
        };
        $('#calendar').fullCalendar('renderEvent', eventData, true);
      },
      unselectAuto : true,
      eventClick : function (calEvent, jsEvent, view) {
        let selected = $('#calendar').fullCalendar('clientEvents', calEvent._id);
        let startTime = selected[ 0 ][ 'start' ][ '_d' ]
          .toString().split(' ')[ 4 ].slice(0, 5);
        let endTime = selected[ 0 ][ 'end' ][ '_d' ]
          .toString().split(' ')[ 4 ].slice(0, 5);
        document.getElementById('deleteButton').style.display = 'block';
        document.getElementById('deleteButton').innerText = `Delete ${startTime} - ${endTime}`;

        localStorage.setItem('deleteButtonId', calEvent._id);
      },
    };
  }
}


