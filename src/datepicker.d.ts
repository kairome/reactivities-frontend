import React from 'react';

declare module 'react-datetime-picker' {
  interface Props {
    disabled?: boolean,
    disableCalendar?: boolean,
    disableClock?: boolean,
    format?: string,
    hourPlaceholder?: string,
    isCalendarOpen?: boolean,
    isClockOpen?: boolean,
    name?: string,
    onChange: (v: Date | null) => void,
    value: Date | null,
  }

  export default class DateTimePicker extends React.Component<Props, any> {}

}
