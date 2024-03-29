/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { createWsClient } from '../lib/socket/socket'
import useAppStore from '../stores/useAppStore'
import { FileType, MediaProfileStatus } from '../types'

interface Props {
  profiles: any
  type?: FileType
}

const useTranscodePercent = (props: Props) => {
  const { profiles, type } = props

  const [transcodePercentMap, setTranscodePercentMap] = useState<Record<string, number>>({})

  const [subscriptions, setSubscriptions] = useState<any[]>([])

  const queryClient = useQueryClient()

  const { listMediaQueries } = useAppStore()

  const clearSubscription = () => {
    for (const subscription of subscriptions) {
      subscription?.unsubscribe()
    }
  }

  useEffect(() => {
    if (!profiles || type !== FileType.VIDEO) return
    clearSubscription()
    const tempSubscriptions = []

    for (let i = 0; i < profiles?.length; i++) {
      const profile = profiles[i]
      const profileId = profile?.id || ''

      if (profile.status !== MediaProfileStatus.TRANSCODING) {
        const percent = profile.status === MediaProfileStatus.DONE ? 100 : 0

        setTranscodePercentMap(prev => ({
          ...prev,
          [profileId]: percent,
        }))

        // eslint-disable-next-line no-continue
        continue
      }

      const OnTranscodeProgressDocument = `
      subscription onTranscodeProgress($profileId: String!) {
          onTranscodeProgress(input: {profileId: $profileId}) {
              profile {
                _id
                status
              }
              progress
            }
          }
              `
      const subscription = createWsClient()
        .request({
          query: OnTranscodeProgressDocument,
          variables: {
            profileId: profileId || '',
          },
        })
        .subscribe({
          next({ data }: any) {
            if (data) {
              const response = data?.onTranscodeProgress
              const percent = Math.round(response?.progress)
              setTranscodePercentMap(prev => ({
                ...prev,
                [profileId]: percent,
              }))

              if (percent >= 97) {
                queryClient.invalidateQueries({
                  queryKey: ['getListMedia', listMediaQueries],
                })
              }
            }
          },
        })

      tempSubscriptions.push(subscription)
    }

    setSubscriptions(tempSubscriptions)
  }, [profiles, type, createWsClient])

  // Clear subscript after
  useEffect(() => {
    return () => {
      clearSubscription()
    }
  }, [])

  return {
    transcodePercentMap,
  }
}

export default useTranscodePercent
