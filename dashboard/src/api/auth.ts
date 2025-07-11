import { handleErrors } from "@/lib/request";
import { buildUrlParams } from "@/lib/request/params";
import { requestUrl } from "@/lib/request/url";

import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:8001/api/v1",
    headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem('token')}`, // get token from local storage
    },
});

export const register = async (data: { name: string; email: string; password: string }) => api.post("auth/register", data);

export interface LoginParams {
    username: string;
    password: string;
}

export async function login(params: LoginParams) {
    const usp = buildUrlParams(params);

    await fetch(requestUrl("/api/v1/auth/login"), {
        method: "POST",
        body: usp,
        // headers: {
        //     ...(await authenticationHeaders()),
        //     "Content-Type": "application/x-www-form-urlencoded",
        // },
    }).then(handleErrors);
}
