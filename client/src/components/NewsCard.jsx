import { Link } from 'react-router-dom';

const NewsCard = ({ news }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {news.imageUrl && (
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-5 flex flex-col grow">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
          {news.category || 'General'}
        </span>
        <h2 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
          {news.title}
        </h2>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3 grow">
          {news.content}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>By {news.author?.name || 'Reporter'}</span>
          <Link
            to={`/news/${news._id}`}
            className="text-blue-600 hover:underline font-semibold"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;