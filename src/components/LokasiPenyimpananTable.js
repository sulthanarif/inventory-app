import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  InputLabel, MenuItem, Select, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Typography, Container, CircularProgress, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../utils/api'; // Import API

const LokasiPenyimpananTable = () => {
  const [lokasiPenyimpananData, setLokasiPenyimpananData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLokasiPenyimpanan, setSelectedLokasiPenyimpanan] = useState(null);

  // State untuk form tambah/ubah lokasi penyimpanan
  const [deskripsi, setDeskripsi] = useState('');
  const [idLokasi, setIdLokasi] = useState('');
  const [lokasiData, setLokasiData] = useState({});

  const fetchLokasiPenyimpananData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/lokasi-penyimpanan');
      setLokasiPenyimpananData(response.data);
    } catch (error) {
      console.error('Error fetching lokasi penyimpanan data:', error);
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

  const handleAddLokasiPenyimpanan = async () => {
    try {
      await api.post('/lokasi-penyimpanan/create', { deskripsi, id_lokasi: idLokasi });
      fetchLokasiPenyimpananData();
      handleAddClose();
    } catch (error) {
      console.error('Error adding lokasi penyimpanan:', error);
    }
  };

  const handleAddOpen = () => {
    setIsAdding(true);
  };

  const handleAddClose = () => {
    setIsAdding(false);
    setDeskripsi('');
    setIdLokasi('');
  };

  const handleEditLokasiPenyimpanan = async () => {
    try {
      await api.put(`/lokasi-penyimpanan/update/${selectedLokasiPenyimpanan.id}`, { deskripsi, id_lokasi: idLokasi });
      fetchLokasiPenyimpananData();
      handleEditClose();
    } catch (error) {
      console.error('Error editing lokasi penyimpanan:', error);
    }
  };

  const handleEditOpen = (lokasiPenyimpanan) => {
    setSelectedLokasiPenyimpanan(lokasiPenyimpanan);
    setDeskripsi(lokasiPenyimpanan.deskripsi);
    setIdLokasi(lokasiPenyimpanan.id_lokasi);
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setDeskripsi('');
    setIdLokasi('');
    setSelectedLokasiPenyimpanan(null);
  };

  const handleDeleteLokasiPenyimpanan = async (id) => {
    try {
      await api.delete(`/lokasi-penyimpanan/delete/${id}`);
      fetchLokasiPenyimpananData();
    } catch (error) {
      console.error('Error deleting lokasi penyimpanan:', error);
    }
  };

  useEffect(() => {
    fetchLokasiPenyimpananData();
    fetchLokasiData();
  }, []);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Manajemen Lokasi Penyimpanan
        </Typography>
        <Button variant="contained" onClick={handleAddOpen} sx={{ mb: 3 }}>
          Tambah Lokasi Penyimpanan
        </Button>
        <Dialog open={isAdding} onClose={handleAddClose}>
          <DialogTitle>Tambah Lokasi Penyimpanan Baru</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan isi form berikut:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="deskripsi"
              label="Deskripsi"
              type="text"
              fullWidth
              variant="standard"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
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
            <Button onClick={handleAddLokasiPenyimpanan} variant='contained'>Simpan</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isEditing} onClose={handleEditClose}>
          <DialogTitle>Edit Lokasi Penyimpanan</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan edit data lokasi penyimpanan:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="deskripsi"
              label="Deskripsi"
              type="text"
              fullWidth
              variant="standard"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
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
            <Button onClick={handleEditLokasiPenyimpanan} variant='contained'>Simpan Perubahan</Button>
          </DialogActions>
        </Dialog>
        <Paper elevation={3} sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Deskripsi</TableCell>
                  <TableCell align="center">Lokasi</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : lokasiPenyimpananData.length > 0 ? (
                  lokasiPenyimpananData.map((lokasiPenyimpanan) => (
                    <TableRow key={lokasiPenyimpanan.id}>
                      <TableCell align="center">{lokasiPenyimpanan.deskripsi}</TableCell>
                      <TableCell align="center">{lokasiData[lokasiPenyimpanan.id_lokasi]}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleEditOpen(lokasiPenyimpanan)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteLokasiPenyimpanan(lokasiPenyimpanan.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
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

export default LokasiPenyimpananTable;