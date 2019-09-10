import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView, ActivityIndicator, ToastAndroid } from 'react-native'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconMaterialCom from 'react-native-vector-icons/MaterialCommunityIcons'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import IconOct from 'react-native-vector-icons/Octicons'
import axios from 'axios'

import { Styles, Color } from '../../res/Styles'
import Constanta, { convertToRupiah } from '../../res/Constant'
import { addOrder, editOrder, addOrderBiasa } from '../../_actions/Order'
import { setIsOrdered } from '../../_actions/Home'

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
    if (index >= 0) {
      await this.setState({
        dataNow: orders[index],
        isOrdered: true
      })
      const ObjHomeBottomOption = {
        isOrdered:this.state.isOrdered,
        jmlKeranjang:await this.props.Home.jmlKeranjang,
        jmlHarga:await this.props.Home.jmlHarga,
        estimasiHarga: await 15/100*this.props.Home.jmlHarga
      }
      await this.props.dispatch(setIsOrdered(ObjHomeBottomOption))
    }
  }
  componentDidMount() {
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
        status: null
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
    await this.cekJmlSemuaOrder(transactionId)
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
          isOrdered: false
        })
      } else {
        let decQty = orderTemporer.qty - 1
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
    await this.cekJmlSemuaOrder(transactionId)
  }

  cekJmlSemuaOrder = (transactionId) => {
    const dataOrder = this.props.Order.dataItemTmp
    let bisa = false
    let jmlKeranjang = 0
    let jmlHarga = 0
    dataOrder.map( (item,index) => {
      if(item.transactionId == transactionId & item.status == null){
        bisa = true
        const tmpJmlHarga = item.qty*item.price
        jmlKeranjang = jmlKeranjang+item.qty
        jmlHarga = jmlHarga+tmpJmlHarga
      }
    })
    const ObjHomeBottomOption = {
      isOrdered:bisa,
      jmlKeranjang:jmlKeranjang,
      jmlHarga:jmlHarga,
      estimasiHarga: 15/100*jmlHarga
    }
    this.props.dispatch(setIsOrdered(ObjHomeBottomOption))
    this.props.callBackNya(ObjHomeBottomOption.isOrdered)
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
        borderColor: Color.whiteColor
      }]}>
        {this.state.isOrdered ?
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
                alignItems:'flex-start',
                justifyContent:'center',
                height:'100%'
              }}
              onPress={() => this.aksiRemoveOrder(this.props.itemNya.id, this.props.idTransaction)}
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
              flex:1,
              textAlign:'center'
            }]}>{this.state.dataNow.qty}</Text>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems:'flex-end',
                justifyContent:'center',
                height:'100%'
              }}
              onPress={() => this.aksiAddOrder(this.props.itemNya.id, this.props.idTransaction)}
            >
              <IconFA5
                name='plus'
                size={15}
                color={Color.accentColor}
              ></IconFA5>
            </TouchableOpacity>
          </View>
          :
          <TouchableOpacity style={{
            position: 'absolute',
            right: 15,
            bottom: 15,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Color.accentColor,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 5,
            width: 100
          }}
            onPress={() => this.aksiAddOrder(this.props.itemNya.id, this.props.idTransaction)}
          >
            <Text style=
              {[Styles.hurufKonten,
              {
                color: Color.whiteColor,
                fontSize: 14,
                marginLeft: 20,
                marginRight: 5,
                fontWeight: 'bold',
                flex:1
              }]}
            >ADD</Text>
            <IconFA5
              name='plus'
              size={15}
              color={Color.whiteColor}
              style={{
                flex:1,
                textAlign:'right'
              }}
            ></IconFA5>
          </TouchableOpacity>
        }

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
    Order: state.Order,
    Home: state.Home
  }
}
export default connect(mapStateToProps)(CompListMenu)