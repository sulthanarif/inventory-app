// components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Menu, Home, Inventory, LocalOffer, LocalShipping, LocationCity, MonetizationOn, ShoppingCart } from '@mui/icons-material';

const navItems = [
  { title: 'Home', icon: <Home />, path: '/' },
  { title: 'Barang', icon: <Inventory />, path: '/barang' },
  { title: 'Pemasok', icon: <LocalShipping />, path: '/pemasok' },
  { title: 'Kategori', icon: <LocalOffer />, path: '/kategori' },
  { title: 'Lokasi', icon: <LocationCity />, path: '/lokasi' },
  { title: 'Lokasi Penyimpanan', icon: <Inventory />, path: '/lokasi-penyimpanan' },
  { title: 'Pengeluaran', icon: <MonetizationOn />, path: '/pengeluaran' },
  { title: 'Transaksi', icon: <ShoppingCart />, path: '/transaksi' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory App
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer}
      >
        <List>
          {navItems.map((item) => (
            <ListItem key={item.title}>
              <ListItemButton component="a" href={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default Navbar;
