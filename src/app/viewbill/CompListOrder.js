import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import { Styles, Color } from '../../res/Styles'
import { convertToRupiah } from '../../res/Constant'


const CompListOrder = (props) => {
  return (
    /* List Menu (Status , Name dan Price) */
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10
    }}>
      <Text style={[Styles.hurufKonten, {
        fontSize: 14,
        fontWeight: '300',
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:12
      }]}>
        {props.status == null ? `Not Confirm` :
          props.status == 0 ? `Waiting` : `Confirmed`
        }
      </Text>
      <Text style={[Styles.hurufKonten, {
        fontSize: 14,
        fontWeight: '300',
        flex: 1,
        textAlign:'center',
        justifyContent:'center',
        alignItems:'center'
      }]}>{props.name}</Text>
      <Text style={[Styles.hurufKonten, {
        fontSize: 14,
        fontWeight: '300',
        flex: 1,
        textAlign: 'center',
        justifyContent:'center',
        alignItems:'center'
      }]}>{props.qty}</Text>
      <Text style={[Styles.hurufKonten, {
        fontSize: 14,
        fontWeight: '300',
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
      }]}>{convertToRupiah(props.price * props.qty)}</Text>
    </View>
  )
}
export default CompListOrder