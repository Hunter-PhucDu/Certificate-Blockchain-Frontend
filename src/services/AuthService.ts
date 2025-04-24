import { axiosService } from "@/lib/axios";
import type { ApiResponse } from "@/services/api/types";

export interface SignInBody {
  username: string;
  password: string;
}

export interface SignInData {
  accessToken: string;
  refreshToken: string;
}

export const AuthService = {
  adminSignIn: (body: SignInBody): Promise<SignInData> =>
    axiosService
      .post<ApiResponse<SignInData>>("/auth/admin/sign-in", body)
      .then((apiResp: ApiResponse<SignInData>) => apiResp.data),
};
