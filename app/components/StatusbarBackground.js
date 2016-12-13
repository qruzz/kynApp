'use strict'

import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'

class StatusbarBackground extends Component {
    render() {
        return (
            <View style={styles.statusbarBackground}>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    statusbarBackground: {
        height: 20,
        backgroundColor: '#FAFAFA'
    }
})

module.exports = StatusbarBackground
