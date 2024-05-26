import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  InputLabel, MenuItem, Select, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Typography, Container, CircularProgress, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../utils/api'; // Import API

const PemasokTable = () => {
  const [pemasokData, setPemasokData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPemasok, setSelectedPemasok] = useState(null);

  // State untuk form tambah/ubah pemasok
  const [nama, setNama] = useState('');
  const [kontak, setKontak] = useState('');
  const [idLokasi, setIdLokasi] = useState('');
  const [lokasiData, setLokasiData] = useState({});

  const fetchPemasokData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/pemasok');
      setPemasokData(response.data);
    } catch (error) {
      console.error('Error fetching pemasok data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLokasiData = async () => {
    try {
      const response = await api.get('/lokasi');
      const lokasiMap = response.data.reduce((acc, lokasi) => ({ ...acc, [lokasi.id]: lokasi.alamat }), {});
      setLokasiData(lokasiMap);
    } catch (error) {
      console.error('Error fetching lokasi data:', error);
    }
  };

  const handleAddPemasok = async () => {
    try {
      await api.post('/pemasok/create', { nama, kontak, id_lokasi: idLokasi });
      fetchPemasokData();
      handleAddClose();
    } catch (error) {
      console.error('Error adding pemasok:', error);
    }
  };

  const handleAddOpen = () => {
    setIsAdding(true);
  };

  const handleAddClose = () => {
    setIsAdding(false);
    setNama('');
    setKontak('');
    setIdLokasi('');
  };

  const handleEditPemasok = async () => {
    try {
      await api.put(`/pemasok/update/${selectedPemasok.id}`, { nama, kontak, id_lokasi: idLokasi });
      fetchPemasokData();
      handleEditClose();
    } catch (error) {
      console.error('Error editing pemasok:', error);
    }
  };

  const handleEditOpen = (pemasok) => {
    setSelectedPemasok(pemasok);
    setNama(pemasok.nama);
    setKontak(pemasok.kontak);
    setIdLokasi(pemasok.id_lokasi);
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setNama('');
    setKontak('');
    setIdLokasi('');
    setSelectedPemasok(null);
  };

  const handleDeletePemasok = async (id) => {
    try {
      await api.delete(`/pemasok/delete/${id}`);
      fetchPemasokData();
    } catch (error) {
      console.error('Error deleting pemasok:', error);
    }
  };

  useEffect(() => {
    fetchPemasokData();
    fetchLokasiData();
  }, []);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Manajemen Pemasok
        </Typography>
        <Button variant="contained" onClick={handleAddOpen} sx={{ mb: 3 }}>
          Tambah Pemasok
        </Button>
        <Dialog open={isAdding} onClose={handleAddClose}>
          <DialogTitle>Tambah Pemasok Baru</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan isi form berikut:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="nama"
              label="Nama Pemasok"
              type="text"
              fullWidth
              variant="standard"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            <TextField
              margin="dense"
              id="kontak"
              label="Kontak"
              type="text"
              fullWidth
              variant="standard"
              value={kontak}
              onChange={(e) => setKontak(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Lokasi</InputLabel>
              <Select
                value={idLokasi}
                onChange={(e) => setIdLokasi(e.target.value)}
                label="Lokasi"
              >
                <MenuItem value="">
                  <em>Pilih Lokasi</em>
                </MenuItem>
                {Object.entries(lokasiData).map(([id, alamat]) => (
                  <MenuItem key={id} value={id}>
                    {alamat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose}>Cancel</Button>
            <Button onClick={handleAddPemasok} variant='cointained'>Simpan</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isEditing} onClose={handleEditClose}>
          <DialogTitle>Edit Pemasok</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan edit data pemasok:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="nama"
              label="Nama Pemasok"
              type="text"
              fullWidth
              variant="standard"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            <TextField
              margin="dense"
              id="kontak"
              label="Kontak"
              type="text"
              fullWidth
              variant="standard"
              value={kontak}
              onChange={(e) => setKontak(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Lokasi</InputLabel>
              <Select
                value={idLokasi}
                onChange={(e) => setIdLokasi(e.target.value)}
                label="Lokasi"
              >
                <MenuItem value="">
                  <em>Pilih Lokasi</em>
                </MenuItem>
                {Object.entries(lokasiData).map(([id, alamat]) => (
                  <MenuItem key={id} value={id}>
                    {alamat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleEditPemasok} variant='contained'>Simpan Perubahan</Button>
          </DialogActions>
        </Dialog>
        <Paper elevation={3} sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Nama</TableCell>
                  <TableCell align="center">Kontak</TableCell>
                  <TableCell align="center">Lokasi</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : pemasokData.length > 0 ? (
                  pemasokData.map((pemasok) => (
                    <TableRow key={pemasok.id}>
                      <TableCell align="center">{pemasok.nama}</TableCell>
                      <TableCell align="center">{pemasok.kontak}</TableCell>
                      <TableCell align="center">{lokasiData[pemasok.id_lokasi]}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleEditOpen(pemasok)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeletePemasok(pemasok.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
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

export default PemasokTable;
