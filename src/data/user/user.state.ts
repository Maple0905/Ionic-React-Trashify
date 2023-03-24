export interface UserState {
  isLoggedin: boolean;
  username?: string;
  email?: string;
  role?: string;
  darkMode: boolean;
  hasSeenTutorial: boolean;
  loading: boolean;
};
