'use client'

import type { TextFieldClientComponent } from 'payload'
import { useField, useAllFormFields } from '@payloadcms/ui'
import { useState } from 'react'
import { getSiblingData } from 'payload/shared'

export const AssignDropableObjects: TextFieldClientComponent = ({ path }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { value, setValue } = useField({ path })
  const [fields] = useAllFormFields()
  const data = getSiblingData(fields, 'dragDropQuestion')
  const objects = data?.content?.dragDropQuestion?.dropableObjects
  const onSelect = (id: string) => {
    setValue(id)
    setShowDropdown(!showDropdown)
  }
  const handleSelect = () => {
    setShowDropdown(!showDropdown)
  }
  const currentObject = objects
    ? objects.find((obj: any) => obj.id === value)
    : { name: 'Select Dropable Object' }
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
  if (objects && objects?.length > 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', position: 'relative' }}>
        {(value as string) ? (
          <button type="button" onClick={handleSelect} style={buttonStyle}>
            {currentObject.name}
          </button>
        ) : (
          <button type="button" onClick={handleSelect} style={buttonStyle}>
            Select Dropable Object
          </button>
        )}
        {showDropdown && objects?.length > 0 && (
          <div
            style={{ ...dropdownStyle, flexDirection: 'column', position: 'absolute', zIndex: 50 }}
          >
            {objects.map((obj: any) => {
              return (
                <button
                  type="button"
                  key={obj.id}
                  onClick={() => onSelect(obj.id)}
                  style={buttonStyle}
                >
                  {obj.name}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}
