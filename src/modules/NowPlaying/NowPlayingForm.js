import React from 'react'
import { observable, autorun, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import './NowPlaying.scss'
import axios from 'axios'
import { Toast } from 'react-toastr-basic';
import socketIOClient from "socket.io-client";
import Geolocation from "react-geolocation";
import logo from '../../images/nowplaying.png'

@inject('NowPlayingController')
@observer
export class NowPlayingForm extends React.Component {
  @observable url = ''
  @observable comment = ''
  @observable tweetList = []
  @observable latitude = null
  @observable longitude = null
  @observable cityName = null
  socket = socketIOClient('http://nowplaying-server.herokuapp.com');

  constructor(props) {
    super(props)
    this.NowPlayingController = props.NowPlayingController
    this.formatDate = this.NowPlayingController.formatDate
    this.getYoutubeIdByUrl = this.NowPlayingController.getYoutubeIdByUrl
  }

  /** 
   * React function, called as soon as the page loads.
   * Here we add a listener, which pays attention when the user touches the bottom of the screen.
   * If it happens, the fillTweetList function is called.
   */
  componentDidMount() {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop + document.body.clientHeight >= document.body.scrollHeight) {
        let lastIndex = this.tweetList.length - 1
        let lastTweetId = this.tweetList[lastIndex].id
        this.fillTweetList(lastTweetId)
      }
    });
  }


  /** Function called immediately after the location is retrieved. It sets the headers, 
   * fills the body with the desired queries which filter what kind of tweets I want to receive
   * and sends a request through Axios. The response is attached to the observed variable 'tweetList'.
   * In case the user touches the bottom and the tweets ended, the infiniteScroll is activated and it
   * fills the tweetList with more items.
   */
  fillTweetList = (max_id = null) => {
    let headers = { 'Content-Type': 'application/json' };
    let body = {
      "q": "url:youtube #nowplaying filter:media -filter:retweets",
      "count": 5,
      "result_type": "recent",
      "lang": "en",
      "geocode": this.latitude + "," + this.longitude + ",10000km"
    }
    if (max_id) {
      body.max_id = max_id
    }

    axios.post('http://nowplaying-server.herokuapp.com/search', body, { headers: headers })
      .then(response => {
        if (max_id) {
          response.data.statuses.map(status => {
            this.tweetList.push(status)
          })
        } else {
          this.tweetList = response.data.statuses
          this.activateWebSocket()
        }
      });

  }

  /** 
   * Activates the websocket, as soon as the first load on the tweet list is finished.
   */
  activateWebSocket = () => {
    this.socket.on("tweet", data => {
      this.tweetList.splice(0, 0, data)
    })
  }

  /**
   * Function that manages the input changes, React standard
   */
  handleInputChange = (event) => {
    let key = event.target.name
    let value = event.target.value

    return this[key] = value
  }

  /**
   * When you click on 'tweet to #nowplaying', this function is called. It first veryfies if the 'url' and 'comment' fields are filled.
   * If not, it will block the function. Otherwise, it gets the content, concatenates and send thru POST.
   */
  onTweetClick = () => {
    if (!this.url || this.url === '') {
      Toast('The Video URL field cannot be empty');
      return
    }

    if (!this.comment || this.comment === '') {
      Toast('The Comment field cannot be empty');
      return
    }

    let newTweet = this.url + ' ' + this.comment

    let headers = { 'Content-Type': 'application/json' };
    let body = { status: newTweet }
    axios.post('http://nowplaying-server.herokuapp.com/tweet', body, { headers: headers })
      .then(response => {
        Toast('Tweet postado com sucesso!');
        this.url = ''
        this.comment = ''
      });
  }

  /**
   * As soon as the Geolocation component gets the current position, it sets the values to the corresponding variables.
   */
  getCurrentCity = (position) => {
    this.latitude = position.coords.latitude
    this.longitude = position.coords.longitude

    let latlng = new google.maps.LatLng(this.latitude, this.longitude);
    let cityName = ''
    new Promise((resolve) => {

      new google.maps.Geocoder().geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            let city = null;
            let c, lc, component;
            for (let r = 0, rl = results.length; r < rl; r += 1) {
              let result = results[r];

              if (!city && result.types[0] === 'locality') {
                for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                  component = result.address_components[c];

                  if (component.types[0] === 'locality') {
                    cityName = component.long_name;
                    resolve()
                  }
                }
              }
            }
          }
        }
      });
    }).then((result) => {
      this.cityName = cityName
      this.fillTweetList()
    })
  }

  render() {
    return (
      <div>
        {/* 
          Gets the current geolocation of the user. 
         */}
        <Geolocation
          onSuccess={this.getCurrentCity}
          render={({
            fetchingPosition,
            position: { coords: { latitude, longitude } = {} } = {},
            error,
            getCurrentPosition
          }) => <div></div>}
        />
        <nav className="app-navbar">
          <div className="navbar-items">
            <img alt='logo' src={logo} />
          </div>
        </nav>
        <div className='container'>
          <div className='inputContainer'>
            <div className='inputBox flex1'>
              <span> Video URL</span>
              <input name='url' type='text' value={this.url} onChange={this.handleInputChange} placeholder='http://youtube.com' />
            </div>
            <div className='inputBox flex2'>
              <span>Comment</span>
              <input name='comment' type='text' style={{ width: '100%' }} value={this.comment} onChange={this.handleInputChange} placeholder='type a comment...' />
            </div>
            <div className='inputBox'>
              <button className='inputButton btn btn-primary' onClick={this.onTweetClick}><i className="fab fa-twitter"></i>Tweet to #nowplaying</button>
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>

          {this.cityName && <h3>{'#nowplaying near ' + this.cityName}</h3>}

          <div>
            <ul className='tweetContainer'>
              {!this.cityName && <div className='spinner'><i className="fa fa-spinner fa-spin"></i></div>}
              {this.cityName && this.tweetList.map((tweet, index) => (
                <li key={'tweetLi_' + index}>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='tweetTitle'>
                        {tweet.entities.urls && tweet.entities.urls.length > 0 && tweet.entities.urls[0].expanded_url && <iframe width='100%' height='315' src={'https://www.youtube.com/embed/' + this.getYoutubeIdByUrl(tweet.entities.urls[0].expanded_url) + '?showinfo=0'} frameBorder='0' allowFullScreen></iframe>}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='userData'>
                        <img className='userImg' alt='image' src={tweet.user.profile_image_url}></img>
                        <div className='userName'>{tweet.user.name}</div>
                        <div className='userMention'>{'@' + tweet.user.screen_name}</div>
                      </div>
                      <div style={{ clear: 'both' }}></div>
                      <div className='tweetContent'>
                        {tweet.text}
                      </div>
                      <div className='sharingData'>
                        <div className='currentDate'>{this.formatDate(tweet.created_at)}</div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div >
    )
  }
}
