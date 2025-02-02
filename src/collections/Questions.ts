import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'
import { colorPickerField } from '@innovixx/payload-color-picker-field'

export const Questions: CollectionConfig = {
  slug: 'questions',
  fields: [
    {
      type: 'tabs', // required
      tabs: [
        // required
        {
          label: 'Content', // required
          name: 'content',
          description: 'This tab contains all input fields for the question',
          fields: [
            {
              name: 'question',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
              }),
            },
            {
              name: 'selectedQuestionType',
              type: 'select',
              options: [
                {
                  label: 'MCQ',
                  value: 'MCQ',
                },
                {
                  label: 'Fill in the Gap',
                  value: 'fill_in_the_gap',
                },
                {
                  label: 'Drag & Drop',
                  value: 'drag_and_drop',
                },
              ],
            },
            {
              name: 'dragDropQuestion',
              label: 'Drap & Drop Question',
              type: 'group',
              fields: [
                {
                  name: 'questionImage',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'dropableZones',
                  label: 'Dropable Zone on Question Image',
                  type: 'array',
                  fields: [
                    { name: 'x', type: 'number', required: true },
                    { name: 'y', type: 'number', required: true },
                    { name: 'width', type: 'number', required: true },
                    { name: 'height', type: 'number', required: true },
                    colorPickerField({
                      name: 'color',
                      label: 'Color',
                      required: true,
                    }),
                    {
                      name: 'shape',
                      type: 'select',
                      options: ['rectangle', 'circle'],
                      defaultValue: 'circle',
                    },
                  ],
                },
                {
                  name: 'dropableObjects',
                  type: 'array',
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    {
                      name: 'questionImage',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'assignDropableZones',
                  type: 'array',
                  fields: [
                    {
                      name: 'assignDropableZone',
                      type: 'text',
                      required: true,
                      admin: {
                        components: {
                          Field: '@/app/(payload)/custom/AssignDropzones#AssignDropzones',
                        },
                      },
                    },
                    {
                      name: 'assignDropableObject',
                      type: 'text',
                      required: true,
                      admin: {
                        components: {
                          Field:
                            '@/app/(payload)/custom/AssignDropableObjects#AssignDropableObjects',
                        },
                      },
                    },
                  ],
                },
              ],
              admin: {
                condition: (data) => {
                  if (data.content.selectedQuestionType === 'drag_and_drop') {
                    return true
                  } else {
                    return false
                  }
                },
              },
            },
          ],
        },
        {
          name: 'preview',
          label: 'Preview', // required
          interfaceName: 'this tab has the preview of the whole question', // optional (`name` must be present)
          fields: [
            // required
            {
              name: 'questionPreview', // accessible via tabTwo.numberField
              type: 'ui',
              admin: {
                components: {
                  Field: '@/app/(payload)/custom/QuestionPreview#Preview',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
