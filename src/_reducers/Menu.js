initialStateMenu = {
  dataItem: '',
  dataItemHomeTampilan:[],
  isLoading: true,
  isRejected:false
}

export default Menu = (state = initialStateMenu, action) => {
  switch (action.type) {
    //Untuk Menus Umum
    case 'GET_MENU_PENDING':
      return {
        ...state,
        isLoading: true,
        isRejected:false
      }
      break
    case 'GET_MENU_FULFILLED':
      return {
        ...state,
        dataItem: action.payload.data,
        dataItemHomeTampilan: action.payload.data,
        isLoading: false,
        isRejected:false
      }
      break
    case 'GET_MENU_REJECTED':
      return {
        ...state,
        dataItem: null,
        dataItemHomeTampilan: null,
        isLoading: false,
        isRejected:true
      }
      break

    case 'RE_RENDER_MENU':
      return {
        ...state,
        isLoading: false
      }
      break

    //Untuk Category Menus
    case 'GET_CATEGORY_MENUS_PENDING':
      return {
        ...state,
        dataItemHomeTampilan: null,
        isLoading: true,
        isRejected:false
      }
      break
    case 'GET_CATEGORY_MENUS_FULFILLED':
      return {
        ...state,
        dataItemHomeTampilan: action.payload.data.menus,
        isLoading: false,
        isRejected:false
      }
      break
    case 'GET_CATEGORY_MENUS_REJECTED':
      return {
        ...state,
        dataItemHomeTampilan: null,
        isLoading: false,
        isRejected:true
      }
      break
    default:
      return state
      break
  }
}