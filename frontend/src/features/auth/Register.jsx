import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearError } from './authSlice';
import { showToast } from '../../utils/toast';
import { FiUser, FiLock, FiMail, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput from '../../components/PhoneInput/PhoneInput';
import PageTransition from '../../components/FramerMotion/PageTransition';
import AnimatedFormField from '../../components/FramerMotion/AnimatedFormField';
import './Register.css';

const validators = {
  username: v => /^[a-zA-Z0-9]{6,}$/.test(v),
  password: v => v.length >= 8,
  fullName: v => v.trim().length > 0,
  phone: v => {
    const digits = v.replace(/\D/g, '');
    return digits.length === 11;
  },
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
};

const errorMessages = {
  username: 'Только латинские буквы и цифры, минимум 6 символов',
  password: 'Минимум 8 символов',
  fullName: 'Укажите полное ФИО',
  phone: 'Введите номер телефона полностью',
  email: 'Введите корректный email'
};

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', fullName: '', phone: '', email: '' });
  const [touched, setTouched] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);

  useEffect(() => { 
    if (user) {
      navigate('/dashboard');
      showToast.success('Регистрация успешна! Добро пожаловать!');
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
    const allTouched = { username: true, password: true, fullName: true, phone: true, email: true };
    setTouched(allTouched);
    
    const allValid = Object.keys(validators).every(k => validators[k](form[k]));
    if (allValid) {
      dispatch(registerUser(form));
    }
  };

  const getFieldStatus = name => {
    if (!touched[name]) return '';
    return validators[name](form[name]) ? 'valid' : 'invalid';
  };

  return (
    <PageTransition>
      <div className="auth-page">
        <motion.div 
          className="auth-card auth-card-lg"
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
              Р
            </motion.div>
            <h1 className="auth-title">Регистрация</h1>
            <p className="auth-desc">Создайте аккаунт для бронирования</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="auth-form">
            <AnimatedFormField index={0}>
              <div className="form-group">
                <label className="form-label">
                  <FiUser size={14} /> Логин
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className={`input input-with-status ${
                      getFieldStatus('username') === 'valid' ? 'input-success' : 
                      getFieldStatus('username') === 'invalid' ? 'input-error' : ''
                    }`}
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    onBlur={() => setTouched({ ...touched, username: true })}
                    placeholder="username123"
                    required
                  />
                  <AnimatePresence>
                    {getFieldStatus('username') === 'valid' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <FiCheck className="status-icon status-icon-valid" size={18} />
                      </motion.span>
                    )}
                    {getFieldStatus('username') === 'invalid' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <FiAlertCircle className="status-icon status-icon-error" size={18} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {getFieldStatus('username') === 'invalid' && (
                    <motion.span 
                      className="field-error-text"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      {errorMessages.username}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedFormField>

            <AnimatedFormField index={1}>
              <div className="form-group">
                <label className="form-label">
                  <FiLock size={14} /> Пароль
                </label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    className={`input input-with-status ${
                      getFieldStatus('password') === 'valid' ? 'input-success' : 
                      getFieldStatus('password') === 'invalid' ? 'input-error' : ''
                    }`}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    onBlur={() => setTouched({ ...touched, password: true })}
                    placeholder="Минимум 8 символов"
                    required
                  />
                  <AnimatePresence>
                    {getFieldStatus('password') === 'valid' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <FiCheck className="status-icon status-icon-valid" size={18} />
                      </motion.span>
                    )}
                    {getFieldStatus('password') === 'invalid' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <FiAlertCircle className="status-icon status-icon-error" size={18} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {getFieldStatus('password') === 'invalid' && (
                    <motion.span 
                      className="field-error-text"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      {errorMessages.password}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedFormField>

            <AnimatedFormField index={2}>
              <div className="form-group">
                <label className="form-label">
                  <FiUser size={14} /> ФИО
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className={`input input-with-status ${
                      getFieldStatus('fullName') === 'valid' ? 'input-success' : 
                      getFieldStatus('fullName') === 'invalid' ? 'input-error' : ''
                    }`}
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    onBlur={() => setTouched({ ...touched, fullName: true })}
                    placeholder="Иванов Иван Иванович"
                    required
                  />
                  <AnimatePresence>
                    {getFieldStatus('fullName') === 'valid' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <FiCheck className="status-icon status-icon-valid" size={18} />
                      </motion.span>
                    )}
                    {getFieldStatus('fullName') === 'invalid' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <FiAlertCircle className="status-icon status-icon-error" size={18} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {getFieldStatus('fullName') === 'invalid' && (
                    <motion.span 
                      className="field-error-text"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      {errorMessages.fullName}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedFormField>

            <AnimatedFormField index={3}>
              <div className="form-group">
                <label className="form-label">Телефон</label>
                <PhoneInput
                  value={form.phone}
                  onChange={(value) => setForm({ ...form, phone: value })}
                  onBlur={() => setTouched({ ...touched, phone: true })}
                  status={getFieldStatus('phone')}
                />
                <AnimatePresence>
                  {getFieldStatus('phone') === 'invalid' && (
                    <motion.span 
                      className="field-error-text"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      {errorMessages.phone}
                    </motion.span>
                  )}
                </AnimatePresence>
                {getFieldStatus('phone') === '' && !form.phone && (
                  <span className="field-hint">Например: +7 (999) 123-45-67</span>
                )}
              </div>
            </AnimatedFormField>

            <AnimatedFormField index={4}>
              <div className="form-group">
                <label className="form-label">
                  <FiMail size={14} /> E-mail
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    className={`input input-with-status ${
                      getFieldStatus('email') === 'valid' ? 'input-success' : 
                      getFieldStatus('email') === 'invalid' ? 'input-error' : ''
                    }`}
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    placeholder="example@mail.ru"
                    required
                  />
                  <AnimatePresence>
                    {getFieldStatus('email') === 'valid' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <FiCheck className="status-icon status-icon-valid" size={18} />
                      </motion.span>
                    )}
                    {getFieldStatus('email') === 'invalid' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <FiAlertCircle className="status-icon status-icon-error" size={18} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {getFieldStatus('email') === 'invalid' && (
                    <motion.span 
                      className="field-error-text"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      {errorMessages.email}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedFormField>

            <AnimatedFormField index={5}>
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
                ) : 'Зарегистрироваться'}
              </motion.button>
            </AnimatedFormField>
          </form>

          <motion.div 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <p>
              Уже есть аккаунт?{' '}
              <Link to="/login" className="auth-link">Войти</Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}