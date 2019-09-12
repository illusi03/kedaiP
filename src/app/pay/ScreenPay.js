import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image, BackHandler, ScrollView } from 'react-native'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconIon from 'react-native-vector-icons/Ionicons'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

import { hapusInterval } from '../../_actions/Timer'
import { Styles, Color } from '../../res/Styles'
import AsyncStorage from '@react-native-community/async-storage';
import { getTransaction, editTransaction } from '../../_actions/Transaction'
import { setAnimationOrder, clearDataHome } from '../../_actions/Home'
import { hapusAllOrder } from '../../_actions/Order'

class ScreenPay extends Component {
  state = {
    noMeja: 0,
    idTransaction: 0,
    isLoadingPay: true
  }
  getNoMeja = async () => {
    const idTransaction = await AsyncStorage.getItem('idTransaction')
    const noMeja = await AsyncStorage.getItem('noMeja')
    await this.setState({
      noMeja,
      idTransaction
    })
    await AsyncStorage.clear()
    this.backHandler = await BackHandler.addEventListener('hardwareBackPress', async () => {
      await BackHandler.exitApp();
      return true;
    });
    await this.setState({
      isLoadingPay: false
    })
  }
  componentDidMount() {
    this.getNoMeja()
  }
  componentWillUnmount() {
    this.props.dispatch(hapusInterval())
    this.props.dispatch(hapusAllOrder())
    this.props.dispatch(clearDataHome())
    this.props.dispatch(setAnimationOrder('out'))
  }
  render() {
    return (
      !this.state.isLoadingPay ?
        <View style={[Styles.container, {
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: wp(3.5)
        }]}>
          <ScrollView style={{
            width: wp(100)
          }}>
            <View style={[Styles.content, Styles.cardSimpleContainer, {
              backgroundColor: Color.whiteColor,
              width: wp(100),
              height: hp(100),
              justifyContent: 'flex-start',
              alignItems: 'center'
            }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={[Styles.hurufKonten, {
                  fontSize: wp(4),
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: wp(2.5),
                  flex: 1
                }]}>
                  Payment Session</Text>
              </View>

              {/* Divider */}
              <View
                style={{
                  borderBottomColor: Color.darkPrimaryColor,
                  borderBottomWidth: 2,
                  width: wp(100),
                  marginVertical: hp(0.5)
                }}
              />
              <View style={{
                flex: 1,
                width: wp(100),
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Image
                  source={require('../../assets/Illustrator/receptionist.png')}
                  style={{
                    width: wp(20),
                    height: hp(20)
                  }}
                ></Image>
                <Text style={[Styles.hurufKonten, {
                  fontSize: wp(4),
                  fontWeight: 'bold',
                  marginBottom: wp(3),
                  textAlign: 'center'
                }]}>
                  PLEASE BRING THE IPAD TO THE CASHIER
              </Text>
                <Text style={[Styles.hurufKonten, {
                  fontSize: wp(3.5),
                  fontWeight: 'bold',
                  textAlign: 'center'
                }]}>
                  TO PROCEED WITH THE PAYMENT
              </Text>

                <Text style={[Styles.hurufKonten, {
                  fontSize: wp(5.2),
                  fontWeight: 'bold',
                  marginTop: wp(5),
                  marginBottom: wp(3.5)
                }]}>
                  # {this.state.noMeja}
                </Text>
                <Text style={[Styles.hurufKonten, {
                  fontSize: wp(4),
                  fontWeight: 'bold',
                  marginBottom: 5
                }]}>
                  With Transaction ID : {this.state.idTransaction}
                </Text>
                <Text style={[Styles.hurufKonten, {
                  fontSize: wp(4),
                  fontWeight: 'bold',
                  marginBottom: wp(1.5)
                }]}>
                  Thank you
              </Text>
                <Text style={[Styles.hurufKonten, {
                  fontSize: wp(4),
                  fontWeight: 'bold',
                }]}>
                  Time Spent
              </Text>
                <Text style={[Styles.hurufKonten, {
                  fontWeight: 'bold',
                }]}>
                  {this.props.Timer.timerString}
                </Text>
                <TouchableOpacity style={[Styles.cardSimpleContainer, {
                  backgroundColor: Color.darkPrimaryColor,
                  width: wp(20),
                  height: hp(6),
                  justifyContent: 'center',
                  padding: wp(3),
                  marginTop: wp(3)
                }]}
                  onPress={() => BackHandler.exitApp()}
                >
                  <Text style={[Styles.hurufKonten, {
                    textAlign: 'center',
                    color: Color.whiteColor
                  }]}> DONE </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        :
        <ActivityIndicator style={{
          flex: 1,
          justifyContent: 'center',
          alignSelf: 'center'
        }}
          size={wp(30)}
        >

        </ActivityIndicator>
    )
  }

}
const mapStateToProps = (state) => {
  return {
    Home: state.Home,
    Timer: state.Timer
  }
}
export default connect(mapStateToProps)(ScreenPay)

/*
import React, { Component } from "react";
import { View, Text, BackHandler } from "react-native";
export default class componentName extends Component {
  constructor(props) {
    super(props); this.state = {};
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }
  handleBackPress = () => {
    BackHandler.exitApp();
    // works best when the goBack is async
    return true;
  };
  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}
*/