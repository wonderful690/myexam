import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings, updateBookingStatus } from './adminSlice';
import { showToast } from '../../utils/toast';
import { motion } from 'framer-motion';
import PageTransition from '../../components/FramerMotion/PageTransition';
import AnimatedListItem from '../../components/FramerMotion/AnimatedListItem';
import { FiFilter, FiChevronLeft, FiChevronRight, FiCheck, FiRefreshCw } from 'react-icons/fi';
import './AdminPanel.css';

const statusMap = { new: 'Новая', approved: 'Мероприятие назначено', completed: 'Мероприятие завершено' };

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { bookings, pagination } = useSelector(s => s.admin);
  const [filter, setFilter] = useState({ status: '', sort: 'newest', page: 1 });

  useEffect(() => { dispatch(fetchAllBookings(filter)); }, [dispatch, filter]);

  const handleStatusChange = async (id, status) => {
    await dispatch(updateBookingStatus({ id, status }));
    dispatch(fetchAllBookings(filter));
    showToast.statusChanged(`Статус изменен на «${statusMap[status]}»`);
  };

  const statusOptions = ['', 'new', 'approved', 'completed'];
  const getStatusBadgeClass = status => `badge badge-${status}`;

  return (
    <PageTransition>
      <div className="admin-panel">
        <motion.div 
          className="admin-header"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="page-title">Панель администратора</h1>
            <p className="page-subtitle">Управление заявками на бронирование</p>
          </div>
          <motion.button
            className="btn btn-primary btn-sm"
            onClick={() => dispatch(fetchAllBookings(filter))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiRefreshCw size={16} /> Обновить
          </motion.button>
        </motion.div>

        <motion.div 
          className="card filter-bar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="filter-inner">
            <FiFilter size={18} color="var(--gray-400)" />
            <span className="filter-label">Фильтр:</span>
            {statusOptions.map(s => (
              <motion.button
                key={s || 'all'}
                className={`filter-btn ${filter.status === s ? 'filter-btn-active' : ''}`}
                onClick={() => setFilter({ ...filter, status: s, page: 1 })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {s ? statusMap[s] : 'Все'}
              </motion.button>
            ))}
            <select
              className="select sort-select"
              value={filter.sort}
              onChange={e => setFilter({ ...filter, sort: e.target.value })}
            >
              <option value="newest">Сначала новые</option>
              <option value="date">По дате мероприятия</option>
            </select>
          </div>
        </motion.div>

        <div className="bookings-admin-list">
          {bookings.map((booking, index) => (
            <AnimatedListItem key={booking._id} index={index}>
              <div className="card admin-booking-item">
                <div className="admin-booking-info">
                  <div>
                    <h3 className="admin-booking-user">{booking.user?.fullName}</h3>
                    <div className="admin-booking-details">
                      <span>{booking.room?.name}</span>
                      <span className="detail-sep">•</span>
                      <span>{new Date(booking.date).toLocaleDateString('ru-RU')}</span>
                      <span className="detail-sep">•</span>
                      <span>
                        {booking.paymentMethod === 'card' ? 'Карта' :
                         booking.paymentMethod === 'invoice' ? 'Счет' : 'Наличные'}
                      </span>
                    </div>
                    <div className="admin-booking-contact">
                      {booking.user?.email} • {booking.user?.phone}
                    </div>
                  </div>
                  <span className={getStatusBadgeClass(booking.status)}>
                    {statusMap[booking.status]}
                  </span>
                </div>
                <div className="admin-booking-actions">
                  {statusOptions.filter(s => s && s !== booking.status).map(s => (
                    <motion.button
                      key={s}
                      className={`btn btn-sm action-btn action-btn-${s}`}
                      onClick={() => handleStatusChange(booking._id, s)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {s === 'approved' && <><FiCheck size={14} /> Назначить</>}
                      {s === 'completed' && <><FiCheck size={14} /> Завершить</>}
                      {s === 'new' && <><FiRefreshCw size={14} /> В новую</>}
                    </motion.button>
                  ))}
                </div>
              </div>
            </AnimatedListItem>
          ))}
        </div>

        {pagination.pages > 1 && (
          <motion.div 
            className="pagination"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              className="btn btn-outline btn-sm pagination-btn"
              disabled={filter.page <= 1}
              onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronLeft size={18} />
            </motion.button>
            <span className="pagination-info">
              Страница {pagination.page} из {pagination.pages}
            </span>
            <motion.button
              className="btn btn-outline btn-sm pagination-btn"
              disabled={filter.page >= pagination.pages}
              onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}