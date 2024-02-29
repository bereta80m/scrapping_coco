import puppeteer from "puppeteer";
import userAgent from "user-agents";
import { NextResponse } from "next/server";

// Suponiendo que ya tienes definidas las funciones esperaAleatoria y obtenerProxies
const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

const launchBrowserWithProxyAndUserAgent = async (proxy: any) => {
  const browser = await puppeteer.launch({
    args: [`--proxy-server=${proxy}`],
  });
  const page = await browser.newPage();
  const UserAgent = new userAgent();
  await page.setUserAgent(UserAgent.toString());
  return { browser, page };
};

export async function GET(request: Request) {
  try {
    const proxies: any = await obtenerProxies();
    const proxyTasks = proxies.map(async (proxy: any) => {
      try {
        const { browser, page } = await launchBrowserWithProxyAndUserAgent(proxy);
        await page.goto('https://www.youtube.com/watch?v=VrBLfXfXfoY&t=75s', { waitUntil: 'networkidle2' }).catch(e => console.log(`Error al cargar la página con el proxy ${proxy}: ${e.message}`));
        console.log(`Página cargada correctamente con el proxy: ${proxy}`);
        // Realiza aquí cualquier otra operación con la página
        await delay(5000);
        await browser.close();
      } catch (error) {
        console.log(`Error usando el proxy ${proxy}: ${error}`);
      }
    });

    // Espera a que todas las tareas de proxy se completen
    await Promise.all(proxyTasks);

    return NextResponse.json({ message: "Operación completada" });
  } catch (error:any) {
    console.log("error------------");
    return NextResponse.json({ error: error.message });
  }
}


const obtenerProxies = async () => {
    try {
      const url = "https://free-proxy-list.net/"; // Reemplaza esta URL por la URL real a la que necesitas acceder
      const browser = await puppeteer.launch({
        args:['--no-sandbox']
      });
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
  