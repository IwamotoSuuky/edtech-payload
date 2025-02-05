'use client'

import { useAllFormFields } from '@payloadcms/ui'
import { getSiblingData } from 'payload/shared'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export const Preview: React.FC = () => {
  const [fields] = useAllFormFields()
  const data = getSiblingData(fields, 'content')
  const content = data?.content
  const [image, setImage] = useState<any | null>(null)
  const imageId = content?.dragDropQuestion?.questionImage
  const dropableZones = content?.dragDropQuestion?.dropableZones
  useEffect(() => {
    const fetchImage = async (imageId: string) => {
      const res = await fetch(`/api/media/${imageId}`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await res.json()
      setImage(data)
    }

    if (imageId) fetchImage(imageId)
  }, [imageId])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        dropableZones.forEach((obj: any) => {
          ctx.strokeStyle = obj.color
          if (obj.shape === 'circle') {
            const radius = obj.width / 2
            ctx.beginPath()
            ctx.arc(obj.x + radius, obj.y + radius, radius, 0, Math.PI * 2)
            ctx.stroke()
          } else if (obj.shape === 'rectangle') {
            ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)
          }
        })
      }
    }
  }, [dropableZones])
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {content?.question && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h2>Question</h2>
            <RichText data={content?.question} />
          </div>
        )}
        {content?.question && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h2>Selected Question Type</h2>
            <h3>{content?.selectedQuestionType}</h3>
          </div>
        )}
        {content?.dragDropQuestion && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h2>Drag & Drop Question</h2>
            {content?.dragDropQuestion?.questionImage && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginLeft: '1rem',
                }}
              >
                <h2>Dropzone Background Image</h2>
                {image && <Image width={600} height={400} src={image?.url} alt={image.alt} />}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
