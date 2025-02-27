import  { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
})


export default function RootLayout({children}) {
  return (
    <html lang="pt-br" className={montserrat.className}>
      <body>
  <div class="drop"></div>
  <div class="wave"></div>
</body>
        <body>{children}</body>
    </html>
  )
}
