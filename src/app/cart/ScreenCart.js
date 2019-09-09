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
import CompListOrder from './CompListOrder'
import CompListOrderFooter from './CompListOrderFooter'

//transactionOrder/:transactionId

class ScreenCart extends Component {
  state = {
    isAdaBarang: false,
    isLoading: true,
    isLoadingAddOrRemove: false,
    orderWithMenus: [],

    getDataMenuSatuan: false,
    isQtyMenu: false,
    refreshFlatMenu: false
  }

  aksiConfirm = async (transactionId) => {
    await this.props.dispatch(setOrderStatus(transactionId, {
      status: false
    }))
    await this.props.navigation.navigate('SWScreenViewbill')
  }
  loadDataOrder = async () => {
    let ordersProps = this.props.Order.dataItemTmp
    let menusProps = this.props.Menu.dataItem
    let orderWithMenus = ordersProps
    let isAdaBarang = false
    ordersProps.map((itemOrder, index) => {
      menusProps.map((itemMenu) => {
        if (itemOrder.menuId == itemMenu.id) {
          isAdaBarang = true
          orderWithMenus[index] = {
            ...itemOrder,
            menu: {
              ...itemMenu
            }
          }
        }
      })
    })
    await this.setState({
      orderWithMenus: orderWithMenus,
      isAdaBarang: isAdaBarang
    })
  }
  getInitData = async () => {
    // let idTransaction = await AsyncStorage.getItem('idTransaction')
    this.loadDataOrder()
  }
  componentDidMount() {
    this.getInitData()
  }
  render() {
    return (
      <View style={[Styles.container, {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      }]}>
        <View style={[Styles.content, Styles.cardSimpleContainer, {
          backgroundColor: Color.whiteColor,
          width: '100%',
          marginBottom: 5,
          flex: 1
        }]}>
          {/* Header  */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{ flex: 1, alignSelf: 'flex-start' }}
              onPress={() => this.props.navigation.navigate('ScreenHome')}
            >
              <IconIon name='md-arrow-round-back' size={32}></IconIon>
            </TouchableOpacity>
            <Text style={[Styles.hurufKonten, {
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 5,
              flex: 1
            }]}>
              List Order</Text>
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
              marginVertical: 5,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center'
            }}
          />

          {/* List Menu  */}
          {this.state.isAdaBarang ?
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <FlatList
                data={this.state.orderWithMenus}
                keyExtractor={(item, index) => index.toString()}
                style={{ width: '100%' }}
                showsVerticalScrollIndicator={false}
                renderItem={(item) => {
                  return (
                    <CompListOrder item={item.item} />
                  )
                }}
                ListFooterComponent={() => {
                  return (
                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                      <TouchableOpacity style={[Styles.cardSimpleContainer, {
                        backgroundColor: Color.darkPrimaryColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                        margin: 5,
                        height: '100%',
                        flex: 1,
                        flexDirection: 'row'
                      }]}
                        onPress={() => {
                          Alert.alert(
                            'Confirm Order',
                            'Are you sure to order this ?',
                            [{
                              text: 'No',
                              style: 'cancel',
                            },
                            {
                              text: 'Yes', onPress: () => {
                                alert('mantap')
                              }
                            }],
                            { cancelable: false },
                          );
                        }}
                      >
                        <IconOctic name='checklist' color={Color.whiteColor} size={23} style={{
                          marginRight: 10
                        }}></IconOctic>
                        <Text style={[Styles.hurufKonten, {
                          fontSize: 15,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          color: Color.whiteColor
                        }]}>
                          CONFIRM</Text>
                      </TouchableOpacity>
                    </View>
                  )
                }}
              />

            </View>
            :
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1
            }}>
              <Image
                source={require('../../assets/Illustrator/not-found.png')}
                style={{ width: 400, height: 400 }}
              ></Image>
              <Text style={[Styles.hurufKonten, {
                fontSize: 20,
                fontWeight: 'bold'
              }]}
              >List order not found</Text>
              <Text style={[Styles.hurufKonten, {

              }]}
              >Please order the menu item </Text>
            </View>
          }
        </View>
      </View>
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
export default connect(mapStateToProps)(ScreenCart)