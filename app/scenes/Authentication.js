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
            info: ''
        }

        // Instansiate a new Bluetooth manager
        this.manager = new BleManager()
    }

    componentWillMount() {
        // In ios, we need to wait for a state change before we can scan for devices
        if (Platform.OS === 'ios') {
            // If the platform is ios, we wait for the state to change before scanning
            this.manager.onStateChange((state) => {
                this.scanAndConnect()
            })
        } else {
            // In Android, we can just start the scan
            this.scanAndConnect()
        }
    }

    writeInterests() {
        
    }

    /**
    * Function that scannes for bluetooth devices, until in finds the one we have specified.
    * If the uuid and name of a scanned device matches the one we defined, we stop the scan
    * and try to connect to the device.
    **/
    scanAndConnect() {
        var kynWearUUID = 'AF3A392B-A3BD-4502-6C4C-7EB2F763CFB5'
        var kynWearName = 'kynWear'

        // Start to scan for all devices
        this.manager.startDeviceScan(null, null, (error, device) => {
            // NOTE: Debugging
            console.log('Scanning...')
            console.log(device);

            // If errors happen in the initail period of the scan
            if (error) {
                console.log("ERROR_CODE: " + error.code)
                console.log("ERROR_MESSAGE: " + error.message)
            }

            // Checks if the uuid and name for a scanned device match the onces we are looking for
            if (device.uuid === kynWearUUID && device.name === kynWearName) {
                // Stop the scan for additional devices
                this.manager.stopDeviceScan()

                // Connects to the device, and returns a promise with the device if connected successfully
                device.connect().then(function(result) {
                    // Promise was fulfilled
                    console.log('We are connected to the device with name: ' + result.name + ' and uuid: ' + result.uuid)
                    result.isConnected().then(function(result) {
                        // Promise was fulfilled
                        console.log('We connected to the device? ' + result);
                    }, function(error) {
                        // Promise was rejected
                        console.log('There was an error checking if device is connected: ' + error)
                    })

                    result.discoverAllServicesAndCharacteristics().then(function(result) {
                        // Promise was fulfilled
                        console.log(result)
                    }, function(error) {
                        // Promise was rejected
                        console.log(error)
                    })
                }, function(error) {
                    // Promise was rejected
                    console.log('There was an error connecting to the device: ' + error)
                })
            }
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
