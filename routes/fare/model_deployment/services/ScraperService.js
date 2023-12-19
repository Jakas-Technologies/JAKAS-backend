const puppeteer = require('puppeteer'); 

class ScraperService {
    async getFuelPrice() {
        console.time('Total Execution Time');

        const browser = await puppeteer.launch({
            headless: "new"
        });
        const page = await browser.newPage();

        const url = 'https://mypertamina.id/fuels-harga';
        await page.goto(url);

        await page.waitForSelector('#slick-slide03.slick-active');

        const priceProvJawaBarat = await page.evaluate(() => {
            const activeSlideElement = document.querySelector('#slick-slide03.slick-active');

            if (activeSlideElement) {
                const labels = Array.from(activeSlideElement.querySelectorAll('label.text-sm.font-weight-bolder'));

                const labelProvJawaBarat = labels.find(label => label.textContent.includes('Prov. Jawa Barat'));

                if (labelProvJawaBarat) {
                    const priceText = labelProvJawaBarat.nextElementSibling.textContent.trim();

                    const priceValue = parseInt(priceText.replace(/\D+/g, ''), 10);

                    return priceValue;
                }
            }

            return null;
        });

        console.timeEnd('Total Execution Time');

        await browser.close();

        return priceProvJawaBarat;
    }
}

module.exports = ScraperService
