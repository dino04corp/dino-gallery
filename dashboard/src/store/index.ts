import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";

// const roles = z.enum(['admin', 'user']);

// type Role = z.infer<typeof roles>;

const TokenDataSchema = z.object({
    userId: z.string(),
    // roles,
});

type TokenData = z.infer<typeof TokenDataSchema>;

export interface AuthState {
    accessToken: string | null;
    accessTokenData: TokenData | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setAccessToken: (data: string) => void;
    clearTokens: () => void;
}

export const decodeAccessToken = (accessToken: string) => {
    const decoded = jwtDecode<TokenData>(accessToken);
    console.log("Decoded JWT:", decoded);
    return TokenDataSchema.parse(decoded);
};

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                accessToken: null,
                accessTokenData: null,
                refreshToken: null,
                isAuthenticated: false,
                setAccessToken: (accessToken: string | null) => {
                    const accessTokenData = (() => {
                        try {
                            return accessToken ? decodeAccessToken(accessToken) : null;
                        } catch (error) {
                            console.error(error);
                            return null;
                        }
                    })();

                    console.log("---accessTokenData---", accessTokenData);
                    set({
                        accessToken,
                        accessTokenData,
                        isAuthenticated: true,
                    });
                },
                clearTokens: () => {
                    set({
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                    });
                    localStorage.removeItem("token-store"); // Xóa dữ liệu persist
                },
            }),
            { name: "token-store" }
        )
    )
);

// type AuthState = {
//   accessToken: string | null;
//   accessTokenData: TokenData | null;
//   refreshToken: string | null;
//   isAuthenticated: boolean;
//   actions: {
//     setAccessToken: (accessToken: string | null) => void;
//     setRefreshToken: (refreshToken: string | null) => void;
//     // set tokens on the app start
//     init: () => void;
//     clearTokens: () => void;
//   };
// };

// export const authStore = createStore<AuthState>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         accessToken: null,
//         accessTokenData: null,
//         refreshToken: null,
//         isAuthenticated: false,

//         actions: {
//           setAccessToken: (accessToken: string | null) => {
//             const accessTokenData = (() => {
//               try {
//                 return accessToken ? decodeAccessToken(accessToken) : null;
//               } catch (error) {
//                 console.error(error);
//                 return null;
//               }
//             })();

//             console.log('------', accessTokenData, !!accessTokenData);
//             set({
//               accessToken,
//               accessTokenData,
//               isAuthenticated: !!accessTokenData,
//             });
//           },
//           setRefreshToken: (refreshToken: string | null) =>
//             set({
//               refreshToken,
//             }),
//           init: () => {
//             const { setAccessToken, setRefreshToken } = get().actions;
//             setAccessToken(CookieService.get(ACCESS_TOKEN_KEY));
//             setRefreshToken(CookieService.get(REFRESH_TOKEN_KEY));
//           },
//           clearTokens: () => {
//             set({
//               accessToken: null,
//               accessTokenData: null,
//               refreshToken: null,
//               isAuthenticated: false,
//             });
//             localStorage.removeItem('token-store'); // Xóa dữ liệu persist
//           },
//         },
//       }),
//       {
//         name: 'token-store',
//         // enabled: !import.meta.env.PROD,
//         // onRehydrateStorage: () => (state) => {
//         //   console.log('Rehydrating state:', state);
//         // },
//         // Gọi hàm khi khôi phục trạng thái từ localStorage. Có thể thêm logic kiểm tra token đã hết hạn hay chưa.
//       }
//     )
//   )
// );

// /**
//  * Required for zustand stores, as the lib doesn't expose this type
//  */
// export type ExtractState<S> = S extends {
//   getState: () => infer T;
// }
//   ? T
//   : never;

// type Params<U> = Parameters<typeof useStore<typeof authStore, U>>;

// // Selectors
// const accessTokenSelector = (state: ExtractState<typeof authStore>) =>
//   state.accessToken;
// const accessTokenDataSelector = (state: ExtractState<typeof authStore>) =>
//   state.accessTokenData;
// const refreshTokenSelector = (state: ExtractState<typeof authStore>) =>
//   state.refreshToken;
// const isAuthenticatedSelector = (state: ExtractState<typeof authStore>) =>
//   state.isAuthenticated;
// const actionsSelector = (state: ExtractState<typeof authStore>) =>
//   state.actions;

// // getters
// export const getAccessToken = () => accessTokenSelector(authStore.getState());
// export const getAccessTokenData = () =>
//   accessTokenDataSelector(authStore.getState());
// export const getRefreshToken = () => refreshTokenSelector(authStore.getState());
// export const getIsAuthenticated = () =>
//   isAuthenticatedSelector(authStore.getState());
// export const getActions = () => actionsSelector(authStore.getState());

// function useAuthStore<U>(selector: Params<U>[1]) {
//   return useStore(authStore, selector);
// }

// // Hooks
// export const useAccessToken = () => useAuthStore(accessTokenSelector);
// export const useAccessTokenData = () => useAuthStore(accessTokenDataSelector);
// export const useRefreshToken = () => useAuthStore(refreshTokenSelector);
// export const useActions = () => useAuthStore(actionsSelector);
