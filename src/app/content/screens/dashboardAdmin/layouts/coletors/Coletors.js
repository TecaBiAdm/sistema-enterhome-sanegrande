import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
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
import { useTheme } from "@mui/material/styles";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { FaEdit, FaTrash } from "react-icons/fa";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";

import toast from "react-hot-toast";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import HeaderDashboard from "@/app/components/HeaderDashboard";
import { useCompany } from "@/app/context/CompanyContext";
import PurchaseModal from "@/app/components/Modal/Admin/ModalShop";

import {
  deleteCollectorById,
  fetchedCollectors,
  fetchedCollectorsByCompany,
} from "./API";
import FilterDrawer from "@/app/components/FilterDrawer/FilterDrawer";
import FilterPurchases from "@/app/components/FilterPurchases/FilterPurchases";
import { PDFDocument, rgb } from "pdf-lib";
import { formatCNPJ } from "@/app/utils/formatCNPJ";
import { formatPhone } from "@/app/utils/formatPhone";
import CollectorModal from "@/app/components/Modal/Admin/ModalColetors";

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
        aria-label="primeira página"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="página anterior"
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
        aria-label="próxima página"
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
        aria-label="última página"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function Coletors() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [filteredCollectors, setFilteredCollectors] = useState([]);
  const [dateFilteredPurchases, setDateFilteredPurchases] =
    useState(filteredCollectors);
  const [setIsLoading, isLoading] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedPurchases, setSelectedPurchases] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [monthMenuAnchor, setMonthMenuAnchor] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState({
    materialType: "",
    supplier: "",
    startDate: null,
    endDate: null,
  });
  const { company } = useCompany();
  const theme = useTheme();

  const formatDate = (date) => {
    if (!date) return "-";
    const newDate = new Date(date);
    return newDate.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  useEffect(() => {
    const filtered = filteredCollectors.filter((purchase) => {
      const purchaseDate = new Date(purchase.purchaseDate);
   
      const monthMatch =
        selectedMonth === "" || purchaseDate.getMonth() === selectedMonth;
      const yearMatch =
        purchaseDate.getFullYear().toString() === selectedYear.toString();

      return monthMatch && yearMatch;
    });

    setDateFilteredPurchases(filtered);
  }, [selectedMonth, selectedYear, filteredCollectors]);


    useEffect(() => {
      if (company) {
        const loadCollectors = async () => {
          
          try {
            const employeesData = await fetchedCollectorsByCompany(company.name);
            const activeEmployees = employeesData.filter(
              (employee) => !employee.deletedAt
            );
            setEmployees(activeEmployees);
            setFilteredEmployess(activeEmployees);
          } catch (error) {
            console.error("Erro ao carregar coletores", error);
          } finally {
         
          }
        };
        loadCollectors();
      }
    }, [company]);

  const months = [
    { value: "", label: "Todos" },
    { value: "0", label: "Janeiro" },
    { value: "1", label: "Fevereiro" },
    { value: "2", label: "Março" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Maio" },
    { value: "5", label: "Junho" },
    { value: "6", label: "Julho" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Setembro" },
    { value: "9", label: "Outubro" },
    { value: "10", label: "Novembro" },
    { value: "11", label: "Dezembro" },
  ];
  const handleMonthClick = (event) => {
    setMonthMenuAnchor(event.currentTarget);
  };

  const handleMonthClose = () => {
    setMonthMenuAnchor(null);
  };

  const handleMonthSelect = (monthValue) => {
    setSelectedMonth(monthValue);
    handleMonthClose();
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  const formatQuantity = (value) => {
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  const handleExportPdfSelected = () => {
    const now = new Date();
    
    const getCurrentMonthYear = () => {
      const months = [
        "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
        "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
      ];
      const date = new Date();
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    // Separar dados em grupos especiais e outros itens
    const separatePurchaseData = () => {
      const selectedData = filteredPurchases
        .filter(purchase => selectedPurchases.includes(purchase._id))
        .sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));

      const longTermItems = [];
      const regularItems = [];

      selectedData.forEach(purchase => {
        const isSpecialItem = purchase.items.some(item => {
          const name = item.name.toLowerCase().trim();
          const type = item.type ? item.type.toLowerCase().trim() : '';
          return name === 'coletor' || 
                 name === 'coletores' || 
                 type === 'coletor' || 
                 type === 'coletores' ||
                 name.includes('ar-condicionado') || 
                 name.includes('ar condicionado') ||
                 type.includes('ar-condicionado') ||
                 type.includes('ar condicionado');
        });

        // Se é um item especial ou tem mais de 5 parcelas, vai para longTermItems
        if (isSpecialItem || purchase.installments > 5) {
          longTermItems.push(purchase);
        } else {
          regularItems.push(purchase);
        }
      });

      return { longTermItems, regularItems };
    };

  
    const groupByMonth = (purchases) => {
      const purchasesByMonth = {};
      
      purchases.forEach(purchase => {
        // Primeiro, adiciona a entrada (se existir) no mês da compra
        if (purchase.entrancy && purchase.entrancy > 0) {
          const purchaseDate = new Date(purchase.purchaseDate);
          const entrancyMonthKey = `${purchaseDate.getMonth()}-${purchaseDate.getFullYear()}`;
          const entrancyMonthName = purchaseDate.toLocaleString('pt-BR', { 
            month: 'long', 
            year: 'numeric' 
          }).toUpperCase();
    
          if (!purchasesByMonth[entrancyMonthKey]) {
            purchasesByMonth[entrancyMonthKey] = {
              monthName: entrancyMonthName,
              installments: [],
              totalValue: 0
            };
          }
    
          purchasesByMonth[entrancyMonthKey].installments.push({
            purchase,
            installmentNumber: 'Entrada',
            installmentDate: purchase.entrancyPaymentDate || purchase.purchaseDate,
            installmentValue: purchase.entrancy
          });
          purchasesByMonth[entrancyMonthKey].totalValue += purchase.entrancy;
        }
    
        // Depois, adiciona as parcelas regulares
        if (purchase.installmentDates && purchase.installmentDates.length > 0) {
          const remainingValue = purchase.totalPrice - (purchase.entrancy || 0);
          const installmentValue = remainingValue / purchase.installments;
    
          purchase.installmentDates.forEach((date, index) => {
            const installmentDate = new Date(date);
            const monthKey = `${installmentDate.getMonth()}-${installmentDate.getFullYear()}`;
            const monthName = installmentDate.toLocaleString('pt-BR', { 
              month: 'long', 
              year: 'numeric' 
            }).toUpperCase();
    
            if (!purchasesByMonth[monthKey]) {
              purchasesByMonth[monthKey] = {
                monthName,
                installments: [],
                totalValue: 0
              };
            }
            
            purchasesByMonth[monthKey].installments.push({
              purchase,
              installmentNumber: index + 1,
              installmentDate: date,
              installmentValue
            });
            purchasesByMonth[monthKey].totalValue += installmentValue;
          });
        }
      });
    
      return purchasesByMonth;
    };
    const generateLongTermSection = (items) => {
      const tableData = [];
      let totalValue = 0;

      if (items.length > 0) {
        // Cabeçalho da seção
        tableData.push([{
          content: "PRODUTOS PARCELADOS (COLETORES, AR-CONDICIONADO E ACIMA DE 5 PARCELAS)",
          colSpan: 13,
          styles: {
            fillColor: [50, 50, 50],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
            halign: 'center',
            cellPadding: 3
          }
        }]);

        items.forEach(purchase => {
          totalValue += purchase.totalPrice;

          // Cabeçalho do material
          tableData.push([{
            content: purchase.materialType,
            colSpan: 13,
            styles: {
              fillColor: [200, 200, 200],
              fontStyle: 'bold',
              fontSize: 7,
              halign: 'left',
              cellPadding: 1
            }
          }]);

          // Detalhes dos itens
          purchase.items.forEach(item => {
            tableData.push([
              item.name,
              item.type || '-',
              formatQuantity(item.quantity),
              formatCurrency(item.unitPrice),
              formatCurrency(item.totalPrice),
              purchase.supplier.name,
              purchase.paymentMethod,
              purchase.installments,
              formatCurrency(purchase.entrancy || 0),
              formatDate(purchase.entrancyPaymentDate),
              formatCurrency(item.totalPrice / purchase.installments),
              formatDate(purchase.purchaseDate),
              formatDate(purchase.deliveryDate)
            ]);
          });

          // Total da compra se houver mais de um item
          if (purchase.items.length > 1) {
            tableData.push([
              {
                content: "Total",
                colSpan: 4,
                styles: {
                  fontStyle: "bold",
                  fillColor: [240, 240, 240],
                  halign: "right"
                }
              },
              {
                content: formatCurrency(purchase.totalPrice),
                styles: {
                  fontStyle: "bold",
                  fillColor: [240, 240, 240],
                  halign: "center"
                }
              },
              {
                content: "",
                colSpan: 7,
                styles: {
                  fillColor: [240, 240, 240]
                }
              }
            ]);
          }

          // Todas as parcelas
          const installmentsRows = [];
          for (let i = 0; i < purchase.installmentDates.length; i += 4) {
            const installmentsGroup = purchase.installmentDates
              .slice(i, i + 4)
              .map((date, idx) => {
                const installmentNumber = i + idx + 1;
                return `${installmentNumber}ª: ${formatDate(date)} - ${formatCurrency(purchase.installmentValue)}`;
              })
              .join(" | ");

            installmentsRows.push([{
              content: installmentsGroup,
              colSpan: 13,
              styles: {
                fillColor: [240, 240, 240],
                fontSize: 6,
                cellPadding: 1
              }
            }]);
          }

          tableData.push(...installmentsRows);
          
          // Espaçamento
          tableData.push([{ 
            content: "", 
            colSpan: 13, 
            styles: { cellPadding: 1 } 
          }]);
        });

        // Total da seção
        tableData.push([{
          content: `TOTAL PRODUTOS PARCELADOS: ${formatCurrency(totalValue)}`,
          colSpan: 13,
          styles: {
            fillColor: [100, 100, 100],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 8,
            halign: 'right',
            cellPadding: 2
          }
        }]);

        // Espaçamento entre seções
        tableData.push([{ 
          content: "", 
          colSpan: 12, 
          styles: { cellPadding: 4 } 
        }]);
      }

      return { tableData, totalValue };
    };

    const baseHeaders = [
      "Material", "Tipo", "Quantidade", "Valor Unit.",
      "Valor Total", "Fornecedor", "Forma Pgto.", "Parcelas",
      "Entrada", "Data Pg. Entrada", "Valor Parcela", "Data Compra", "Data Entrega"
    ];
  
    const generateTableData = () => {
      const { longTermItems, regularItems } = separatePurchaseData();
      const { tableData: longTermData, totalValue: longTermTotalValue } = generateLongTermSection(longTermItems);
      const purchasesByMonth = groupByMonth(regularItems);
      
      const tableData = [...longTermData];
      let monthlyTotalValue = 0;
  
      const sortedMonths = Object.keys(purchasesByMonth).sort((a, b) => {
        const [monthA, yearA] = a.split('-');
        const [monthB, yearB] = b.split('-');
        return yearA - yearB || monthA - monthB;
      });
  
      if (regularItems.length > 0) {
        tableData.push([{
          content: "DEMAIS MATERIAIS - POR MÊS",
          colSpan: 13,
          styles: {
            fillColor: [50, 50, 50],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
            halign: 'center',
            cellPadding: 3
          }
        }]);

        sortedMonths.forEach(monthKey => {
          const monthData = purchasesByMonth[monthKey];
          monthlyTotalValue += monthData.totalValue;

          tableData.push([{
            content: `${monthData.monthName} - Total de Parcelas: ${formatCurrency(monthData.totalValue)}`,
            colSpan: 13,
            styles: {
              fillColor: [100, 100, 100],
              textColor: [255, 255, 255],
              fontStyle: 'bold',
              fontSize: 8,
              halign: 'left',
              cellPadding: 2
            }
          }]);

          const groupedByPurchase = monthData.installments.reduce((acc, curr) => {
            const purchaseId = curr.purchase._id;
            if (!acc[purchaseId]) {
              acc[purchaseId] = {
                purchase: curr.purchase,
                installments: []
              };
            }
            acc[purchaseId].installments.push(curr);
            return acc;
          }, {});
          Object.values(groupedByPurchase).forEach(({ purchase, installments }) => {
            tableData.push([{
              content: purchase.materialType,
              colSpan: 13,
              styles: {
                fillColor: [200, 200, 200],
                fontStyle: 'bold',
                fontSize: 7,
                halign: 'left',
                cellPadding: 1
              }
            }]);

            purchase.items.forEach(item => {
              const itemInstallmentValue = item.totalPrice / purchase.installments;

              tableData.push([
                item.name,
                item.type || '-',
                formatQuantity(item.quantity),
                formatCurrency(item.unitPrice),
                formatCurrency(item.totalPrice),
                purchase.supplier.name,
                purchase.paymentMethod,
                purchase.installments,
                formatCurrency(purchase.entrancy || 0),
                formatDate(purchase.entrancyPaymentDate),
                formatCurrency(itemInstallmentValue),
                formatDate(purchase.purchaseDate),
                formatDate(purchase.deliveryDate)
              ]);
            });

            if (purchase.items.length > 1) {
              tableData.push([
                {
                  content: "Total",
                  colSpan: 4,
                  styles: {
                    fontStyle: "bold",
                    fillColor: [240, 240, 240],
                    halign: "right"
                  }
                },
                {
                  content: formatCurrency(purchase.totalPrice),
                  styles: {
                    fontStyle: "bold",
                    fillColor: [240, 240, 240],
                    halign: "center"
                  }
                },
                {
                  content: "",
                  colSpan: 3,
                  styles: {
                    fillColor: [240, 240, 240]
                  }
                },
                {
                  content: purchase.entrancy ? formatCurrency(purchase.entrancy) : "0",
                  styles: {
                    fontStyle: "bold",
                    fillColor: [240, 240, 240],
                    halign: "center"
                  }
                },
                {
                  content: formatCurrency(purchase.installmentValue),
                  styles: {
                    fontStyle: "bold",
                    fillColor: [240, 240, 240],
                    halign: "center"
                  }
                },
                {
                  content: "",
                  colSpan: 2,
                  styles: {
                    fillColor: [240, 240, 240]
                  }
                }
              ]);
            }

            const installmentsInfo = installments
              .map(inst => `${inst.installmentNumber}ª: ${formatDate(inst.installmentDate)} - ${formatCurrency(inst.installmentValue)}`)
              .join(" | ");

            tableData.push([{
              content: `Parcelas do mês: ${installmentsInfo}`,
              colSpan: 12,
              styles: {
                fillColor: [240, 240, 240],
                fontSize: 6,
                cellPadding: 1
              }
            }]);

            tableData.push([{ 
              content: "", 
              colSpan: 12, 
              styles: { cellPadding: 1 } 
            }]);
          });
        });
      }
  
      
      const totalValue = monthlyTotalValue + longTermTotalValue;
      return { tableData, totalValue };
    };
  
    // Criar documento PDF
    const doc = new jsPDF({
      orientation: "landscape"
    });
  
    const primaryColor = [158, 197, 232];
    const borderColor = [0, 0, 0];
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
  
    // Configuração do cabeçalho
    const titleY = 15;
    const titleHeight = 15;
    const logoWidth = 48;
    const logoHeight = 10;
    const logoX = 20;
    const logoY = titleY + (titleHeight - logoHeight) / 2;

    // Desenhar retângulo cinza
    doc.setFillColor(240, 240, 240);
    doc.setDrawColor(0, 0, 0);
    doc.rect(14, titleY, pageWidth - 28, titleHeight, "FD");

    // Adicionar logo
    company.name === "Sanegrande"
      ? doc.addImage(
          "../../../../icons/logo-sanegrande-2.png",
          "PNG",
          logoX,
          logoY,
          logoWidth,
          logoHeight
        )
      : doc.addImage(
          "../../../../icons/logo-enterhome-3.png",
          "PNG",
          logoX,
          logoY,
          logoWidth,
          logoHeight
        );

    // Configurar e adicionar título centralizado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    const title = `CONTROLE DE COMPRAS - ${
      company.name === "Sanegrande"
        ? "SANEGRANDE CONSTRUTORA LTDA"
        : "ENTER HOME"
    }`;
    const textWidth =
      (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const titleX = (pageWidth - textWidth) / 2;
    doc.text(title, titleX, titleY + titleHeight / 2 + 1);

    // Adicionar mês e ano à direita
    doc.setFontSize(8);
    const monthYear = getCurrentMonthYear();
    doc.text(monthYear, pageWidth - 20, titleY + titleHeight / 2 + 1, {
      align: "right"
    });

    // Data de geração
    doc.setFontSize(7);
    doc.setTextColor(100);
    doc.text(
      `Gerado em: ${now.toLocaleDateString("pt-BR")} às ${now.toLocaleTimeString("pt-BR")}`,
      pageWidth - 20,
      titleY + titleHeight + 5,
      { align: "right" }
    );
    
    // Gerar dados da tabela
    const { tableData, totalValue } = generateTableData();
    
    // Configurar tabela
    const tableStart = titleY + titleHeight + 10;
    doc.autoTable({
      head: [baseHeaders],
      body: tableData,
      startY: tableStart,
      theme: 'grid',
      styles: {
        fontSize: 6,
        cellPadding: 2,
        lineColor: borderColor,
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 20 },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 'auto' },
        6: { cellWidth: 20, halign: 'center' },
        7: { cellWidth: 20, halign: 'center' },
        8: { cellWidth: 20, halign: 'center' },
        8: { cellWidth: 20, halign: 'center' },
        9: { cellWidth: 25, halign: 'center' },
        10: { cellWidth: 25, halign: 'center' },
        11: { cellWidth: 25, halign: 'center' },
      },
      margin: { top: 10, left: 14, right: 14, bottom: 20 },
    });
    
    // Adicionar total geral no final do documento
    const finalY = doc.previousAutoTable.finalY + 5;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    
    // Calcular largura do texto do total
    const totalText = `TOTAL GERAL: ${formatCurrency(totalValue)}`;
    const totalWidth = (doc.getStringUnitWidth(totalText) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    const padding = 10;
    
    // Desenhar retângulo para o total
    doc.text(totalText, pageWidth - 20, finalY, { align: 'right' });
    
    // Adicionar numeração de páginas
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
    
    // Salvar o PDF
    const fileName = `controle_compras_${company.name.toLowerCase()}_${now.getTime()}.pdf`;
    doc.save(fileName);
    };


  const handleExportSelected = () => {
    const selectedData = filteredPurchases.filter((purchase) =>
      selectedPurchases.includes(purchase._id)
    );

    const now = new Date();
    const reportDate = `${now.toLocaleDateString(
      "pt-BR"
    )} ${now.toLocaleTimeString("pt-BR")}`;

    // Encontrar o número máximo de parcelas
    const maxInstallments = Math.max(
      ...selectedData.map((p) => p.installmentDates?.length || 0)
    );

    // Criar os headers dinâmicos para as parcelas
    const installmentHeaders = Array.from(
      { length: maxInstallments },
      (_, i) => `Data ${i + 1}ª Parcela`
    );

    // Calcular o valor total das compras
    const totalValue = selectedData.reduce(
      (acc, purchase) => acc + purchase.totalPrice,
      0
    );

    const baseHeaders = [
      "Material",
      "Fornecedor",
      "CNPJ",
      "Quantidade",
      "Valor Unitário",
      "Valor Total",
      "Forma Pagamento",
      "Parcelas",
      "Entrada",
      "Valor Parcela",
      "Data Compra",
      "Data Entrega",
    ];

    // Combinar headers base com headers de parcelas
    const allHeaders = [...baseHeaders, ...installmentHeaders];

    const wsData = [
      ["Relatório de Compras"],
      [`Empresa: ${company.name}`],
      [`Gerado em: ${reportDate}`],
      [],
      allHeaders,
      ...selectedData.map((purchase) => {
        // Dados base da compra
        const baseData = [
          purchase.materialType,
          purchase.supplier.name,
          formatCNPJ(purchase.supplier.cnpj),
          purchase.quantity,
          formatCurrency(purchase.unitPrice),
          formatCurrency(purchase.totalPrice),
          purchase.paymentMethod,
          purchase.installments,
          formatCurrency(purchase.entrancy),
          formatCurrency(purchase.installmentValue),
          formatDate(purchase.purchaseDate),
          formatDate(purchase.deliveryDate),
        ];

        // Adicionar datas das parcelas, preenchendo com vazios se necessário
        const installmentDates = Array.from(
          { length: maxInstallments },
          (_, i) =>
            purchase.installmentDates[i]
              ? formatDate(purchase.installmentDates[i])
              : "-"
        );

        return [...baseData, ...installmentDates];
      }),
      [], // Linha vazia
      [`Valor Total : ${formatCurrency(totalValue)}`], // Linha com o total
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Definindo estilos
    const headerStyle = {
      fill: { fgColor: { rgb: "9EC5E8" } },
      font: { bold: true, color: { rgb: "000000" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    const titleStyle = {
      font: { bold: true, size: 16, color: { rgb: "000000" } },
      alignment: { horizontal: "center" },
    };

    const infoStyle = {
      font: { size: 12 },
      alignment: { horizontal: "left" },
    };

    const totalStyle = {
      font: { bold: true, size: 12, color: { rgb: "000000" } },
      alignment: { horizontal: "left" },
    };

    // Calculando o número total de colunas
    const totalColumns = allHeaders.length;

    // Aplicando larguras das colunas
    ws["!cols"] = [
      { width: 20 }, // Material
      { width: 25 }, // Fornecedor
      { width: 20 }, // CNPJ
      { width: 15 }, // Quantidade
      { width: 15 }, // Valor Unitário
      { width: 15 }, // Valor Total
      { width: 20 }, // Forma Pagamento
      { width: 5 }, // Parcelas
      { width: 10 }, // Entrada
      { width: 15 }, // Valor Parcela
      { width: 15 }, // Data Compra
      { width: 15 }, // Data Entrega
      // Adicionar larguras para as colunas de parcelas
      ...Array(maxInstallments).fill({ width: 15 }),
    ];

    // Estilo do título
    ws["A1"] = { v: "Relatório de Compras", s: titleStyle };
    ws["A2"] = { v: `Empresa: ${company.name}`, s: infoStyle };
    ws["A3"] = { v: `Gerado em: ${reportDate}`, s: infoStyle };

    // Estilo do cabeçalho
    const headerRange = XLSX.utils.decode_range(
      `A5:${XLSX.utils.encode_col(totalColumns - 1)}5`
    );
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cell = XLSX.utils.encode_cell({ r: 4, c: col });
      ws[cell].s = headerStyle;
    }

    // Aplicando estilo ao total
    const lastRowIndex = wsData.length;
    const totalCell = XLSX.utils.encode_cell({ r: lastRowIndex - 1, c: 0 });
    ws[totalCell].s = totalStyle;

    // Mesclando células do título e do total
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: totalColumns - 1 } }, // Título
      { s: { r: 1, c: 0 }, e: { r: 1, c: totalColumns - 1 } }, // Empresa
      { s: { r: 2, c: 0 }, e: { r: 2, c: totalColumns - 1 } }, // Data
      {
        s: { r: lastRowIndex - 1, c: 0 },
        e: { r: lastRowIndex - 1, c: totalColumns - 1 },
      }, // Total
    ];

    // Configurando altura das linhas
    ws["!rows"] = [
      { hpt: 30 }, // Altura da linha do título
      { hpt: 25 }, // Altura da linha da empresa
      { hpt: 25 }, // Altura da linha da data
      { hpt: 20 }, // Linha vazia
      { hpt: 25 }, // Altura do cabeçalho
    ];

    // Criando e salvando o arquivo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Compras");
    XLSX.writeFile(wb, "compras_selecionadas.xlsx");
  };

  // Funções auxiliares de formatação
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const loadPurchases = async () => {
    try {
      const purchaseData = await fetchedPurchasesByCompany(company.name);
      const activePurchases = purchaseData.filter(
        (purchase) => !purchase.deletedAt
      );

      setPurchases(activePurchases);
      setFilteredPurchases(activePurchases);
    } catch (error) {
      console.error("Erro ao carregar compras", error);
      toast.error("Erro ao carregar as compras");
    }
  };

  useEffect(() => {
    if (company) {
      loadPurchases();
    }
  }, [company, purchases.length]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPurchaseModal = (purchase = null) => {
    //Para carregar novamente os dados após atualizar uma compra
    loadPurchases();
    setCurrentPurchase(purchase);
    setIsPurchaseModalOpen(true);
  };

  const handleClosePurchaseModal = () => {
    setIsPurchaseModalOpen(false);
    setCurrentPurchase(null);
  };

  const handleSavePurchase = (updatedPurchase) => {
    if (currentPurchase) {
      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) =>
          purchase.id === updatedPurchase.id ? updatedPurchase : purchase
        )
      );
    } else {
      setPurchases((prevPurchases) => [...prevPurchases, updatedPurchase]);
    }
    loadPurchases()
  };

  const handleDeletePurchase = async (id) => {
    const deleted = await deleteCollectorById(id);
    if (deleted) {
      setPurchases((prevItem) => prevItem.filter((item) => item.id !== id));
      setFilteredPurchases((prevExpense) =>
        prevExpense.filter((expense) => expense.id !== id)
      );
      loadPurchases()
      toast.success("Compra excluída com sucesso.");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const applyFilters = () => {
    const filtered = purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.purchaseDate);
      const matchesDate =
        (!filters.year || purchaseDate.getFullYear() === Number(filters.year)) &&
        (!filters.month || purchaseDate.getMonth() + 1 === Number(filters.month));
  
      const matchesMaterial =
        !filters.materialType || purchase.materialType === filters.materialType;
      const matchesSupplier =
        !filters.supplier || purchase.supplier.name === filters.supplier;
  
      return matchesDate && matchesMaterial && matchesSupplier;
    });
    
    setFilteredPurchases(filtered);
  };
  
  const buttonStyles = {
    backgroundColor: "#3A8DFF",
    color: "#ffffff",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#3A8DFF",
    },
  };

 

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        p: 2,
        mt: -6,
        ml: -3,
      }}
    >
      <Dialog
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      >
        <DialogTitle>Exportar Coletores</DialogTitle>
        <DialogContent>Selecione o formato de exportação:</DialogContent>
        <DialogActions sx={{ margin: "0 auto", textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={() => {
              handleExportSelected();
              setIsExportModalOpen(false);
            }}
            startIcon={<ArticleIcon />}
          >
            Excel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleExportPdfSelected();
              setIsExportModalOpen(false);
            }}
            startIcon={<PictureAsPdfIcon />}
          >
            PDF
          </Button>
        </DialogActions>
      </Dialog>
      <HeaderDashboard
        subtitle="Gerencie os coletores da empresa"
        title="Coletores"
      />

      <FilterPurchases
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        purchases={purchases}
        buttonStyles={buttonStyles}
      />

      <Box
        display="flex"
        gap={2}
        p={2}
        ml={-2}
        mt={-3}
        sx={{
          backgroundColor: "background.paper",

          zIndex: 3,
        }}
      >
        <Button
          variant="contained"
          sx={buttonStyles}
          onClick={() => handleOpenPurchaseModal()}
          startIcon={<AddIcon />}
        >
          Novo Coletor
        </Button>

        <Button
          variant="outlined"
          onClick={() => setFilterDrawerOpen(true)}
          startIcon={<FilterListIcon />}
        >
          Filtros
        </Button>

        <Menu
          anchorEl={monthMenuAnchor}
          open={Boolean(monthMenuAnchor)}
          onClose={handleMonthClose}
        >
          {months.map((month) => (
            <MenuItem
              key={month.value}
              onClick={() => handleMonthSelect(month.value)}
              selected={month.value === selectedMonth}
            >
              {month.label}
            </MenuItem>
          ))}
        </Menu>
        {selectedPurchases.length > 0 && (
          <Button
            variant="contained"
            startIcon={<ArticleIcon />}
            onClick={() => setIsExportModalOpen(true)}
          >
            Exportar Selecionados
          </Button>
        )}


      </Box>

      

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "calc(100vh - 250px)", // Altura máxima considerando o cabeçalho
          width: "100%",
          overflow: "auto", // Habilita scroll em ambas direções quando necessário
          overflowY: 'scroll'
        }}
      >
        <Table stickyHeader sx={{ minWidth: 1200 }}>
          {" "}
          {/* Largura mínima para garantir que todas as colunas caibam */}
          <TableHead>
            <TableRow>
              <TableCell
                padding="checkbox"
                sx={{
                  position: "sticky",
                  left: 0,
                  backgroundColor: "background.default",
                  zIndex: 3,
                }}
              >
                <Checkbox
                  checked={
                    selectedPurchases.length === filteredCollectors.length
                  }
                  indeterminate={
                    selectedPurchases.length > 0 &&
                    selectedPurchases.length < filteredCollectors.length
                  }
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelectedPurchases(
                        filteredCollectors.map((emp) => emp._id)
                      );
                    } else {
                      setSelectedPurchases([]);
                    }
                  }}
                />
              </TableCell>
              {/* Definir larguras fixas para as colunas */}
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: 150 }}
              >
                Matrícula
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: 150 }}
              >
                Funcionário
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: 100 }}
              >
                MEI
              </TableCell>
              
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                MAC
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Condição
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: 100 }}
              >
                Status
              </TableCell>
             
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  minWidth: 100,
                  position: "sticky",
                  right: 0,
                  backgroundColor: "background.default",
                  zIndex: 3,
                }}
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCollectors
              .slice(page)
              .map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell
                    padding="checkbox"
                    sx={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: "background.default",
                      zIndex: 2,
                    }}
                  >
                    <Checkbox
                      checked={selectedPurchases.includes(purchase._id)}
                      onChange={(event) => {
                        event.stopPropagation();
                        if (event.target.checked) {
                          setSelectedPurchases([
                            ...selectedPurchases,
                            purchase._id,
                          ]);
                        } else {
                          setSelectedPurchases(
                            selectedPurchases.filter(
                              (id) => id !== purchase._id
                            )
                          );
                        }
                      }}
                      onClick={(event) => event.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell align="center">{purchase.materialType}</TableCell>
                  <TableCell align="center">{purchase.supplier.name}</TableCell>
                 <TableCell align="center">
  {purchase?.items?.reduce((total, item) => total + item.quantity, 0)}
</TableCell>
                  
                  <TableCell align="center">
                    {purchase.totalPrice.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell align="center">{purchase.paymentMethod}</TableCell>
                  <TableCell align="center">
                    {purchase?.entrancy
                      ? purchase.entrancy.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    {formatDate(purchase.purchaseDate)}
                  </TableCell>
                  <TableCell align="center">
                    {formatDate(purchase.deliveryDate)}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      position: "sticky",
                      right: 0,
                      backgroundColor: "background.default",
                      zIndex: 2,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
                      <Tooltip title="Editar Compra">
                        <span>
                          <FaEdit
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenPurchaseModal(purchase)}
                          />
                        </span>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <span>
                          <FaTrash
                            style={{ cursor: "pointer" }}
                            color="red"
                            onClick={() => handleDeletePurchase(purchase._id)}
                          />
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      

      <CollectorModal
        open={isPurchaseModalOpen}
        onClose={handleClosePurchaseModal}
        onSave={handleSavePurchase}
        item={currentPurchase}
      />
    </Box>
  );
}
