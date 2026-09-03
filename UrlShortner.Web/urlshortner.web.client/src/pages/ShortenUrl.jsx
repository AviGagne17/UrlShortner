import { useState } from "react";
import { shortenUrl } from "../services/urlService";

function ShortenUrl() {

    const [originalUrl, setOriginalUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [error, setError] = useState("");

    const handleShorten = async (event) => {
        event.preventDefault();

        setError("");
        setShortUrl("");

        if (originalUrl.length === 0) {
            setError("Please enter a URL");
            return;
        }

        try {
            const result = await shortenUrl(originalUrl);
            setShortUrl(result.shortUrl);
        }
        catch (error) {
            console.error(error);
            setError("failed to shorten url");
        }
    };

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-8">

                    <h2 className="mb-4">
                        Shorten URL
                    </h2>

                    <form onSubmit={handleShorten}>

                        <div className="mb-3">

                            <label
                                htmlFor="originalUrl"
                                className="form-label"
                            >
                                Original URL
                            </label>

                            <input
                                type="url"
                                id="originalUrl"
                                className="form-control"
                                placeholder="https://example.com/your-long-url"
                                value={originalUrl}
                                onChange={(event) =>
                                    setOriginalUrl(event.target.value)
                                }
                                required
                            />

                        </div>

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Shorten URL
                        </button>

                    </form>

                    {shortUrl && (
                        <div className="mt-4">

                            <label className="form-label">
                                Your short URL
                            </label>

                            <div className="input-group">

                                <input
                                    type="text"
                                    className="form-control"
                                    value={shortUrl}
                                    readOnly
                                />

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default ShortenUrl;