import { Box, TextField } from "@mui/material";
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
    <Box sx={{ display: 'flex', mt: 2 }}>
      <TextField
        inputRef={inputRef}
        label="Søk..."
        variant="outlined"
        value={query}
        onChange={handleInputChange}
        sx={{ width: '100%', maxWidth: 400 }}
      />
    </Box>
  );
};

export default Searchbar;