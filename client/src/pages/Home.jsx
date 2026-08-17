import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import NewsCard from '../components/NewsCard.jsx';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [data, setData] = useState({ articles: [], totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = { page, limit: 9 };
    if (category !== 'All') params.category = category;
    if (search) params.search = search;

    api
      .get('/news', { params })
      .then((res) => setData(res.data))
      .catch(() => setError('Could not load articles. server error.'))
      .finally(() => setLoading(false));
  }, [category, search, page]);

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
  };

  const [lead, ...rest] = data.articles;

  return (
    <div className="page-container">
      <div className="section-heading">
        <h2>{search ? `Results for "${search}"` : category === 'All' ? 'Latest Newses' : category}</h2>
        <span className="section-heading__rule" />
      </div>

      {loading && <p className="state-message">Loading Khobors…</p>}
      {error && <p className="state-message state-message--error">{error}</p>}
      {!loading && !error && data.articles.length === 0 && (
        <p className="state-message">No articles found yet. Check back soon.</p>
      )}

      {!loading && !error && lead && (
        <div className="news-grid">
          <NewsCard article={lead} featured />
          {rest.map((a) => (
            <NewsCard key={a._id} article={a} />
          ))}
        </div>
      )}

      {data.totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={p === page ? 'pagination__btn pagination__btn--active' : 'pagination__btn'}
              onClick={() => goToPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
