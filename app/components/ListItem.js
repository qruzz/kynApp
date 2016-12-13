'use strict'

import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableHighlight
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { firebaseApp } from '../../index.ios.js'

export default class ListItem extends Component {
    constructor(props) {
        super(props)

        this.itemsRef = firebaseApp.database().ref()
    }

    render() {
        return (
            <View style={styles.cell}>
                <Text style={styles.cellText}>{this.props.rowData.interest}</Text>
                {/* <TouchableHighlight style={styles.delete} onPress={this._deleteInterest().bind(this)}>
                    <Icon name="ios-close" size={30} color='#B3B3B3' />
                </TouchableHighlight> */}
            </View>
        )
    }

    _deleteInterest(itemsRef) {
        // TODO: Implement the remove function, so that it only removes the chosen item
        // this.itemsRef.remove()
        // console.log(this.itemsRef.child(key))
    }
}

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#FFFF',
        height: 50
    },
    cellText: {
        fontSize: 12,
        color: 'black',
        padding: 17,
        marginLeft: 5
    },
    delete: {
        padding: 9
    }
})
