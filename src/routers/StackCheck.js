import React, { Component } from 'react'
import { View, ActivityIndicator,Text,BackHandler} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux'

import {getMenu} from '../_actions/Menu'
import {getCategory} from '../_actions/Category'

class StackCheck extends Component {
  componentDidMount() {
    this._bootstrapAsync();
  }
  _bootstrapAsync = async () => {
    try {
      await this.props.dispatch(getMenu())
      await this.props.dispatch(getCategory())
      const x = await AsyncStorage.getItem('noMeja');
      if (x != null) {
        await this.props.navigation.navigate('StackPrivate')
      } else {
        await this.props.navigation.navigate('StackPublic')
      }
    } catch (e) { 
      alert(`Check your connection : ${e}`)
    }
  }
  render() {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size={50} color="#0000ff" />
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold'
        }}>Please wait ...</Text>
      </View>
    )
  }
}
const mapStateToProps = (state) => {
  return{
    Menu : state.Menu,
    Category : state.Category
  }
}
export default connect(mapStateToProps)(StackCheck)