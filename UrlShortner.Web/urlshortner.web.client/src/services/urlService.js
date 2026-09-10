import axios from "axios";

export const shortenUrl = async (originalUrl) => {
    const response = await axios.post(
        "https://localhost:7148/api/UrlShortner/AddUrl",
        {
            OriginalUrl:originalUrl,
            UserId:"test2@test.com"
        },
        {
            withCredentials: true
        }
    );

    return response.data;
}

export const getUrls = async () => {
    const response = await axios.get(
        "https://localhost:7148/api/UrlShortner/All",
        {
            withCredentials: true
        }
    );

    return response.data;
}

export const deleteUrl = async (id) => {
    const response = await axios.delete(
        `https://localhost:7148/api/UrlShortner/${id}`,
        {
            withCredentials: true
        }
    );

    return response.data;
};

export const updateUrl = async (id, originalUrl) => {
    const response = await axios.patch(
        `https://localhost:7148/api/UrlShortner/${id}`,
        {
            originalUrl: originalUrl
        },
        {
            withCredentials: true
        }
    );

    return response.data;
};