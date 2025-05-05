import { Radio } from './fields/Radio'
import { Checkbox } from './fields/Checkbox'
import { Email } from './fields/Email'
import { Message } from './fields/Message'
import { Number } from './fields/Number'
import { Select } from './fields/Select'
import { Text } from './fields/Text'
import { Textarea } from './fields/Textarea'
import { Upload } from './fields/Upload'

export type SupportedFieldTypes =
  | 'checkbox'
  | 'email'
  | 'message'
  | 'number'
  | 'radio'
  | 'select'
  | 'text'
  | 'textarea'
  | 'upload'

// Update the fields object with proper typing
export const fields: Record<SupportedFieldTypes, React.ComponentType<any>> = {
  checkbox: Checkbox,
  email: Email,
  message: Message,
  number: Number,
  radio: Radio,
  select: Select,
  text: Text,
  textarea: Textarea,
  upload: Upload,
}
