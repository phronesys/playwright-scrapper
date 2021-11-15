const playwright = require('playwright');
const fs = require('fs');
async function scrapeJobs() {
  const browser = await playwright.chromium.launch({
    headless: true // setting this to true will not run the UI
  });

  let context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.getonbrd.cl/jobs/programacion');
  const jobsList = await page.$$eval(".gb-results-list__item", as => as.map(a => a.href));

  console.log(jobsList);
  const job = await context.newPage();

  let jobs = []
  for (let index = 0; index < jobsList.length - 100; index++) {
    console.log(index);
    await job.goto(jobsList[index]);
    const salary = await job.$$eval(".tooltipster-basic > strong", as => as.map(salary => salary.innerText))
    const title = await job.$$eval('.gb-landing-cover__title > span[itemprop="title"]',
      as => as.map(title => title.innerText));
    const skills = await job.$$eval('.gb-tags > .gb-tags__item', as => as.map(skill => skill.innerText))
    const jobItem = {
      title: title[0], salary: salary[0], skills, url: jobsList[index]
    }
    jobs.push(jobItem);
  }

  await page.waitForTimeout(5000); // wait for 5 seconds
  await browser.close();


  fs.writeFile('jobs.json', JSON.stringify(jobs), (err) => { 
    if (err) throw err; 
  }) 
  return jobs;
}

let jobs = []
jobs = scrapeJobs();
console.log(jobs);

if (Array.isArray(jobs)) {
  const vueJobs = jobs.reduce((job) => job.skills.includes("Vue.js"))
  console.log(vueJobs);
}
