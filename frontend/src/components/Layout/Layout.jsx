import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import { FiLogOut, FiUser, FiCalendar, FiShield, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import logo from "../../assets/logo.svg";
import './Layout.css';

export default function Layout() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="header-brand" onClick={closeMenu}>
            <div className="header-logo">
              <img src={logo} alt="logo" />
            </div>
            <span className="header-title">Конференции.РФ</span>
          </Link>

          <button className="header-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <nav className={`header-nav ${menuOpen ? 'header-nav-open' : ''}`}>
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link" onClick={closeMenu}>
                  <FiUser size={16} />
                  <span>{user.fullName || user.username}</span>
                </Link>

                <Link to="/bookings" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  <FiCalendar size={14} />
                  <span>Мои заявки</span>
                </Link>

                {user.role === 'admin' && (
                  <Link to="/admin" className="btn btn-success btn-sm" onClick={closeMenu}>
                    <FiShield size={14} />
                    <span>Панель управления</span>
                  </Link>
                )}

                <button onClick={handleLogout} className="nav-link nav-link-logout">
                  <FiLogOut size={16} />
                  <span>Выйти</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={closeMenu}>Вход</Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>Регистрация</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p className="footer-text">© 2026 Конференции.РФ — Всероссийский портал бронирования помещений</p>
        </div>
      </footer>
    </div>
  );
}