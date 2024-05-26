import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography,
  Container, CircularProgress, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../utils/api'; // Import API

const KategoriTable = () => {
  const [kategoriData, setKategoriData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState(null);

  // State untuk form tambah/ubah kategori
  const [nama, setNama] = useState('');

  const fetchKategoriData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/kategori');
      setKategoriData(response.data);
    } catch (error) {
      console.error('Error fetching kategori data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKategori = async () => {
    try {
      await api.post('/kategori/create', { nama });
      fetchKategoriData();
      handleAddClose();
    } catch (error) {
      console.error('Error adding kategori:', error);
    }
  };

  const handleAddOpen = () => {
    setIsAdding(true);
  };

  const handleAddClose = () => {
    setIsAdding(false);
    setNama('');
  };

  const handleEditKategori = async () => {
    try {
      await api.put(`/kategori/update/${selectedKategori.id}`, { nama });
      fetchKategoriData();
      handleEditClose();
    } catch (error) {
      console.error('Error editing kategori:', error);
    }
  };

  const handleEditOpen = (kategori) => {
    setSelectedKategori(kategori);
    setNama(kategori.nama);
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setNama('');
    setSelectedKategori(null);
  };

  const handleDeleteKategori = async (id) => {
    try {
      await api.delete(`/kategori/delete/${id}`);
      fetchKategoriData();
    } catch (error) {
      console.error('Error deleting kategori:', error);
    }
  };

  useEffect(() => {
    fetchKategoriData();
  }, []);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Manajemen Kategori
        </Typography>
        <Button variant="contained" onClick={handleAddOpen} sx={{ mb: 3 }}>
          Tambah Kategori
        </Button>
        <Dialog open={isAdding} onClose={handleAddClose}>
          <DialogTitle>Tambah Kategori Baru</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan isi form berikut:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="nama"
              label="Nama Kategori"
              type="text"
              fullWidth
              variant="standard"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose}>Cancel</Button>
            <Button onClick={handleAddKategori} variant='contained'>Simpan</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isEditing} onClose={handleEditClose}>
          <DialogTitle>Edit Kategori</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan edit data kategori:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="nama"
              label="Nama Kategori"
              type="text"
              fullWidth
              variant="standard"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleEditKategori} variant='contained'>Simpan Perubahan</Button>
          </DialogActions>
        </Dialog>
        <Paper elevation={3} sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Nama</TableCell>
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
                ) : kategoriData.length > 0 ? (
                  kategoriData.map((kategori) => (
                    <TableRow key={kategori.id}>
                      <TableCell align="center">{kategori.nama}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleEditOpen(kategori)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteKategori(kategori.id)}>
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

export default KategoriTable;
