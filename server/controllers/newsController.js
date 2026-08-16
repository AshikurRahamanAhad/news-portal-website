import News from '../models/News.js';

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name email');
    if (!news) return res.status(404).json({ message: 'News article not found' });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createNews = async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;
    const news = await News.create({
      title,
      content,
      category,
      imageUrl,
      author: req.user.id,
    });
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};