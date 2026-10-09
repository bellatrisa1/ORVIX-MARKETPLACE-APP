'use client';

import { useStore } from '@/store';
import { formatMoney } from '@/lib/money';

export default function OrderHistory() {
  const orders = useStore((state) => state.orders);
  const hydrated = useStore((state) => state.hydrated);
  return (
    <div className="profile__orders">
      <h3 className="profile__orders-title">История демозаказов</h3>
      <p className="demo-note">
        Локальные заказы этого браузера, включая гостевые. Деньги не
        списываются, доставка не выполняется. Не вводите реальные персональные
        данные.
      </p>
      {!hydrated ? (
        <p role="status">Загрузка истории…</p>
      ) : orders.length === 0 ? (
        <div className="profile__empty">
          <p>У вас пока нет демозаказов</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card" data-testid="order-card">
              <div className="order-card__head">
                <span className="order-card__id">Заказ #{order.id}</span>
                <span className="order-card__status order-card__status--process">
                  {order.status}
                </span>
              </div>
              <p className="order-card__date">
                {new Date(order.date).toLocaleString('ru-RU')}
              </p>
              <p>
                {order.details.name} · {order.details.email} ·{' '}
                {order.details.phone}
              </p>
              <p>
                {order.details.city}, {order.details.address}
                {order.details.apartment
                  ? `, кв. ${order.details.apartment}`
                  : ''}
              </p>
              <p>
                {order.details.delivery === 'courier'
                  ? 'Демо: курьер'
                  : 'Демо: пункт выдачи (без выбора ПВЗ)'}{' '}
                ·{' '}
                {order.details.payment === 'card'
                  ? 'Карта (без оплаты)'
                  : 'Наличные (без оплаты)'}
              </p>
              {order.details.comment && (
                <p>Комментарий: {order.details.comment}</p>
              )}
              <div className="order-card__items">
                {order.items.map((item) => (
                  <div key={item.productId} className="order-card__item">
                    <span>{item.title}</span>
                    <span>x{item.quantity}</span>
                    <span>{formatMoney(item.price)}</span>
                  </div>
                ))}
              </div>
              <div className="order-card__total">
                Итого: {formatMoney(order.total)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
