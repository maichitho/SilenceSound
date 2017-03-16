import React, {Component} from 'react';
import BackgroundTimer from 'react-native-background-timer';
import configureStore from './src/store/configureStore';
import { Provider } from 'react-redux';
import offline from 'react-native-simple-store';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ItemsActions from './src/actions/items'

const store = configureStore()
import {
  Button, Icon
} from 'react-native-elements';

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

    this.playSoundBundle = () => {
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
      });
    };

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


    this.stopSoundBundle = () => {
       this.setState({loopingSound: true});
       BackgroundTimer.clearInterval(this.state.interval);
       time= (new Date().getTime())-this.state.startTime;
       ItemsActions.addItem('stop', time);
    };

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

    this.state = {
      loopingSound: true,
      interval: undefined,
      startTime: 0,
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
      </Provider>
     )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#378DBE'
  },
  button: {
    fontSize: 20,
    backgroundColor: 'silver',
    padding: 5,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  feature: {
    padding: 20,
    alignSelf: 'stretch',
  }
});

export default SilenceSound;