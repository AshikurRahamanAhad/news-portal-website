import News from '../models/News.js';

// @route  GET /api/news
// @query  category, search, page, limit, author
// @desc   Public: list published articles with optional filtering, search & pagination
export const getNews = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 9, author } = req.query;

    const query = { published: true };
    if (category && category !== 'All') query.category = category;
    if (author) query.author = author;
    if (search) query.$text = { $search: search };

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 9, 1);

    const [articles, total] = await Promise.all([
      News.find(query)
        .populate('author', 'name role')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      News.countDocuments(query),
    ]);

    res.json({
      articles,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch news', error: err.message });
  }
};

// @route  GET /api/news/:slug
export const getNewsBySlug = async (req, res) => {
  try {
    const article = await News.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name role');

    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ article });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch article', error: err.message });
  }
};

// @route  POST /api/news
// @access reporter, admin
export const createNews = async (req, res) => {
  try {
    const { title, description, content, imageUrl, category, published } = req.body;

    if (!title || !description || !content || !category) {
      return res.status(400).json({ message: 'Title, description, content and category are required' });
    }

    const article = await News.create({
      title,
      description,
      content,
      imageUrl,
      category,
      published: published !== undefined ? published : true,
      author: req.user._id,
    });

    res.status(201).json({ article });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create article', error: err.message });
  }
};

// @route  PUT /api/news/:id
// @access reporter (own articles only), admin (any article)
export const updateNews = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const isOwner = article.author.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'You can only edit your own articles' });
    }

    const { title, description, content, imageUrl, category, published } = req.body;
    if (title !== undefined) article.title = title;
    if (description !== undefined) article.description = description;
    if (content !== undefined) article.content = content;
    if (imageUrl !== undefined) article.imageUrl = imageUrl;
    if (category !== undefined) article.category = category;
    if (published !== undefined) article.published = published;

    await article.save();
    res.json({ article });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update article', error: err.message });
  }
};

// @route  DELETE /api/news/:id
// @access reporter (own articles only), admin (any article)
export const deleteNews = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const isOwner = article.author.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'You can only delete your own articles' });
    }

    await article.deleteOne();
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete article', error: err.message });
  }
};

// @route  GET /api/news/mine/list
// @access reporter, admin — articles authored by the logged-in user
export const getMyNews = async (req, res) => {
  try {
    const articles = await News.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your articles', error: err.message });
  }
};
