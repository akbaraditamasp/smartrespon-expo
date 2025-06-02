import { UserModel } from "@/api/user";
import { create } from "zustand";

interface UserState {
  user: UserModel | null;
  token: string | null;
  setUser: (user: UserModel | null) => void;
  tokenize: (token: string | null) => void;
}

const useUserStore = create<UserState>()((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  tokenize: (token) => set({ token }),
}));

export default useUserStore;
