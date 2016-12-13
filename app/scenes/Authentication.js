import React, { Component, PropTypes } from 'react'
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Platform
} from 'react-native'
import ViewContainer from '../components/ViewContainer'
import Dashboard from './Dashboard'
import { firebaseApp } from '../../index.ios.js'
import { Actions } from 'react-native-router-flux'
import { BleManager } from 'react-native-ble-plx'

export default class Authentication extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            info: '',
            values: {}
        }

        this.manager = new BleManager()
        // const uuid = [
        // 	'75023A9074F94CCD95B0967E742282D0'
        // ]
    }

    componentWillMount() {
        // In ios, we need to wait for a state change before we can scan for devices
        if (Platform.OS === 'ios') {
            this.manager.onStateChange((state) => {
                console.log('This is ios')
                this.scanAndConnect()
            })
        } else {
            this.scanAndConnect()
        }
    }



    scanAndConnect() {
        // Start to scan for devices
        this.manager.startDeviceScan(null, null, (error, device) => {
            this.setState({info: 'Scanning...'})
            // NOTE: Debugging
            console.log(this.state.info)
            console.log(device);

            if (error) {
                console.log("ERROR_CODE: " + error.code)
                console.log("ERROR_MESSAGE: " + error.message)
            }

            if (device.uuid === '9D0C0030-EF59-4E11-928C-DDAD1E82DBAB') {
                this.setState({info: 'Connecting to device with uuid: ' + device.uuid})
                this.manager.stopDeviceScan()
                console.log(this.state.info)

                this.manager.connectToDevice(device.uuid)
            }

            // var connection = this.manager.isDeviceConnected(device.uuid)
            // console.log('Is device connected? ' + connection)

            // Returns a JS Promise, that we can then handle 
            this.manager.isDeviceConnected(device.uuid).then(function(result) {
                console.log(result)
            })
        })
    }

    render() {

        return (
            <ViewContainer>
                <View style={styles.welcome}>
                    <Text style={styles.message}>Welcome! Please Log In.</Text>
                </View>
                <View style={styles.inputFields}>
                    <TextInput
                        style={styles.input}
                        placeholder="email"
                        onChangeText={(input) => this.setState({email: input})}
                        value={this.state.email}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="password"
                        onChangeText={(input) => this.setState({password: input})}
                        value={this.state.password}
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.loginButton} onPress={this._login.bind(this)}>
                        <Text style={styles.buttonText}>log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signupButton} onPress={this._signUp.bind(this)}>
                        <Text style={styles.buttonText}>sign up</Text>
                    </TouchableOpacity>
                </View>
            </ViewContainer>
        )
    }

    /**
    * Function that handles onPress event from sign up button and creates a user
    * in Firebase with the entered email and password.
    **/
    _signUp() {
        firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
            // Handle errors here
            console.log(error.code)
            console.log(error.message)
        })
        // NOTE: Debugging
        console.log('Signed up')

        this._login()
    }

    /**
    * Function that handles onPress event from sign up button and logs in user
    * already authorised, with the entered email and password.
    **/
    _login() {
        firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
            // Handle errors here
            // NOTE: Debugging
            console.log(error.code)
            console.log(error.message)
        })
        // Push the new scene on top of the navigation stack, and clears the input fields
        // NOTE: Debugging
        console.log('Logged in')
        Actions.dashboard()
        this.setState({email: ''})
        this.setState({password: ''})
    }
}

const styles = StyleSheet.create({
    welcome: {
        marginTop: 150
    },
    message: {
        textAlign: 'center',
        color: '#B4B4B4',
        fontSize: 15
    },
    inputFields: {
        marginTop: 40
    },
    input: {
        height: 50,
        backgroundColor: '#FFFF',
        textAlign: 'center',
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#C5C5C5',
        marginBottom: 15
    },
    buttons: {
        padding: 40
    },
    loginButton: {
        height: 50,
        backgroundColor: '#F97151',
        overflow: 'hidden',
        borderRadius: 30,
    },
    signupButton: {
        height: 50,
        backgroundColor: '#E9E9E9',
        overflow: 'hidden',
        borderRadius: 30,
        marginTop: 15
    },
    buttonText: {
        textAlign: 'center',
        padding: 17
    }
})
