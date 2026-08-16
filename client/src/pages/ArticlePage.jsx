import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios.js';

const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setArticle(null);
    setError('');
    api
      .get(`/news/${slug}`)
      .then((res) => setArticle(res.data.article))
      .catch(() => setError('This article could not be found.'));
  }, [slug]);

  if (error) {
    return (
      <div className="page-container">
        <p className="state-message state-message--error">{error}</p>
        <Link to="/">← Back to the front page</Link>
      </div>
    );
  }

  if (!article) return <div className="page-container"><p className="state-message">Loading…</p></div>;

  return (
    <article className="article-page">
      <div className="article-page__meta">
        <span className="news-card__category">{article.category}</span>
        <span className="article-page__dateline">
          DISPATCH · {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <h1 className="article-page__title">{article.title}</h1>
      <p className="article-page__desc">{article.description}</p>
      <div className="article-page__byline">
        By {article.author?.name || 'Staff Writer'} · {article.views} views
      </div>

      {article.imageUrl && (
        <figure className="article-page__figure">
          <img src={article.imageUrl} alt={article.title} />
        </figure>
      )}

      <div className="article-page__content">
        {article.content.split('\n').filter(Boolean).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <Link to="/" className="article-page__back">
        ← Back to the front page
      </Link>
    </article>
  );
};

export default ArticlePage;
