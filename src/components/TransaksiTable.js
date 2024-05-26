import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  InputLabel, MenuItem, Select, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Typography, Container, CircularProgress, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../utils/api'; // Import API 

const TransaksiTable = () => {
  const [transaksiData, setTransaksiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);

  // State untuk form tambah/ubah transaksi
  const [idBarang, setIdBarang] = useState('');
  const [jumlahBarang, setJumlahBarang] = useState('');
  const [total, setTotal] = useState(''); // State untuk total
  const [jenisTransaksi, setJenisTransaksi] = useState('');
  const [barangData, setBarangData] = useState({}); 

  const fetchTransaksiData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/transaksi');
      setTransaksiData(response.data);
    } catch (error) {
      console.error('Error fetching transaksi data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBarangData = async () => {
    try {
      const response = await api.get('/barang');
      const barangMap = response.data.reduce((acc, barang) => ({ ...acc, [barang.id]: barang }), {});
      setBarangData(barangMap);
    } catch (error) {
      console.error('Error fetching barang data:', error);
    }
  };

  // Fungsi untuk menghitung total
  const calculateTotal = () => {
    const selectedBarang = barangData[idBarang];
    if (selectedBarang && jumlahBarang) {
      const calculatedTotal = selectedBarang.harga * jumlahBarang;
      setTotal(calculatedTotal.toFixed(2)); // Format ke 2 desimal
    } else {
      setTotal('');
    }
  };

  // Panggil calculateTotal saat idBarang atau jumlahBarang berubah
  useEffect(() => {
    calculateTotal();
  }, [idBarang, jumlahBarang]);

  const handleAddTransaksi = async () => {
    const date = new Date();
    const waktuFormatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    
    try {
      await api.post('/transaksi/create', { id_barang: idBarang, jumlah_barang: jumlahBarang, total: total, jenis_transaksi: jenisTransaksi, waktu: waktuFormatted });
      fetchTransaksiData();
      handleAddClose();
    } catch (error) {
      console.error('Error adding transaksi:', error);
    }
  };

  const handleAddOpen = () => {
    setIsAdding(true);
  };

  const handleAddClose = () => {
    setIsAdding(false);
    setIdBarang('');
    setJumlahBarang('');
    setTotal('');
    setJenisTransaksi('');
  };

  const handleEditTransaksi = async () => {
    try {
      await api.put(`/transaksi/update/${selectedTransaksi.id}`, { id_barang: idBarang, jumlah_barang: jumlahBarang, jenis_transaksi: jenisTransaksi });
      fetchTransaksiData();
      handleEditClose();
    } catch (error) {
      console.error('Error editing transaksi:', error);
    }
  };

  const handleEditOpen = (transaksi) => {
    setSelectedTransaksi(transaksi);
    setIdBarang(transaksi.id_barang);
    setJumlahBarang(transaksi.jumlah_barang);
    setJenisTransaksi(transaksi.jenis_transaksi);
    setTotal(barangData[transaksi.id_barang]?.harga * transaksi.jumlah_barang || ''); // Hitung total awal
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setIdBarang('');
    setJumlahBarang('');
    setTotal('');
    setJenisTransaksi('');
    setSelectedTransaksi(null);
  };

  const handleDeleteTransaksi = async (id) => {
    try {
      await api.delete(`/transaksi/delete/${id}`);
      fetchTransaksiData();
    } catch (error) {
      console.error('Error deleting transaksi:', error);
    }
  };

  useEffect(() => {
    fetchTransaksiData();
    fetchBarangData();
  }, []);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Manajemen Transaksi
        </Typography>
        <Button variant="contained" onClick={handleAddOpen} sx={{ mb: 3 }}>
          Tambah Transaksi
        </Button>
        <Dialog open={isAdding} onClose={handleAddClose}>
          <DialogTitle>Tambah Transaksi Baru</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan isi form berikut:</DialogContentText>
            <FormControl fullWidth margin="normal">
              <InputLabel>Barang</InputLabel>
              <Select
                value={idBarang}
                onChange={(e) => setIdBarang(e.target.value)}
                label="Barang"
              >
                <MenuItem value="">
                  <em>Pilih Barang</em>
                </MenuItem>
                {Object.entries(barangData).map(([id, barang]) => (
                  <MenuItem key={id} value={id}>
                    {barang.nama}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              id="jumlahBarang"
              label="Jumlah Barang"
              type="number"
              fullWidth
              variant="standard"
              value={jumlahBarang}
              onChange={(e) => setJumlahBarang(e.target.value)}
            />
            <TextField
              margin="dense"
              id="total"
              label="Total"
              type="number"
              fullWidth
              variant="standard"
              value={total} // Tampilkan nilai total
              disabled // Nonaktifkan input total
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Jenis Transaksi</InputLabel>
              <Select
                value={jenisTransaksi}
                onChange={(e) => setJenisTransaksi(e.target.value)}
                label="Jenis Transaksi"
              >
                <MenuItem value="jual">Jual</MenuItem>
                <MenuItem value="beli">Beli</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose}>Cancel</Button>
            <Button onClick={handleAddTransaksi} variant='contained'>Simpan</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isEditing} onClose={handleEditClose}>
          <DialogTitle>Edit Transaksi</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan edit data transaksi:</DialogContentText>
            <FormControl fullWidth margin="normal">
              <InputLabel>Barang</InputLabel>
              <Select
                value={idBarang}
                onChange={(e) => setIdBarang(e.target.value)}
                label="Barang"
              >
                <MenuItem value="">
                  <em>Pilih Barang</em>
                </MenuItem>
                {Object.entries(barangData).map(([id, barang]) => (
                  <MenuItem key={id} value={id}>
                    {barang.nama}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              id="jumlahBarang"
              label="Jumlah Barang"
              type="number"
              fullWidth
              variant="standard"
              value={jumlahBarang}
              onChange={(e) => setJumlahBarang(e.target.value)}
            />
            <TextField
              margin="dense"
              id="total"
              label="Total"
              type="number"
              fullWidth
              variant="standard"
              value={total} // Tampilkan nilai total
              disabled // Nonaktifkan input total
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Jenis Transaksi</InputLabel>
              <Select
                value={jenisTransaksi}
                onChange={(e) => setJenisTransaksi(e.target.value)}
                label="Jenis Transaksi"
              >
                <MenuItem value="jual">Jual</MenuItem>
                <MenuItem value="beli">Beli</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleEditTransaksi} variant='contained'>Simpan Perubahan</Button>
          </DialogActions>
        </Dialog>
        <Paper elevation={3} sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Barang</TableCell>
                  <TableCell align="center">Jumlah Barang</TableCell>
                  <TableCell align="center">Jenis Transaksi</TableCell>
                  <TableCell align="center">Total</TableCell> {/* Tambah kolom Total */}
                  <TableCell align="center">Waktu</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : transaksiData.length > 0 ? (
                  transaksiData.map((transaksi) => (
                    <TableRow key={transaksi.id}>
                      <TableCell align="center">{barangData[transaksi.id_barang]?.nama || ''}</TableCell>
                      <TableCell align="center">{transaksi.jumlah_barang}</TableCell>
                      <TableCell align="center">{transaksi.jenis_transaksi}</TableCell>
                      <TableCell align="center">{(transaksi.jenis_transaksi === 'jual' ? (
                        transaksi.total.toFixed(2)
                      ) : (
                        barangData[transaksi.id_barang]?.harga * transaksi.jumlah_barang || ''
                      ))}</TableCell> {/* Tampilkan total, jika jual ambil dari DB, jika beli hitung */}
                      <TableCell align="center">{transaksi.waktu}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleEditOpen(transaksi)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteTransaksi(transaksi.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Data Kosong
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default TransaksiTable;
