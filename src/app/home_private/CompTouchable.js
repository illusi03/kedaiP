import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

import { Styles, Color } from '../../res/Styles'
class CompTouchable extends Component {
  render() {
    return (
      <TouchableOpacity style={[Styles.cardSimpleContainer,{
        backgroundColor: Color.darkPrimaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp(1.5),
        margin:wp(1.5),
        width:wp(22)
      }]}
      onPress={this.props.onPress}
      onLongPress={this.props.onLongPress}
      >
        <Text style={[Styles.hurufKonten, {
          fontWeight: 'bold',
          textAlign: 'center',
          color:Color.whiteColor
        }]}>
          {this.props.namaKategori}</Text>
      </TouchableOpacity>
    )
  }
}
export default CompTouchable