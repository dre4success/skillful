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

export interface UpdateProfile {
  firstname: string;
  lastname: string;
  interest: string;
  bio: string;
  skill: string;
  profilePicture: string;
}

export interface DataStoredInToken {
  _id: string;
}
