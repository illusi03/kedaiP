import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView, ActivityIndicator, ToastAndroid } from 'react-native'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconMaterialCom from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios'

import { Styles, Color } from '../../res/Styles'
import Constanta, { convertToRupiah } from '../../res/Constant'
import { addOrder, editOrder, addOrderBiasa } from '../../_actions/Order'

class CompListMenu extends Component {
  state = {
    isOrdered: false,
    dataNow: {}
  }
  getdataItemTmp = async () => {
    let transID = this.props.idTransaction
    let menuId = this.props.itemNya.id

    let orders = this.props.Order.dataItemTmp
    let menus = this.props.Menu.dataItem
    const index = orders.findIndex(item => {
      return (item.menuId == menuId & item.transactionId == transID)
    })
    if(index >= 0){
      await this.setState({
        dataNow:orders[index],
        isOrdered:true
      })
    }
  }
  componentDidMount(){
    this.getdataItemTmp()
  }
  aksiAddOrder = async (menuId, transactionId) => {
    //Untuk tambah data
    //Cari data Jika isPaid false , Input Order.
    //Insert ke dispatch Temp Order
    let orders = this.props.Order.dataItemTmp
    let menus = this.props.Menu.dataItem
    const indexMenus = menus.findIndex(item => {
      return (item.id == menuId)
    })
    const index = orders.findIndex(item => {
      return (item.menuId == menuId & item.transactionId == transactionId)
    })
    let menuObj = menus[indexMenus]
    if (index < 0) {
      let dataTambahTmp = {
        menuId,
        transactionId,
        price: menuObj.price,
        qty: 1,
        status:null
      }
      await this.props.dispatch(addOrderBiasa([
        ...this.props.Order.dataItemTmp,
        dataTambahTmp
      ]))
      await this.setState({
        isOrdered: true,
        dataNow: dataTambahTmp
      })
    } else {
      let orderTemporer = orders[index]
      let incQty = orderTemporer.qty + 1
      let incOrder = {
        ...orderTemporer,
        qty: incQty
      }
      orders[index] = incOrder
      await this.props.dispatch(addOrderBiasa(
        orders
      ))
      await this.setState({
        dataNow: orders[index]
      })
    }
  }
  aksiRemoveOrder = async (menuId, transactionId) => {
    //Untuk tambah data
    //Cari data Jika isPaid false , Input Order.
    //Insert ke dispatch Temp Order
    let orders = this.props.Order.dataItemTmp
    const index = orders.findIndex(item => {
      return (item.menuId == menuId & item.transactionId == transactionId)
    })
    if (index >= 0) {
      let orderTemporer = orders[index]
      if (orderTemporer.qty <= 1) {
        //Splice Index
        orders.splice(index, 1);
        await this.setState({
          dataNow: null,
          isOrdered:false
        }) 
      } else {
        let decQty = orderTemporer.qty-1
        decOrder = {
          ...orderTemporer,
          qty: decQty
        }
        orders[index] = decOrder
        await this.setState({
          dataNow: orders[index]
        }) 
      }
      await this.props.dispatch(addOrderBiasa(
        orders
      ))
    }
  }

  render() {
    return (
      <View style={[Styles.cardSimpleContainer, {
        backgroundColor: Color.whiteColor,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 5,
        margin: 5,
        height: 100,
        flexDirection: 'row',
        position: 'relative',
        borderWidth: 2,
        borderColor: Color.darkPrimaryColor
      }]}>
        {this.state.isOrdered ?
          <TouchableOpacity style={{
            position: 'absolute',
            right: 10,
            top: 45,
            backgroundColor:Color.accentColor,
            borderColor: Color.accentColor,
            borderRadius: 40,
            borderWidth: 2,
            padding: 5,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
            onPress={() => this.aksiRemoveOrder(this.props.itemNya.id, this.props.idTransaction)}
          >
            <Text style={{
              color: Color.whiteColor,
              fontSize: 16,
              fontWeight: 'bold'
            }}>{this.state.dataNow.qty}</Text>
          </TouchableOpacity>
          : false}

        <TouchableOpacity style={{
          position: 'absolute',
          right: 15,
          top: 8,
        }}
          onPress={() => this.aksiAddOrder(this.props.itemNya.id, this.props.idTransaction)}
        >
          <IconMaterialCom
            name='clipboard-plus'
            size={32}
            color={Color.accentColor}
          ></IconMaterialCom>
        </TouchableOpacity>

        <Image source={{ uri: this.props.itemNya.image }} style={{
          width: 100,
          height: '100%',
          marginRight: 20,
          borderRadius: 10
        }}></Image>
        <View style={{ flexDirection: 'column' }}>
          <Text style={[Styles.hurufKonten, {
            fontSize: 15,
            fontWeight: 'bold',
            textAlign: 'center'
          }]}>
            {this.props.itemNya.name}</Text>
          <Text style={[Styles.hurufKonten, {
            fontSize: 17,
            fontWeight: 'bold',
            textAlign: 'left'
          }]}>
            {convertToRupiah(this.props.itemNya.price)}</Text>
        </View>
      </View>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    Menu: state.Menu,
    Order: state.Order
  }
}
export default connect(mapStateToProps)(CompListMenu)