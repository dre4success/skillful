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
}

export interface DataStoredInToken {
  _id: string;
}
