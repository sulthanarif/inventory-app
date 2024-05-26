import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  InputLabel, MenuItem, Select, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Typography, Container, CircularProgress, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../utils/api'; // Import API

const PengeluaranTable = () => {
  const [pengeluaranData, setPengeluaranData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPengeluaran, setSelectedPengeluaran] = useState(null);

  // State untuk form tambah/ubah pengeluaran
  const [jumlah, setJumlah] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  const fetchPengeluaranData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/pengeluaran');
      setPengeluaranData(response.data);
    } catch (error) {
      console.error('Error fetching pengeluaran data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPengeluaran = async () => {
    try {
      await api.post('/pengeluaran/create', { deskripsi, jumlah });
      fetchPengeluaranData();
      handleAddClose();
    } catch (error) {
      console.error('Error adding pengeluaran:', error);
    }
  };

  const handleAddOpen = () => {
    setIsAdding(true);
  };

  const handleAddClose = () => {
    setIsAdding(false);
    setJumlah('');
  };

  const handleEditPengeluaran = async () => {
    try {
      await api.put(`/pengeluaran/update/${selectedPengeluaran.deskripsi,selectedPengeluaran.id}`, { deskripsi,jumlah });
      fetchPengeluaranData();
      handleEditClose();
    } catch (error) {
      console.error('Error editing pengeluaran:', error);
    }
  };

  const handleEditOpen = (pengeluaran) => {
    setSelectedPengeluaran(pengeluaran);
    setDeskripsi(pengeluaran.deskripsi);
    setJumlah(pengeluaran.jumlah);
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setJumlah('');
    setSelectedPengeluaran(null);
  };

  const handleDeletePengeluaran = async (id) => {
    try {
      await api.delete(`/pengeluaran/delete/${id}`);
      fetchPengeluaranData();
    } catch (error) {
      console.error('Error deleting pengeluaran:', error);
    }
  };

  useEffect(() => {
    fetchPengeluaranData();
  }, []);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Manajemen Pengeluaran
        </Typography>
        <Button variant="contained" onClick={handleAddOpen} sx={{ mb: 3 }}>
          Tambah Pengeluaran
        </Button>
        <Dialog open={isAdding} onClose={handleAddClose}>
          <DialogTitle>Tambah Pengeluaran Baru</DialogTitle>
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
            <TextField
              autoFocus
              margin="dense"
              id="jumlah"
              label="Jumlah"
              type="number"
              fullWidth
              variant="standard"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose}>Cancel</Button>
            <Button onClick={handleAddPengeluaran} variant='contained'>Simpan</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isEditing} onClose={handleEditClose}>
          <DialogTitle>Edit Pengeluaran</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan edit data pengeluaran:</DialogContentText>
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

            <TextField
              autoFocus
              margin="dense"
              id="jumlah"
              label="Jumlah"
              type="number"
              fullWidth
              variant="standard"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleEditPengeluaran} variant='contained'>Simpan Perubahan</Button>
          </DialogActions>
        </Dialog>
        <Paper elevation={3} sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>Deskripsi</TableCell>
                  <TableCell align="center">Jumlah</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : pengeluaranData.length > 0 ? (
                  pengeluaranData.map((pengeluaran) => (
                    <TableRow key={pengeluaran.id}>
                      <TableCell align='center'>{pengeluaran.deskripsi}</TableCell>
                      <TableCell align="center">{pengeluaran.jumlah}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleEditOpen(pengeluaran)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeletePengeluaran(pengeluaran.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
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

export default PengeluaranTable;