export type RootStackParamList = {
  login: undefined
  cards: undefined
  product: undefined
  tabs: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
