import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconIon from 'react-native-vector-icons/Ionicons'
import IconOctic from 'react-native-vector-icons/Octicons'

import { Styles, Color } from '../../res/Styles'
import { getTransaction, editTransaction } from '../../_actions/Transaction'
import { hapusInterval, setIsOrdered, setAnimationOrder } from '../../_actions/Home'
import { addOrderBiasa } from '../../_actions/Order'
import { getMenu } from '../../_actions/Menu'
import CompListOrder from './CompListOrder'
import CompOptionBot from './CompOptionBot'

class ScreenViewbill extends Component {
  state = {
    subStateTotal: 0,
    isNotConfirm: false,
    isAdaBarang: false,
    dataOrderMenu: [],
    idTrans: '',
    dataNow: [],
    isOrdered: false,
    idTrans: 0
  }
  aksiCallBill = async () => {
    let orders = []
    await this.props.Order.dataItemTmp.map( (item,index) => {
      item.status = false
      orders.push(item)
    })
    await this.props.dispatch(addOrderBiasa(orders))
    await this.props.navigation.navigate('SWScreenViewbillConfirmed')
  }

  aksiAddOrder = async (menuId, transactionId = null) => {
    //Untuk tambah data
    //Cari data Jika isPaid false , Input Order.
    //Insert ke dispatch Temp Order
    transactionId = this.state.idTrans
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
  aksiRemoveOrder = async (menuId, transactionId = null) => {
    //Untuk tambah data
    //Cari data Jika isPaid false , Input Order.
    //Insert ke dispatch Temp Order
    transactionId = this.state.idTrans
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
    dataOrder.map((item, index) => {
      if (item.transactionId == transactionId & item.status == null) {
        bisa = true
        const tmpJmlHarga = item.qty * item.price
        jmlKeranjang = jmlKeranjang + item.qty
        jmlHarga = jmlHarga + tmpJmlHarga
      }
    })
    const ObjHomeBottomOption = {
      isOrdered: bisa,
      jmlKeranjang: jmlKeranjang,
      jmlHarga: jmlHarga,
      estimasiHarga: 15 / 100 * jmlHarga
    }
    this.setState({
      subStateTotal: ObjHomeBottomOption.jmlHarga,
      isOrdered: ObjHomeBottomOption.isOrdered
    })
    this.props.dispatch(setIsOrdered(ObjHomeBottomOption))
    if (!ObjHomeBottomOption.isOrdered) {
      this.props.navigation.navigate('ScreenHome')
    }
  }
  getOrderList = async () => {
    const idTrans = await AsyncStorage.getItem('idTransaction')
    await this.setState({
      idTrans: idTrans
    })
    let ordersProps = this.props.Order.dataItemTmp
    let menusProps = this.props.Menu.dataItem
    let dataNow = ordersProps
    let isAdaBarang = false
    let jmlHargaTotal = 0
    ordersProps.map((itemOrder, index) => {
      menusProps.map((itemMenu) => {
        if (itemOrder.menuId == itemMenu.id) {
          ordersProps[index] = {
            ...ordersProps[index],
            menu: {
              ...itemMenu
            }
          }
          this.setState({
            isOrdered: true
          })
        }
      })
      const tmpHarga = itemOrder.qty * itemOrder.price
      jmlHargaTotal = jmlHargaTotal + tmpHarga
    })
    await this.setState({
      dataOrderMenu: ordersProps,
      subStateTotal: jmlHargaTotal,
    })
  }
  componentDidMount() {
    this.getOrderList()
  }
  componentWillUnmount() {
    if (!this.state.isOrdered) {
      this.props.dispatch(setAnimationOrder('out'))
    }
    this.props.dispatch(getMenu())
  }
  render() {
    return (
      this.state.isOrdered ?
        <View style={[Styles.container, {
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: 10
        }]}>
          <View style={[Styles.content, Styles.cardSimpleContainer, {
            backgroundColor: Color.whiteColor,
            width: '100%',
            height: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{ flex: 1, alignSelf: 'flex-start' }}
                onPress={() => this.props.navigation.navigate('ScreenHome')}
              >
                <IconIon name='md-arrow-round-back' size={33}></IconIon>
              </TouchableOpacity>
              <Text style={[Styles.hurufKonten, {
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 5,
                flex: 1
              }]}>
                Billing </Text>
              <Text style={[Styles.hurufKonten, {
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 5,
                flex: 1
              }]}>
              </Text>
            </View>

            {/* Divider */}
            <View
              style={{
                borderBottomColor: Color.darkPrimaryColor,
                borderBottomWidth: 2,
                width: '100%',
                marginVertical: 5
              }}
            />

            <FlatList
              data={this.state.dataOrderMenu}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <CompListOrder
                    item={item}
                    transactionId={this.state.idTrans}
                    onPressAdd={() => this.aksiAddOrder(item.menuId)}
                    onPressMin={() => this.aksiRemoveOrder(item.menuId)}
                  />)
              }}
              style={{
                flex: 1,
                width: '100%'
              }}
            />
            {/* Divider */}
            <View
              style={{
                borderBottomColor: Color.darkPrimaryColor,
                borderBottomWidth: 2,
                width: '100%',
                marginVertical: 5
              }}
            />

            {/* Option Bawah */}
            <View style={[Styles.cardSimpleContainer, {
              elevation: 2,
              height: 150,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 5,
            }]}>
              <CompOptionBot subTotal={this.state.subStateTotal} />
            </View>

            {/* Button Call) */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 15
            }}>
              <TouchableOpacity style={[Styles.cardSimpleContainer, {
                backgroundColor: Color.darkPrimaryColor,
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: 5,
                margin: 5,
                height: '100%',
                flexDirection: 'row'
              }]}
                onPress={ () => 
                  Alert.alert(
                    'Confirm Order',
                    'Are you sure to order this ?',
                    [
                      {
                        text: 'No',
                        style: 'cancel',
                      },
                      {
                        text: 'Yes', onPress: () => {
                          this.aksiCallBill()
                        }
                      },
                    ],
                    { cancelable: false },
                  )
                }
              >
                <IconOctic name='checklist' color={Color.whiteColor} size={25} style={{
                  marginHorizontal: 10
                }}></IconOctic>
                <Text style={[Styles.hurufKonten, {
                  fontSize: 15,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: Color.whiteColor,
                  marginRight: 10
                }]}>
                  CONFIRM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View >
        : false
    )
  }
}
const mapStateToProps = (state) => {
  return {
    Transaction: state.Transaction,
    Order: state.Order,
    Home: state.Home,
    Menu: state.Menu
  }
}

export default connect(mapStateToProps)(ScreenViewbill)