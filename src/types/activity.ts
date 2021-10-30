export interface ActivityAttendee {
  Name: string,
  UserId: string,
}

export interface ActivityItem {
  Category: string,
  City: string,
  Comments: [],
  Date: string,
  Description: string,
  Id: string,
  Title: string,
  Venue: string,
  AuthorName: string,
  AuthorId: string,
  Attendees: ActivityAttendee[],
  IsCancelled: boolean,
}

export interface CreateActivityPayload {
  Id?: string,
  Title: string,
  Description: string,
  Category: string,
  Date: string,
  City: string,
  Venue: string,
}

export interface ActivityFiltersPayload {
  DateSort: 'Asc' | 'Desc',
  Title?: string,
  DateFrom?: string,
  DateTo?: string,
  Categories?: string[],
  Cities?: string[],
  IsMy?: boolean,
  Attending?: boolean,
}
