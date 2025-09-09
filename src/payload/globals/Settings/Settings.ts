import { revalidateGlobal } from '@/payload/hooks/revalidateGlobal'
import { MetaDescriptionField, MetaTitleField } from '@payloadcms/plugin-seo/fields'
import { GlobalConfig } from 'payload'
import { link, linkGroup } from '@/payload/fields/link'
import { seoFields } from '@/payload/fields/seo'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: {
    en: 'Settings',
    ru: 'Настройки',
  },
  admin: {
    group: {
      en: 'Admin',
      ru: 'Админ',
    },
  },
  typescript: {
    interface: 'Settings',
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'company',
          fields: [
            {
              type: 'text',
              name: 'name',
            },
          ],
        },
        {
          name: 'navigation',
          label: {
            en: 'Navigation',
            ru: 'Навигация',
          },
          fields: [
            {
              name: 'header',
              label: {
                en: 'Header',
                ru: 'Шапка',
              },
              type: 'group',
              fields: [
                linkGroup({
                  appearances: false,
                  overrides: {
                    label: {
                      en: 'Menu Items',
                      ru: 'Пункты меню',
                    },
                    labels: {
                      singular: {
                        en: 'Menu Item',
                        ru: 'Пункт меню',
                      },
                      plural: {
                        en: 'Menu Items',
                        ru: 'Пункты меню',
                      },
                    },
                  },
                }),
              ],
            },
            {
              name: 'footer',
              label: {
                en: 'Footer',
                ru: 'Подвал',
              },
              type: 'group',
              fields: [
                linkGroup({
                  appearances: false,
                  overrides: {
                    label: {
                      en: 'Menu Items',
                      ru: 'Пункты меню',
                    },
                    labels: {
                      singular: {
                        en: 'Menu Item',
                        ru: 'Пункт меню',
                      },
                      plural: {
                        en: 'Menu Items',
                        ru: 'Пункты меню',
                      },
                    },
                  },
                }),

                {
                  name: 'copyText',
                  label: {
                    en: 'Copy Text',
                    ru: 'Текст копирайта',
                  },
                  type: 'text',
                },
                linkGroup({
                  appearances: false,
                  overrides: {
                    name: 'legalLinks',
                    label: {
                      en: 'Legal Links',
                      ru: '',
                    },
                    labels: {
                      singular: {
                        en: 'Legal Link',
                        ru: '...',
                      },
                      plural: {
                        en: 'Legal Links',
                        ru: '...',
                      },
                    },
                  },
                }),
              ],
            },
          ],
        },
        {
          name: 'seo',
          label: 'SEO',
          description: {
            en: `These settings serve as a fallback for any pages that do not have SEO configured. If a page has SEO configured, these settings will be ignored.`,
            ru: `Эти настройки используются как запасные для страниц, у которых не настроен SEO. Если у страницы настроен SEO, эти настройки будут проигнорированы.`,
          },
          fields: [
            {
              name: 'default',
              type: 'group',
              fields: seoFields({
                titlePath: 'seo.default.title',
                descriptionPath: 'seo.default.description',
                imagePath: 'seo.default.image',
              }),
            },

            {
              name: 'blog',
              label: {
                en: 'Blog Posts SEO',
                ru: 'SEO для Блога',
              },
              type: 'group',
              fields: seoFields({
                titlePath: 'seo.blog.title',
                descriptionPath: 'seo.blog.description',
                imagePath: 'seo.blog.image',
                // previewSuffix: '/blog',
                includeNoIndex: true,
              }),
            },
            {
              name: 'calculator',
              label: {
                en: 'Calculator SEO',
                ru: 'SEO для Калькулятора',
              },
              type: 'group',
              fields: seoFields({
                titlePath: 'seo.calculator.title',
                descriptionPath: 'seo.calculator.description',
                imagePath: 'seo.calculator.image',
                // previewSuffix: '/blog',
                includeNoIndex: true,
              }),
            },
          ],
        },
        {
          name: 'calculator',
          label: {
            en: 'Price Calculator',
            ru: 'Калькулятор цен',
          },
          description: {
            en: 'House design project calculator settings',
            ru: 'Настройки калькулятора проектирования дома',
          },
          fields: [
            {
              name: 'calculatorTitle',
              type: 'text',
              label: {
                en: 'Calculator Title',
                ru: 'Название калькулятора',
              },
              defaultValue: 'Калькулятор проектирования дома',
              required: true,
            },
            {
              name: 'currency',
              type: 'text',
              label: {
                en: 'Currency Symbol',
                ru: 'Символ валюты',
              },
              defaultValue: 'р.',
              required: true,
            },
            {
              name: 'areaSettings',
              type: 'group',
              label: {
                en: 'Area Settings',
                ru: 'Настройки площади',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: {
                    en: 'Group Label',
                    ru: 'Заголовок группы',
                  },
                  defaultValue: 'Общая площадь дома (все помещения на всех этажах)',
                },
                {
                  name: 'placeholder',
                  type: 'text',
                  label: {
                    en: 'Placeholder',
                    ru: 'Подсказка',
                  },
                  defaultValue: 'Введите площадь в м²',
                },
                {
                  name: 'defaultArea',
                  type: 'number',
                  label: {
                    en: 'Default Area',
                    ru: 'Площадь по умолчанию',
                  },
                  defaultValue: 0,
                },

                {
                  name: 'description',
                  type: 'text',
                  label: {
                    en: 'Description',
                    ru: 'Описание',
                  },
                },
                {
                  name: 'areaCoefficients',
                  type: 'array',
                  label: {
                    en: 'Area Coefficients',
                    ru: 'Коэффициенты по площади',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: {
                        en: 'Range Description',
                        ru: 'Описание диапазона',
                      },
                      required: true,
                    },
                    {
                      name: 'minArea',
                      type: 'number',
                      label: {
                        en: 'Minimum Area',
                        ru: 'Минимальная площадь',
                      },
                      required: true,
                    },
                    {
                      name: 'maxArea',
                      type: 'number',
                      label: {
                        en: 'Maximum Area',
                        ru: 'Максимальная площадь',
                      },
                    },
                    {
                      name: 'coefficient',
                      type: 'number',
                      label: {
                        en: 'Coefficient',
                        ru: 'Коэффициент',
                      },
                      required: true,
                    },
                  ],
                  defaultValue: [
                    { label: 'площадь 100-150 м²', minArea: 100, maxArea: 150, coefficient: 1.2 },
                    { label: 'площадь 150-250 м²', minArea: 150, maxArea: 250, coefficient: 1.0 },
                    {
                      label: 'площадь более 250 м²',
                      minArea: 250,
                      maxArea: null,
                      coefficient: 0.9,
                    },
                  ],
                },
              ],
            },
            {
              name: 'floorSettings',
              type: 'group',
              label: {
                en: 'Floor Settings',
                ru: 'Настройки этажности',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: {
                    en: 'Group Label',
                    ru: 'Заголовок группы',
                  },
                  defaultValue: 'Этажность',
                },
                {
                  name: 'floorOptions',
                  type: 'array',
                  label: {
                    en: 'Floor Options',
                    ru: 'Варианты этажности',
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      label: {
                        en: 'Name',
                        ru: 'Название',
                      },
                      required: true,
                    },
                    {
                      name: 'coefficient',
                      type: 'number',
                      label: {
                        en: 'Coefficient',
                        ru: 'Коэффициент',
                      },
                      required: true,
                    },
                    {
                      name: 'isDefault',
                      type: 'checkbox',
                      label: {
                        en: 'Default',
                        ru: 'По умолчанию',
                      },
                    },
                  ],
                  defaultValue: [
                    { name: 'Одноэтажный', coefficient: 1, isDefault: true },
                    { name: 'Двухэтажный (полный или мансардный второй этаж)', coefficient: 1.1 },
                    { name: 'Одноэтажный с цокольным этажом или подвалом', coefficient: 1.1 },
                    { name: 'Двухэтажный с цокольным этажом или подвалом', coefficient: 1.2 },
                  ],
                },
              ],
            },
            {
              name: 'servicesSections',
              type: 'array',
              label: {
                en: 'Services Sections',
                ru: 'Разделы услуг',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: {
                    en: 'Group Label',
                    ru: 'Заголовок группы',
                  },
                  required: true,
                },
                {
                  name: 'services',
                  type: 'array',
                  label: {
                    en: 'Services',
                    ru: 'Услуги',
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      label: {
                        en: 'Service Name',
                        ru: 'Название услуги',
                      },
                      required: false,
                    },
                    {
                      name: 'fieldType',
                      type: 'select',
                      label: {
                        en: 'Field Type',
                        ru: 'Тип поля',
                      },
                      options: [
                        { label: 'Радио кнопка', value: 'radio' },
                        { label: 'Чекбокс', value: 'checkbox' },
                      ],
                      defaultValue: 'checkbox',
                    },
                    {
                      name: 'pricePerM2',
                      type: 'number',
                      label: {
                        en: 'Price per m²',
                        ru: 'Цена за м²',
                      },
                      admin: {
                        condition: (_, siblingData) => !siblingData?.ignoreArea,
                      },
                    },
                    {
                      name: 'fixedPrice',
                      type: 'number',
                      label: {
                        en: 'Fixed Price',
                        ru: 'Фиксированная цена',
                      },
                      admin: {
                        condition: (_, siblingData) => siblingData?.ignoreArea === true,
                      },
                    },
                    {
                      name: 'ignoreArea',
                      type: 'checkbox',
                      label: {
                        en: 'Ignore Area',
                        ru: 'Не учитывать площадь',
                      },
                    },
                    {
                      name: 'isRequired',
                      type: 'checkbox',
                      label: {
                        en: 'Required Field',
                        ru: 'Обязательное поле',
                      },
                    },
                    {
                      name: 'isDefault',
                      type: 'checkbox',
                      label: {
                        en: 'Default Selected',
                        ru: 'Выбрано по умолчанию',
                      },
                    },
                    {
                      name: 'radioGroup',
                      type: 'text',
                      label: {
                        en: 'Radio Group',
                        ru: 'Группа радио кнопок',
                      },
                      admin: {
                        description: 'Для группировки радио кнопок (например: "opr-group")',
                        condition: (data) => data.fieldType === 'radio',
                      },
                    },
                    {
                      name: 'hasOptions',
                      type: 'checkbox',
                      label: {
                        en: 'Has Options',
                        ru: 'Есть варианты выбора',
                      },
                      admin: {
                        description: 'При выборе этой услуги появятся дополнительные варианты',
                      },
                    },
                    {
                      name: 'options',
                      type: 'array',
                      label: {
                        en: 'Service Options',
                        ru: 'Варианты услуги',
                      },
                      admin: {
                        condition: (_, siblingData) => siblingData?.hasOptions === true,
                      },
                      fields: [
                        {
                          name: 'name',
                          type: 'text',
                          label: {
                            en: 'Option Name',
                            ru: 'Название варианта',
                          },
                          required: true,
                        },
                        {
                          name: 'pricePerM2',
                          type: 'number',
                          label: {
                            en: 'Price per m²',
                            ru: 'Цена за м²',
                          },
                        },
                        {
                          name: 'description',
                          type: 'text',
                          label: {
                            en: 'Description',
                            ru: 'Описание',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
              defaultValue: [
                {
                  title: 'Общестроительные',
                  services: [
                    {
                      name: 'Объемно-планировочные решения (ОПР)',
                      fieldType: 'radio',
                      pricePerM2: 495,
                      isRequired: true,
                      isDefault: true,
                      radioGroup: 'opr-group',
                    },
                    {
                      name: 'Архитектурный проект (АР)',
                      fieldType: 'checkbox',
                      pricePerM2: 1105,
                      isDefault: true,
                    },
                    {
                      name: 'План застройки участка',
                      fieldType: 'checkbox',
                      fixedPrice: 19500,
                      ignoreArea: true,
                    },
                    {
                      name: 'Проект конструкций (КР)',
                      fieldType: 'checkbox',
                      pricePerM2: 915,
                    },
                  ],
                },
                {
                  title: 'Инженерные сети',
                  services: [
                    {
                      name: 'Проект наружных сетей здания',
                      fieldType: 'checkbox',
                      pricePerM2: 200,
                    },
                    {
                      name: 'Проект ливневой канализации',
                      fieldType: 'checkbox',
                      fixedPrice: 18000,
                      ignoreArea: true,
                    },
                    {
                      name: 'Проект внутренней канализации',
                      fieldType: 'checkbox',
                      pricePerM2: 260,
                    },
                    {
                      name: 'Проект системы вентиляции',
                      fieldType: 'checkbox',
                      pricePerM2: 260,
                      hasOptions: true,
                      options: [
                        {
                          name: 'Децентрализованная система',
                          pricePerM2: 260,
                          description:
                            'с притоком через клапаны (бризеры) и системой вытяжных воздуховодов',
                        },
                        {
                          name: 'Централизованная система',
                          pricePerM2: 340,
                          description:
                            'с приточно-вытяжной установкой, рекуператором, системой воздуховодов',
                        },
                      ],
                    },
                    {
                      name: 'Проект электроснабжения',
                      fieldType: 'checkbox',
                      pricePerM2: 230,
                    },
                  ],
                },
              ],
            },
            {
              name: 'additionalSections',
              type: 'array',
              label: {
                en: 'Additional Sections',
                ru: 'Дополнительные разделы',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: {
                    en: 'Group Label',
                    ru: 'Заголовок группы',
                  },
                  required: true,
                },
                {
                  name: 'fieldType',
                  type: 'select',
                  label: {
                    en: 'Field Type',
                    ru: 'Тип поля',
                  },
                  options: [
                    { label: 'Чекбоксы', value: 'checkbox' },
                    { label: 'Радио кнопки', value: 'radio' },
                  ],
                  defaultValue: 'checkbox',
                },
                {
                  name: 'elements',
                  type: 'array',
                  label: {
                    en: 'Elements',
                    ru: 'Элементы',
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      label: {
                        en: 'Element Name',
                        ru: 'Название элемента',
                      },
                      required: true,
                    },
                    {
                      name: 'price',
                      type: 'number',
                      label: {
                        en: 'Price',
                        ru: 'Цена',
                      },
                      required: true,
                    },
                    {
                      name: 'isDefault',
                      type: 'checkbox',
                      label: {
                        en: 'Default Selected',
                        ru: 'Выбрано по умолчанию',
                      },
                    },
                  ],
                },
              ],
              defaultValue: [
                {
                  title: 'Кровля',
                  fieldType: 'checkbox',
                  elements: [
                    {
                      name: 'Эксплуатируемая кровля',
                      price: 12000,
                    },
                  ],
                },
                {
                  title: 'Бассейн',
                  fieldType: 'radio',
                  elements: [
                    {
                      name: 'Монолитный бассейн или купель',
                      price: 12000,
                    },
                    {
                      name: 'Пластиковый (композитный) бассейн',
                      price: 3000,
                    },
                    {
                      name: 'нет бассейна',
                      price: 0,
                      isDefault: true,
                    },
                  ],
                },
                {
                  title: 'Погреб',
                  fieldType: 'radio',
                  elements: [
                    {
                      name: 'Монолитный погреб',
                      price: 9000,
                    },
                    {
                      name: 'Пластиковый погреб',
                      price: 2000,
                    },
                  ],
                },
              ],
            },
            {
              name: 'interfaceTexts',
              type: 'group',
              label: {
                en: 'Interface Texts',
                ru: 'Тексты интерфейса',
              },
              fields: [
                {
                  name: 'submitButtonText',
                  type: 'text',
                  label: {
                    en: 'Submit Button Text',
                    ru: 'Текст кнопки расчета',
                  },
                  defaultValue: 'Рассчитать стоимость',
                },
                {
                  name: 'resetButtonText',
                  type: 'text',
                  label: {
                    en: 'Reset Button Text',
                    ru: 'Текст кнопки сброса',
                  },
                  defaultValue: 'Сбросить',
                },
                {
                  name: 'totalPriceLabel',
                  type: 'text',
                  label: {
                    en: 'Total Price Label',
                    ru: 'Текст итоговой цены',
                  },
                  defaultValue: 'Стоимость всех разделов',
                },
                {
                  name: 'pricePerM2Label',
                  type: 'text',
                  label: {
                    en: 'Price per m² Label',
                    ru: 'Текст цены за м²',
                  },
                  defaultValue: 'Цена всех разделов за м²',
                },
                {
                  name: 'additionalElementsTitle',
                  type: 'text',
                  label: {
                    en: 'Additional Elements Title',
                    ru: 'Заголовок дополнительных элементов',
                  },
                  defaultValue: 'Дополнительные элементы',
                },
              ],
            },
            {
              name: 'resultPageSettings',
              type: 'group',
              label: {
                en: 'Result Page Settings',
                ru: 'Настройки страницы результата',
              },
              fields: [
                {
                  name: 'resultForm',
                  type: 'relationship',
                  label: {
                    en: 'Result Page Form',
                    ru: 'Форма на странице результата',
                  },
                  relationTo: 'forms',
                  admin: {
                    description: {
                      en: 'Form that will be displayed on the calculator result page',
                      ru: 'Форма, которая будет отображаться на странице результата калькулятора',
                    },
                  },
                },
                {
                  name: 'formShowButtonText',
                  type: 'text',
                  label: {
                    en: 'Form Show Button Text',
                    ru: 'Текст кнопки показа формы',
                  },
                },
                {
                  name: 'formHideButtonText',
                  type: 'text',
                  label: {
                    en: 'Form Hide Button Text',
                    ru: 'Текст кнопки скрытия формы',
                  },
                },
                {
                  name: 'downloadPdfButtonText',
                  type: 'text',
                  label: {
                    en: 'Download PDF Button Text',
                    ru: 'Текст кнопки скачивания PDF',
                  },
                },
                {
                  name: 'downloadPdfButtonLoadingText',
                  type: 'text',
                  label: {
                    en: 'Download PDF Button Loading Text',
                    ru: 'Текст кнопки при генерации PDF',
                  },
                },
                {
                  name: 'shareButtonText',
                  type: 'text',
                  label: {
                    en: 'Share Button Text',
                    ru: 'Текст кнопки поделиться',
                  },
                },
              ],
            },
            {
              name: 'instructions',
              type: 'group',
              label: {
                en: 'Instructions',
                ru: 'Инструкции',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: {
                    en: 'Instructions Title',
                    ru: 'Заголовок инструкции',
                  },
                },
                {
                  name: 'steps',
                  type: 'array',
                  label: {
                    en: 'Instruction Steps',
                    ru: 'Шаги инструкции',
                  },
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      label: {
                        en: 'Step Text',
                        ru: 'Текст шага',
                      },
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
