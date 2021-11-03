export interface UpdateUserPayload {
  Name: string,
  Email: string,
  Bio: string,
}

export interface UserPhoto {
  Id: string,
  Url: string,
}

export interface CurrentUser {
  DisplayName: string,
  Id: string,
  Email: string | null,
  Bio: string,
  UserName: string,
  ProfilePhoto: UserPhoto | null,
  Photos: UserPhoto[],
  Notifications: UserNotification[],
}

export interface UserProfileItem {
  Id: string,
  Name: string,
  PhotoUrl: string,
  Bio: string,
}

export enum UserNotificationType {
  Edited = 'Edited',
  Deleted = 'Deleted',
  Cancelled = 'Cancelled',
  Activated = 'Activated',
  NewMessages = 'NewMessages',
}

export interface UserNotification {
  ActivityId: string,
  ActivityTitle: string,
  CreatedAt: string,
  Id: string,
  IsRead: boolean,
  Type: UserNotificationType,
}

export interface UserActivitiesStats {
  ActivitiesHosting: number,
  ActivitiesFollowing: number,
  ActivitiesAttending: number,
}
