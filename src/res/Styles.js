import { StyleSheet} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

export const Color = {
  backgroundColor : '#FAFAFA',
  primaryColor : '#03A9F4',
  darkPrimaryColor : '#0288D1',
  accentColor : '#448AFF',
  lightPrimaryColor : '#B3E5FC',
  primaryTextColor : '#212121',
  secondaryTextColor : '#757575',
  deviderColor : '#BDBDBD',
  whiteColor : '#FFFFFF',
  errorColor : '#E53935',
  successColor: '#28A745',
  warningColor: '#FABD3B'
}
export const Styles = StyleSheet.create({
  container : {
    flex:1
  },
  content:{
    padding:wp(2)
  },
  cardSimpleContainer: {
    shadowColor: '#000000',
    shadowOffset: {
      height: 3,
      width: 3
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: Color.whiteColor,
    borderRadius: 3,
    elevation: 4
  },
  hurufKonten:{
    fontSize:wp(3),
    color:Color.primaryTextColor
  }
})