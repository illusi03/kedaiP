import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { connect } from 'react-redux'

import { Styles, Color } from '../../res/Styles'
import { convertToRupiah } from '../../res/Constant'
import { setTransactionInput } from '../../_actions/Transaction'

const CompOptionBot = (props) => {
  let serviceCharge = Math.trunc((props.subTotal / 100) * 5.5)
  let tax = Math.trunc((props.subTotal / 100) * 10)
  let discount = 0
  let totalGrand = (props.subTotal + serviceCharge + tax) - discount
  let objCompOption = {
    subtotal: props.subTotal,
    serviceCharge,
    tax,
    discount,
    total: totalGrand,
    isPaid: false
  }
  props.dispatch(setTransactionInput(objCompOption))
  return (
    /* List Menu (Status , Name dan Price) */
    <View style={{
      flexDirection: 'row',
      flex: 1
    }}>
      <View style={[{
        flex: 25,
        marginRight: wp(1)
      }]}>
        <Text
          style={StylesLocal.fontRupiahKanan}
        >Sub Total</Text>
        <Text
          style={StylesLocal.fontRupiahKanan}
        >Discount</Text>
        <Text
          style={StylesLocal.fontRupiahKanan}
        >Service Charge (5.5%) </Text>
        <Text
          style={StylesLocal.fontRupiahKanan}
        >Tax (10%) </Text>
        <Text
          style={[StylesLocal.fontRupiahKanan, { fontSize: wp(4) }]}
        >TOTAL</Text>
      </View>
      <View style={[{
        flex: 15
      }]}>
        <Text
          style={StylesLocal.fontRupiahKanan}
        >
          {convertToRupiah(props.subTotal)}
        </Text>
        <Text
          style={StylesLocal.fontRupiahKanan}
        >
          {convertToRupiah(discount)}
        </Text>
        <Text
          style={StylesLocal.fontRupiahKanan}
        >
          {convertToRupiah(serviceCharge)}
        </Text>
        <Text
          style={StylesLocal.fontRupiahKanan}
        >
          {convertToRupiah(tax)}
        </Text>
        <Text
          style={[StylesLocal.fontRupiahKanan, { fontSize: wp(4) }]}
        >
          {convertToRupiah(totalGrand)}
        </Text>
      </View>
    </View>
  )
}
const StylesLocal = StyleSheet.create({
  fontRupiahKanan: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: wp(2),
    marginBottom: wp(0.8),
    color: Color.primaryTextColor
  },
  fontLabelKiri: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    textAlign: 'right'
  }
})
const mapStateToProps = (state) => {
  return {

  }
}

export default connect(mapStateToProps)(CompOptionBot)