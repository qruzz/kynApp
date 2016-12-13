import React, { Component, PropTypes } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native'
import Dashboard from './app/scenes/Dashboard'
import Authentication from './app/scenes/Authentication'
import {Actions, Scene, Router} from 'react-native-router-flux';
import * as firebase from 'firebase'
import RNRestart from 'react-native-restart'
// import { BleManager } from 'react-native-ble-plx'

const firebaseConfig = {
    apiKey: "AIzaSyBpBPio31QhKBmqJy_aT9xH0L7pFg9hlR8",
    authDomain: "kyn-e98de.firebaseapp.com",
    databaseURL: "https://kyn-e98de.firebaseio.com/"
}
export const firebaseApp = firebase.initializeApp(firebaseConfig)

export default class kyn extends Component {
    constructor(props) {
        super(props)

        // const manager = new BleManager()
        // const uuid = '75023A9074F94CCD95B0967E742282D0'
        //
        // manager.startDeviceScan(uuid)
        // console.log(manager)
    }

    render() {
        return (
            <Router>
                <Scene key={'root'}>
                    <Scene
                        key={'authentication'}
                        component={Authentication}
                        initial={true}
                        hideNavBar={true}
                    />
                    <Scene
                        key={'dashboard'}
                        component={Dashboard}
                        // initial={true}
                        hideNavBar={false}
                        backTitle={'LOG OUT'}
                        onBack={this._signOut}
                    />
                </Scene>
            </Router>
        );
    }

    /**
    * Function that signs out the currently logged in user, pops the scene from
    * the navigation stack so that the
    **/
    _signOut() {
        firebaseApp.auth().signOut().then(function() {
            // Succesfuly logged out
            Actions.pop()
            // HACK: Restarting the app after signOut to reset all the states
            RNRestart.Restart()
            // NOTE: Debugging
            console.log('Signed out')
        }, function(error) {
            // An error occured
            console.log(error.code)
            console.log(error.message)
        })
    }
}

const styles = StyleSheet.create({
    navigator: {
        flex: 1,
    }
});

AppRegistry.registerComponent('kyn', () => kyn);
