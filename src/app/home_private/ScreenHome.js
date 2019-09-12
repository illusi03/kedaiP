import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  View,
  Text, TouchableOpacity, FlatList, Image, ScrollView,
  ActivityIndicator, Animated, Easing,
  Dimensions
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

import IconIon from 'react-native-vector-icons/Ionicons'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterialCom from 'react-native-vector-icons/MaterialCommunityIcons'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios'
import Constanta, { convertToRupiah } from '../../res/Constant'

import { Styles, Color } from '../../res/Styles'
import AsyncStorage from '@react-native-community/async-storage';
import CompTouchable from './CompTouchable'
import { reRenderMenu, getMenuWhereCategory, getMenu } from '../../_actions/Menu'
import { reRenderCategory, getCategory } from '../../_actions/Category'
import { addOrder, editOrder, addOrderBiasa } from '../../_actions/Order'
import { isOrdered, setAnimationOrder } from '../../_actions/Home'
import { setIntervalNya, counterNya } from '../../_actions/Timer'
import CompListMenu from './CompListMenu'

class ScreenHome extends Component {
  state = {
    noMeja: 0,
    idTransaction: 0,
    initNameCategory: 'All',
    startedMenus: [],
    getDataMenuSatuan: false,
    toogleStarted: '',
    isQtyMenu: false,
    fadeValue: new Animated.Value(0),
  }
  callBackMenus = (bisa) => {
    if (bisa) {
      this.props.dispatch(setAnimationOrder('in'))
    } else {
      this.props.dispatch(setAnimationOrder('out'))
    }
  }
  fadeIn = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 1, //Ke angka berapa
      duration: 850, //dengan berapa Milisecond
      easing: Easing.linear
    }).start()
  }
  convertIntToTime = (given_seconds) => {
    dateObj = new Date(given_seconds * 1000);
    hours = dateObj.getUTCHours();
    minutes = dateObj.getUTCMinutes();
    seconds = dateObj.getSeconds();

    timeString = hours.toString().padStart(2, '0') + ':' +
      minutes.toString().padStart(2, '0') + ':' +
      seconds.toString().padStart(2, '0');
  }

  aksiListOrder = async () => {
    await this.props.navigation.navigate('SwitchBill')
  }
  getNoMeja = async () => {
    try {
      const noMeja = await AsyncStorage.getItem('noMeja')
      const idTransaction = await AsyncStorage.getItem('idTransaction')
      await this.setState({
        noMeja: noMeja,
        idTransaction: idTransaction
      })
    } catch (e) {
      console.log(e)
    }
  }
  clearNoMeja = async () => {
    try {
      await AsyncStorage.clear();
      await this.props.navigation.navigate('StackPublic')
    } catch (e) {
    }
  }
  aksiCategoryMenus = (categoryId, categoryName) => {
    this.props.dispatch(getMenuWhereCategory(categoryId))
    this.setState({
      initNameCategory: categoryName
    })
  }
  cekIsStartedMenus = async () => {
    const startedMenus = await AsyncStorage.getItem('startedMenus')
    await this.setState({
      startedMenus
    });
  }

  //Tahap Percobaan
  setStartedMenus = (menuId) => {
    let arrTemporer = this.state.startedMenus
    let kosong = true;
    arrTemporer.forEach((item, index, arr) => {
      if (item.id == menuId) {
        kosong = false
      }
    })
    if (kosong) {
      //Push array where id
      arrTemporer.push(menuId)
    } else {
      //Pop array where id
      arrTemporer.pop
    }
    // const noMeja = AsyncStorage.setItem('startedMenus',this.state.startedMenus)
  }

  componentDidMount() {
    lor(this)
    this.getNoMeja()
    this.props.dispatch(setIntervalNya(
      setInterval(() => {
        this.props.dispatch(counterNya(this.props.Timer.timer))
      }, 1000)
    ))
    // this.fadeIn()
    // this.cekIsStartedMenus()
  }
  componentWillUnmount() {
    rol()
  }
  render() {
    return (
      <View style={[Styles.container, {
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 0
      }]}>
        {/* Header */}
        <View style={[Styles.content, Styles.cardSimpleContainer, {
          backgroundColor: Color.whiteColor,
          width: wp(100),
          height: hp(7),
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: hp(0.5),
          flexDirection: 'row'
        }]}>
          <Text style={[Styles.hurufKonten, { fontWeight: 'bold' }]}>Tbl Num#{this.state.noMeja}</Text>
          <Text style={[Styles.hurufKonten, {
            fontSize: 15,
            fontWeight: 'bold',
            textAlign: 'center'
          }]}>Kedai PapaLapar</Text>
          <View style={{ flexDirection: 'row' }}>
            <IconIon name='md-timer' size={wp(4)} style={{ marginRight: wp(2) }}></IconIon>
            <Text style={[Styles.hurufKonten, { fontWeight: 'bold' }]}>
              {this.props.Timer.timerString}
            </Text>
          </View>
        </View>

        {/* List Category */}
        <View style={[Styles.content, {
          backgroundColor: Color.whiteColor,
          width: wp(100),
          height: hp(8),
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginBottom: wp(0.5),
          paddingBottom: wp(0.5)
        }]}>
          {this.props.Category.isLoading ?
            false
            :
            <FlatList
              horizontal={true}
              ListHeaderComponent={() => {
                return (
                  <TouchableOpacity style={[Styles.cardSimpleContainer, {
                    backgroundColor: Color.darkPrimaryColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: wp(1.5),
                    margin: wp(1.5),
                    width: wp(22),
                    flex: 1
                  }]}
                    onPress={() => this.props.dispatch(getMenu())}
                  >
                    <Text style={[Styles.hurufKonten, {
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: Color.whiteColor
                    }]}>
                      All</Text>
                  </TouchableOpacity>
                )
              }}
              showsHorizontalScrollIndicator={false}
              data={this.props.Category.dataItem}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <CompTouchable
                  namaKategori={item.name}
                  onPress={() => this.aksiCategoryMenus(item.id, item.name)}
                />
              )}

            />
          }
        </View>

        {/* List Menu */}
        <View style={[Styles.content, {
          backgroundColor: Color.whiteColor,
          width: wp(100),
          flex: 7,
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginBottom: 0
        }]}>
          <View style={{ height: hp(79), width: wp(97) }}>
            {this.props.Menu.isLoading ?
              <ActivityIndicator size={wp(10)} color={Color.darkPrimaryColor} style={{
                flex: 1,
                alignSelf: 'center'
              }}></ActivityIndicator>
              :
              <FlatList
                data={this.props.Menu.dataItemHomeTampilan}
                ListHeaderComponent={() => {
                  return (
                    <Text style={[Styles.hurufKonten, {
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: wp(4)
                    }]}>List Menu From {this.state.initNameCategory} Category</Text>
                  )
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                extraData={[this.state.refreshFlatMenu]}
                renderItem={({ item }) => {
                  return (
                    <CompListMenu
                      itemNya={item}
                      idTransaction={this.state.idTransaction}
                      callBackNya={this.callBackMenus}
                    />
                  )
                }}
                ListFooterComponent={() => {
                  if (this.props.Home.isOrdered) {
                    return (
                      <View style={{
                        width: wp(100),
                        height: hp(12)
                      }}></View>
                    )
                  }
                  return (<View></View>)
                }}
              />
            }
          </View>
        </View>
        {true ?
          <Animated.View style={[this.props.Home.xyValue.getLayout(), {
            width: wp(95),
            height: hp(12),
            position: 'absolute',
            bottom: 0,
            marginBottom: wp(10),
            borderRadius: wp(1.5)
          }]}>
            <TouchableOpacity style={[Styles.cardSimpleContainer, {
              backgroundColor: Color.darkPrimaryColor,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'row',
              paddingVertical: wp(2),
              paddingHorizontal: wp(3)
            }]}
              activeOpacity={0.9}
              onPress={() => this.props.navigation.navigate('SWScreenViewbill')}
            // onPress={this.bouncer}
            >
              <View style={{
                flex: 1
              }}>
                <View style={{
                  flexDirection: 'row'
                }}>
                  <Text style={[Styles.hurufKonten, {
                    fontSize: wp(4),
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: Color.whiteColor
                  }]}>
                    {this.props.Home.jmlKeranjang} Item | </Text>
                  <Text style={[Styles.hurufKonten, {
                    fontSize: wp(4),
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: Color.whiteColor
                  }]}>
                    {convertToRupiah(this.props.Home.jmlHarga)} | </Text>
                  <Text style={[Styles.hurufKonten, {
                    fontSize: wp(3.5),
                    fontWeight: 'bold',
                    color: Color.whiteColor,
                    alignSelf: 'center'
                  }]}>
                    {convertToRupiah(this.props.Home.estimasiHarga + this.props.Home.jmlHarga)} (Est)</Text>
                </View>
                <Text style={[Styles.hurufKonten, {
                  fontSize: wp(3.5),
                  fontWeight: 'bold',
                  color: Color.whiteColor,
                  alignSelf: 'flex-start',
                  marginTop: wp(1.2)
                }]}>
                  Please tap for detail bill</Text>
              </View>
              <View style={{
                alignSelf: 'center'
              }}>
                <IconMaterialCom name='cart' size={wp(10)} color={Color.whiteColor}></IconMaterialCom>
              </View>
            </TouchableOpacity>
          </Animated.View>
          : false}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    Menu: state.Menu,
    Category: state.Category,
    Home: state.Home,
    Order: state.Order,
    Timer: state.Timer
  }
}

export default connect(mapStateToProps)(ScreenHome)