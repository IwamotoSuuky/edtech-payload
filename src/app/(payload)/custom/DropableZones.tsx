/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { Stage, Layer, Rect, Transformer, Image as KonvaImage } from 'react-konva'
import { KonvaEventObject } from 'konva/lib/Node'
import useImage from 'use-image'
import { useAllFormFields, useForm } from '@payloadcms/ui'
import { getSiblingData } from 'payload/shared'
import { ArrayFieldClientComponent } from 'payload'

type RectConfig = {
  id: string
  x: number
  y: number
  width: number
  height: number
  stroke: string
}

export const DropableZones: ArrayFieldClientComponent = ({ path }) => {
  const [fields] = useAllFormFields()
  const data = getSiblingData(fields, 'content')
  const content = data?.content
  const imageId = content?.dragDropQuestion?.questionImage
  const dropableZones = content?.dragDropQuestion?.dropableZones
  const [rectangles, setRectangles] = useState<RectConfig[]>((dropableZones as RectConfig[]) || [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('#FF0000')
  const transformerRef = useRef<any>(null)

  const { addFieldRow, removeFieldRow, replaceFieldRow } = useForm()
  const [image, setImage] = useState<any | null>(null)

  useEffect(() => {
    const fetchImage = async (imageId: string) => {
      const res = await fetch(`/api/media/${imageId}`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await res.json()
      setImage(data.url)
    }

    if (imageId) fetchImage(imageId)
  }, [imageId])

  const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      setSelectedId(null)
    }
  }
  const findIndex = rectangles.findIndex((rect) => rect.id === selectedId)
  const addRectangle = (newRect: RectConfig) => {
    addFieldRow({
      schemaPath: 'content.dragDropQuestion.dropableZones',
      path: path,
      subFieldState: {
        id: {
          value: newRect.id,
        },
        x: {
          value: newRect.x,
        },
        y: {
          value: newRect.y,
        },
        width: {
          value: newRect.width,
        },
        height: {
          value: newRect.height,
        },
        stroke: {
          value: newRect.stroke,
        },
      },
    })
  }
  const updateRectange = (newRect: RectConfig, rowIndex: number) => {
    replaceFieldRow({
      schemaPath: 'content.dragDropQuestion.dropableZones',
      path: path,
      rowIndex: rowIndex,
      subFieldState: {
        id: {
          value: newRect.id,
        },
        x: {
          value: newRect.x,
        },
        y: {
          value: newRect.y,
        },
        width: {
          value: newRect.width,
        },
        height: {
          value: newRect.height,
        },
        stroke: {
          value: newRect.stroke,
        },
      },
    })
  }
  const removeRectangle = (rowIndex: number) => {
    removeFieldRow({
      path: path,
      rowIndex: rowIndex,
    })
  }
  const handleAddRectangle = (e: any) => {
    e.stopPropagation()
    const newRect: RectConfig = {
      id: `rect_${Date.now()}`,
      x: 50,
      y: 50,
      width: 100,
      height: 80,
      stroke: selectedColor,
    }
    setRectangles((prev) => {
      return [...prev, newRect]
    })
    requestAnimationFrame(() => {
      setSelectedId(newRect.id)
      addRectangle(newRect)
    })
  }
  const handleRemoveRectangle = () => {
    if (!selectedId) return
    setRectangles(rectangles.filter((r) => r.id !== selectedId))

    removeRectangle(findIndex)
    setSelectedId(null)
  }

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor)
    if (!selectedId) return
    setRectangles((prev) => prev.map((r) => (r.id === selectedId ? { ...r, stroke: newColor } : r)))
    if (findIndex) {
      const findRect = rectangles[findIndex]
      updateRectange(
        {
          ...findRect,
          stroke: newColor,
        },
        findIndex,
      )
    }
  }

  // OnTransformEnd
  const handleTransform = (index: number, node: any) => {
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    setRectangles((prev) => {
      const copy = [...prev]
      copy[index] = {
        ...copy[index],
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
      }
      return copy
    })
    const findRect = rectangles[index]
    if (index) {
      updateRectange(
        {
          ...findRect,
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
        },
        index,
      )
    }
    node.scaleX(1)
    node.scaleY(1)
  }

  // Keep Transformer in sync
  useLayoutEffect(() => {
    if (transformerRef.current && selectedId) {
      const stage = transformerRef.current.getStage()
      const selectedNode = stage.findOne(`#${selectedId}`)
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode])
        transformerRef.current.getLayer()?.batchDraw()
      }
    } else {
      // Clear if no selection
      transformerRef.current?.nodes([])
      transformerRef.current?.getLayer()?.batchDraw()
    }
  }, [selectedId, rectangles])
  const [bgImage] = useImage(image)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      <h2>Select Dropable Zones</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={handleAddRectangle}>
            Add Rect
          </button>
          <button type="button" onClick={handleRemoveRectangle} disabled={!selectedId}>
            Remove
          </button>
          <input
            type="color"
            defaultValue="#FF0000"
            onChange={(e) => handleColorChange(e.target.value)}
          />
        </div>
        <Stage
          width={600}
          height={400}
          style={{ border: '1px solid grey', marginTop: 10, background: '#ffffff' }}
          onMouseDown={handleStageMouseDown}
        >
          <Layer>
            {bgImage && (
              <KonvaImage
                image={bgImage}
                x={-100}
                y={0}
                width={800}
                height={400}
                listening={false}
              />
            )}
            {rectangles &&
              rectangles?.length > 0 &&
              rectangles.map((rect, i) => (
                <Rect
                  key={rect.id}
                  id={rect.id}
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  stroke={rect.stroke}
                  strokeWidth={5}
                  cornerRadius={10}
                  draggable
                  onClick={() => setSelectedId(rect.id)}
                  onTap={() => setSelectedId(rect.id)}
                  dragBoundFunc={(pos) => {
                    // The current rectangle dimensions
                    const width = rect.width
                    const height = rect.height

                    // The max boundaries (in your code: Stage width=600, height=400)
                    const maxX = 600 - width
                    const maxY = 400 - height

                    // Clamp the x/y so rect stays inside
                    const x = Math.max(0, Math.min(pos.x, maxX))
                    const y = Math.max(0, Math.min(pos.y, maxY))

                    return { x, y }
                  }}
                  onDragEnd={(e) => {
                    const node = e.target
                    setRectangles((prev) => {
                      const copy = [...prev]
                      copy[i] = {
                        ...copy[i],
                        x: node.x(),
                        y: node.y(),
                      }
                      return copy
                    })
                  }}
                  onTransformEnd={(e) => handleTransform(i, e.target)}
                />
              ))}
            <Transformer
              ref={transformerRef}
              rotateEnabled={false}
              boundBoxFunc={(oldBox, newBox) => {
                // Prevent negative sizes
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox
                }
                return newBox
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
