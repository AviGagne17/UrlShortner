import axios from "axios";

export const login = async (email, password) => {
    const response = await axios.post(
        "https://localhost:7148/api/Auth/login",
        {
            email: email,
            password: password
        },
        {
            withCredentials: true
        }
    );

    return response.data;
}

export const checkAuthentication = async () => {
    try {
        await axios.get(
            "https://localhost:7148/api/Auth/me",
            {
                withCredentials: true
            }
        );

        return true;
    }
    catch {
        return false;
    }
};