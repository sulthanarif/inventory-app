import React from 'react';
import PemasokTable from '../components/PemasokTable';
import Navbar from '../components/Navbar';

const PemasokPage = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>
        <PemasokTable />
      </div>
    </div>
  );
};

export default PemasokPage;