import { AuthProvider } from "@/app/context/AuthContext";
import "./globals.css";
import Theme from "@/app/theme/theme";
import { CartProvider } from "@/app/context/CartContext";
import { SnackbarProvider } from "notistack";
import { CompanyProvider } from "@/app/context/CompanyContext";
import { Toaster } from 'react-hot-toast';
import { ChakraProvider } from "@chakra-ui/react"

export default function MyApp({ Component, pageProps }) {
  return (

<SnackbarProvider maxSnack={3} >
      <CompanyProvider>
        <CartProvider>
          <AuthProvider>
            <Theme>
              <Toaster />
              <Component {...pageProps} />
            </Theme>
          </AuthProvider>
        </CartProvider>
      </CompanyProvider>
    </SnackbarProvider>


    
  );
}
