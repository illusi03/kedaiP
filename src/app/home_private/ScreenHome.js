import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  View,
  Text, TouchableOpacity, FlatList, Image, ScrollView,
  ActivityIndicator, Animated, Easing,
  Dimensions
} from 'react-native'
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
import {isOrdered,setAnimationOrder } from '../../_actions/Home'
import { setIntervalNya, counterNya } from '../../_actions/Timer'
import CompListMenu from './CompListMenu'

var { height, width } = Dimensions.get('window')

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
    xyValue: new Animated.ValueXY({ x: 12, y:height  })
  }
  callBackMenus = (bisa) => {
    if(bisa){
      this.props.dispatch(setAnimationOrder('in'))
    }else{
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
    this.getNoMeja()
    this.props.dispatch(setIntervalNya(
      setInterval(() => {
        this.props.dispatch(counterNya(this.props.Timer.timer))
      }, 1000)
    ))
    // this.fadeIn()
    // this.cekIsStartedMenus()
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
          width: '100%',
          height: 50,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          flexDirection: 'row'
        }]}>
          <Text style={[Styles.hurufKonten, { fontWeight: 'bold' }]}>Tbl Num#{this.state.noMeja}</Text>
          <Text style={[Styles.hurufKonten, {
            fontSize: 15,
            fontWeight: 'bold',
            textAlign: 'center'
          }]}>Kedai PapaLapar</Text>
          <View style={{ flexDirection: 'row' }}>
            <IconIon name='md-timer' size={17} style={{ marginRight: 5 }}></IconIon>
            <Text style={[Styles.hurufKonten, { fontWeight: 'bold' }]}>
              {this.props.Timer.timerString}
            </Text>
          </View>
        </View>

        {/* List Category */}
        <View style={[Styles.content, {
          backgroundColor: Color.whiteColor,
          width: '100%',
          height: 75,
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginBottom: 5,
          paddingBottom: 5
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
                    padding: 5,
                    margin: 5,
                    width: 100,
                    flex: 1
                  }]}
                    onPress={() => this.props.dispatch(getMenu())}
                  >
                    <Text style={[Styles.hurufKonten, {
                      fontSize: 15,
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
          width: '100%',
          flex: 7,
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginBottom: 0
        }]}>
          <View style={{ height: '100%', width: '100%' }}>
            {this.props.Menu.isLoading ?
              <ActivityIndicator size={70} color={Color.darkPrimaryColor} style={{
                flex: 1,
                alignSelf: 'center'
              }}></ActivityIndicator>
              :
              <FlatList
                data={this.props.Menu.dataItemHomeTampilan}
                ListHeaderComponent={() => {
                  return (
                    <Text style={[Styles.hurufKonten, {
                      fontSize: 17,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginBottom: 5
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
                        width: '95%',
                        height: 100,
                        backgroundColor: 'transparent'
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
            width: '95%',
            height: 75,
            position: 'absolute',
            bottom: 0,
            marginBottom: 25,
            borderRadius: 5
          }]}>
            <TouchableOpacity style={[Styles.cardSimpleContainer, {
              backgroundColor: Color.darkPrimaryColor,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'row',
              paddingVertical: 10,
              paddingHorizontal: 15
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
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: Color.whiteColor
                  }]}>
                    {this.props.Home.jmlKeranjang} Item | </Text>
                  <Text style={[Styles.hurufKonten, {
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: Color.whiteColor
                  }]}>
                    {convertToRupiah(this.props.Home.jmlHarga)} | </Text>
                  <Text style={[Styles.hurufKonten, {
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: Color.whiteColor,
                    alignSelf: 'center'
                  }]}>
                    {convertToRupiah(this.props.Home.estimasiHarga + this.props.Home.jmlHarga)} (Est)</Text>
                </View>
                <Text style={[Styles.hurufKonten, {
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: Color.whiteColor,
                  alignSelf: 'flex-start',
                  marginTop: 5
                }]}>
                  Please tap for detail bill</Text>
              </View>
              <View style={{
                alignSelf: 'center'
              }}>
                <IconMaterialCom name='cart' size={40} color={Color.whiteColor}></IconMaterialCom>
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