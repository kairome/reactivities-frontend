import React, { useEffect, useState } from 'react';
import { ActivityFiltersPayload } from 'types/activity';

import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import _ from 'lodash';
import Radio from 'ui/Radio/Radio';
import Button from 'ui/Button/Button';
import Select from 'ui/Select/Select';
import { MultiSelectOption, SelectOption } from 'types/entities';
import { useQuery } from 'react-query';
import { fetchCategories, fetchCities } from 'api/activities';
import Input from 'ui/Input/Input';
import queryString from 'query-string';

import s from './Activities.css';
import history from 'utils/history';

interface Props {
  filters: ActivityFiltersPayload,
  onChange: (v: ActivityFiltersPayload) => void,
  onClear: () => void,
}

const ActivityFilters: React.FC<Props> = (props) => {
  const { filters } = props;

  const [dateSwitcherValue, setDateSwitcherValue] = useState('range');

  const { data: categories } = useQuery(fetchCategories.name, fetchCategories.request);
  const { data: cities } = useQuery(fetchCities.name, fetchCities.request);

  useEffect(() => {
    const search = history.location.search;
    if (search) {
      const parsed = queryString.parse(search);
      props.onChange({
        ...filters,
        ...parsed,
      });
    }
  }, []);

  const handleCalendarChange = (dates: Date[] | Date) => {
    if (_.isArray(dates)) {
      const [from, to] = dates;
      props.onChange({
        ...filters,
        DateFrom: dayjs(from).format('YYYY-MM-DD'),
        DateTo: dayjs(to).format('YYYY-MM-DD'),
      });
      return;
    }

    props.onChange({
      ...filters,
      DateFrom: dayjs(dates).format('YYYY-MM-DD'),
      DateTo: undefined,
    });
  };

  const handleClearDate = () => {
    props.onChange({
      ...filters,
      DateFrom: undefined,
      DateTo: undefined,
    });
  };

  const handleDateModeChange = (e: React.FormEvent<HTMLInputElement>) => {
    setDateSwitcherValue(e.currentTarget.value);
  };

  const getCalendarValues = () => {
    if (!filters.DateTo && filters.DateFrom) {
      return new Date(filters.DateFrom);
    }

    if (filters.DateTo && filters.DateFrom) {
      return [new Date(filters.DateFrom), new Date(filters.DateTo)];
    }

    return null;
  };

  const handleCategoriesChange = (values: MultiSelectOption) => {
    props.onChange({
      ...filters,
      Categories: !_.isEmpty(values) ? _.map(values, v => v.value) : undefined,
    });
  };

  const handleParticipationChange = (values: MultiSelectOption) => {
    const newFilters = { ...filters };

    newFilters.IsMy = !_.isEmpty(_.find(values, v => v.value === 'host'));
    newFilters.Attending = !_.isEmpty(_.find(values, v => v.value === 'attendee'));
    newFilters.Following = !_.isEmpty(_.find(values, v => v.value === 'follower'));
    props.onChange(newFilters);
  };

  const handleCitiesChange = (values: MultiSelectOption) => {
    props.onChange({
      ...filters,
      Cities: !_.isEmpty(values) ? _.map(values, v => v.value) : undefined,
    });
  };

  const handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    props.onChange({
      ...filters,
      Title: e.currentTarget.value,
    });
  };

  const participationOptions: SelectOption[] = [
    {
      label: 'Hosting',
      value: 'host',
    },
    {
      label: 'Attending',
      value: 'attendee',
    },
    {
      label: 'Following',
      value: 'follower',
    },
  ];

  const getParticipationValues = () => {
    return _.reduce(participationOptions, (acc, option) => {
      if (filters.IsMy && option.value === 'host') {
        return [...acc, option.value];
      }

      if (filters.Attending && option.value === 'attendee') {
        return [...acc, option.value];
      }

      if (filters.Following && option.value === 'follower') {
        return [...acc, option.value];
      }

      return acc;
    }, [] as string[]);
  };

  const dateSwitcher = [
    { label: 'Select range ', value: 'range' },
    { label: 'Select date', value: 'date' },
  ];


  return (
    <div className={s.filters}>
      <div className={s.filtersTitle}>Filters</div>
      <Input
        type="text"
        value={filters.Title ?? ''}
        label="Title"
        onChange={handleTitleChange}
      />
      <div>
        <Select
          label="Participation"
          value={getParticipationValues()}
          options={participationOptions}
          onChange={handleParticipationChange}
          placeholder="Select participation options"
          className={s.selectWrapper}
          multi
        />
        <Select
          label="Categories"
          value={filters.Categories}
          options={_.map(categories, c => ({ value: c, label: c }))}
          onChange={handleCategoriesChange}
          placeholder="Select categories"
          className={s.selectWrapper}
          multi
        />
        <Select
          label="Cities"
          value={filters.Cities}
          options={_.map(cities, c => ({ value: c, label: c }))}
          onChange={handleCitiesChange}
          placeholder="Select cities"
          className={s.selectWrapper}
          multi
        />
      </div>
      <div>
        <div className={s.filterLabel}>Filter by date</div>
        <Radio
          name="dateSwitcher"
          items={dateSwitcher}
          value={dateSwitcherValue}
          onChange={handleDateModeChange}
        />
        <div className={s.clearDate} onClick={handleClearDate}>Clear date</div>
        <Calendar
          onChange={handleCalendarChange}
          value={getCalendarValues()}
          selectRange={dateSwitcherValue === 'range'}
        />
      </div>
      <Button
        theme="danger"
        text="Clear all filters"
        onClick={props.onClear}
        className={s.clearBtn}
      />
    </div>
  );
};

export default ActivityFilters;
