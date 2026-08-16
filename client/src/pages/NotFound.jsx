import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page-container">
    <div className="section-heading">
      <h2>404 — Page not found</h2>
      <span className="section-heading__rule" />
    </div>
    <p>
      <Link to="/">← Back to the front page</Link>
    </p>
  </div>
);

export default NotFound;
