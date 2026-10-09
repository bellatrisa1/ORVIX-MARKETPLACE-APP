'use client';

import { useEffect } from 'react';
import { useStore } from '@/store';

export default function StoreHydration() {
  const hydrate = useStore((state) => state.hydrate);
  const error = useStore((state) => state.storageError);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return error ? (
    <div className="container storage-warning" role="alert">
      {error}{' '}
      <button type="button" onClick={hydrate}>
        Повторить загрузку
      </button>
    </div>
  ) : null;
}
