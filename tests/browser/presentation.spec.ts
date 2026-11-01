import {test,expect,Page} from '@playwright/test';
const current=(page:Page)=>page.locator('.slide:not([aria-hidden="true"])');
async function waitTransition(page:Page){await expect(page.locator('.stage')).toHaveAttribute('aria-busy','false');}
async function go(page:Page,direction:'left'|'right'){
 const size=page.viewportSize()!;
 if(test.info().project.name==='phone')await page.touchscreen.tap(size.width*(direction==='right'?.94:.06),size.height*.12);
 else await page.mouse.click(size.width*(direction==='right'?.94:.06),size.height*.12);
 await waitTransition(page);
}
test('bidirectional zones, finale, restart and rapid clicks',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.getByTestId('counter')).toHaveText('01 / 17');
 await go(page,'left');await expect(current(page)).toHaveAttribute('data-slide','1');
 await go(page,'right');await expect(current(page)).toHaveAttribute('data-slide','2');
 await go(page,'left');await expect(current(page)).toHaveAttribute('data-slide','1');
 for(let i=0;i<9;i++)await go(page,'right');
 await expect(current(page)).toHaveAttribute('data-slide','10');
 await go(page,'left');await expect(current(page)).toHaveAttribute('data-slide','9');
 for(let i=0;i<8;i++)await go(page,'right');
 await expect(current(page)).toHaveAttribute('data-slide','17');
 await go(page,'right');await expect(current(page)).toHaveAttribute('data-slide','finale');
 await expect(page.getByTestId('counter')).toHaveCount(0);
 await page.waitForTimeout(7700);
 await expect(page.getByText('GRACIAS POR SU ATENCIÓN',{exact:true})).toBeVisible();
 await page.screenshot({path:`test-results/${test.info().project.name}-finale.png`});
 await expect(current(page)).toHaveAttribute('data-slide','finale');
 await go(page,'left');await expect(current(page)).toHaveAttribute('data-slide','17');
 await go(page,'right');await go(page,'right');
 await expect(current(page)).toHaveAttribute('data-slide','1');
 await expect(page.locator('[role="progressbar"]>div')).toHaveAttribute('style','width: 0%;');
 const size=page.viewportSize()!;
 await page.mouse.click(size.width*.9,size.height*.5,{clickCount:5,delay:15});
 await waitTransition(page);await expect(current(page)).toHaveAttribute('data-slide','2');
 expect(errors).toEqual([]);
});
test('presenter isolation and keyboard shortcuts',async({page})=>{
 await page.goto('/');await page.keyboard.press('ArrowRight');await waitTransition(page);
 await page.getByRole('button',{name:'Modo presentador',exact:true}).click();
 await expect(current(page)).toHaveAttribute('data-slide','2');
 await page.getByRole('dialog').getByRole('heading',{name:'Modo presentador'}).click();
 await expect(current(page)).toHaveAttribute('data-slide','2');
 await page.getByRole('dialog').getByRole('button',{name:'Siguiente',exact:true}).click();
 await waitTransition(page);await expect(current(page)).toHaveAttribute('data-slide','3');
 await page.keyboard.press('p');await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.locator('main').focus();
 for(const key of ['ArrowLeft','PageUp']){await page.keyboard.press(key);await waitTransition(page);}
 await expect(current(page)).toHaveAttribute('data-slide','1');
 for(const key of ['Space','PageDown']){await page.keyboard.press(key);await waitTransition(page);}
 await expect(current(page)).toHaveAttribute('data-slide','3');
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(900);await page.keyboard.down('ArrowRight');await page.keyboard.up('ArrowRight');
 await waitTransition(page);await expect(current(page)).toHaveAttribute('data-slide','4');
});
test('all slides fit and local images resolve',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 for(let i=1;i<=17;i++){
  await expect(current(page)).toHaveAttribute('data-slide',String(i));
  const problems=await current(page).evaluate(el=>{
   const rect=el.getBoundingClientRect();
   return Array.from(el.querySelectorAll('h1,h2,.concept,.support,.timeline-event,.idea,.connection')).filter(node=>{
    const r=node.getBoundingClientRect();return r.bottom>rect.bottom-25||r.top<0||r.right>rect.right+1||r.left< -1;
   }).map(node=>node.textContent);
  });
  expect(problems,`slide ${i} overflow`).toEqual([]);
  for(const image of await current(page).locator('img').all())expect(await image.evaluate(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0)).toBe(true);
  if([1,4,9,13,17].includes(i))await page.screenshot({path:`test-results/${test.info().project.name}-slide-${i}.png`});
  if(i<17)await go(page,'right');
 }
 await go(page,'right');
 await expect(page.getByText('Toca a la derecha para volver al inicio',{exact:false})).toBeVisible();
});
test('offline reload keeps the whole deck available',async({page,context})=>{
 await page.goto('/');await page.getByRole('button',{name:'Modo presentador',exact:true}).click();
 await expect(page.getByText('Recursos guardados para usar sin conexión')).toBeVisible({timeout:20000});
 await context.setOffline(true);await page.reload();
 await expect(current(page)).toHaveAttribute('data-slide','1');
 await page.emulateMedia({reducedMotion:'reduce'});
 for(let i=0;i<16;i++)await go(page,'right');
 await expect(current(page)).toHaveAttribute('data-slide','17');
 await go(page,'right');await expect(current(page)).toHaveAttribute('data-slide','finale');
 await context.setOffline(false);
});
test('fullscreen survives final restart and Escape exits',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.keyboard.press('f');
 await expect.poll(()=>page.evaluate(()=>Boolean(document.fullscreenElement))).toBe(true);
 for(let i=0;i<18;i++)await go(page,'right');
 await expect(current(page)).toHaveAttribute('data-slide','1');
 await expect.poll(()=>page.evaluate(()=>Boolean(document.fullscreenElement))).toBe(true);
 await page.keyboard.press('Escape');
 await expect.poll(()=>page.evaluate(()=>Boolean(document.fullscreenElement))).toBe(false);
});
test('timeline controls take priority over invisible zones',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 for(let i=0;i<3;i++)await go(page,'right');
 await page.getByRole('button',{name:'1755: Rousseau publica',exact:false}).click();
 await expect(current(page)).toHaveAttribute('data-slide','4');
 await go(page,'right');await expect(current(page)).toHaveAttribute('data-slide','5');
});
