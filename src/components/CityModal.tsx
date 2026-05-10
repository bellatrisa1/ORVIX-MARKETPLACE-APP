'use client';

import { useEffect } from 'react';
import { useStore } from '@/store';

const cities = [
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Екатеринбург',
  'Новосибирск',
  'Краснодар',
  'Ростов-на-Дону',
  'Самара',
  'Нижний Новгород',
  'Владивосток',
];

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CityModal({ isOpen, onClose }: CityModalProps) {
  const updateCity = useStore((state) => state.updateCity);
  const currentCity = useStore(
    (state) => state.user?.city || 'Санкт-Петербург'
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (city: string) => {
    updateCity(city);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2 className="modal__title">Выберите город</h2>
          <button className="modal__close" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="modal__cities">
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              className={`modal__city-btn ${
                currentCity === city ? 'modal__city-btn--active' : ''
              }`}
              onClick={() => handleSelect(city)}
            >
              {city}
              {currentCity === city && <span className="modal__check">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
