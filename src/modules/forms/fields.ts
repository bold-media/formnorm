import { Checkbox } from './fields/Checkbox'
import { Email } from './fields/Email'
import { Message } from './fields/Message'
import { Number } from './fields/Number'
import { Select } from './fields/Select'
import { Text } from './fields/Text'
import { Textarea } from './fields/Textarea'

export type SupportedFieldTypes =
  | 'checkbox'
  | 'email'
  | 'message'
  | 'number'
  | 'select'
  | 'text'
  | 'textarea'

// Update the fields object with proper typing
export const fields: Record<SupportedFieldTypes, React.ComponentType<any>> = {
  checkbox: Checkbox,
  email: Email,
  message: Message,
  number: Number,
  select: Select,
  text: Text,
  textarea: Textarea,
}
