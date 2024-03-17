/* eslint-disable consistent-return */
import '@videojs/http-streaming'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import Player from 'video.js/dist/types/player'
import 'video.js/dist/video-js.css'

interface VideoPlayerProps {
  videoUrl: string
  thumbnailUrl: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, thumbnailUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [player, setPlayer] = useState<Player>()

  const initVideoPlayer = useCallback(() => {
    if (!videoRef.current) {
      return
    }

    const pl = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      poster: thumbnailUrl,
      sources: [
        {
          src: videoUrl,
          type: 'application/x-mpegURL',
        },
      ],
    })

    setPlayer(pl)
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
    if (player) {
      player.src(videoUrl)
      player.poster(thumbnailUrl)
    }
  }, [player, videoUrl, thumbnailUrl])

  return (
    <div className="w-full aspect-video">
      <video ref={videoRef} className="w-full video-js vjs-default-skin vjs-16-9" />
    </div>
  )
}

export default VideoPlayer
