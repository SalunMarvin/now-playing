#NOWPLAYING
======================

### The website
\#nowplaying is a React and Node based website that shows recent \#nowplaying tweets with an embed YouTube video near your current city.
You can also post tweets in @BInowplaying profile.

### Why React?

I'm using and working with React for 1 and a half year, I'm really confortable with it. Mobx
framework also helps a lot to refresh data in realtime, it has a property called @observable that updates an object always as it state changes (in this project, the Tweet list is an example).
Components can be separated in order to get more files instead of more lines of code (this is a TO-DO for this project).

### \#nowplaying auto-refresh
Since the load of #nowplaying it's HUGE in Twitter side, the auto-refresh provided by the project websockets will only load Tweets with the #nowplaying hashtag and "Torre" string in it. Otherwise the page would be loading tweets extremely fast and lazy-loading could not be tested.

### Setup

Clone the repository in your projects folder.

Node and NPM are pre-requisites for this project to run.

Run `npm install`
Run `npm start` and it's done - browser will automatically open.
