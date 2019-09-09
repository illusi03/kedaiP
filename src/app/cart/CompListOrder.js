import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView, ActivityIndicator, Alert } from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';
import IconIon from 'react-native-vector-icons/Ionicons'
import IconFa from 'react-native-vector-icons/FontAwesome5'
import IconOctic from 'react-native-vector-icons/Octicons'

import Constanta, { convertToRupiah } from '../../res/Constant'
import { Styles, Color } from '../../res/Styles'
import { getTransaction } from '../../_actions/Transaction'
import { addOrder, editOrder, addOrderBiasa, setOrderStatus } from '../../_actions/Order'

class CompListOrder extends Component {
  state = {
    isAdaBarang: false,
    isLoading: true,
    isLoadingAddOrRemove: false,
    dataNow: [],

    getDataMenuSatuan: false,
    isQtyMenu: false,
    refreshFlatMenu: false,
  }

  aksiAddOrder = async () => {
    //Untuk tambah data
    //Cari data Jika isPaid false , Input Order.
    //Insert ke dispatch Temp Order
    alert('mantap')
    // let orders = this.props.Order.dataItemTmp
    // const index = orders.findIndex(item => {
    //   return (item.menuId == menuId & item.transactionId == transactionId)
    // })
    // if(index >= 0) {
    //   let orderTemporer = orders[index]
    //   let incQty = orderTemporer.qty + 1
    //   let incOrder = {
    //     ...orderTemporer,
    //     qty: incQty
    //   }
    //   orders[index] = incOrder
    //   await this.props.dispatch(addOrderBiasa(
    //     orders
    //   ))
    //   await this.setState({
    //     dataNow: orders[index]
    //   })
    // }
  }

  loadDataOrder = async () => {
    let ordersProps = this.props.Order.dataItemTmp
    let menusProps = this.props.Menu.dataItem
    let dataNow = ordersProps
    let isAdaBarang = false
    ordersProps.map((itemOrder, index) => {
      if (this.props.item.menuId == itemOrder.menuId
        & this.props.item.transactionId == itemOrder.transactionId
        & itemOrder.status == null) {
        dataNow = itemOrder
      }
    })
    await this.setState({
      dataNow: dataNow,
      isAdaBarang: isAdaBarang
    })
  }
  componentDidMount() {
    this.loadDataOrder()
  }
  render() {
    return (
      this.state.dataNow.menu ?
      <View style={[Styles.cardSimpleContainer, {
        backgroundColor: Color.whiteColor,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        margin: 5,
        marginVertical: 20,
        flexDirection: 'row',
        position: 'relative',
        height: 100,
        flex: 1
      }]}>
        <TouchableOpacity
          onPress={() => alert('mantap La')}
        >
          <IconFa name='minus-square' color={Color.darkPrimaryColor} size={23} style={{
            paddingRight: 10,
            paddingLeft: 10
          }}></IconFa>
        </TouchableOpacity>
        <Image source={{ uri: this.state.dataNow.menu.image }} style={{
          width: 100,
          height: '100%',
          marginRight: 20,
          borderRadius: 10
        }}></Image>
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Text style={[Styles.hurufKonten, {
            fontSize: 17,
            fontWeight: 'bold',
            textAlign: 'center'
          }]}>
            {this.state.dataNow.menu.name}</Text>
          <Text style={[Styles.hurufKonten, {
            fontSize: 15,
            fontWeight: 'bold',
            textAlign: 'center'
          }]}>
            {convertToRupiah(this.state.dataNow.menu.price)} / pcs</Text>
          <Text style={[Styles.hurufKonten, {
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center'
          }]}>
            ({convertToRupiah(this.state.dataNow.menu.price * this.state.dataNow.qty)})</Text>
        </View>
        <TouchableOpacity
          onPress={this.aksiAddOrder}
        >
          <IconFa name='plus-square' color={Color.darkPrimaryColor} size={23} style={{
            paddingRight: 10,
            paddingLeft: 10
          }}></IconFa>
        </TouchableOpacity>
        <View style={{
          position: 'absolute',
          right: -5,
          top: -15,
          width: 30,
          height: 30,
          backgroundColor: Color.whiteColor,
          borderRadius: 50,
          borderColor: Color.darkPrimaryColor,
          borderWidth: 2,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{this.state.dataNow.qty}</Text>
        </View>
      </View>
      : false 
    )
  }
}
const mapStateToProps = (state) => {
  return {
    Transaction: state.Transaction,
    Order: state.Order,
    Menu: state.Menu
  }
}
export default connect(mapStateToProps)(CompListOrder)