import { computed, observable } from 'mobx'

export class NowPlayingController {
  @observable url = ''
  @observable comment = ''
  @observable tweetList = []
  @observable tweets = ['', '', '']

  constructor(store) {
  }
}
