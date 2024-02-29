import { NextResponse } from "next/server";

import puppeteer from "puppeteer";

const Auth = "";

export async function GET() {
  try {
    const browser = await puppeteer.connect({browserWSEndpoint: `wss://${Auth}@brd.superproxy.io:9222`})
    //const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    await page.goto("https://www.jobbank.gc.ca/jobsearch/");
    await page.waitForSelector(".results-jobs");
  
    const jobLinks = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll("article a.resultJobItem")
      );
      return links.slice(0,5).map((link: any) => link.href);
    });

    const jobEmails = []; // Para almacenar los emails recolectados

    for (const link of jobLinks) {
      const jobPage = await browser.newPage();
      await jobPage.goto(link, { waitUntil: 'networkidle0' });
    
      // Hacer clic en el botón #applynowbutton si está presente
      if (await jobPage.$('#applynowbutton') !== null) {
        await jobPage.click('#applynowbutton');
        
        // Esperar a que el email sea visible
        await jobPage.waitForSelector('div#howtoapply a[href^="mailto:"]', { visible: true });
    
        // Extraer el valor del correo electrónico
        const email = await jobPage.evaluate(() => {
          const emailElement = document.querySelector('div#howtoapply a[href^="mailto:"]');
          return emailElement ? emailElement.textContent : 'No email found';
        });
    
        jobEmails.push(email);
      } else {
        jobEmails.push('No apply button found');
      }
    
      await jobPage.close();
    }
    
    console.log(jobEmails);

    return new Response(JSON.stringify({ jobEmails }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("error", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

/*
try {
    // Lanzar el navegador
    const browser = await puppeteer.connect({
        browserWSEndpoint: `wss://${Auth}@brd.superproxy.io:9222`
    })
    const page = await browser.newPage();

    // Ir a la página de tendencias de YouTube
    await page.goto("https://www.youtube.com/feed/trending");

    // Esperar a que el elemento con el ID 'meta' esté presente
    // Nota: Este paso puede requerir ajustes según cómo YouTube cargue el contenido
    await page.waitForSelector("#meta");

    // Extraer los títulos de los videos
    // YouTube utiliza atributos dinámicos y puede que no siempre use el mismo ID o clases, por lo que este selector puede necesitar ajustes.
    const titles = await page.evaluate(() => {
      const anchors: any = Array.from(
        document.querySelectorAll("a#video-title")
      );
      return anchors.map((anchor: any) => anchor?.textContent.trim());
    });
    const Channelnames = await page.evaluate(()=>{// style-scope yt-formatted-string
        const anchors:any = Array.from(document.querySelectorAll('.style-scope.ytd-channel-name.complex-string'));
        return anchors.map((anchor:any)=> anchor.textContent.trim())
    })

    console.log(Channelnames);
    await browser.close();
    return Response.json({});
  } catch (error) {
    console.log("error", error);
    return Response.json({});
  }
*/
