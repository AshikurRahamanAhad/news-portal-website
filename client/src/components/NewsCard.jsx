import { Link } from 'react-router-dom';

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NewsCard = ({ article, featured = false }) => {
  return (
    <article className={`news-card ${featured ? 'news-card--featured' : ''}`}>
      <Link to={`/article/${article.slug}`} className="news-card__media">
        {article.imageUrl ? (
          <img src={article.imageUrl} alt={article.title} loading="lazy" />
        ) : (
          <div className="news-card__media-fallback" aria-hidden="true">
            {article.category}
          </div>
        )}
      </Link>
      <div className="news-card__body">
        <span className="news-card__category">{article.category}</span>
        <h3 className="news-card__title">
          <Link to={`/article/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="news-card__desc">{article.description}</p>
        <div className="news-card__meta">
          <span>{article.author?.name || 'Staff Writer'}</span>
          <span>·</span>
          <span>{timeAgo(article.createdAt)}</span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
