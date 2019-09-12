import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { connect } from 'react-redux'

import { Styles, Color } from '../../res/Styles'
import { convertToRupiah } from '../../res/Constant'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'

import { reRenderMenu, getMenu } from '../../_actions/Menu'
import { addOrderBiasa } from '../../_actions/Order'
import { setIsOrdered } from '../../_actions/Home'

class CompListOrder extends Component {
  render() {
    return (
      <View style={[Styles.cardSimpleContainer, {
        backgroundColor: Color.whiteColor,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: wp(1.5),
        margin: wp(1.5),
        height: hp(12),
        flexDirection: 'row',
        position: 'relative',
        borderWidth: 2,
        borderColor: Color.whiteColor,
        flex: 1
      }]}>
        <View style={Styles.cardSimpleContainer, [{
          position: 'absolute',
          right: wp(2),
          bottom: wp(2),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Color.whiteColor,
          paddingHorizontal: wp(1.5),
          paddingVertical: wp(1.5),
          borderRadius: wp(0.5),
          width: wp(25),
          elevation: 3,
          flexDirection: 'row'
        }]}>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
            onPress={this.props.onPressMin}
          >
            <IconFA5
              name='minus'
              size={wp(3.5)}
              color={Color.accentColor}
            ></IconFA5>
          </TouchableOpacity>
          <Text style={[Styles.hurufKonten, {
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center'
          }]}>{this.props.item.qty}</Text>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
            onPress={this.props.onPressAdd}
          >
            <IconFA5
              name='plus'
              size={wp(3.5)}
              color={Color.accentColor}
            ></IconFA5>
          </TouchableOpacity>
        </View>
        <Image source={{ uri: this.props.item.menu.image }} style={{
          width: wp(20),
          height:hp(10),
          marginRight: wp(4),
          borderRadius: wp(2)
        }}></Image>
        <View style={{
          flexDirection: 'column',
          marginTop: 5
        }}>
          <Text style={[Styles.hurufKonten, {
            fontSize:wp(3),
            fontWeight: 'bold',
            textAlign: 'left'
          }]}>{this.props.item.menu.name}</Text>
          <Text style={[Styles.hurufKonten, {
            fontSize:wp(4),
            fontWeight: 'bold',
            textAlign: 'left'
          }]}>
            {convertToRupiah(this.props.item.price * this.props.item.qty)}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[Styles.hurufKonten, {
              fontSize:wp(3.5),
              fontWeight: 'bold',
              textAlign: 'left'
            }]}>
              {convertToRupiah(this.props.item.price)}/pcs </Text>
          </View>
        </View>
      </View>
    )
  }
}
export default CompListOrder