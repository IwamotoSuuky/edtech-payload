/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { useState } from 'react'

type Props = {
  zone: any
  assignDropableZones: any
  dropableObjects: any
  addFieldRow: any
  replaceFieldRow: any
  path: any
  index: number
}

export const AssignDropableObjects = ({
  zone,
  assignDropableZones,
  dropableObjects,
  addFieldRow,
  replaceFieldRow,
  path,
}: Props) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const findAssignedZone = assignDropableZones
    ? assignDropableZones.find((z: any) => zone.id === z.dropableZoneId)
    : undefined
  const findAssignedObject = findAssignedZone?.dropableObjectId
    ? dropableObjects.find((obj: any) => obj.id === findAssignedZone.dropableObjectId)
    : undefined
  const handleClick = () => {
    setShowDropdown(!showDropdown)
  }
  const onClickObject = (dropableObjectId: any, dropableZoneId: any) => {
    const findZoneIndex =
      assignDropableZones && assignDropableZones?.length > 0
        ? assignDropableZones.findIndex((adz: any) => adz.dropableZoneId === dropableZoneId)
        : undefined
    if (Number.isInteger(findZoneIndex) && findZoneIndex !== -1) {
      replaceFieldRow({
        schemaPath: 'content.dragDropQuestion.assignDropableZones',
        path: path,
        rowIndex: findZoneIndex,
        subFieldState: {
          dropableObjectId: {
            value: dropableObjectId,
          },
          dropableZoneId: {
            value: dropableZoneId,
          },
        },
      })
    } else {
      addFieldRow({
        schemaPath: 'content.dragDropQuestion.assignDropableZones',
        path: path,
        subFieldState: {
          dropableObjectId: {
            value: dropableObjectId,
          },
          dropableZoneId: {
            value: dropableZoneId,
          },
        },
      })
    }
    setShowDropdown(!showDropdown)
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginTop: '1rem',
        position: 'relative',
      }}
    >
      <button
        type="button"
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'center',
          width: '220px',
        }}
        onClick={handleClick}
      >
        {findAssignedObject ? (
          <>
            <p>{findAssignedObject.name}</p>
            {findAssignedObject?.url && (
              <Image src={findAssignedObject.url} width={150} height={200} alt="" />
            )}
          </>
        ) : (
          <p>Select an object</p>
        )}
      </button>
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: findAssignedObject ? '195px' : '25px',
            display: 'flex',
            flexDirection: 'column',
            width: '220px',
            zIndex: 50,
            border: '3px solid orange',
          }}
        >
          {dropableObjects.map((dropObj: any) => {
            return (
              <button
                key={dropObj.id}
                type="button"
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => onClickObject(dropObj.id, zone.id)}
              >
                <p>{dropObj.name}</p>
                {dropObj?.url && <Image src={dropObj.url} width={150} height={200} alt="" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
