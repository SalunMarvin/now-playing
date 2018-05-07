import React from 'react'
import { observable, autorun, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import './NowPlaying.scss'
import axios from 'axios'
import Twit from 'twit'

@inject('NowPlayingController')
@observer
export class NowPlayingForm extends React.Component {
  constructor(props) {
    super(props)
    this.nowPlayingController = props.NowPlayingController
  }

  componentDidMount() {

  }

  handleInputChange = (event) => {
    let key = event.target.name
    let value = event.target.value

    return this[key] = value
  }

  onTweetClick = () => {
    if (!this.url || this.url === '') {
      console.log('you need to add an url')
      return
    }

    if (!this.comment || this.comment === '') {
      console.log('you need to add a comment')
      return
    }

    this.tweetList.push({ url: this.url, comment: this.comment })

    console.log('item added')
    this.url = ''
    this.comment = ''
  }

  renderTweets = (tweets) => {
    return tweets.map((tweet, index) => {
      return (
        <li key={'li_' + index}>
          <div className='row'>
            <div className='col-md-12'>
              <div className='tweetTitle'>
                Imagine Dragons - Night Visions (Official Video)
                    </div>
            </div>
            <div className='col-md-6'>
              <div className='tweetTitle'>
                <iframe width="100%" height="315" src="https://www.youtube.com/embed/Or3GAT24tcA?showinfo=0" frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
            <div className='col-md-6'>
              John Doe
                  </div>
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <div>
        <nav className="app-navbar">
          <div className="navbar-items">

          </div>
        </nav>
        <div className='container'>

          <div className='inputContainer'>

            <div className='inputBox'>
              <span> Video URL</span>
              <input name='url' type='text' value={this.url} onChange={this.handleInputChange} placeholder='http://youtube.com' />
            </div>
            <div className='inputBox'>
              <span>Comment</span>
              <input name='comment' type='text' value={this.comment} onChange={this.handleInputChange} placeholder='type a comment...' />
            </div>
            <button className='inputButton' onClick={this.onTweetClick}> Tweet to #nowplaying</button>
            <div style={{ clear: 'both' }}></div>
          </div>
          <div>
            <ul className='tweetContainer'>
              {this.renderTweets(this.nowPlayingController.tweets)}
            </ul>
          </div>
        </div>
        {/* my variable = {this.NowPlayingController.myVariable} */}
      </div>
    )
  }
}
