export type RootStackParamList = {
  login: undefined
  cards: undefined
  product: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
