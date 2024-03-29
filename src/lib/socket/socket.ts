import { SubscriptionClient } from 'graphql-subscriptions-client'
import { AuthTokenType, getAuthToken } from '../utils/auth'

export let wsClient: SubscriptionClient | null = null
export const sockUrl = 'wss://uat.api.plcplatform.net/graphql'

export const createWsClient = () => {
  if (wsClient) {
    return wsClient
  }

  wsClient = new SubscriptionClient(sockUrl, {
    reconnect: true,
    timeout: 5000,
    reconnectionAttempts: 10,
    connectionParams: () => {
      const token = getAuthToken(AuthTokenType.ACCESS)
      console.log('connectionParams', token)
      return {
        Authorization: `Bearer ${token}`,
      }
    },
    lazy: false, // only connect when there is a query
    connectionCallback: error => {
      error && console.log('sock:', error)
    },
  })
  return wsClient
}
