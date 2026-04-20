import { IUser } from "./user.type";

export type LoginInput = {
  email: string;
  password: string;
};

export interface IAccount {
  message: string;
  accessToken: string;
  user: IUser;
}

export interface IGetAccount {
  message: string;
  user: IUser;
}

