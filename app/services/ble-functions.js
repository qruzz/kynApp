import { BleManager } from 'react-native-ble-plx'
import { Buffer } from 'buffer'

/**
 * Function that scannes for bluetooth devices, until in finds the one we have specified.
 * If the uuid of a scanned device matches the one we defined, we stop the scan
 * and try to connect to the device.
 * @param {<BLEManager>}
 * @param {<Device>}
**/
export function scanAndConnect(manager, deviceUUID) {
    // Real
    // var kynWearUUID = 'A68F54B9-A343-48F8-9590-90382FB4FEF6'
    var kynWearServiceUUID = '713d0000-503e-4c75-ba94-3148f18d941e'
    var characteristicUUID = '713d0003-503e-4c75-ba94-3148f18d941e'



    // Start to scan for all devices
    manager.startDeviceScan(null, null, (error, device) => {
        // NOTE: Debugging
        console.log('Scanning...')
        console.log(device);

        // If errors happen in the initail period of the scan
        if (error) {
            console.log("ERROR_CODE: " + error.code)
            console.log("ERROR_MESSAGE: " + error.message)
        }

        // Checks if the uuid for a scanned device match the once we are looking for
        if (device.uuid === deviceUUID) {
            // Stop the scan for additional devices
            manager.stopDeviceScan()

            // Connect to the specified device
            device.connect().then(function(result) {
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
                discoverServicesAndCharacteristics(result, kynWearServiceUUID, characteristicUUID)

            }, function(error) {
                // Promise was rejected
                console.log('There was an error connecting to the device: ' + error)
            })
        }
    })
}

/**
 * Function that discovers all the services and characteristcs of one of those specific services,
 * for a specified device.
 * @param Object {<Device>}
 * @param String serviceUUID
 * @param String characteristicUUID
 * @param String base64
**/
export function discoverServicesAndCharacteristics(device, serviceUUID, characteristicUUID) {
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

                // The value that we are writing to the characteristic
                var value = Buffer.from('buttocks', 'ascii').toString('base64')

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
 * @param String base64
**/
export function writeInterests(device, serviceUUID, characteristicUUID, value) {
    device.writeCharacteristicWithoutResponseForService(serviceUUID, characteristicUUID, value).then(function(result) {
        // Promise was fulfilled
        console.log('Wrote ' + value + ' to the characteristic with UUID: ' + characteristicUUID)

        // Cancel connection to the device after write
        // NOTE: device.cancelConnection()

    }, function(error) {
        // Promise was rejected

        console.log(error)
    })
}
