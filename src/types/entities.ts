import { MultiValue, SingleValue } from 'react-select';

export interface SelectOption {
  value: string,
  label: string,
}

export type SingleSelectOption = SingleValue<SelectOption>;
export type MultiSelectOption = MultiValue<SelectOption>;

export interface AlertItem {
  id: string,
  title: string,
  type: 'success' | 'info' | 'error',
  timeout?: number,
}

export type SpawnAlert = (a: Omit<AlertItem, 'id'>) => void;

export type ValidationErrors = {
  [k: string]: string[],
};
