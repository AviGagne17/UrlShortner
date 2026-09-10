import { useEffect, useState } from "react";
import { getUrls, deleteUrl, updateUrl } from "../services/urlService";

function UrlHistory() {

    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editedUrl, setEditedUrl] = useState("");

    useEffect(() => {

        const loadUrls = async () => {

            try {
                const result = await getUrls();

                setUrls(result);
            }
            catch (error) {
                console.error(error);
                setError("Failed to load URLs");
            }
            finally {
                setLoading(false);
            }
        };

        loadUrls();

    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteUrl(id);

            setUrls(urls.filter(url => url.shortUrl !== id));

            setToast("URL deleted successfully!");

            setTimeout(() => {
                setToast("");
            }, 3000);
        }
        catch (error) {
            console.error(error);
            setError("Failed to delete URL");
        }
    };

    const handleEdit = async (url) => {
        setEditingId(url.shortUrl);
        setEditedUrl(url.originalUrl);
    };

    const handleUpdate = async (id) => {
        try {
            const updatedUrl = await updateUrl(id, editedUrl);

            setUrls(
                urls.map(url =>
                    url.shortUrl === id
                        ? { ...url, originalUrl: updatedUrl }
                        : url
                )
            );

            setEditingId(null);
            setEditedUrl("");
            setToast("URL updated successfully!");

            setTimeout(() => {
                setToast("");
            }, 3000);
        }
        catch (error) {
            setError("Failed to update URL");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="mb-1">My URLs</h2>
                            <p className="text-muted mb-0">
                                Your shortened URLs
                            </p>
                        </div>
                    </div>

                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                            <p className="mt-3 text-muted">
                                Loading your URLs...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {!loading && !error && urls.length === 0 && (
                        <div className="text-center py-5">
                            <h5>No shortened URLs yet</h5>
                            <p className="text-muted">
                                Create your first shortened URL to see it here.
                            </p>
                        </div>
                    )}

                    {!loading && !error && urls.length > 0 && (
                        <div className="card shadow-sm">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">

                                    <thead className="table-light">
                                        <tr>
                                            <th>Original URL</th>
                                            <th>Short URL</th>
                                            <th>Created</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {urls.map((url) => (
                                            <tr key={url.shortUrl}>

                                                <td style={{ minWidth: "350px" }}>
                                                    {editingId === url.shortUrl ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={editedUrl}
                                                            onChange={(event) =>
                                                                setEditedUrl(event.target.value)
                                                            }
                                                        />
                                                    ) : (
                                                        <div
                                                            className="text-truncate"
                                                            style={{ maxWidth: "350px" }}
                                                            title={url.originalUrl}
                                                        >
                                                            {url.originalUrl}
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    <a
                                                        href={url.shortUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {url.shortUrl}
                                                    </a>
                                                </td>

                                                <td>
                                                    {new Date(
                                                        url.createdAt
                                                    ).toLocaleString()}
                                                </td>

                                                <td>

                                                    {editingId === url.shortUrl ? (
                                                        <button
                                                            className="btn btn-success btn-sm me-2"
                                                            onClick={() => handleUpdate(url.shortUrl)}
                                                        >
                                                            Update
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-primary btn-sm me-2"
                                                            onClick={() => handleEdit(url)}
                                                        >
                                                            Edit
                                                        </button>
                                                    )}

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(url.shortUrl)}
                                                    >
                                                        Delete
                                                    </button>

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    )}

                    {toast && (
                        <div className="position-fixed bottom-0 end-0 p-3">
                            <div className="alert alert-success shadow">
                                ✓ {toast}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UrlHistory;

