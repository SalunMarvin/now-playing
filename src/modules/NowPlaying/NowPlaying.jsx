import React, {Component} from 'react'
import {Provider} from 'mobx-react'
import {NowPlayingController} from './NowPlayingController'
import {NowPlayingForm} from './NowPlayingForm'

export default class NowPlaying extends Component {
  constructor(props) {
    super(props)
    this.NowPlayingController = new NowPlayingController(this.store)
  }

  render() {
    return (
      <Provider NowPlayingController={this.NowPlayingController}>
        <div>
          <NowPlayingForm {...this.props}/>
        </div>
      </Provider>
    )
  }
}