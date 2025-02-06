/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useForm, useAllFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import { getSiblingData } from 'payload/shared'
import { ArrayFieldClientComponent } from 'payload'
import { AssignDropableObjects } from './AssignDropableObjects'

export const AssignDropZones: ArrayFieldClientComponent = ({ path }) => {
  const [fields] = useAllFormFields()
  const data = getSiblingData(fields, 'content')
  const content = data?.content
  const dropableZones = content?.dragDropQuestion?.dropableZones
  const objects = content?.dragDropQuestion?.dropableObjects
  const assignDropableZones = content?.dragDropQuestion?.assignDropableZones
  const [dropableObjects, setDropableObjects] = useState<any[]>([])
  const [isFetched, setIsFetched] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addFieldRow, replaceFieldRow } = useForm()
  useEffect(() => {
    const fetchImage = async (objects: any) => {
      try {
        setLoading(true)
        const getImages = await Promise.all(
          objects.map(async (obj: any) => {
            const res = await fetch(`/api/media/${obj.questionImage}`, {
              method: 'GET',
              credentials: 'include',
            })
            const data = await res.json()
            return {
              id: obj.id,
              name: obj.name,
              url: data.url,
            }
          }),
        )
        setDropableObjects(getImages)
        setIsFetched(true)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching images:', error)
        setLoading(false)
      }
    }

    if (objects && !isFetched) fetchImage(objects)
  }, [objects, isFetched])

  if (loading) {
    return <h4>Loading assigned dropzones...</h4>
  }

  if (
    dropableZones &&
    dropableZones?.length > 0 &&
    dropableObjects &&
    dropableObjects?.length > 0
  ) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '1rem',
        }}
      >
        <h2>Assign Dropzones</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {dropableZones.map((zone: any, index: number) => {
            return (
              <div key={zone.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Stage
                  width={250}
                  height={350}
                  style={{ border: '1px solid grey', marginTop: 10, background: '#ffffff' }}
                >
                  <Layer>
                    <Rect
                      key={zone.id}
                      id={zone.id}
                      x={50}
                      y={30}
                      width={zone.width}
                      height={zone.height}
                      stroke={zone.stroke}
                      strokeWidth={5}
                      cornerRadius={10}
                    />
                  </Layer>
                </Stage>
                <AssignDropableObjects
                  zone={zone}
                  dropableObjects={dropableObjects}
                  assignDropableZones={assignDropableZones}
                  addFieldRow={addFieldRow}
                  replaceFieldRow={replaceFieldRow}
                  path={path}
                  index={index}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  } else {
    return (
      <>
        <h2>Assign Dropzones</h2>
        <h4>No dropable zones are found</h4>
      </>
    )
  }
}
