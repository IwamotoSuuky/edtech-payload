'use client'

import type { TextFieldClientComponent } from 'payload'
import { useField, useFormFields } from '@payloadcms/ui'
import { useState } from 'react'

export const AssignDropzones: TextFieldClientComponent = ({ path }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { value, setValue } = useField({ path })
  const dropableZones = useFormFields(
    ([fields, _]) => fields['content.dragDropQuestion.dropableZones'],
  )
  const zones = dropableZones?.rows
  const onSelect = (id: string) => {
    setValue(id)
    setShowDropdown(!showDropdown)
  }
  const handleSelect = () => {
    setShowDropdown(!showDropdown)
  }
  const buttonStyle = {
    color: 'white',
    backgroundColor: 'black',
    border: '1px solid gray',
    padding: '10px',
    cursor: 'pointer',
  }

  const dropdownStyle = {
    display: 'flex',
    top: '40px',
    backgroundColor: 'black',
    border: '1px solid gray',
  }
  const currentZoneText = zones?.findIndex((zone) => zone.id === value) ?? 0
  if (zones && zones?.length > 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
          marginBottom: '1rem',
        }}
      >
        {(value as string) ? (
          <button type="button" onClick={handleSelect} style={buttonStyle}>
            Zone {`${currentZoneText + 1}`}
          </button>
        ) : (
          <button type="button" onClick={handleSelect} style={buttonStyle}>
            Select Dropzone
          </button>
        )}
        {showDropdown && zones?.length > 0 && (
          <div
            style={{ ...dropdownStyle, flexDirection: 'column', position: 'absolute', zIndex: 50 }}
          >
            {zones.map((zone, index) => {
              const text = `Zone ${index + 1}`
              return (
                <button
                  type="button"
                  key={zone.id}
                  onClick={() => onSelect(zone.id)}
                  style={buttonStyle}
                >
                  {text}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}
