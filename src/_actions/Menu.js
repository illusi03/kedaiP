import axios from 'axios'
import Constanta from '../res/Constant'

export const getMenu = () => {
  return {
    type:'GET_MENU',
    payload : axios.get(`${Constanta.host}/menus`)
  }
}
export const reRenderMenu = (data) => {
  return {
    type:'RE_RENDER_MENU',
    payload : data
  }
}
export const getMenuWhereCategory = (categoryId) => {
  return {
    type:'GET_CATEGORY_MENUS',
    payload : axios.get(`${Constanta.host}/category/menus/${categoryId}`)
  }
}