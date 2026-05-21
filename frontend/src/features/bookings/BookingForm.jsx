import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRooms, createBooking, clearMessages } from './bookingSlice';
import { showToast } from '../../utils/toast';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../../components/FramerMotion/PageTransition';
import { FiCalendar, FiMapPin, FiCreditCard, FiAlertCircle } from 'react-icons/fi';
import './BookingForm.css';

const roomTypes = { auditorium: 'Аудитория', coworking: 'Коворкинг', cinema: 'Кинозал' };
const typeEmoji = { auditorium: '🏛️', coworking: '💼', cinema: '🎬' };

export default function BookingForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rooms, loading, error, success } = useSelector(s => s.bookings);
  const [form, setForm] = useState({ roomId: '', date: '', paymentMethod: 'card' });

  useEffect(() => { 
    dispatch(fetchRooms()); 
    return () => dispatch(clearMessages()); 
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      showToast.bookingCreated('Заявка успешно создана! Ожидайте подтверждения администратором.');
      const timer = setTimeout(() => {
        navigate('/dashboard');
        dispatch(clearMessages());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      showToast.error(error);
      dispatch(clearMessages());
    }
  }, [error, dispatch]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(createBooking(form));
  };

  return (
    <PageTransition>
      <div className="booking-form-page">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h1 className="page-title">Оформление заявки</h1>
          <p className="page-subtitle">Выберите помещение и укажите детали конференции</p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="card booking-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="form-section">
            <motion.h3 
              className="form-section-title"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FiMapPin size={20} />
              Выберите помещение
            </motion.h3>
            <div className="rooms-grid">
              {rooms.map((room, index) => (
                <motion.div
                  key={room._id}
                  className={`room-card ${form.roomId === room._id ? 'room-card-selected' : ''}`}
                  onClick={() => setForm({ ...form, roomId: room._id })}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.08, duration: 0.3 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="room-emoji">{typeEmoji[room.type]}</span>
                  <h4 className="room-name">{room.name}</h4>
                  <p className="room-type">{roomTypes[room.type]}</p>
                  <p className="room-capacity">Вместимость: {room.capacity} чел.</p>
                  <p className="room-price">{room.pricePerHour.toLocaleString()} ₽/час</p>
                  <AnimatePresence>
                    {form.roomId === room._id && (
                      <motion.div 
                        className="room-check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            className="form-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <div className="form-group">
              <label className="form-label">
                <FiCalendar size={16} />
                Дата начала конференции
              </label>
              <input
                type="date"
                className="input"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <span className="form-hint">Формат: ДД.ММ.ГГГГ</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiCreditCard size={16} />
                Способ оплаты
              </label>
              <select
                className="select"
                value={form.paymentMethod}
                onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
              >
                <option value="card">Банковская карта</option>
                <option value="invoice">Безналичный расчет (счет)</option>
                <option value="cash">Наличные</option>
              </select>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={loading || !form.roomId || !form.date}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {loading ? (
              <motion.span 
                className="spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            ) : 'Отправить заявку'}
          </motion.button>
        </motion.form>
      </div>
    </PageTransition>
  );
}