import News from '../models/News.js';

// Get top 5 trending/popular news
export const getTopNews = async (req, res) => {
  try {
    const news = await News.find()
      .populate('author', 'name avatar')
      .sort({ views: -1 })
      .limit(5);
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all news (with category filter & search)
export const getAllNews = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const news = await News.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single news by ID & increment view count
export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name avatar bio');

    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    // Increment views counter
    news.views += 1;
    await news.save();

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get news published by logged-in reporter
export const getMyNews = async (req, res) => {
  try {
    const news = await News.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create news (Reporters/Admins only)
export const createNews = async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;

    if (!title || !content || !imageUrl) {
      return res.status(400).json({ message: 'Please provide title, content, and imageUrl' });
    }

    const news = await News.create({
      title,
      content,
      category: category || 'General',
      imageUrl,
      author: req.user._id,
    });

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update news (Author or Admin only)
export const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    // Check ownership or admin status
    if (news.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this news article' });
    }

    news.title = req.body.title || news.title;
    news.content = req.body.content || news.content;
    news.category = req.body.category || news.category;
    news.imageUrl = req.body.imageUrl || news.imageUrl;

    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete news (Author or Admin only)
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    // Check ownership or admin status
    if (news.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this news article' });
    }

    await news.deleteOne();
    res.json({ message: 'News article removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};