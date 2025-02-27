import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, TextField, Box, Button, Pagination, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import TopBar from '@/app/components/Topbar/TopbarSite';
import styles from './Products.module.css';
import Footer from '@/app/components/Footer/Footer';
import { fetchProducts } from './API';
import { CartContext } from '@/app/context/CartContext';

const truncateText = (text, length) => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useContext(CartContext);
  const itemsPerPage = 9;

  useEffect(() => {
    const getProducts = async () => {
      const productsFromApi = await fetchProducts();
      setProducts(productsFromApi);
      setFilteredProducts(productsFromApi);
    };

    getProducts();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const filterProducts = () => {
    let tempProducts = products;

    if (searchTerm) {
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      tempProducts = tempProducts.filter(product =>
        product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedBrand) {
      tempProducts = tempProducts.filter(product =>
        product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    setFilteredProducts(tempProducts);
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, selectedBrand]);

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Box>
      <TopBar />
      <Container className={styles.container}>
        <Box className={styles.searchBox}>
          <TextField
            label="Pesquise seu Café preferido..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button variant="contained" style={{ backgroundColor: '#4E392A', padding: '.875rem' }} className={styles.searchButton} onClick={filterProducts}>Pesquisar</Button>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box className={styles.filterBox}>
              <Typography variant="h5">FILTROS</Typography>
              <FormControl component="fieldset" className={styles.filterCategory}>
                <FormLabel component="legend">Categoria</FormLabel>
                <RadioGroup aria-label="category" name="category" value={selectedCategory} onChange={handleCategoryChange}>
                  <FormControlLabel value="grão" control={<Radio />} label="Grão" />
                  <FormControlLabel value="cápsula" control={<Radio />} label="Cápsula" />
                  <FormControlLabel value="moído" control={<Radio />} label="Moído" />
                </RadioGroup>
              </FormControl>
              <FormControl component="fieldset" className={styles.filterBrand}>
                <FormLabel component="legend">Marca</FormLabel>
                <RadioGroup aria-label="brand" name="brand" value={selectedBrand} onChange={handleBrandChange}>
                  <FormControlLabel value="coffeecode" control={<Radio />} label="CoffeeCode" />
                  <FormControlLabel value="dolce-gusto" control={<Radio />} label="Dolce Gusto" />
                  <FormControlLabel value="melitta" control={<Radio />} label="Melitta" />
                  <FormControlLabel value="nespresso" control={<Radio />} label="Nespresso" />
                  <FormControlLabel value="pilao" control={<Radio />} label="Pilão" />
                  <FormControlLabel value="orfeu" control={<Radio />} label="Orfeu" />
                  <FormControlLabel value="3coracoes" control={<Radio />} label="3 Corações" />
                  <FormControlLabel value="santaclara" control={<Radio />} label="Santa Clara" />
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={4} className={styles.productsGrid}>
              {paginatedProducts.map((product, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card className={styles.productCard}>
                    <Box className={styles.productImageWrapper}>
                      <CardMedia
                        component="img"
                        className={styles.productImage}
                        image={product.image}
                        title={product.name}
                      />
                      <IconButton className={styles.addToCartButton} onClick={() => addToCart(product)}>
                        <AddShoppingCartIcon />
                      </IconButton>
                    </Box>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color={theme.palette.text.secondary}>
                        R$ {product.price}
                      </Typography>
                      <Typography variant="body2" color={theme.palette.text.secondary}>
                        {truncateText(product.description, 60)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box className={styles.paginationBox}>
              <Pagination
                count={Math.ceil(filteredProducts.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
              />
            </Box>
          </Grid>
        </Grid>
        <Typography variant="h5" className={styles.relatedProductsTitle} style={{marginTop: '1rem'}}>
          PRODUTOS RELACIONADOS
        </Typography>
        <Grid container spacing={5} className={styles.relatedProductsGrid}>
          {filteredProducts.slice(0, 4).map((product, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card className={styles.productCard}>
                <Box className={styles.productImageWrapper}>
                  <CardMedia
                    component="img"
                    className={styles.productImage}
                    image={product.image}
                    title={product.name}
                  />
                  <IconButton className={styles.addToCartButton} onClick={() => addToCart(product)}>
                    <AddShoppingCartIcon />
                  </IconButton>
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    R$ {product.price}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    {truncateText(product.description, 60)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default Products;
