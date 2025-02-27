import  { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ["100", "200", "300", "400", "700"]
})


export default function RootLayout({children}) {
  return (
    <html lang="pt-br" className={montserrat.className}>
        <body>{children}</body>
    </html>
  )
}
