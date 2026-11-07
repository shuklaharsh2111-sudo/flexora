const API_URL = "/api";
export const api = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
            `Server returned an invalid response (${response.status}). Please check the API URL.`
        );
    }
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
    }
    return data;
};
