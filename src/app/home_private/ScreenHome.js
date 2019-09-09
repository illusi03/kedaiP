import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView, ActivityIndicator, ToastAndroid } from 'react-native'
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
import { setIntervalNya, counterNya } from '../../_actions/Home'
import CompListMenu from './CompListMenu'


class ScreenHome extends Component {
  state = {
    noMeja: 0,
    idTransaction: 0,
    initNameCategory: 'All',
    startedMenus: [],
    getDataMenuSatuan : false,
    toogleStarted: '',
    isQtyMenu: false,
    refreshFlatMenu: false
  }
  refreshMenu = () => {
    this.setState({
      refreshFlatMenu: !this.state.refreshFlatMenu
    })
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
  aksiAddOrderMenus = async (menuId, transactionId) => {
    //Cari data Jika isPaid false , Input Order.
    //Cek Data Transaksi (Apakah sudah STATUS PAID / BELUM)
    try {
      await this.refreshMenu()
      //Ambil Data Menu , By Filter Data MenuId
      let menuObj = await this.props.Menu.dataItem.filter((item, index) => {
        if (item.id == menuId) {
          return item
        }
      })
      let arrTemporerData = {
        menuId,
        transactionId,
        price: menuObj[0].price,
        qty: 1
      }
      //Seleksi , jika ada Data Tambah Qty.Jika Kosong Tambah Data
      let adaDataMenu = false
      let noIndex = 0
      let tempArrMenu = []
      let qtyLama = 0
      if (this.props.Order.dataItemTmp) {
        await this.props.Order.dataItemTmp.map((item, index) => {
          if ((item.menuId == menuId) & (item.transactionId == transactionId)) {
            adaDataMenu = true
            noIndex = index
            qtyLama = item.qty + 1
          }
        })
      }
      if (adaDataMenu) {
        //Ambil Data Menu , By Filter Data MenuId
        let tmpMenuObj = await this.props.Menu.dataItem.filter((item, index) => {
          if (item.id == menuId) {
            return item
          }
        })
        tempArrMenu = this.props.Order.dataItemTmp
        tempArrMenu[noIndex] = {
          menuId: tmpMenuObj[0].id,
          transactionId,
          price: tmpMenuObj[0].price,
          qty: qtyLama
        }
        await this.props.dispatch(addOrderBiasa(tempArrMenu))
      } else {
        //Insert ke dispatch Temp Order
        await this.props.dispatch(addOrderBiasa([
          ...this.props.Order.dataItemTmp,
          arrTemporerData
        ]))
      }
      await console.warn(this.props.Order.dataItemTmp)

    } catch (e) {
      alert(`Alert : ${e}`)
    }

    /*
    let transaksiData
    let menuData
    try {
      transaksiData = await axios.get(`${Constanta.host}/transaction/${transactionId}`)
      menuData = await axios.get(`${Constanta.host}/menu/${menuId}`)
    } catch (e) {
      console.log(e)
    }
    // console.log(`Transaksi Data : ${JSON.stringify(transaksiData)}`)
    // console.log(`Menu Data : ${JSON.stringify(menuData)}`)
    // console.log(`jmlMenuData Data : ${JSON.stringify(jmlMenuDataByTrans)}`)

    if (!transaksiData.data.isPaid) {
      //Cek jika ada Menu yg sudah terdaftar di Order MenuId dan TransaksiId, Tambah
      //Cek Jumlah Order di setiap Transaksi
      //const jumlahSemuaMenuByTransaksi = await axios.get(`${Constanta.host}/transaction/${transactionId}`)
      const jmlMenuDataByTrans = await axios.get(`${Constanta.host}/order/transactionId/${transactionId}/menuId/${menuId}`)

      if (!jmlMenuDataByTrans.data) {
        const dataJadi = {
          menuId,
          transactionId,
          price: menuData.data.price,
          qty: 1
        }
        ToastAndroid.show('Berhasil Menambahkan Order', ToastAndroid.SHORT);
        this.props.dispatch(addOrder(dataJadi))
      } else {
        if (jmlMenuDataByTrans.data.status == null) {
          //Ambil dulu jumlah Qty nya, lalu Tambahkan + 1
          //Patch Data Where IDOrderNya
          let idOrderNya = jmlMenuDataByTrans.data.id
          let jmlDataNya = jmlMenuDataByTrans.data.qty
          jmlDataNya = jmlDataNya + 1
          const dataJadi = {
            qty: jmlDataNya
          }
          ToastAndroid.show(`Berhasil Menambahkan Order , Jumlah : ${jmlDataNya}`, ToastAndroid.SHORT);
          this.props.dispatch(editOrder(idOrderNya, dataJadi))
        } else {
          //Data sudah di confirm
          ToastAndroid.show(`Data sudah terkonfirmasi , Silakan Tunggu Pesanan Anda`, ToastAndroid.SHORT);
        }
      }
    } else {
      alert('Sudah Bayar')
    }
    */
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
        this.props.dispatch(counterNya(this.props.Home.timer))
      }, 1000)
    ))
    // this.cekIsStartedMenus()
  }
  render() {

    return (
      <View style={[Styles.container, {
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 5
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
              {this.props.Home.timerString}
            </Text>
          </View>
        </View>

        {/* List Category */}
        <View style={[Styles.content, Styles.cardSimpleContainer, {
          backgroundColor: Color.whiteColor,
          width: '100%',
          height: 75,
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginBottom: 10,
          paddingBottom: 10
        }]}>
          {this.props.Menu.isLoading ?
            <ActivityIndicator></ActivityIndicator>
            :
            <FlatList
              horizontal={true}
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
        <View style={[Styles.content, Styles.cardSimpleContainer, {
          backgroundColor: Color.whiteColor,
          width: '100%',
          flex: 7,
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginBottom: 5
        }]}>
          <View style={{ height: '100%', width: '100%' }}>
            <Text style={[Styles.hurufKonten, {
              fontSize: 17,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 5
            }]}>List Menu From {this.state.initNameCategory} Category</Text>
            {this.props.Menu.isLoading ?
              <ActivityIndicator></ActivityIndicator>
              :
              <FlatList
                data={this.props.Menu.dataItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                extraData={[this.state.refreshFlatMenu]}
                renderItem={({ item }) => {
                  return (
                    <CompListMenu itemNya={item} idTransaction={this.state.idTransaction} />
                  )}
                }
              />
            }
          </View>
        </View>

        {/* Option */}
        <View style={[Styles.content, Styles.cardSimpleContainer, {
          backgroundColor: Color.whiteColor,
          width: '100%',
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row'
        }]}>

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
            onPress={() => this.aksiListOrder()}
          >
            <Text style={[Styles.hurufKonten, {
              fontSize: 15,
              fontWeight: 'bold',
              textAlign: 'center',
              color: Color.whiteColor
            }]}>
              LIST ORDER</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[Styles.cardSimpleContainer, {
            backgroundColor: Color.darkPrimaryColor,
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: 5,
            margin: 5,
            height: '100%',
            flexDirection: 'row'
          }]}
            onPress={() => this.props.navigation.navigate('SWScreenViewbill')}
          >
            <Text style={[Styles.hurufKonten, {
              fontSize: 15,
              fontWeight: 'bold',
              textAlign: 'center',
              color: Color.whiteColor
            }]}>
              VIEW BILL</Text>
          </TouchableOpacity>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    Menu: state.Menu,
    Category: state.Category,
    Home: state.Home,
    Order: state.Order
  }
}

export default connect(mapStateToProps)(ScreenHome)