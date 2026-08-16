import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';

const CATEGORIES = ['Politics', 'World', 'Business', 'Technology', 'Sports', 'Entertainment', 'Science', 'Health'];

const WriteNews = () => {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    imageUrl: '',
    category: CATEGORIES[0],
    published: true,
  });
  const [imageMode, setImageMode] = useState('link'); // 'link' | 'upload'
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    api.get('/news/mine/list').then((res) => {
      const found = res.data.articles.find((a) => a._id === id);
      if (found) setForm(found);
    });
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError('Image is too large. Please use a file under 4MB or paste an image link instead.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, imageUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isEditing) {
        await api.put(`/news/${id}`, form);
      } else {
        await api.post('/news', form);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the article');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="write-page">
      <h2>{isEditing ? 'Edit article' : 'Write news'}</h2>
      <form className="write-form" onSubmit={handleSubmit}>
        {error && <p className="state-message state-message--error">{error}</p>}

        <label>
          Title
          <input type="text" name="title" value={form.title} onChange={handleChange} required maxLength={180} />
        </label>

        <label>
          Short description
          <textarea name="description" value={form.description} onChange={handleChange} required maxLength={300} rows={2} />
        </label>

        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="image-field">
          <legend>Article image</legend>
          <div className="image-field__toggle">
            <button type="button" className={imageMode === 'link' ? 'active' : ''} onClick={() => setImageMode('link')}>
              Paste image link
            </button>
            <button type="button" className={imageMode === 'upload' ? 'active' : ''} onClick={() => setImageMode('upload')}>
              Upload image
            </button>
          </div>

          {imageMode === 'link' ? (
            <input
              type="url"
              name="imageUrl"
              placeholder="https://example.com/photo.jpg"
              value={form.imageUrl?.startsWith('data:') ? '' : form.imageUrl}
              onChange={handleChange}
            />
          ) : (
            <input type="file" accept="image/*" onChange={handleFileChange} />
          )}

          {form.imageUrl && (
            <img src={form.imageUrl} alt="Preview" className="image-field__preview" />
          )}
        </fieldset>

        <label>
          Content
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={12}
            placeholder="Write the full article. Separate paragraphs with a blank line."
          />
        </label>

        <label className="checkbox-label">
          <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
          Publish immediately
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Publish article'}
        </button>
      </form>
    </div>
  );
};

export default WriteNews;
