import React from 'react';
import { useLocation } from 'react-router-dom';

const QuarterlyReport: React.FC = (): JSX.Element => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const symbol = searchParams.get('symbol');
  const date = searchParams.get('date');

  // lage custom Hook til henting av kvartallsrapport

  return (
    <div>
      <h1>Kvartalsrapport for {symbol}</h1>
      <p>Dato: {date}</p>
    

    </div>
  );
};

export default QuarterlyReport;