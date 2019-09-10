import Store from '../_redux/Store'

initStateHome = {
  isLoading: true,
  timer: 0,
  timerEvent: '',
  timerString: '00:00:00',
  isOrdered: false,
  jmlKeranjang: 0,
  jmlHarga:0,
  estimasiHarga:0
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
    case 'SET_INTERVAL_EVENT':
      return {
        ...state,
        timer: state.timer,
        timerString: state.timerString,
        timerEvent: action.payload
      }
      break
    case 'SET_INTERVAL_COUNTER':
      return {
        ...state,
        timerEvent: state.timerEvent,
        timer: action.payload,
        timerString: convertIntToTime(action.payload)
      }
      break
    case 'REMOVE_INTERVAL':
      return {
        ...state,
        timerEvent: null,
        timer: 0,
        timerString: '00:00:00'
      }
      break

    case 'SET_ISORDERED':
      return {
        ...state,
        isOrdered: action.payload.isOrdered,
        jmlKeranjang: action.payload.jmlKeranjang,
        jmlHarga: action.payload.jmlHarga,
        estimasiHarga: action.payload.estimasiHarga
      }
      break
    default:
      return state
      break
  }
}
// const mapStateToProps = (state) => {
//   return{
//     Order:state.Order
//   }
// }
// export default connect(mapStateToProps)(Home)