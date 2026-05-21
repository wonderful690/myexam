import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, addReview, clearMessages } from './bookingSlice';
import Slider from '../../components/Slider/Slider';
import Modal from '../../components/Modal/Modal';
import BookingDetails from '../../components/BookingDetails/BookingDetails';
import AnimatedCard from '../../components/FramerMotion/AnimatedCard';
import PageTransition from '../../components/FramerMotion/PageTransition';
import { showToast } from '../../utils/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiSend, FiX, FiChevronRight, FiCalendar, FiClock } from 'react-icons/fi';
import './BookingList.css';

const statusLabels = {
  new: 'Новая',
  approved: 'Назначено',
  completed: 'Завершено'
};

const statusIcons = {
  new: '📋',
  approved: '✅',
  completed: '🏁'
};

const roomEmoji = {
  auditorium: '🏛️',
  coworking: '💼',
  cinema: '🎬'
};

export default function BookingList() {
  const dispatch = useDispatch();
  const { myBookings, error, success } = useSelector(s => s.bookings);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ bookingId: null, text: '', rating: 5 });

  useEffect(() => { 
    dispatch(fetchMyBookings()); 
    return () => dispatch(clearMessages()); 
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      showToast.reviewAdded(success);
      dispatch(clearMessages());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      showToast.error(error);
      dispatch(clearMessages());
    }
  }, [error, dispatch]);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleReviewSubmit = (bookingId) => {
    dispatch(addReview({ bookingId, review: { text: reviewForm.text, rating: reviewForm.rating } }));
    setReviewForm({ bookingId: null, text: '', rating: 5 });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <PageTransition>
      <div className="dashboard">
        <Slider />

        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h1 className="page-title">Мои заявки</h1>
          <p className="page-subtitle">История бронирований и отзывы</p>
        </motion.div>

        {myBookings.length === 0 ? (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.div 
              className="empty-icon"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📋
            </motion.div>
            <h3>Нет заявок</h3>
            <p>У вас пока нет созданных заявок на бронирование</p>
          </motion.div>
        ) : (
          <div className="bookings-grid">
            {myBookings.map((booking, index) => (
              <AnimatedCard
                key={booking._id}
                index={index}
                className={`booking-card-new ${booking.status === 'completed' ? 'booking-completed' : ''}`}
                onClick={() => handleBookingClick(booking)}
              >
                <div className="booking-card-top">
                  <div className="booking-card-status" data-status={booking.status}>
                    <span className="booking-status-icon">{statusIcons[booking.status]}</span>
                    <span className="booking-status-text">{statusLabels[booking.status]}</span>
                  </div>
                  <FiChevronRight className="booking-card-arrow" size={20} />
                </div>

                <div className="booking-card-main">
                  <div className="booking-card-room">
                    <span className="booking-room-emoji">
                      {roomEmoji[booking.room?.type] || '🏢'}
                    </span>
                    <div>
                      <h3 className="booking-room-name">{booking.room?.name || 'Помещение'}</h3>
                      <span className="booking-room-type">
                        {booking.room?.type === 'auditorium' ? 'Аудитория' :
                         booking.room?.type === 'coworking' ? 'Коворкинг' :
                         booking.room?.type === 'cinema' ? 'Кинозал' : 'Помещение'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="booking-card-footer">
                  <div className="booking-card-info">
                    <span className="booking-info-item">
                      <FiCalendar size={14} />
                      {formatDate(booking.date)}
                    </span>
                    <span className="booking-info-item">
                      <FiClock size={14} />
                      {formatTime(booking.date)}
                    </span>
                  </div>
                  {booking.review && (
                    <div className="booking-card-rating">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} style={{
                          color: i <= booking.review.rating ? '#FFC107' : '#CED4DA',
                          fontSize: '14px'
                        }}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {booking.status === 'completed' && !booking.review && (
                  <div className="booking-card-review-btn" onClick={e => e.stopPropagation()}>
                    {reviewForm.bookingId === booking._id ? (
                      <div className="review-inline-form">
                        <div className="review-stars-inline">
                          {[1, 2, 3, 4, 5].map(i => (
                            <button
                              key={i}
                              type="button"
                              className={`star-btn-inline ${i <= reviewForm.rating ? 'active' : ''}`}
                              onClick={() => setReviewForm({ ...reviewForm, rating: i })}
                            >
                              <FiStar size={16} fill={i <= reviewForm.rating ? '#FFC107' : 'none'} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          className="review-textarea-inline"
                          value={reviewForm.text}
                          onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })}
                          placeholder="Ваш отзыв..."
                          rows={2}
                        />
                        <div className="review-actions-inline">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleReviewSubmit(booking._id)}
                          >
                            <FiSend size={12} /> Отправить
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setReviewForm({ bookingId: null, text: '', rating: 5 })}
                          >
                            <FiX size={12} /> Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn btn-outline-success btn-sm btn-block"
                        onClick={() => setReviewForm({ ...reviewForm, bookingId: booking._id })}
                      >
                        <FiStar size={14} /> Оставить отзыв
                      </button>
                    )}
                  </div>
                )}
              </AnimatedCard>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`Заявка № ${selectedBooking?._id?.slice(-6).toUpperCase() || ''}`}
        >
          <BookingDetails booking={selectedBooking} />
        </Modal>
      </div>
    </PageTransition>
  );
}