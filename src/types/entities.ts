import { MultiValue, SingleValue } from 'react-select';
import React from 'react';

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

export type InputEventElement = HTMLInputElement | HTMLTextAreaElement;

export type InputEvent = React.FormEvent<InputEventElement>;

export interface TabItem {
  id: string,
  title: string,
}
