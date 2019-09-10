initialStateCategory = {
  dataItem: '',
  isLoading: true,
  isRejected:false
}

export default Category = (state = initialStateCategory, action) => {
  switch (action.type) {
    //Untuk Category Master 
    case 'GET_CATEGORY_PENDING':
      return {
        ...state,
        isLoading: true,
        isRejected:false
      }
      break
    case 'GET_CATEGORY_FULFILLED':
      return {
        ...state,
        dataItem: action.payload.data,
        isLoading: false,
        isRejected:false
      }
      break
    case 'GET_CATEGORY_REJECTED':
      return {
        ...state,
        dataItem: null,
        isLoading: false,
        isRejected:true
      }
      break

    case 'RE_RENDER_CATEGORY':
      return {
        ...state,
        dataItem: action.payload,
        isLoading: false,
        isRejected:false
      }
      break

    default:
      return state
      break
  }
}