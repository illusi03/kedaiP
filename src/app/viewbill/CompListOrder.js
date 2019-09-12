import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
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
          padding: 5,
          margin: 5,
          height: 100,
          flexDirection: 'row',
          position: 'relative',
          borderWidth: 2,
          borderColor: Color.whiteColor,
          flex: 1
        }]}>
          <View style={Styles.cardSimpleContainer, [{
            position: 'absolute',
            right: 15,
            bottom: 15,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Color.whiteColor,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 5,
            width: 100,
            elevation: 3,
            flexDirection: 'row'
          }]}>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'center',
                height: '100%'
              }}
              onPress={this.props.onPressMin}
            >
              <IconFA5
                name='minus'
                size={15}
                color={Color.accentColor}
              ></IconFA5>
            </TouchableOpacity>
            <Text style={[Styles.hurufKonten, {
              fontSize: 14,
              fontWeight: 'bold',
              flex: 1,
              textAlign: 'center'
            }]}>{this.props.item.qty}</Text>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'center',
                height: '100%'
              }}
              onPress={this.props.onPressAdd}
            >
              <IconFA5
                name='plus'
                size={15}
                color={Color.accentColor}
              ></IconFA5>
            </TouchableOpacity>
          </View>
          <Image source={{ uri: this.props.item.menu.image }} style={{
            width: 100,
            height: '100%',
            marginRight: 20,
            borderRadius: 10
          }}></Image>
          <View style={{
            flexDirection: 'column',
            marginTop: 5
          }}>
            <Text style={[Styles.hurufKonten, {
              fontSize: 15,
              fontWeight: 'bold',
              textAlign: 'left'
            }]}>{this.props.item.menu.name}</Text>
            <Text style={[Styles.hurufKonten, {
              fontSize: 19,
              fontWeight: 'bold',
              textAlign: 'left'
            }]}>
              {convertToRupiah(this.props.item.price * this.props.item.qty)}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[Styles.hurufKonten, {
                fontSize: 15,
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