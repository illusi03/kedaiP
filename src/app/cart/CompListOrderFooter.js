
import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView, ActivityIndicator, Alert } from 'react-native'

import Constanta, { convertToRupiah } from '../../res/Constant'
import { Styles, Color } from '../../res/Styles'
import { getTransaction } from '../../_actions/Transaction'
import { addOrder, editOrder, addOrderBiasa, setOrderStatus } from '../../_actions/Order'
import CompListOrder from './CompListOrder'

export default class CompListOrderFooter extends Component {
  render() {
    return (
      <TouchableOpacity style={[Styles.cardSimpleContainer, {
        backgroundColor: Color.darkPrimaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        margin: 5,
        height: '100%',
        flex: 1,
        flexDirection: 'row'
      }]}
        onPress={() => alert('List Order')}
      >
        <Text style={[Styles.hurufKonten, {
          fontSize: 15,
          fontWeight: 'bold',
          textAlign: 'center',
          color: Color.whiteColor
        }]}>
          LIST ORDER</Text>
      </TouchableOpacity>
    )
  }
}