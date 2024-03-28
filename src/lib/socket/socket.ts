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
    timeout: 3000,
    connectionParams: () => {
      const token = getAuthToken(AuthTokenType.ACCESS)
      return {
        Authorization: `Bearer ${token}`,
      }
    },
    lazy: false, // only connect when there is a query
    connectionCallback: error => {
      error && console.error(error)
    },
  })
  return wsClient
}
