import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from './authSlice';
import { showToast } from '../../utils/toast';
import { FiUser, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageTransition from '../../components/FramerMotion/PageTransition';
import AnimatedFormField from '../../components/FramerMotion/AnimatedFormField';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);

  useEffect(() => { 
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      showToast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => { 
    return () => dispatch(clearError()); 
  }, [dispatch]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <PageTransition>
      <div className="auth-page">
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div 
            className="auth-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <motion.div 
              className="auth-icon"
              whileHover={{ scale: 1.05, backgroundColor: '#28A745' }}
              transition={{ duration: 0.2 }}
            >
              К
            </motion.div>
            <h1 className="auth-title">Добро пожаловать</h1>
            <p className="auth-desc">Войдите в свой аккаунт</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="auth-form">
            <AnimatedFormField index={0}>
              <div className="form-group">
                <label className="form-label">Логин</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" size={18} />
                  <input
                    type="text"
                    className="input input-with-icon"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    placeholder="Введите логин"
                    required
                  />
                </div>
              </div>
            </AnimatedFormField>

            <AnimatedFormField index={1}>
              <div className="form-group">
                <label className="form-label">Пароль</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" size={18} />
                  <input
                    type="password"
                    className="input input-with-icon"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Введите пароль"
                    required
                  />
                </div>
              </div>
            </AnimatedFormField>

            <AnimatedFormField index={2}>
              <motion.button 
                type="submit" 
                className="btn btn-primary btn-block btn-lg" 
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <motion.span 
                    className="spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                ) : 'Войти'}
              </motion.button>
            </AnimatedFormField>
          </form>

          <motion.div 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <p>
              Еще не зарегистрированы?{' '}
              <Link to="/register" className="auth-link">Регистрация</Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}