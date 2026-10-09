const chips = [
  'Все',
  'Скидки',
  'beauty',
  'fragrances',
  'furniture',
  'groceries',
  'home-decoration',
  'kitchen-accessories',
  'laptops',
  'mens-shirts',
  'mens-shoes',
  'mobile-accessories',
  'skin-care',
  'smartphones',
  'sports-accessories',
  'sunglasses',
  'tablets',
  'tops',
  'vehicle',
  'womens-bags',
  'womens-dresses',
  'womens-jewellery',
  'womens-shoes',
  'Дешевле',
  'Дороже',
];

interface ChipsProps {
  activeChip: string;
  onChange: (chip: string) => void;
}

export default function Chips({ activeChip, onChange }: ChipsProps) {
  return (
    <section className="chips">
      {chips.map((chip) => (
        <button
          key={chip}
          className={`chip ${activeChip === chip ? 'chip--active' : ''}`}
          type="button"
          aria-pressed={activeChip === chip}
          onClick={() => onChange(chip)}
        >
          {chip}
        </button>
      ))}
    </section>
  );
}
