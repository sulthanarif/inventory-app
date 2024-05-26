import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  InputLabel, MenuItem, Select, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Typography, Container, CircularProgress, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../utils/api'; // Import API

const BarangTable = () => {
  const [barangData, setBarangData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [search, setSearch] = useState(''); 

  // State untuk form tambah/ubah barang
  const [nama, setNama] = useState('');
  const [stok, setStok] = useState('');
  const [harga, setHarga] = useState('');
  const [idPemasok, setIdPemasok] = useState(''); // State untuk pilihan pemasok
  const [idKategori, setIdKategori] = useState(''); // State untuk pilihan kategori
  const [idLokasiPenyimpanan, setIdLokasiPenyimpanan] = useState(''); // State untuk pilihan lokasi penyimpanan
  const [pemasokData, setPemasokData] = useState({}); // State untuk data pemasok (map ID ke nama)
  const [kategoriData, setKategoriData] = useState({}); // State untuk data kategori (map ID ke nama)
  const [lokasiPenyimpananData, setLokasiPenyimpananData] = useState({}); // State untuk data lokasi penyimpanan (map ID ke deskripsi)

  const fetchBarangData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/barang');
      setBarangData(response.data);
    } catch (error) {
      console.error('Error fetching barang data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPemasokData = async () => {
    try {
      const response = await api.get('/pemasok');
      const pemasokMap = response.data.reduce((acc, pemasok) => ({ ...acc, [pemasok.id]: pemasok.nama }), {});
      setPemasokData(pemasokMap);
    } catch (error) {
      console.error('Error fetching pemasok data:', error);
    }
  };

  const fetchKategoriData = async () => {
    try {
      const response = await api.get('/kategori');
      const kategoriMap = response.data.reduce((acc, kategori) => ({ ...acc, [kategori.id]: kategori.nama }), {});
      setKategoriData(kategoriMap);
    } catch (error) {
      console.error('Error fetching kategori data:', error);
    }
  };

  const fetchLokasiPenyimpananData = async () => {
    try {
      const response = await api.get('/lokasi-penyimpanan');
      const lokasiPenyimpananMap = response.data.reduce((acc, lokasiPenyimpanan) => ({ ...acc, [lokasiPenyimpanan.id]: lokasiPenyimpanan.deskripsi }), {});
      setLokasiPenyimpananData(lokasiPenyimpananMap);
    } catch (error) {
      console.error('Error fetching lokasi penyimpanan data:', error);
    }
  };

  const handleAddBarang = async () => {
    try {
      await api.post('/barang/create', { nama, stok, harga, id_pemasok: idPemasok, id_kategori: idKategori, id_lokasi_penyimpanan: idLokasiPenyimpanan });
      fetchBarangData();
      handleAddClose();
    } catch (error) {
      console.error('Error adding barang:', error);
    }
  };

  const handleAddOpen = () => {
    setIsAdding(true);
  };

  const handleAddClose = () => {
    setIsAdding(false);
    setNama('');
    setStok('');
    setHarga('');
    setIdPemasok('');
    setIdKategori('');
    setIdLokasiPenyimpanan('');
  };

  const handleEditBarang = async () => {
    try {
      await api.put(`/barang/update/${selectedBarang.id}`, { nama, stok, harga, id_pemasok: idPemasok, id_kategori: idKategori, id_lokasi_penyimpanan: idLokasiPenyimpanan });
      fetchBarangData();
      handleEditClose();
    } catch (error) {
      console.error('Error editing barang:', error);
    }
  };

  const handleEditOpen = (barang) => {
    setSelectedBarang(barang);
    setNama(barang.nama);
    setStok(barang.stok);
    setHarga(barang.harga);
    setIdPemasok(barang.id_pemasok);
    setIdKategori(barang.id_kategori);
    setIdLokasiPenyimpanan(barang.id_lokasi_penyimpanan);
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setNama('');
    setStok('');
    setHarga('');
    setIdPemasok('');
    setIdKategori('');
    setIdLokasiPenyimpanan('');
    setSelectedBarang(null);
  };

  const handleDeleteBarang = async (id) => {
    try {
      await api.delete(`/barang/delete/${id}`);
      fetchBarangData();
    } catch (error) {
      console.error('Error deleting barang:', error);
    }
  };

  useEffect(() => {
    fetchBarangData();
    fetchPemasokData();
    fetchKategoriData();
    fetchLokasiPenyimpananData();
  }, []);

  const filterBarang = barangData.filter((barang) => {
    return barang.nama.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Manajemen Barang
        </Typography>
        <Button variant="contained" onClick={handleAddOpen} sx={{ mb: 3 }}>
          Tambah Barang
        </Button>
        <TextField
          label="Cari Barang"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Dialog open={isAdding} onClose={handleAddClose}>
          <DialogTitle>Tambah Barang Baru</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan isi form berikut:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="nama"
              label="Nama Barang"
              type="text"
              fullWidth
              variant="standard"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            <TextField
              margin="dense"
              id="stok"
              label="Stok"
              type="number"
              fullWidth
              variant="standard"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
            />
            <TextField
              margin="dense"
              id="harga"
              label="Harga"
              type="number"
              fullWidth
              variant="standard"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Pemasok</InputLabel>
              <Select
                value={idPemasok}
                onChange={(e) => setIdPemasok(e.target.value)}
                label="Pemasok"
              >
                <MenuItem value="">
                  <em>Pilih Pemasok</em>
                </MenuItem>
                {Object.entries(pemasokData).map(([id, nama]) => (
                  <MenuItem key={id} value={id}>
                    {nama}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Kategori</InputLabel>
              <Select
                value={idKategori}
                onChange={(e) => setIdKategori(e.target.value)}
                label="Kategori"
              >
                <MenuItem value="">
                  <em>Pilih Kategori</em>
                </MenuItem>
                {Object.entries(kategoriData).map(([id, nama]) => (
                  <MenuItem key={id} value={id}>
                    {nama}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Lokasi Penyimpanan</InputLabel>
              <Select
                value={idLokasiPenyimpanan}
                onChange={(e) => setIdLokasiPenyimpanan(e.target.value)}
                label="Lokasi Penyimpanan"
              >
                <MenuItem value="">
                  <em>Pilih Lokasi Penyimpanan</em>
                </MenuItem>
                {Object.entries(lokasiPenyimpananData).map(([id, deskripsi]) => (
                  <MenuItem key={id} value={id}>
                    {deskripsi}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose}>Cancel</Button>
            <Button onClick={handleAddBarang} variant='contained'>Simpan</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isEditing} onClose={handleEditClose}>
          <DialogTitle>Edit Barang</DialogTitle>
          <DialogContent>
            <DialogContentText>Silahkan edit data barang:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="nama"
              label="Nama Barang"
              type="text"
              fullWidth
              variant="standard"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            <TextField
              margin="dense"
              id="stok"
              label="Stok"
              type="number"
              fullWidth
              variant="standard"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
            />
            <TextField
              margin="dense"
              id="harga"
              label="Harga"
              type="number"
              fullWidth
              variant="standard"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Pemasok</InputLabel>
              <Select
                value={idPemasok}
                onChange={(e) => setIdPemasok(e.target.value)}
                label="Pemasok"
              >
                <MenuItem value="">
                  <em>Pilih Pemasok</em>
                </MenuItem>
                {Object.entries(pemasokData).map(([id, nama]) => (
                  <MenuItem key={id} value={id}>
                    {nama}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Kategori</InputLabel>
              <Select
                value={idKategori}
                onChange={(e) => setIdKategori(e.target.value)}
                label="Kategori"
              >
                <MenuItem value="">
                  <em>Pilih Kategori</em>
                </MenuItem>
                {Object.entries(kategoriData).map(([id, nama]) => (
                  <MenuItem key={id} value={id}>
                    {nama}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Lokasi Penyimpanan</InputLabel>
              <Select
                value={idLokasiPenyimpanan}
                onChange={(e) => setIdLokasiPenyimpanan(e.target.value)}
                label="Lokasi Penyimpanan"
              >
                <MenuItem value="">
                  <em>Pilih Lokasi Penyimpanan</em>
                </MenuItem>
                {Object.entries(lokasiPenyimpananData).map(([id, deskripsi]) => (
                  <MenuItem key={id} value={id}>
                    {deskripsi}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleEditBarang} variant='contained'>Simpan Perubahan</Button>
          </DialogActions>
        </Dialog>
        <Paper elevation={3} sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Nama</TableCell>
                  <TableCell align="center">Stok</TableCell>
                  <TableCell align="center">Harga</TableCell>
                  <TableCell align="center">Pemasok</TableCell>
                  <TableCell align="center">Kategori</TableCell>
                  <TableCell align="center">Lokasi Penyimpanan</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filterBarang.length > 0 ? (
                  filterBarang.map((barang) => (
                    <TableRow key={barang.id}>
                      <TableCell align="center">{barang.nama}</TableCell>
                      <TableCell align="center">{barang.stok}</TableCell>
                      <TableCell align="center">{barang.harga}</TableCell>
                      <TableCell align="center">{pemasokData[barang.id_pemasok] || ''}</TableCell>
                      <TableCell align="center">{kategoriData[barang.id_kategori] || ''}</TableCell>
                      <TableCell align="center">{lokasiPenyimpananData[barang.id_lokasi_penyimpanan] || ''}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleEditOpen(barang)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteBarang(barang.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
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

export default BarangTable;
