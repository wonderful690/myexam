import { FiMapPin, FiCalendar, FiCreditCard, FiClock, FiUser, FiPhone, FiMail, FiHash } from 'react-icons/fi';
import './BookingDetails.css';

const statusLabels = {
  new: 'Новая',
  approved: 'Мероприятие назначено',
  completed: 'Мероприятие завершено'
};

const statusColors = {
  new: { bg: '#FFF3CD', text: '#856404', border: '#FFEEBA' },
  approved: { bg: '#D1ECF1', text: '#0C5460', border: '#BEE5EB' },
  completed: { bg: '#D4EDDA', text: '#155724', border: '#C3E6CB' }
};

const paymentLabels = {
  card: 'Банковская карта',
  invoice: 'Безналичный расчет (счет)',
  cash: 'Наличные'
};

const paymentIcons = {
  card: '💳',
  invoice: '📄',
  cash: '💵'
};

const roomTypeIcons = {
  auditorium: '🏛️',
  coworking: '💼',
  cinema: '🎬'
};

const roomTypeLabels = {
  auditorium: 'Аудитория',
  coworking: 'Коворкинг',
  cinema: 'Кинозал'
};

export default function BookingDetails({ booking }) {
  if (!booking) return null;

  const statusColor = statusColors[booking.status];
  const formattedDate = new Date(booking.date).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = new Date(booking.date).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const createdDate = new Date(booking.createdAt).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="booking-details">
      <div className="detail-status" style={{
        backgroundColor: statusColor.bg,
        color: statusColor.text,
        borderColor: statusColor.border
      }}>
        {statusLabels[booking.status]}
      </div>

      <div className="detail-section">
        <div className="detail-room-header">
          <span className="detail-room-icon">
            {roomTypeIcons[booking.room?.type] || '🏢'}
          </span>
          <div>
            <h3 className="detail-room-name">{booking.room?.name || 'Не указано'}</h3>
            <span className="detail-room-type">
              {roomTypeLabels[booking.room?.type] || 'Помещение'}
            </span>
          </div>
        </div>
        {booking.room?.description && (
          <p className="detail-room-desc">{booking.room.description}</p>
        )}
      </div>

      <div className="detail-info-grid">
        <div className="detail-info-item">
          <FiCalendar size={18} />
          <div>
            <span className="detail-info-label">Дата мероприятия</span>
            <span className="detail-info-value">{formattedDate}</span>
          </div>
        </div>

        <div className="detail-info-item">
          <FiClock size={18} />
          <div>
            <span className="detail-info-label">Время начала</span>
            <span className="detail-info-value">{formattedTime}</span>
          </div>
        </div>

        <div className="detail-info-item">
          <FiCreditCard size={18} />
          <div>
            <span className="detail-info-label">Способ оплаты</span>
            <span className="detail-info-value">
              {paymentIcons[booking.paymentMethod]} {paymentLabels[booking.paymentMethod]}
            </span>
          </div>
        </div>

        {booking.room?.capacity && (
          <div className="detail-info-item">
            <FiMapPin size={18} />
            <div>
              <span className="detail-info-label">Вместимость</span>
              <span className="detail-info-value">{booking.room.capacity} человек</span>
            </div>
          </div>
        )}

        {booking.room?.pricePerHour && (
          <div className="detail-info-item">
            <span style={{ fontSize: '18px' }}>₽</span>
            <div>
              <span className="detail-info-label">Стоимость</span>
              <span className="detail-info-value" style={{ color: 'var(--green)', fontWeight: 600 }}>
                {booking.room.pricePerHour.toLocaleString()} ₽/час
              </span>
            </div>
          </div>
        )}

        <div className="detail-info-item">
          <FiHash size={18} />
          <div>
            <span className="detail-info-label">Номер заявки</span>
            <span className="detail-info-value" style={{ fontFamily: 'Roboto Mono, monospace', fontSize: '12px' }}>
              {booking._id}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-footer">
        <span>Заявка создана: {createdDate}</span>
      </div>

      {booking.review && (
        <div className="detail-review">
          <h4 className="detail-section-title">⭐ Отзыв</h4>
          <div className="detail-review-stars">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} style={{
                color: i <= booking.review.rating ? '#FFC107' : '#CED4DA',
                fontSize: '18px'
              }}>
                ★
              </span>
            ))}
          </div>
          <p className="detail-review-text">{booking.review.text}</p>
        </div>
      )}
    </div>
  );
}