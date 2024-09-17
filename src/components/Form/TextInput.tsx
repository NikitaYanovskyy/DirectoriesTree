// External
import { ChangeEvent, FC } from 'react';
import { Control, RegisterOptions, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

// Internal
import styles from './index.module.scss';

export interface Props {
  className?: string;
  label?: string;
  name: string;
  control: Control<any, any>;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  rules?: Pick<
    RegisterOptions,
    'maxLength' | 'minLength' | 'validate' | 'required'
  >;
}

export const TextInput: FC<Props> = ({
  name,
  control,
  rules,
  className,
  label,
  onChange,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, formState: { errors } }) => (
        <div className={`${styles.root} ${className}`}>
          {label && (
            <label htmlFor={name} className={styles.label}>
              {label}
            </label>
          )}
          <input
            {...field}
            name={name}
            onChange={(e) => {
              field.onChange(e);

              onChange && onChange(e);
            }}
          />

          <p className={styles.error}>
            <ErrorMessage errors={errors} name={name} />
          </p>
        </div>
      )}
    />
  );
};
