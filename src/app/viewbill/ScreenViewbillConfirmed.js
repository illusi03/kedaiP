import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image, BackHandler } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconIon from 'react-native-vector-icons/Ionicons'
import IconOctic from 'react-native-vector-icons/Octicons'

import { Styles, Color } from '../../res/Styles'
import { getTransaction, editTransaction } from '../../_actions/Transaction'
import { hapusInterval, setIsOrdered, setAnimationOrder } from '../../_actions/Home'
import { addOrderBiasa, addOrder } from '../../_actions/Order'
import { getMenu } from '../../_actions/Menu'
import CompListOrderConfirmed from './CompListOrderConfirmed'
import CompOptionBot from './CompOptionBot'

class ScreenViewbillConfirmed extends Component {
  state = {
    subStateTotal: 0,
    isNotConfirm: false,
    isAdaBarang: false,
    dataOrderMenu: [],
    dataOrderMenuKirim: [],
    idTrans: '',
    dataNow: [],
    isOrdered: false,
    idTrans: 0,
    isDoneWaiting: false
  }
  aksiCallBill = async () => {
    // PATCH tbl transaksi berdasarkan ID
    // Data yg dipatch {Sub_total,discount,serviceCharge,tax,total,isPaid}
    // Insert tbl transaksi {no_tbl,isPaid=false}, ambil IDTransaksi simpan di Async idTransaction
    // + INSERT KE tbl Order with Bulk (Array)
    //
    let dataOrderKirim = []
    await clearInterval(this.props.Timer.timerEvent)
    let tmpMantap = [...this.state.dataOrderMenuKirim]
    tmpMantap.map((item, index) => {
      delete item.menu
      item.status = true
      dataOrderKirim.push(item)
    })
    // Kirim datanya dataOrderKirim
    await this.props.dispatch(addOrder(tmpMantap))
    let dataTransKirim = {
      ...this.props.Transaction.dataAsli,
      finishedTime: this.props.Timer.timerString
    }
    await this.props.dispatch(editTransaction(this.state.idTrans, dataTransKirim))
    await this.props.navigation.navigate('SWScreenPay')
  }
  aksiGantiStatus = async (menuId, transactionId = null) => {
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
      if (orderTemporer.status == false) {
        //Splice Index
        orders[index].status = true
      }
      await this.props.dispatch(addOrderBiasa(
        orders
      ))
    }
    // console.warn(orders)
    await this.cekJmlSemuaOrder(transactionId)
  }
  cekJmlSemuaOrder = (transactionId) => {
    const dataOrder = this.props.Order.dataItemTmp
    let bisa = false
    let jmlKeranjang = 0
    let jmlHarga = 0
    let isDoneWaiting = true
    dataOrder.map((item, index) => {
      if (item.transactionId == transactionId) {
        bisa = true
        const tmpJmlHarga = item.qty * item.price
        jmlKeranjang = jmlKeranjang + item.qty
        jmlHarga = jmlHarga + tmpJmlHarga
      }
      if (item.status == false) {
        isDoneWaiting = false
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
      isOrdered: ObjHomeBottomOption.isOrdered,
      isDoneWaiting: isDoneWaiting
    })
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
            isOrdered: true,
            dataOrderMenuKirim: [...this.state.dataOrderMenuKirim, itemOrder]
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
  handleBackPress = () => {
    // BackHandler.exitApp()
    // Navigate ke pay bill
    alert(`Please wait your menu and Call the bill`)
    return true
  }
  componentDidMount() {
    this.getOrderList()
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }
  componentWillUnmount() {
    this.props.dispatch(getMenu())
    this.backHandler.remove()
  }
  render() {
    return (
      <View style={[Styles.container, {
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: wp(2)
      }]}>
        <View style={[Styles.content, Styles.cardSimpleContainer, {
          backgroundColor: Color.whiteColor,
          width: wp(100),
          height: hp(100),
          justifyContent: 'flex-start',
          alignItems: 'center'
        }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[Styles.hurufKonten, {
              fontSize: wp(5),
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: wp(0.5),
              flex: 1
            }]}>
              Billing </Text>
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
                <CompListOrderConfirmed
                  item={item}
                  transactionId={this.state.idTrans}
                  onPressStatus={() => this.aksiGantiStatus(item.menuId)}
                />)
            }}
            style={{
              flex: 1,
              width: wp(100),
              paddingHorizontal: wp(1.5)
            }}
          />
          {/* Divider */}
          <View
            style={{
              borderBottomColor: Color.darkPrimaryColor,
              borderBottomWidth: 2,
              width: wp(95),
              marginVertical: hp(0.5)
            }}
          />

          {/* Option Bawah */}
          {this.state.isDoneWaiting ?
            <View style={[Styles.cardSimpleContainer, {
              elevation: 2,
              height: hp(16.4),
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: hp(2.5)
            }]}>
              <CompOptionBot subTotal={this.state.subStateTotal} />
            </View>
            :
            <View style={[Styles.cardSimpleContainer, {
              elevation: 2,
              height: hp(16.4),
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: hp(5),
            }]}>
              <CompOptionBot subTotal={this.state.subStateTotal} />
            </View>
          }

          {this.state.isDoneWaiting ?
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: hp(5)
            }}>
              {!this.props.Transaction.isLoading ?
                <TouchableOpacity style={[Styles.cardSimpleContainer, {
                  backgroundColor: Color.darkPrimaryColor,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  height: hp(5),
                  flexDirection: 'row'
                }]}
                  onPress={this.aksiCallBill}
                >
                  <IconOctic name='checklist' color={Color.whiteColor} size={wp(5)} style={{
                    marginHorizontal: wp(2)
                  }}></IconOctic>
                  <Text style={[Styles.hurufKonten, {
                    fontSize: wp(3.5),
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: Color.whiteColor,
                    marginRight: wp(1.5)
                  }]}>
                    CALL BILL</Text>
                </TouchableOpacity>
                :
                <ActivityIndicator size={hp(5)}></ActivityIndicator>
              }
            </View>
            : false}
        </View>
      </View>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    Transaction: state.Transaction,
    Order: state.Order,
    Home: state.Home,
    Menu: state.Menu,
    Timer: state.Timer
  }
}

export default connect(mapStateToProps)(ScreenViewbillConfirmed)