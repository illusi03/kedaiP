import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'

import { Styles, Color } from '../../res/Styles'
import { convertToRupiah } from '../../res/Constant'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'

import { reRenderMenu, getMenu } from '../../_actions/Menu'
import { addOrderBiasa } from '../../_actions/Order'
import { setIsOrdered } from '../../_actions/Home'

class CompListOrderConfirmed extends Component {
  render() {
    return (
      this.props.item ?
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
          {this.props.item.status == false ?
            <TouchableOpacity style={Styles.cardSimpleContainer, [{
              position: 'absolute',
              right: 15,
              bottom: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Color.warningColor,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 5,
              width: 100,
              elevation: 3,
              flexDirection: 'row'
            }]}
              onPress={this.props.onPressStatus}
            >
              <Text style={[Styles.hurufKonten, {
                color: Color.whiteColor,
                fontWeight: 'bold',
                fontSize: 18
              }]}>Waiting</Text>
            </TouchableOpacity>
            :
            <View style={Styles.cardSimpleContainer, [{
              position: 'absolute',
              right: 15,
              bottom: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Color.successColor,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 5,
              width: 100,
              elevation: 3,
              flexDirection: 'row'
            }]}>
              <Text style={[Styles.hurufKonten, {
                color: Color.whiteColor,
                fontWeight: 'bold',
                fontSize: 18
              }]}>Success</Text>
            </View>
          }
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
              {convertToRupiah(this.props.item.price * this.props.item.qty)} ({this.props.item.qty})</Text>
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
        : false
    )
  }
}
const mapStateToProps = (state) => {
  return {
    Order: state.Order,
    Menu: state.Menu
  }
}
export default connect(mapStateToProps)(CompListOrderConfirmed)