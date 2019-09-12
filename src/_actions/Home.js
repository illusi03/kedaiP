export const setIsOrdered = (data) => {
  /*
  Tipe Objek ={
    isOrdered,
    jmlKeranjang,
    jmlHarga
  }
  */
  return {
    type:'SET_ISORDERED',
    payload:data
  }
}
export const setAnimationOrder = (jenis) => {
  return {
    type:'SET_ANIMATION_ORDER',
    jenis:jenis
  }
}
export const clearDataHome = () => {
  return {
    type:'CLEAR_DATA_HOME'
  }
}