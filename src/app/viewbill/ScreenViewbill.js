import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconIon from 'react-native-vector-icons/Ionicons'

import { Styles, Color } from '../../res/Styles'
import { getTransaction, editTransaction } from '../../_actions/Transaction'
import { hapusInterval } from '../../_actions/Home'
import CompListOrder from './CompListOrder'
import CompOptionBot from './CompOptionBot'

class ScreenViewbill extends Component {
  state = {
    subStateTotal: 0,
    isNotConfirm: false,
    isAdaBarang: false,
  }
  aksiCallBill = async () => {
    // PATCH tbl transaksi berdasarkan ID
    // Data yg dipatch {Sub_total,discount,serviceCharge,tax,total,isPaid}
    // Insert tbl transaksi {no_tbl,isPaid=false}, ambil IDTransaksi simpan di Async idTransaction
    
  }
  getOrderList = async () => {
    const idTrans = await AsyncStorage.getItem('idTransaction')

    let ordersProps = this.props.Order.dataItemTmp
    let menusProps = this.props.Menu.dataItem
    let dataNow = ordersProps
    let isAdaBarang = false
    ordersProps.map((itemOrder, index) => {
      if (itemOrder.transactionId == idTrans) {
        
      }
    })
    console.warn(ordersProps)
  }
  componentDidMount() {
    this.getOrderList()
  }
  render() {
    return (
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

          {/* List Order */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5
          }}>
            <Text style={[Styles.hurufKonten, {
              fontSize: 16,
              fontWeight: 'bold',
              flex: 1,
              textAlign: 'center'
            }]}>Status</Text>
            <Text style={[Styles.hurufKonten, {
              fontSize: 16,
              fontWeight: 'bold',
              flex: 1,
              textAlign: 'center'
            }]}>Name</Text>
            <Text style={[Styles.hurufKonten, {
              fontSize: 16,
              fontWeight: 'bold',
              flex: 1,
              textAlign: 'center'
            }]}>Qty</Text>
            <Text style={[Styles.hurufKonten, {
              fontSize: 16,
              fontWeight: 'bold',
              flex: 1,
              textAlign: 'center'
            }]}>Sum Price</Text>
          </View>

          <CompListOrder
            status={null}
            name='Nasi Goreng'
            qty={3}
            price={250000}
          />
          <CompListOrder
            status={null}
            name='Nasi Goreng Spesial Mantap'
            qty={3}
            price={250000}
          />
          <CompListOrder
            status={null}
            name='Nasi Goreng'
            qty={3}
            price={250000}
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
            <CompOptionBot subTotal={250000} />
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
            >
              <IconMaterial name='payment' size={25} color={Color.whiteColor} style={{
                marginHorizontal: 10
              }}></IconMaterial>
              <Text style={[Styles.hurufKonten, {
                fontSize: 15,
                fontWeight: 'bold',
                textAlign: 'center',
                color: Color.whiteColor,
                marginRight: 10
              }]}>
                CALL BILL</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={[Styles.cardSimpleContainer, {
              backgroundColor: Color.errorColor,
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: 5,
              margin: 5,
              height: '100%',
              flexDirection: 'row'
            }]}
            >
              <Text style={[Styles.hurufKonten, {
                fontSize: 15,
                fontWeight: 'bold',
                textAlign: 'center',
                color: Color.whiteColor
              }]}>
                CONFIRM FIRST BEFORE CALL BILL
                </Text>
            </TouchableOpacity> */}
          </View>

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
    Menu: state.Menu
  }
}

export default connect(mapStateToProps)(ScreenViewbill)