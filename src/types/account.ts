export interface LoginPayload {
  Login: string,
  Password: string,
}


export interface RegisterPayload {
  UserName: string,
  DisplayName: string,
  Email?: string,
  Password: string,
}

