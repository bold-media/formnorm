import { access } from '@/payload/access'
import { visibleFor } from '@/payload/utils/visibleFor'
import { formBuilderPlugin, fields } from '@payloadcms/plugin-form-builder'
import { Field, FieldBase } from 'payload'

const nameField: Field = {
  name: 'name',
  type: 'text',
  required: true,
  label: {
    en: "Name (no special characters, or spaces) i.e. 'firstName'",
    ru: "Имя (без специальных символов или пробелов), например 'firstName'",
  },
}

const labelField: Field = {
  name: 'label',
  type: 'text',
  label: {
    en: 'Label',
    ru: 'Метка',
  },
}

const placeholderField: Field = {
  name: 'placeholder',
  type: 'text',
  label: {
    en: 'Placeholder',
    ru: 'Заполнитель',
  },
}

const descriptionField: Field = {
  name: 'description',
  type: 'text',
  label: {
    en: 'Description',
    ru: 'Описание',
  },
}

const widthField: Field = {
  name: 'width',
  type: 'number',
  label: {
    en: 'Field Width (percentage)',
    ru: 'Ширина поля (в процентах)',
  },
}

const defaultValueField: Field = {
  name: 'defaultValue',
  type: 'text',
  label: {
    en: 'Default Value',
    ru: 'Значение по умолчанию',
  },
}

const requiredField: Field = {
  name: 'required',
  type: 'checkbox',
  label: {
    en: 'Required',
    ru: 'Обязательное',
  },
}

const sharedFields: Field[] = [
  nameField,
  {
    type: 'row',
    fields: [
      {
        ...labelField,
        admin: {
          width: '50%',
        },
      },
      {
        ...placeholderField,
        admin: {
          width: '50%',
        },
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        ...widthField,
        admin: {
          width: '50%',
        },
      },
      {
        ...defaultValueField,
        admin: {
          width: '50%',
        },
      },
    ],
  },
  requiredField,
]

export const formBuilder = formBuilderPlugin({
  fields: {
    text: {
      ...fields.text,
      labels: {
        singular: {
          en: 'Text',
          ru: 'Текст',
        },
        plural: {
          en: 'Text',
          ru: 'Текст',
        },
      },
      fields: sharedFields,
    },
    select: {
      ...fields.select,
      labels: {
        singular: {
          en: 'Select',
          ru: 'Выбор',
        },
        plural: {
          en: 'Select Fields',
          ru: 'Выбор полей',
        },
      },
      fields: [
        ...sharedFields,
        {
          name: 'options',
          type: 'array',
          label: {
            en: 'Select Attribute Options',
            ru: 'Выберите параметры атрибута',
          },
          labels: {
            singular: {
              en: 'Option',
              ru: 'Опция',
            },
            plural: {
              en: 'Options',
              ru: 'Опции',
            },
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                  label: {
                    en: 'Label',
                    ru: 'Метка',
                  },
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                  label: {
                    en: 'Value',
                    ru: 'Значение',
                  },
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    textarea: {
      ...fields.textarea,
      labels: {
        singular: {
          en: 'Textarea',
          ru: 'Текстовое поле',
        },
        plural: {
          en: 'Textarea Fields',
          ru: 'Текстовые поля',
        },
      },
      fields: sharedFields,
    },
    number: {
      ...fields.number,
      labels: {
        singular: {
          en: 'Number',
          ru: 'Число',
        },
        plural: {
          en: 'Number Fields',
          ru: 'Числовые поля',
        },
      },
      fields: sharedFields,
    },
    email: {
      ...fields.email,
      labels: {
        singular: {
          en: 'Email',
          ru: 'Электронная почта',
        },
        plural: {
          en: 'Email Fields',
          ru: 'Поля электронной почты',
        },
      },
    },
    checkbox: {
      ...fields.checkbox,
      labels: {
        singular: {
          en: 'Checkbox',
          ru: 'Флажок',
        },
        plural: {
          en: 'Checkbox Fields',
          ru: 'Поля флажков',
        },
      },
      fields: [
        nameField,
        {
          type: 'row',
          fields: [
            {
              ...labelField,
              admin: {
                width: '50%',
              },
            },
            {
              ...descriptionField,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              ...widthField,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'defaultValue',
              type: 'checkbox',
              label: {
                en: 'Default Value',
                ru: 'Значение по умолчанию',
              },
              admin: {
                width: '50%',
              },
            },
          ],
        },
        requiredField,
      ],
    },
    message: {
      ...fields.message,
      labels: {
        singular: {
          en: 'Message',
          ru: 'Сообщение',
        },
        plural: {
          en: 'Message Blocks',
          ru: 'Блоки сообщений',
        },
      },
      fields: [
        {
          name: 'message',
          type: 'richText',
          label: {
            en: 'Message',
            ru: 'Сообщение',
          },
        },
      ],
    },
    country: false,
    payment: false,
    state: false,
  },
  formOverrides: {
    admin: {
      enableRichTextLink: false,
      enableRichTextRelationship: false,
      hidden: (args: any) => visibleFor(args, ['admin']),
    },
    labels: {
      singular: {
        en: 'Form',
        ru: 'Форма',
      },
      plural: {
        en: 'Forms',
        ru: 'Формы',
      },
    },
    access: {
      read: () => true,
      create: access(),
      update: access(),
      delete: access(),
    },
    fields: ({ defaultFields }) => {
      const fields = defaultFields.map((field) => {
        const baseField = field as FieldBase
        if (baseField.name === 'title') {
          return {
            ...field,
            label: {
              en: 'Title',
              ru: 'Заголовок',
            },
          }
        }

        if (baseField.name === 'fields') {
          return {
            ...field,
            label: {
              en: 'Fields',
              ru: 'Поля',
            },
          }
        }

        if (baseField.name === 'submitButtonLabel') {
          return {
            ...field,
            label: {
              en: 'Submit Button Label',
              ru: 'Текст кнопки отправки',
            },
          }
        }

        if (baseField.name === 'confirmationType') {
          return {
            ...field,
            label: {
              en: 'Confirmation Type',
              ru: 'Тип подтверждения',
            },
            admin: {
              layout: 'vertical',
              description: {
                en: 'Choose whether to display an on-page message, or redirect to a different page after they submit the form.',
                ru: 'Выберите, отображать ли сообщение на странице или перенаправлять на другую страницу после отправки формы.',
              },
            },
            options: [
              {
                label: {
                  en: 'Message',
                  ru: 'Сообщение',
                },
                value: 'message',
              },
              {
                label: {
                  en: 'Redirect',
                  ru: 'Перенаправление',
                },
                value: 'redirect',
              },
            ],
          }
        }

        if (baseField.name === 'confirmationMessage') {
          return {
            ...field,
            label: {
              en: 'Confirmation Message',
              ru: 'Сообщение подтверждения',
            },
          }
        }

        if (baseField.name === 'redirect') {
          return {
            ...field,
            label: {
              en: 'Redirect',
              ru: 'Перенаправление',
            },
            fields: [
              {
                name: 'url',
                type: 'text',
                label: {
                  en: 'URL to redirect to',
                  ru: 'URL для перенаправления',
                },
                required: true,
              },
            ],
          }
        }

        if (baseField.name === 'emails') {
          return {
            ...field,
            admin: {
              description: {
                en: "Send custom emails when the form submits. Use comma separated lists to send the same email to multiple recipients. To reference a value from this form, wrap that field's name with double curly brackets, i.e. {{firstName}}.",
                ru: 'Отправляйте пользовательские электронные письма при отправке формы. Используйте списки, разделенные запятыми, чтобы отправить одно и то же письмо нескольким получателям. Чтобы сослаться на значение из этой формы, оберните имя этого поля в двойные фигурные скобки, например, {{firstName}}.',
              },
            },
            fields: [
              {
                type: 'row',
                fields: [
                  {
                    name: 'emailTo',
                    type: 'text',
                    label: {
                      en: 'Email To',
                      ru: 'Email для',
                    },
                    admin: {
                      placeholder: {
                        en: '"Email Sender" <sender@email.com>',
                        ru: '"Отправитель электронной почты" <sender@email.com>',
                      },
                      width: '100%',
                    },
                  },
                  {
                    name: 'cc',
                    type: 'text',
                    admin: {
                      width: '50%',
                    },
                    label: {
                      en: 'CC',
                      ru: 'Копия',
                    },
                  },
                  {
                    name: 'bcc',
                    type: 'text',
                    admin: {
                      width: '50%',
                    },
                    label: {
                      en: 'BCC',
                      ru: 'Скрытая копия',
                    },
                  },
                ],
              },
              {
                type: 'row',
                fields: [
                  {
                    name: 'replyTo',
                    type: 'text',
                    admin: {
                      placeholder: {
                        en: '"Reply To" <reply-to@email.com>',
                        ru: '"Ответить на" <reply-to@email.com>',
                      },
                      width: '50%',
                    },
                    label: {
                      en: 'Reply To',
                      ru: 'Ответить на',
                    },
                  },
                  {
                    name: 'emailFrom',
                    type: 'text',
                    admin: {
                      placeholder: {
                        en: '"Email From" <email-from@email.com>',
                        ru: '"Электронная почта от" <email-from@email.com>',
                      },
                      width: '50%',
                    },
                    label: {
                      en: 'Email From',
                      ru: 'Электронная почта от',
                    },
                  },
                ],
              },
              {
                name: 'subject',
                type: 'text',
                defaultValue: 'Вы получили новое сообщение.',
                label: {
                  en: 'Subject',
                  ru: 'Тема',
                },
                required: true,
              },
              {
                name: 'message',
                type: 'richText',
                admin: {
                  description: {
                    en: 'Enter the message that should be sent in this email.',
                    ru: 'Введите сообщение, которое должно быть отправлено в этом письме.',
                  },
                },
                label: {
                  en: 'Message',
                  ru: 'Сообщение',
                },
              },
            ],
          }
        }

        if (baseField.name === 'name') {
          return {
            ...field,
            label: 'test',
          }
        }

        return field as any
      })

      return [
        ...fields,
        //more custom fields
      ]
    },
  },
  formSubmissionOverrides: {
    admin: {
      enableRichTextLink: false,
      enableRichTextRelationship: false,
      hidden: (args: any) => visibleFor(args, ['admin']),
    },
    labels: {
      singular: {
        en: 'Form Submission',
        ru: 'Отправка формы',
      },
      plural: {
        en: 'Form Submissions',
        ru: 'Отправки форм',
      },
    },
    access: {
      read: access(),
    },
  },
})
