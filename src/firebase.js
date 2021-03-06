import { initializeApp } from 'firebase'
import { addItemSuccess, removeItemSuccess, goOnline, goOffline } from './actions/items'

import config from '../config'
var DeviceInfo = require('react-native-device-info');

const firebaseApp = initializeApp({
  apiKey: config.API_KEY,
  authDomain: config.AUTH_DOMAIN,
  databaseURL: config.DATABASE_URL,
  storageBucket: config.STORAGE_BUCKET
})
export const itemsRef = firebaseApp.database().ref('users/'+DeviceInfo.getUniqueID()+'/items')
const connectedRef = firebaseApp.database().ref('.info/connected')

export function syncFirebase(store) {
  itemsRef.on('child_added', (snapshot) => {
    store.dispatch(addItemSuccess(snapshot.val()))
  })

  itemsRef.on('child_removed', (snapshot) => {
    store.dispatch(removeItemSuccess(snapshot.val().id))
  })

  connectedRef.on('value', snap => {
    if (snap.val() === true) {
      store.dispatch(goOnline())
    } else {
      store.dispatch(goOffline())
    }
  })
}
