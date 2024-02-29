import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import userAgent from "user-agents";

const esperaAleatoria = (min: any, max: any) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const launchBrowserWithProxyAndUserAgent = async (proxy: any) => {
  const browser = await puppeteer.launch({
    args: [`--proxy-server=${proxy}`],
  });
  const page = await browser.newPage();

  // Genera un User-Agent aleatorio y lo asigna a la página
  const UserAgent = new userAgent();
  await page.setUserAgent(UserAgent.toString());
  return { browser, page };
};

export async function GET(request: Request) {
    try {
      const proxies: any = await obtenerProxies();
      const AllProxies = Array.from(proxies);
  
      /*for (const proxy of AllProxies) {
        try {
          console.log(`Lanzando navegador con proxy: ${proxy}`);
          
          const { browser, page } = await launchBrowserWithProxyAndUserAgent(proxy);
          await page.goto('https://www.youtube.com/watch?v=VrBLfXfXfoY&t=75s', {waitUntil: 'networkidle2', timeout: 10000}).catch(e => console.log(`Error al cargar la página con el proxy ${proxy}: ${e.message}`));
          console.log(`Página cargada correctamente con el proxy: ${proxy}`);

          await browser.close();
        } catch (error) {
          console.log(`Error usando el proxy ${proxy}: ${error}`);
          // Aquí simplemente continuamos con el siguiente proxy sin hacer nada más.
        }
      }*/
      return NextResponse.json({ proxies });
    } catch (error) {
      console.log("error------------");
      return NextResponse.json({ error });
    }
  }
  




const obtenerProxies = async () => {
  try {
    const url = "https://free-proxy-list.net/"; // Reemplaza esta URL por la URL real a la que necesitas acceder
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Espera a que la tabla de proxies esté cargada; ajusta este selector según sea necesario
    await page.waitForSelector('table');

    // Extrae las direcciones IP y puertos de la tabla
    const proxies = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
        return rows.map((row:any) => {
          // Asume que la IP está en la primera celda y el puerto en la segunda
          const ip = row.cells[0].innerText;
          const port = row.cells[1].innerText;
          return `${ip}:${port}`;
        });
      });
    await browser.close();
    return proxies;
  } catch (error) {
    console.error('Error al obtener proxies:', error);
    return []; // Retorna una lista vacía en caso de error
  }
};






/*const obtenerProxies = async () => {
    try {
        const url = "https://proxyscrape.com/free-proxy-list"; // Sustituye por la URL de tu fuente de proxies
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('#table-mbl tbody tr', {visible: true});
       
          
          // Uso en tu script Puppeteer
          await wait(5000); // Espera 5 segundos        
        const ipsAndPorts = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('#table-mbl tbody tr'));
            return rows.map((row:any) => {
              const ip = row.querySelector('td:nth-child(2)').innerText; // La IP está en la segunda columna
              const portSpan = row.querySelector('.ports-table span'); // El puerto está dentro de un <span> en la tercera columna
              const port = portSpan ? portSpan.innerText : ''; // Extrae el texto del puerto, si existe
              return `${ip}:${port}`;
            });
          });


        await browser.close();
        return ipsAndPorts;
    } catch (error) {
        console.log("error");
 
    }
}*/



/*
const obtenerProxies = async () => {
  try {
    const url = "https://geonode.com/free-proxy-list"; // Sustituye por la URL de tu fuente de proxies
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const textSelector = await page.waitForSelector("text/Free proxy ");
    const fullTitle = await textSelector?.evaluate((el) => el.textContent);

    const ipsAndPorts = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.free-proxies-table tbody tr'));
        return rows.map(row => {
          const cells = row.querySelectorAll('td');
          const ip = cells[0].innerText; // Asume que la IP está en la primera columna
          const port = cells[1].innerText; // Asume que el puerto está en la segunda columna
          return `${ip}:${port}`;
        });
      });

    await browser.close();
    return ipsAndPorts;
  } catch (error) {
    console.log("error");
  }
};


*/