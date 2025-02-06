/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const questionText = content?.dragDropQuestion?.questionText
  const assignDropableZones = content?.dragDropQuestion?.assignDropableZones
  const dropableObjects = content?.dragDropQuestion?.dropableObjects
  const [objects, setObjects] = useState<any[]>([])
  const [isImgFetched, setIsImgFetched] = useState(false)
  const [isFetched, setIsFetched] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchImage = async (imageId: string) => {
      const res = await fetch(`/api/media/${imageId}`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await res.json()
      setImage(data)
      setIsImgFetched(true)
    }

    if (imageId && !isImgFetched) fetchImage(imageId)
  }, [imageId, isImgFetched])
  useEffect(() => {
    const fetchImage = async (asgnDropzones: any) => {
      try {
        const getImages = await Promise.all(
          asgnDropzones.map(async (obj: any) => {
            if (dropableObjects && dropableObjects?.length > 0) {
              const findImage = dropableObjects.find(
                (dropObject: any) => dropObject.id === obj.dropableObjectId,
              )
              if (findImage) {
                setLoading(true)
                const res = await fetch(`/api/media/${findImage.questionImage}`, {
                  method: 'GET',
                  credentials: 'include',
                })
                const data = await res.json()
                return {
                  id: obj.id,
                  name: findImage.name,
                  url: data.url,
                }
              }
            } else {
              return
            }
          }),
        )
        setObjects(getImages)
        setIsFetched(true)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching images:', error)
        setLoading(false)
      }
    }

    if (assignDropableZones && !isFetched) fetchImage(assignDropableZones)
  }, [assignDropableZones, isFetched, dropableObjects])
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
            {loading && <h3>Loading images...</h3>}
            {!loading && content?.dragDropQuestion?.questionImage && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  background: '#ffffff',
                  maxWidth: '600px',
                  paddingTop: '1rem',
                }}
              >
                {questionText && (
                  <p
                    style={{
                      color: '#000000',
                      fontWeight: 500,
                      textAlign: 'center',
                      fontSize: '16px',
                      padding: '1rem',
                    }}
                  >
                    {questionText}
                  </p>
                )}
                {image && <Image width={600} height={400} src={image?.url} alt={image.alt} />}

                {objects && objects?.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '3rem',
                      justifyContent: 'center',
                      width: '600px',
                    }}
                  >
                    {objects.map((obj) => {
                      return (
                        <Image key={obj.id} src={obj.url} alt={obj.name} width={100} height={80} />
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
