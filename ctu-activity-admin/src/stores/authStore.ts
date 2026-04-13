import { IUser } from "@/types/user.type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface IAuthUser {
  id: string | null;
  email: string;
  fullName: string;
  studentCode: string | null;
  status: "ACTIVE" | "BANNED" | "";
  avatarUrl: string | null;
  unitId: number | null;
  role: string;
  permissions?: {
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];
}

interface IAuthState {
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshToken: boolean;
  accessToken: string;
  errorRefreshToken: string;
  authUser: IAuthUser;
}

const initialAuthState: IAuthState = {
  isLoggingIn: false,
  isSigningUp: false,
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  accessToken: "",
  errorRefreshToken: "",
  authUser: {
    id: null,
    email: "",
    fullName: "",
    studentCode: null,
    status: "",
    avatarUrl: null,
    unitId: null,
    role: "",
    permissions: [],
  },
};

type authAction = {
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setIsLoggingIn: (value: boolean) => void;
  setIsSigningUp: (value: boolean) => void;
  loginAction: (data: { accessToken: string; user: IAuthUser }) => void;
  logOutAction: () => void;
  setRefreshTokenAction: (status: boolean, message: string) => void;
  setTokenToTestApi: () => void;
  fetchAccountAction: (user: IUser) => void;
  resetAuthAction: () => void;
};

export const useAuthStore = create<IAuthState & authAction>()(
  persist(
    (set, get) => ({
      ...initialAuthState,

      setAuthenticated: (value) => set({ isAuthenticated: value }),

      setLoading: (value) => set({ isLoading: value }),

      loginAction: ({ accessToken, user }) => {
        set((prev) => ({
          isAuthenticated: true,
          authUser: {
            ...prev.authUser,
            ...user,
          },
          isLoading: false,
          accessToken: accessToken,
        }));
      },

      logOutAction: () => {
        set({
          accessToken: "",
          isLoading: false,
          isAuthenticated: false,
          authUser: initialAuthState.authUser,
        });
      },

      setRefreshTokenAction: (status, message) => {
        set({
          isRefreshToken: status,
          errorRefreshToken: message,
          accessToken: "",
          isAuthenticated: false,
        });
      },

      setTokenToTestApi: () => {
        set({ accessToken: "" });
      },

      fetchAccountAction: (user) => {
        set({
          isAuthenticated: true,
          isLoading: false,
          authUser: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            studentCode: user.studentCode,
            status: user.status,
            avatarUrl: user.avatarUrl,
            unitId: user.unitId,
            role: user.role,
            permissions: user.permissions || [],
          },
        });
      },
      resetAuthAction: () => {
        set({
          isAuthenticated: false,
          accessToken: "",
          authUser: initialAuthState.authUser,
          isLoading: false,
        });
      },

      setIsLoggingIn: (value) => set({ isLoggingIn: value }),

      setIsSigningUp: (value) => set({ isSigningUp: value }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
