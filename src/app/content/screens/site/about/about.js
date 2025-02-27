import React from 'react';
import { Container, Typography, Grid, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TopBar from '@/app/components/Topbar/TopbarSite';
import styles from './About.module.css';
import Footer from '@/app/components/Footer/Footer';
import Img1 from '../../../../../../public/siteImages/sobre-1.png'
import Img2 from '../../../../../../public/siteImages/sobre-2.png'
import Img3 from '../../../../../../public/siteImages/sobre-3.png'
import Image from 'next/image';

const AboutUs = () => {
  return (
    <div>
      <TopBar />
      <Container className={styles.container}>
        <Typography variant="h4" className={styles.title}>
          Bem-vindo à CoffeeCode!
        </Typography>
        <Box className={styles.descriptionBox}>
          <Typography variant="body1" className={styles.description}>
            Na CoffeeCode, somos apaixonados por café e por oferecer a melhor experiência para nossos clientes. Nossa jornada começou com um simples desejo: compartilhar a arte e a ciência do café de alta qualidade com o mundo. Hoje, somos uma referência na produção de cafés especiais, com torrefação 100% própria e um compromisso inabalável com a excelência.
          </Typography>
          <Typography variant="body1" className={styles.description}>
            Nossa missão é simples: proporcionar uma experiência de café inigualável, desde o grão até a última gota. Acreditamos que cada xícara de café deve ser uma obra de arte, e nos dedicamos a explorar constantemente novas formas de aprimorar nossos produtos e serviços. Queremos que nossos clientes sintam a paixão e o cuidado que colocamos em cada etapa do processo.
          </Typography>
          <Typography variant="body1" className={styles.description}>
            Oferecemos uma ampla variedade de cafés, desde grãos inteiros até cápsulas e moídos, atendendo a todos os gostos e preferências. Cada produto é o resultado de um meticuloso processo de seleção e torrefação, garantindo uma experiência única e deliciosa.
          </Typography>
          <Typography variant="body1" className={styles.description}>
            Na CoffeeCode, acreditamos que o café é mais do que uma bebida – é uma experiência, uma paixão e uma comunidade. Convidamos você a explorar nossos produtos, visitar nossa loja e se juntar à nossa comunidade de amantes do café. Seja para uma conversa casual, uma reunião de negócios ou um momento de relaxamento, temos o café perfeito para cada ocasião.
          </Typography>
        </Box>
        <Box className={styles.imageBox}>
          <Box>
            <Image src={Img1.src} width={410} height={410} style={{objectFit:'contain'}}/>
          </Box>
          <Box style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <Image src={Img2.src} width={400} height={200} style={{objectFit:'cover'}}/>
            <Image src={Img3.src} width={400} height={200}style={{objectFit:'cover'}} />
          </Box>

        </Box>
        <Typography variant="h5" className={styles.faqTitle}>
          Dúvidas Frequentes
        </Typography>
        <Accordion className={styles.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className={styles.accordionSummary}>
            <Typography>Dúvida 1</Typography>
          </AccordionSummary>
          <AccordionDetails className={styles.accordionDetails}>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion className={styles.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className={styles.accordionSummary}>
            <Typography>Dúvida 2</Typography>
          </AccordionSummary>
          <AccordionDetails className={styles.accordionDetails}>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion className={styles.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className={styles.accordionSummary}>
            <Typography>Dúvida 3</Typography>
          </AccordionSummary>
          <AccordionDetails className={styles.accordionDetails}>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>
      <Footer/>
    </div>
  );
};

export default AboutUs;
