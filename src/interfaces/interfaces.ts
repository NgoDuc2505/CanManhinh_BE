interface IUser {
  userName: string;
  password: string;
  phone: string;
  address: string;
  dob: Date;
  roleID: number;
  dayCreated: Date;
}

interface IUserTokenDecode extends IUser {
  iat: number;
  exp: number;
}

interface IUserSecure {
  userName: string;
  phone: string;
  address: string;
  dob: Date;
  roleID: number;
  dayCreated: Date;
}

interface IUserCreateData {
  userName: string;
  password: string;
  phone: string;
  address: string;
  dob: Date;
}

export { IUser, IUserSecure, IUserCreateData, IUserTokenDecode };
