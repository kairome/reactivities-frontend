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
}
