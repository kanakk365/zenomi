import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name: string;
    countryCode: string;
    mobileNo: string;
}

interface AuthState {
    accessToken: string;
    refreshToken: string;
    user: User | null;
    setAuth: (data: { accessToken?: string; refreshToken?: string; user?: User | null }) => void;
    logout:()=>void;
}

export const useAuthStore = create<AuthState>()(

    persist((set)=>({
        accessToken: '',
        refreshToken: '',
        user: null,
        setAuth: (data) => set((state)=>({...state,...data})),
        logout: () => set({ accessToken: '', refreshToken: '', user: null }),
    }),{
        name: 'auth-storage',
        storage: createJSONStorage(()=>localStorage),
    }),
)

export const useIsAuthenticated = () => {
    return useAuthStore((state) => !!state.accessToken && !!state.user);
}