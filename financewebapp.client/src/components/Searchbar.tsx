import React, { useRef, useEffect, ChangeEvent } from "react";

interface SearchbarProps {
  query: string;
  onSearch: (query: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ query, onSearch }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="input-wrapper">
      <input
        ref={inputRef}
        className="input"
        placeholder="Søk..."
        value={query}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default Searchbar;