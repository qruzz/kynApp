import { BleManager } from 'react-native-ble-plx'
import { Buffer } from 'buffer'

/**
 * Function that contineously scannes for bluetooth devices
 * @param Object {<BleManager>}
 * @param String deviceUUID
**/
export function scanForDevices(manager, deviceUUID) {
    // Start to scan for all devices
    manager.startDeviceScan(null, null, (error, device) => {
        // NOTE: Debugging
        console.log('Scanning...')
        console.log(device)

        // If errors happen in the initail period of the scan
        if (error) {
            console.log("ERROR_CODE: " + error.code)
            console.log("ERROR_MESSAGE: " + error.message)
        }
    })
}

/**
 * Function that connects to a specified device, and passes down a value to the
 * writeInterests function.
 * @param Object {<BleManager>}
 * @param Object {<Device>}
 * @param String value
**/
export function connect(manager, device, value) {
    // The constants containing the UUIDs of the service and characterisic to write to
    const kynWearServiceUUID = '713d0000-503e-4c75-ba94-3148f18d941e'
    const characteristicUUID = '713d0003-503e-4c75-ba94-3148f18d941e'

    console.log('In connect function, before connecting')

    // Connect to the specified device
    manager.connectToDevice(device).then(function(result) {
        // Promise was fulfilled
        console.log('We are connected to the device with uuid: ' + result.uuid)

        // Second check to verfiy that the connection to the device was successful
        result.isConnected().then(function(result) {
            // Promise was fulfilled
            console.log('So we are really connected to the device? ' + result)
        }, function(error) {
            // Promise was rejected
            console.log('There was an error checking if device is connected: ' + error)
        })

        // Discover all the services and characteristics for the specified device and UUIDs
        discoverServicesAndCharacteristics(result, kynWearServiceUUID, characteristicUUID, value)

    }, function(error) {
        // Promise was rejected
        console.log('There was an error connecting to the device: ' + error)
    })
}

/**
 * Function that discovers all the services and characteristcs of one of those specific services,
 * for a specified device.
 * @param Object {<Device>}
 * @param String serviceUUID
 * @param String characteristicUUID
 * @param String value
**/
export function discoverServicesAndCharacteristics(device, serviceUUID, characteristicUUID, value) {
    device.discoverAllServicesAndCharacteristics().then(function(result) {
        // Promise was fulfilled
        console.log('The characteristics for the device is:')
        console.log(result)

        result.services().then(function(result) {
            // Promise was fulfilled
            console.log('The services for the device are: ')
            console.log(result)

            device.characteristicsForService(serviceUUID).then(function(result) {
                // Promise was fulfilled
                console.log('The characteristics for the service with UUID: ' + serviceUUID + ' are:')
                console.log(result)

                // Calling the function, to write to characteristics with the specified uuid
                writeInterests(device, serviceUUID, characteristicUUID, value)

            }, function(error) {
                // Promise was rejected
                console.log('There was an error discovering the caracteristics for the service with UUID: ' + kynWearServiceUUID + ' Error: ' + error)
            })
        }, function(error) {
            // Promise was rejected
            console.log('There was an error discovering the services for the device: ' + error)
        })
    }, function(error) {
        // Promise was rejected
        console.log('There was an error discovering all the characteristics for the device: ' + error)
    })
}

/**
 * Function that writes data to a specified characteristic for a connected device.
 * @param Object {<Device>}
 * @param String serviceUUID
 * @param String characteristicUUID
 * @param String value
**/
export function writeInterests(device, serviceUUID, characteristicUUID, value) {
    // The value that we are writing to the characteristic, converted to base64
    value = Buffer.from(value, 'ascii').toString('base64')

    // Write the specified value to the characteristic and then cancel the connection
    device.writeCharacteristicWithoutResponseForService(serviceUUID, characteristicUUID, value).then(function(result) {
        // Promise was fulfilled
        console.log('Wrote ' + value + ' to the characteristic with UUID: ' + characteristicUUID)

        // Cancel connection to the device after write
        device.cancelConnection()

    }, function(error) {
        // Promise was rejected

        console.log(error)
    })
}
