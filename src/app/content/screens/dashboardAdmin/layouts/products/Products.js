import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import styles from "./Products.module.css";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import { FaEdit, FaTrash } from "react-icons/fa";
import ProductModal from "@/app/components/Modal/Admin/CreateProductsModal";
import ReportModal from "@/app/components/Modal/Admin/ReportModal";
import { fetchProducts, deleteProduct } from "./API";
import { toast, ToastContainer } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function Products() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [products, setProducts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      const productsFromApi = await fetchProducts();
      setProducts(productsFromApi);
    };

    getProducts();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenProductModal = (product = null) => {
    setCurrentProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setCurrentProduct(null);
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleSaveProduct = (savedProduct) => {
    if (currentProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === savedProduct.id ? savedProduct : product
        )
      );
    } else {
      setProducts((prevProducts) => [...prevProducts, savedProduct]);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      toast.success("Produto excluído com sucesso");
    } catch (error) {
      toast.error("Erro ao excluir o produto");
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Nome", "Descrição", "Quantidade", "Valor"];
    const tableRows = [];

    products.forEach((product) => {
      const productData = [
        product.id,
        product.name,
        product.description,
        product.quantity,
        `R$ ${product.price.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })}`,
      ];
      tableRows.push(productData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("relatorio_produtos.pdf");
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateDescription = (description) => {
    const words = description.split(" ");
    return words.length > 5
      ? words.slice(0, 5).join(" ") + "..."
      : description;
  };

  return (
    <Box className={styles.product}>
      <Typography
        typography="h4"
        style={{ fontWeight: "bold", color: "#1E3932" }}
      >
        Produtos
      </Typography>

      <Typography
        typography="label"
        style={{ padding: "0 0 1rem 0", color: "#1E3932", fontSize: ".875rem" }}
      >
        Gerencie todos os seus produtos
      </Typography>
      <TableContainer component={Paper} className={styles.product__table}>
        <Box className={styles.product__table__top}>
          <Box className={styles.product__table__search}>
            <TextField
              maxRows="1"
              id="outlined-basic"
              label="Pesquise os produtos"
              variant="outlined"
              className={styles.product__table__input}
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button
              style={{ background: "#D9D9D9", color: "#000" }}
              variant="contained"
              className={styles.product__table__button}
            >
              Pesquisar
            </Button>
          </Box>
          <Box className={styles.product__table__actions}>
            <Button
              variant="contained"
              style={{ background: "#4E392A" }}
              className={styles.product__search__input}
              onClick={generateReport}
            >
              <ArticleIcon />
              Gerar Relatório
            </Button>
            <Button
              variant="contained"
              style={{ background: "#1E3932" }}
              className={styles.product__search__input}
              onClick={() => handleOpenProductModal()}
            >
              <AddIcon />
              Novo Produto
            </Button>
          </Box>
        </Box>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold", width: 60 }}>
                Imagem
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 60 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 120 }}>Nome</TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", width: 200 }}>
                Descrição
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", width: 100 }}>
                Quantidade
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", width: 100 }}>
                Valor
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", width: 100 }}>
                Ação
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredProducts
            ).map((product) => (
              <TableRow key={product.id}>
                <TableCell style={{ width: 60 }}>
                  <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} />
                </TableCell>
                <TableCell style={{ width: 60 }}>
                  {product.id}
                </TableCell>
                <TableCell style={{ width: 120 }}>{product.name}</TableCell>
                <Tooltip title={product.description}>
                  <TableCell style={{ width: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {truncateDescription(product.description)}
                  </TableCell>
                </Tooltip>
                <TableCell style={{ width: 100 }}>{product.quantity} Un.</TableCell>
                <TableCell style={{ width: 100 }}>
                  R$ {product.price.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell style={{ display: 'flex', gap: '1rem', width: 100 }}>
                  <Tooltip title="Editar produto">
                    <span>
                      <FaEdit
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenProductModal(product)}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip title="Excluir produto">
                    <span>
                      <FaTrash
                        style={{ cursor: "pointer" }}
                        color="red"
                        onClick={() => handleDeleteProduct(product.id)}
                      />
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={10} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "Todos", value: -1 }]}
                colSpan={8}
                count={filteredProducts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "Linhas por página",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {/* Modal para criar ou editar produto */}
      <ProductModal
        open={isProductModalOpen}
        onClose={handleCloseProductModal}
        onSave={handleSaveProduct}
        product={currentProduct}
      />

      {/* Modal para gerar relatório */}
      <ReportModal open={isReportModalOpen} onClose={handleCloseReportModal} />
      <ToastContainer />
    </Box>
  );
}
