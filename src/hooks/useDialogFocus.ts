'use client';

import { useEffect, type RefObject } from 'react';

export function useDialogFocus(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const root = ref.current;
    const controls = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), select, textarea, [tabindex="0"]',
        ),
      ).filter((element) => element.getClientRects().length > 0);
    (controls()[0] ?? root).focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab') return;
      const items = controls();
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) {
        event.preventDefault();
        root.focus();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !root.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !root.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      previous?.focus();
    };
  }, [open, ref, onClose]);
}
