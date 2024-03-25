/* eslint-disable consistent-return */
import useAppStore from '@/src/stores/useAppStore'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import Player from 'video.js/dist/types/player'
import 'video.js/dist/video-js.css'

interface VideoPlayerProps {
  videoUrl: string
  thumbnailUrl: string
  setPlayerInstance?: (d: Player) => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, thumbnailUrl, setPlayerInstance }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [player, setPlayer] = useState<Player>()
  const { mediaSelectedID } = useAppStore()

  const initVideoPlayer = useCallback(() => {
    if (!videoRef.current) {
      return
    }

    const pl = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      poster: thumbnailUrl,
      // sources: [
      //   {
      //     src: videoUrl,
      //     type: 'application/x-mpegURL',
      //   },
      // ],
    })

    setPlayer(pl)
    if (setPlayerInstance) setPlayerInstance(pl)
  }, [videoRef])

  useEffect(() => {
    initVideoPlayer()

    return () => {
      if (player) {
        player.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (mediaSelectedID) {
      if (player) {
        player.pause()
        player.poster(thumbnailUrl)
        player.src(videoUrl)
      }
    }
  }, [mediaSelectedID, player, videoUrl, thumbnailUrl])

  useEffect(() => {
    if (player) {
      player.src(videoUrl)
      player.poster(thumbnailUrl)
    }
  }, [player, videoUrl, thumbnailUrl])

  return (
    <div className="w-full aspect-video">
      <video
        ref={videoRef}
        className="w-full video-js vjs-has-started vjs-default-skin vjs-big-play-centered vjs-16-9 vjs-show-big-play-button-on-pause"
        preload="auto"
      />
    </div>
  )
}

export default VideoPlayer
