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