import React, {Component, Navigator} from 'react';
import BackgroundTimer from 'react-native-background-timer';
import configureStore from './src/store/configureStore';
import { Provider } from 'react-redux';
import offline from 'react-native-simple-store';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ItemsActions from './src/actions/items'
var debounce = require('debounce');

const store = configureStore()
import {
  Button, Icon, SocialIcon 
} from 'react-native-elements';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,AccessToken
} = FBSDK;

import {
  NetInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
const Sound = require('react-native-sound');

const requireAudio = require('./bell_sound.mp3');

class SilenceSound extends Component {

  constructor(props) {
    super(props);

    Sound.setCategory('Playback', true); // true = mixWithOthers

    this.facebookLogin = () =>{
      LoginManager.logInWithReadPermissions(['public_profile','email']).then(
        function(result) {
          if (result.isCancelled) {
            alert('Login cancelled');
          } else {
            console.log(JSON.stringify(result));
            AccessToken.getCurrentAccessToken().then(
              (data) => {
                console.log(JSON.stringify(data));
                 fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + data.accessToken.toString())
                  .then((response) => response.json())
                  .then((json) => {
                     alert(JSON.stringify(json));  
                    // Some user object has been set up somewhere, build that user here
                    var user = new Object();
                    user.name = json.name
                    user.id = json.id
                    user.user_friends = json.friends
                    user.email = json.email
                    user.username = json.name
                    user.loading = false
                    user.loggedIn = true
                  // user.avatar = setAvatar(json.id)    
                   
                  })
                  .catch((error) => {
                    console.log('Loi nang');
                    console.log(error);
                  })
              }
            )
          }
        },
        function(error) {
          alert('Login fail with error: ' + error);
        }
      );
    }

    this.playSoundBundle = debounce(() => {
      if (NetInfo) {
          NetInfo.isConnected.fetch().done(isConnected => {
            if (isConnected) {
              this.checkConnection()
            } else {
              this.goOffline()
            }
          })
        } else {
          this.checkConnection()
        }

      const s = new Sound('bell_sound.mp3', Sound.MAIN_BUNDLE, (e) => {
        if (e) {
          console.log('error', e);
        } else {
          s.setSpeed(1);
          s.play(); 
          ItemsActions.addItem('start',0);
          this.setState({startTime: new Date().getTime()});
          this.state.interval= BackgroundTimer.setInterval(() => {
             s.play(); 
          }, 4000);
          this.setState({loopingSound: false});
          
        }
      }, 1000);
    }
  );
this.mapStateToProps =(state) =>{
  return {
    onlineItems: state.items.onlineList,
    offlineItems: state.items.offlineList,
    connectionChecked: state.items.connectionChecked,
    connected: state.items.connected
  }
}

this.mapDispatchToProps=(dispatch)=> {
  return bindActionCreators(ItemsActions, dispatch)
}

this.checkConnection = () =>{
  return dispatch => {
    dispatch({type: ItemsActions.CONNECTION_CHECKING})
    setTimeout(() => dispatch({type: ItemsActions.CONNECTION_CHECKED}), 5000)
  }
}

this.goOnline=() =>{
  return {
    type: ItemsActions.CONNECTION_ONLINE
  }
}

this.goOffline=() =>{
  return {
    type: ItemsActions.CONNECTION_OFFLINE
  }
}


    this.stopSoundBundle = debounce(() => {
       this.setState({loopingSound: true});
       BackgroundTimer.clearInterval(this.state.interval);
       time= (new Date().getTime())-this.state.startTime;
       ItemsActions.addItem('stop', time);
    },1000);

    this.playSoundLooped = () => {
      if (this.state.loopingSound) {
        return;
      }
      const s = new Sound('bell_sound.mp3', Sound.MAIN_BUNDLE, (e) => {
        if (e) {
          console.log('error', e);
        }
        s.setNumberOfLoops(-1);
        s.play();
      });
      this.setState({loopingSound: s});
    };

    this.stopSoundLooped = () => {
      if (!this.state.loopingSound) {
        return;
      }

      this.state.loopingSound
        .stop()
        .release();
      this.setState({loopingSound: null});
    };

    this.playSoundFromRequire = () => {
      const s = new Sound(requireAudio, (e) => {
        if (e) {
          console.log('error', e);
          return;
        }

        s.play(() => s.release());
      });
    };

    this.initUser = (token) => {
     
    }

    this.state = {
      loopingSound: true,
      interval: undefined,
      startTime: 0,
      user: undefined
    };
  }

  renderiOSOnlyFeatures() {
    return [
      <Feature key="require" title="Audio via 'require' statement" onPress={this.playSoundFromRequire}/>,
    ]
  }

  render() {
    return (
      <Provider store={store}>
         
        <View style={styles.container}>
         <View style={styles.header}>
           <Icon
                    name='cog'
                    type='font-awesome'
                    color='#3351AD'
                    underlayColor='#378DBE'
                    onPress={this.stopSoundBundle} />
        </View>
        <View style={styles.center}>
          {this.state.loopingSound
            ?
                <Icon
                    raised
                    name='envira'
                    type='font-awesome'
                    color='#77C54F'
                    underlayColor='#378DBE'
                    onPress={this.playSoundBundle} />
            :  
            <Icon
                    raised
                    name='stop'
                    type='font-awesome'
                    color='#3351AD'
                    underlayColor='#378DBE'
                    onPress={this.stopSoundBundle} />
                    
          }
          { Platform.OS === 'ios' ? this.renderiOSOnlyFeatures() : null }
        </View>
        <View style={styles.bottom}>

          <Icon
                    raised
                    name='line-chart'
                    type='font-awesome'
                    color='#FF9000'
                    underlayColor='#378DBE'
                    onPress={this.stopSoundBundle} />
        </View>
         </View>
      </Provider>
     )
  }
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor:'#378DBE',
    padding: 10,
  },
   header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  button: {
    fontSize: 20,
    backgroundColor: 'silver',
    padding: 5,
  },
 
  feature: {
    padding: 20,
    alignSelf: 'stretch',
  }
});

export default SilenceSound;