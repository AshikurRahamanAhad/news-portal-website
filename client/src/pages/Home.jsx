import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import NewsCard from '../components/NewsCard';

const Home = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axiosInstance.get('/news');
        setNewsList(response.data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-slate-600 text-lg font-medium animate-pulse">
          Loading latest news...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-10 p-4 bg-red-50 border border-red-200 rounded-lg text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800">Top Stories</h1>
        <span className="text-sm text-slate-500">
          Showing {newsList.length} {newsList.length === 1 ? 'article' : 'articles'}
        </span>
      </div>

      {newsList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-lg">No news articles published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <NewsCard key={news._id} news={news} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;