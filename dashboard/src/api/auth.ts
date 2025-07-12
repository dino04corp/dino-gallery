import { handleErrors } from "@/lib/request";
import { buildUrlParams } from "@/lib/request/params";
import { requestUrl } from "@/lib/request/url";

export interface LoginParams {
    username: string;
    password: string;
}

export interface RegisterParams {
    username: string;
    password: string;
    name: string;
}

export async function login(params: LoginParams) {
    const usp = buildUrlParams(params);
    console.log();

    await fetch(requestUrl("/api/v1/auth/login"), {
        method: "POST",
        body: usp,
        headers: {
            // "Content-Type": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            // ...(await authenticationHeaders()),
        },
    }).then(handleErrors);
}

export async function register(params: LoginParams) {
    const usp = buildUrlParams(params);

    await fetch(requestUrl("/api/v1/auth/register"), {
        method: "POST",
        body: usp,
        // headers: {
        //     ...(await authenticationHeaders()),
        //     "Content-Type": "application/x-www-form-urlencoded",
        // },
    }).then(handleErrors);
}
