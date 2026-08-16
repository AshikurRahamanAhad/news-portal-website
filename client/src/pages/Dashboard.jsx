import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canWrite = user && (user.role === 'reporter' || user.role === 'admin');

  const load = () => {
    setLoading(true);
    api
      .get('/news/mine/list')
      .then((res) => setArticles(res.data.articles))
      .catch(() => setError('Could not load your articles'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (canWrite) load();
    else setLoading(false);
  }, [canWrite]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    try {
      await api.delete(`/news/${id}`);
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert('Could not delete this article');
    }
  };

  return (
    <div className="page-container">
      <div className="section-heading">
        <h2>Dashboard</h2>
        <span className="section-heading__rule" />
      </div>

      <p className="dashboard-welcome">
        Signed in as <strong>{user?.name}</strong> ({user?.role})
      </p>

      {!canWrite && <p className="state-message">Readers don't have articles to manage. Browse the front page instead.</p>}

      {canWrite && (
        <>
          <div className="dashboard-actions">
            <Link to="/write" className="nav-bar__cta">
              + New article
            </Link>
          </div>

          {loading && <p className="state-message">Loading your articles…</p>}
          {error && <p className="state-message state-message--error">{error}</p>}
          {!loading && articles.length === 0 && <p className="state-message">You haven't written anything yet.</p>}

          {!loading && articles.length > 0 && (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <Link to={`/article/${a.slug}`}>{a.title}</Link>
                    </td>
                    <td>{a.category}</td>
                    <td>{a.published ? 'Published' : 'Draft'}</td>
                    <td>{a.views}</td>
                    <td className="dashboard-table__actions">
                      <Link to={`/edit/${a._id}`}>Edit</Link>
                      <button className="link-button" onClick={() => handleDelete(a._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
