import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  InputLabel, MenuItem, Select, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Typography, Container, CircularProgress, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../utils/api'; // Import API

const LokasiTable = () => {
  const [lokasiData, setLokasiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLokasi, setSelectedLokasi] = useState(null);

  // State untuk form tambah/ubah lokasi
  const [alamat, setAlamat] = useState('');
  const [kodePos, setKodePos] = useState('');

  const fetchLokasiData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/lokasi');
      setLokasiData(response.data);
    } catch (error) {
      console.error('Error fetching lokasi data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLokasi = async () => {
    try {
      await api.post('/lokasi/create', { alamat, kode_pos: kodePos });
      fetchLokasiData();
      handleAddClose();
    } catch (error) {
      console.error('Error adding lokasi:', error);
    }
  };

  const handleAddOpen = () => {
    setIsAdding(true);
  };

  const handleAddClose = () => {
    setIsAdding(false);
    setAlamat('');
    setKodePos('');
  };

  const handleEditLokasi = async () => {
    try {
      await api.put(`/lokasi/update/${selectedLokasi.id}`, { alamat, kode_pos: kodePos });
      fetchLokasiData();
      handleEditClose();
    } catch (error) {
      console.error('Error editing lokasi:', error);
    }
  };

  const handleEditOpen = (lokasi) => {
    setSelectedLokasi(lokasi);
    setAlamat(lokasi.alamat);
    setKodePos(lokasi.kode_pos);
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setAlamat('');
    setKodePos('');
    setSelectedLokasi(null);
  };

  const handleDeleteLokasi = async (id) => {
    try {
      await api.delete(`/lokasi/delete/${id}`);
      fetchLokasiData();
    } catch (error) {
      console.error('Error deleting lokasi:', error);
    }
  };

  useEffect(() => {
    fetchLokasiData();
  }, []);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Manajemen Lokasi
        </Typography>
        <Button variant="contained" onClick={handleAddOpen} sx={{ mb: 3 }}>
          Tambah Lokasi
        </Button>
        <Dialog open={isAdding} onClose={handleAddClose}>
          <DialogTitle>Tambah Lokasi Baru</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan isi form berikut:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="alamat"
              label="Alamat"
              type="text"
              fullWidth
              variant="standard"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
            <TextField
              margin="dense"
              id="kodePos"
              label="Kode Pos"
              type="number"
              fullWidth
              variant="standard"
              value={kodePos}
              onChange={(e) => setKodePos(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose}>Cancel</Button>
            <Button onClick={handleAddLokasi} variant='contained'>Simpan</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isEditing} onClose={handleEditClose}>
          <DialogTitle>Edit Lokasi</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan edit data lokasi:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="alamat"
              label="Alamat"
              type="text"
              fullWidth
              variant="standard"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
            <TextField
              margin="dense"
              id="kodePos"
              label="Kode Pos"
              type="number"
              fullWidth
              variant="standard"
              value={kodePos}
              onChange={(e) => setKodePos(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleEditLokasi} variant='contained'>Simpan Perubahan</Button>
          </DialogActions>
        </Dialog>
        <Paper elevation={3} sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Alamat</TableCell>
                  <TableCell align="center">Kode Pos</TableCell>
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
                ) : lokasiData.length > 0 ? (
                  lokasiData.map((lokasi) => (
                    <TableRow key={lokasi.id}>
                      <TableCell align="center">{lokasi.alamat}</TableCell>
                      <TableCell align="center">{lokasi.kode_pos}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleEditOpen(lokasi)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteLokasi(lokasi.id)}>
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

export default LokasiTable;
