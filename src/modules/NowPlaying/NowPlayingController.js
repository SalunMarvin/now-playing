import { observable } from 'mobx'
import moment from 'moment'

export class NowPlayingController {
  constructor(store) {
    this.store = store
  }

  //
  // Formats the date when the content was twitted.
  formatDate = (currentDate) => {
    return moment(currentDate).format("H:mm a - MMM D");
  }

   //
  // Receives the URL from youtube and returns the ID, used below on the youtube iframe tag.
  getYoutubeIdByUrl = (youtubeUrl) => {
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = youtubeUrl.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return 'error';
    }
  }


}