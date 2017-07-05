import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class ConferenceData {
  data: any;

  constructor(public http: Http, public user: UserData) { }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/data.json')
        .map(this.processData, this);
    }
  }

  processData(data: any) {
    this.data = data.json();

    return this.data;
  }

  getTimeline(dayIndex: number, queryText = '', excludeTracks: any[] = [], segment = 'all') {
    return this.load().map((data: any) => {
      let day = data.schedule[dayIndex];
      day.shownSessions = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      day.groups.forEach((group: any) => {
        group.hide = true;

        group.sessions.forEach((session: any) => {
          // check if this session should show or not
          this.filterSession(session, queryWords, excludeTracks, segment);

          if (!session.hide) {
            // if this session is not hidden then this group should show
            group.hide = false;
            day.shownSessions++;
          }
        });

      });

      return day;
    });
  }

  filterSession(session: any, queryWords: string[], excludeTracks: any[], segment: string) {

    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (session.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // if any of the sessions tracks are not in the
    // exclude tracks then this session passes the track test
    let matchesTracks = false;
    session.tracks.forEach((trackName: string) => {
      if (excludeTracks.indexOf(trackName) === -1) {
        matchesTracks = true;
      }
    });

    // if the segement is 'favorites', but session is not a user favorite
    // then this session does not pass the segment test
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.user.hasFavorite(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getGardens() {
      return this.load().map((data: any) => {
          data.gardens.forEach((e:any) => {
              e.plants = [];
              e.plantIds.forEach((id: any) => {
                  let plant = this.findById(data.plants, id);
                  if (plant != null)
                      e.plants.push(plant);
              });
          });
          return data.gardens;
      });
  }

  findById(array: any, id: any):any {
      var elem = null;
      array.forEach((e: any) => {
          if (e.id == id)
              elem = e;
      });
      return elem;
  }

  deleteGardenById(id : any) {
      for (var i = 0; i < this.data.gardens.length; i++) {
          if (this.data.gardens[i].id == id) {
              this.data.gardens.splice(i, 1);
              return;
          }
      }
  }

  createGarden(garden: any) {
      garden.plantIds = [];
      garden.points = [];
      garden.profilePic = "assets/img/speakers/mouse.jpg";
      garden.id = this.data.gardens[this.data.gardens.length - 1].id + 1;
      this.data.gardens.push(garden);
      return garden;
  }

  saveGarden(garden: any) {
      for (var i = 0; i < this.data.gardens.length; i++) {
          if (this.data.gardens[i].id == garden.id) {
              this.data.gardens[i] = garden;
          }
      }
  }
}
