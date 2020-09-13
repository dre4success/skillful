import { ObjectID } from 'mongodb';

export interface Signup {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phoneNumber: string;
  interest: string;
  skill: string;
  bio: string;
  profilePicture: string;
  createdAt: Date;
}

export interface UpdateProfile {
  firstname: string;
  lastname: string;
  interest: string;
  bio: string;
  skill: string;
  profilePicture: string;
  updatedAt: Date;
}

export interface DataStoredInToken {
  _id: string;
}

export interface Post {
  title: string;
  body: string;
  image: string;
  userID: ObjectID;
  createdAt: Date;
  updatedAt: Date;
}
