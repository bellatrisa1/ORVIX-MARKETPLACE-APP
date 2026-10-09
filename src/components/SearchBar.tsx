interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <form
      className="search"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <input
        className="search__input"
        type="text"
        placeholder="Найти товар в Orvix"
        aria-label="Найти товар в Orvix"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className="search__button" type="submit" aria-label="Поиск">
        🔍
      </button>
    </form>
  );
}
