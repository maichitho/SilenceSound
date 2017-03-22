import React, {Component, Navigator} from 'react';
import BackgroundTimer from 'react-native-background-timer';
import configureStore from './src/store/configureStore';
import { Provider } from 'react-redux';
import offline from 'react-native-simple-store';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ItemsActions from './src/actions/items'
var debounce = require('debounce');

var Slider = require('react-native-slider');

const store = configureStore()
import {
  Button, Icon, SocialIcon 
} from 'react-native-elements';
var DeviceInfo = require('react-native-device-info');

// const FBSDK = require('react-native-fbsdk');
// const {
//   LoginManager,AccessToken
// } = FBSDK;

import {
  Linking,
  NetInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
const Sound = require('react-native-sound');
class SilenceSound extends Component {

  constructor(props) {
    super(props);

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

    Sound.setCategory('Playback', true); // true = mixWithOthers
    this.state = {
      loopingSound: true,
      interval: undefined,
      startTime: 0,
      user: undefined,
      step: 4
    };
  }

  componentWillMount = () =>{
      this.playSoundBundle = debounce(this.playSoundBundle,500);
  }

  playSoundBundle = () => {
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
          }, this.state.step*1000);
          this.setState({loopingSound: false});
        }
      });
    }

    
    stopSoundBundle = () => {
       BackgroundTimer.clearInterval(this.state.interval);
       time= (new Date().getTime())-this.state.startTime;
       ItemsActions.addItem('stop', time);
       this.setState({loopingSound: true});
    };
    mapStateToProps =(state) =>{
      return {
        onlineItems: state.items.onlineList,
        offlineItems: state.items.offlineList,
        connectionChecked: state.items.connectionChecked,
        connected: state.items.connected
      }
    }

    mapDispatchToProps=(dispatch)=> {
      return bindActionCreators(ItemsActions, dispatch)
    }

    checkConnection = () =>{
      return dispatch => {
        dispatch({type: ItemsActions.CONNECTION_CHECKING})
        setTimeout(() => dispatch({type: ItemsActions.CONNECTION_CHECKED}), 5000)
      }
    }

    goOnline=() =>{
      return {
        type: ItemsActions.CONNECTION_ONLINE
      }
    }

    goOffline=() =>{
      return {
        type: ItemsActions.CONNECTION_OFFLINE
      }
    }



    openLink = () =>{
      Linking.openURL("https://silencesound-349ab.firebaseapp.com/?id="+DeviceInfo.getUniqueID());
    }

  render() {
    return (
      <Provider store={store}>
         
        <View style={styles.container}>
          <View style={styles.header}>
            <Slider
              value={this.state.step}
              disabled={!this.state.loopingSound}
              minimumValue={2}
              maximumValue={6}
              step={1}
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              onValueChange={(step) => this.setState({step})} />
              <View style={styles.step}>
                <Text>{this.state.step} s</Text>
              </View>
            
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
        </View>
        <View style={styles.bottom}>
          <Icon
                    raised
                    name='line-chart'
                    type='font-awesome'
                    color='#FF9000'
                    underlayColor='#378DBE'
                    onPress={this.openLink} />
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
    backgroundColor:'#005CA1',
    padding: 20,
  },
    track: {
      height: 2,
      borderRadius: 1,
    },
    thumb: {
      width: 18,
      height: 18,
      borderRadius: 18 / 2,
      backgroundColor: 'white',
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 2,
      shadowOpacity: 0.35,
      top: 20
    },
   header: {
     flex: 1, 
     alignItems: 'stretch', 
     justifyContent: 'flex-start'

  },
  step: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
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