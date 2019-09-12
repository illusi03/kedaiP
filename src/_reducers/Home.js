import {
  Animated,
  Easing,
  Dimensions
} from 'react-native'
var { height, width } = Dimensions.get('window')

initStateHome = {
  isLoading: true,
  isOrdered: false,
  jmlKeranjang: 0,
  jmlHarga: 0,
  estimasiHarga: 0,
  xyValue: new Animated.ValueXY({ x: 12, y: height + 100 })
}

convertIntToTime = (given_seconds) => {
  dateObj = new Date(given_seconds * 1000);
  hours = dateObj.getUTCHours();
  minutes = dateObj.getUTCMinutes();
  seconds = dateObj.getSeconds();

  timeString = hours.toString().padStart(2, '0') + ':' +
    minutes.toString().padStart(2, '0') + ':' +
    seconds.toString().padStart(2, '0');
  return timeString
}

export default Home = (state = initStateHome, action) => {
  switch (action.type) {
    //Untuk Menus Umum
    case 'SET_ISORDERED':
      return {
        ...state,
        isOrdered: action.payload.isOrdered,
        jmlKeranjang: action.payload.jmlKeranjang,
        jmlHarga: action.payload.jmlHarga,
        estimasiHarga: action.payload.estimasiHarga
      }
      break

    case 'SET_ANIMATION_ORDER':
      if (action.jenis == 'in') {
        Animated.spring(state.xyValue, {
          toValue: { x: 12, y: height - 120 },
          duration: 1000
        }).start()
      } else {
        Animated.spring(state.xyValue, {
          toValue: { x: 12, y: height + 100 },
          duration: 1000
        }).start()
      }
      return {
        ...state
      }
      break

    case 'CLEAR_DATA_HOME':
      return {
        ...state,
        isLoading: true,
        isOrdered: false,
        jmlKeranjang: 0,
        jmlHarga: 0,
        estimasiHarga: 0,
        xyValue: new Animated.ValueXY({ x: 12, y: height + 100 })
      }
      break

    default:
      return state
      break
  }
}