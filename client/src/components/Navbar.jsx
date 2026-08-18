import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORIES = ['Politics', 'World', 'Business', 'Technology', 'Sports', 'Entertainment', 'Science', 'Health'];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.elements.q.value.trim();
    navigate(q ? `/?search=${encodeURIComponent(q)}` : '/');
  };

  return (
    <header className="site-header">
      <div className="masthead">
        <Link to="/" className="masthead__title">
          The News
        </Link>
        <span className="masthead__date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <span className="masthead__date">
           {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <nav className="nav-bar">
        <div className="nav-bar__categories">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/?category=${c}`} className="nav-bar__link">
              {c}
            </Link>
          ))}
        </div>

        <form className="nav-bar__search" onSubmit={handleSearch}>
          <input name="q" type="text" placeholder="Search Newses…" aria-label="Search articles" />
          <button type="submit">Search</button>
        </form>

        <div className="nav-bar__auth">
          {!user && (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="nav-bar__cta">
                Register
              </Link>
            </>
          )}
          {user && (user.role === 'admin' || user.role === 'reporter') && (
            <Link to="/write" className="nav-bar__cta">
              Write news
            </Link>
          )}
          {user && user.role === 'admin' && <Link to="/settings">Settings</Link>}
          {user && (
            <>
              <Link to="/dashboard">{user.name.split(' ')[0]} · {user.role}</Link>
              <button className="link-button" onClick={logout}>
                Log out
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
