import { normalizeServerErrors } from "@/lib/request/index";

export async function handleErrors(responseOrPromise: Response | PromiseLike<Response>): Promise<Response> {
    const response = await responseOrPromise;
    if (response.ok) {
        return response;
    }

    try {
        const jsonBody = await response.clone().json();
        return Promise.reject(normalizeServerErrors(response, jsonBody));
    } catch {
        try {
            const textBody = await response.clone().text();
            return Promise.reject(normalizeServerErrors(response, textBody));
        } catch {
            return Promise.reject(normalizeServerErrors(response, `${response.status} ${response.statusText}`));
        }
    }
}
