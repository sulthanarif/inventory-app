// pages/barang.js
import React from 'react';
import BarangTable from '../components/BarangTable';
import Navbar from '../components/Navbar';

const BarangPage = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>
        <BarangTable />
      </div>
    </div>
  );
};

export default BarangPage;