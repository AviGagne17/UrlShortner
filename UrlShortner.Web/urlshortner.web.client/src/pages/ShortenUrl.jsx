import { useState } from "react";
import { shortenUrl } from "../services/urlService";

function ShortenUrl() {

    const [originalUrl, setOriginalUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShorten = async (event) => {
        event.preventDefault();

        setError("");
        setShortUrl("");

        if (originalUrl.length === 0) {
            setError("Please enter a URL");
            return;
        }

        setLoading(true);

        try {
            const result = await shortenUrl(originalUrl);
            setShortUrl(result.shortUrl);
        }
        catch (error) {
            console.error(error);
            setError("failed to shorten url");
        }
        finally {
            setLoading(false);
        }
    };

    const handleCopy = async (event) => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
    }

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
                            disabled={loading}
                        >
                            {loading ? "loading..." : "Shorten URL"}
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

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCopy}
                                >
                                    {copied ? "✓ Copied" : "Copy"}
                                </button>
                            </div>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default ShortenUrl;