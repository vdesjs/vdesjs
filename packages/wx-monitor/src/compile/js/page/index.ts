import { store } from "../../store";


const excludeProp = ['data', 'onLoad', 'onShow', 'onReady', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onShareTimeline', 'onAddToFavorites', 'onPageScroll', 'onResize', 'onTabItemTap', 'onSaveExitState']

type TData = Record<string, any>;

export function Page(pageObj) {
  if (pageObj.data) {
    store.page.data = pageObj.data
  }

  for (const propertie in pageObj) {
    store.page[propertie] = pageObj[propertie]

  }

}
