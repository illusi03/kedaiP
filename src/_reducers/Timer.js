initStateTimer = {
  timer: 0,
  timerEvent: '',
  timerString: '00:00:00'
}
export default Timer = (state = initStateTimer, action) => {
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
    default:
      return state
      break
  }
}