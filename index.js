const playwright = require('playwright');
async function main() {
  const browser = await playwright.chromium.launch({
    headless: true // setting this to true will not run the UI
  });

  let context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.getonbrd.cl/jobs/programacion');
  const jobsList = await page.$$eval(".gb-results-list__item", as => as.map(a => a.href));

  console.log(jobsList);
  const job = await context.newPage();

  let jobSalaries = []
  for (let index = 0; index < jobsList.length -100; index++) {
    console.log(index);
    await job.goto(jobsList[index]);
    const salary = await job.$$eval(".tooltipster-basic > strong", as => as.map(salary => salary.innerText))
    if(salary.length > 0) jobSalaries.push(salary[0]);
  }
  console.log(jobSalaries);


  await page.waitForTimeout(5000); // wait for 5 seconds
  await browser.close();
}

main();
