'use client';

import { useEffect, useRef } from 'react';
import { useDialogFocus } from '@/hooks/useDialogFocus';
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
  const modalRef = useRef<HTMLDivElement | null>(null);
  useDialogFocus(isOpen, modalRef, onClose);
  const ready = useStore((state) => state.hydrated && state.storageReady);
  const updateCity = useStore((state) => state.updateCity);
  const currentCity = useStore((state) => state.city);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
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
      <div
        className="modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="city-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <h2 id="city-title" className="modal__title">
            Выберите город
          </h2>
          <button
            aria-label="Закрыть выбор города"
            className="modal__close"
            onClick={onClose}
            type="button"
          >
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
              disabled={!ready}
              aria-pressed={currentCity === city}
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
