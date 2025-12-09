export type RootStackParamList = {
  login: undefined
  product: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
