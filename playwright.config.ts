import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser',timeout:60000,fullyParallel:false,workers:1,
 use:{baseURL:'http://localhost:3000',headless:true,launchOptions:{executablePath:process.env.BROWSER_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'},trace:'retain-on-failure'},
 projects:[
  {name:'projector',use:{viewport:{width:1920,height:1080}}},
  {name:'phone',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}},
  {name:'laptop',grep:/all slides fit/,use:{viewport:{width:1366,height:768}}},
  {name:'tablet',grep:/all slides fit/,use:{viewport:{width:1024,height:768}}},
  {name:'phone-landscape',grep:/all slides fit/,use:{viewport:{width:844,height:390},isMobile:true,hasTouch:true}},
 ],
 webServer:{command:'npm run start',url:'http://localhost:3000',reuseExistingServer:!process.env.CI,timeout:60000}
});
