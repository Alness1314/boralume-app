import { TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import { useController } from 'react-hook-form'
import type { FieldValues, UseControllerProps } from 'react-hook-form'

type FormTextFieldProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<
    TextFieldProps,
    'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'inputRef' | 'error'
  >

/** Shared form binding: validation, focus and accessible helper text in one place. */
export function FormTextField<T extends FieldValues>({
  name,
  control,
  rules,
  shouldUnregister,
  defaultValue,
  helperText,
  ...props
}: FormTextFieldProps<T>) {
  const {
    field: { ref, ...field },
    fieldState,
  } = useController({ name, control, rules, shouldUnregister, defaultValue })
  return (
    <TextField
      {...props}
      {...field}
      id={props.id ?? name}
      inputRef={ref}
      fullWidth
      error={Boolean(fieldState.error)}
      helperText={fieldState.error?.message ?? helperText}
    />
  )
}
