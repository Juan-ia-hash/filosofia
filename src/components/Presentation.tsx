'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Maximize, Minimize, Presentation as PresentIcon, X, WifiOff, CircleCheck } from 'lucide-react';
import { slides } from '@/data/slides';
import { destination, directionFromKey, directionFromPoint, INTERACTIVE_SELECTOR, TRANSITION_MS, FINALE_INDEX } from '@/lib/navigation.mjs';
import SlideArt from './SlideArt';
import Finale from './Finale';

type Change = {from:number;to:number;direction:number;serial:number};
export default function Presentation() {
 const [index,setIndex]=useState(0);
 const [change,setChange]=useState<Change|null>(null);
 const [generation,setGeneration]=useState(0);
 const [presenter,setPresenter]=useState(false);
 const [fullscreen,setFullscreen]=useState(false);
 const [hint,setHint]=useState(true);
 const [awake,setAwake]=useState(true);
 const [offlineReady,setOfflineReady]=useState(false);
 const [message,setMessage]=useState('');
 const indexRef=useRef(0), locked=useRef(false), serial=useRef(0);
 const transitionTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const idleTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const stage=useRef<HTMLElement>(null);
 const pointer=useRef<{x:number;y:number}|null>(null);
 const presenterButton=useRef<HTMLButtonElement>(null);
 const closeButton=useRef<HTMLButtonElement>(null);
 const navigate=useCallback((direction:number)=>{
   if(locked.current)return;
   const from=indexRef.current, to=destination(from,direction);
   if(to===from)return;
   locked.current=true;
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   indexRef.current=to;
   setIndex(to);
   const nextSerial=++serial.current;
   setGeneration(nextSerial);
   setChange({from,to,direction,serial:nextSerial});
   transitionTimer.current=setTimeout(()=>{setChange(null);locked.current=false;},reduced?100:TRANSITION_MS);
 },[]);
 const toggleFullscreen=useCallback(async()=>{
   try {
     if(document.fullscreenElement)await document.exitFullscreen();
     else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();
     else setMessage('Este navegador no ofrece pantalla completa. Puedes usar el modo horizontal.');
   } catch {setMessage('No se pudo activar la pantalla completa en este navegador.');}
 },[]);
 useEffect(()=>{
   const keydown=(event:KeyboardEvent)=>{
     if(event.altKey||event.ctrlKey||event.metaKey||event.repeat)return;
     const target=event.target;
     const editable=target instanceof Element&&target.closest('input,textarea,select,[contenteditable="true"]');
     if(editable)return;
     if(event.key.toLowerCase()==='p'){event.preventDefault();setPresenter(p=>!p);return;}
     if(event.key.toLowerCase()==='f'){event.preventDefault();void toggleFullscreen();return;}
     if(event.key==='Escape'){
       setPresenter(false);
       if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});
       return;
     }
     if(target instanceof Element&&target.closest(INTERACTIVE_SELECTOR))return;
     const direction=directionFromKey(event.key);
     if(direction){event.preventDefault();navigate(direction);}
   };
   const full=()=>setFullscreen(Boolean(document.fullscreenElement));
   window.addEventListener('keydown',keydown);document.addEventListener('fullscreenchange',full);
   const timer=setTimeout(()=>setHint(false),6500);
   return()=>{window.removeEventListener('keydown',keydown);document.removeEventListener('fullscreenchange',full);clearTimeout(timer);if(transitionTimer.current)clearTimeout(transitionTimer.current);if(idleTimer.current)clearTimeout(idleTimer.current);};
 },[navigate,toggleFullscreen]);
 useEffect(()=>{
   if(presenter)closeButton.current?.focus();
   else if(document.activeElement===document.body)stage.current?.focus({preventScroll:true});
 },[presenter]);
 useEffect(()=>{
   if(process.env.NODE_ENV!=='production'||!('serviceWorker'in navigator))return;
   let alive=true;
   const received=(event:MessageEvent)=>{if(event.data?.type==='OFFLINE_READY'&&alive)setOfflineReady(true);};
   navigator.serviceWorker.addEventListener('message',received);
   const prepare=async()=>{
     try {
       await navigator.serviceWorker.register('/sw.js');
       const registration=await navigator.serviceWorker.ready;
       const urls=performance.getEntriesByType('resource').map(e=>e.name).filter(url=>url.startsWith(location.origin)&&/\.(js|css|woff2?)(\?|$)/.test(url));
       registration.active?.postMessage({type:'CACHE_PRESENTATION',urls});
     }catch{ /* The presentation remains usable without a service worker. */ }
   };
   if(document.readyState==='complete')void prepare();else window.addEventListener('load',prepare,{once:true});
   return()=>{alive=false;navigator.serviceWorker.removeEventListener('message',received);window.removeEventListener('load',prepare);};
 },[]);
 const wake=()=>{setAwake(true);if(idleTimer.current)clearTimeout(idleTimer.current);idleTimer.current=setTimeout(()=>setAwake(false),2500);};
 const closePresenter=()=>{setPresenter(false);presenterButton.current?.focus();};
 const renderLayer=(slideIndex:number,outgoing:boolean)=>{
   const final=slideIndex===FINALE_INDEX;
   const direction=change?.direction===-1?'backward':'forward';
   const key=`slide-${outgoing?generation-1:generation}`;
   return <section key={key} className={`slide slide-${slideIndex+1} ${final?'finale':''} ${change?(outgoing?'outgoing':'incoming'):''} ${direction} ${change?.from===FINALE_INDEX&&change?.to===0?'restarting':''}`} aria-hidden={outgoing} inert={outgoing?true:undefined} data-slide={final?'finale':slideIndex+1}>
     {!final&&<div className="slide-section" aria-hidden="true"><span>{slides[slideIndex].section}</span><span>Rousseau / 1755</span></div>}
     {final?<Finale/>:<SlideArt index={slideIndex} advance={()=>navigate(1)}/>}
   </section>;
 };
 const current=slides[index];
 return <main ref={stage} tabIndex={-1} data-theme={[2,5,8,11,14].includes(index)?'light':'dark'} className={`presentation ${awake?'awake':'idle'} ${presenter?'presenter-open':''}`} aria-label="Presentación sobre Rousseau" onPointerMove={wake} onPointerDown={event=>{wake();pointer.current={x:event.clientX,y:event.clientY};}} onClick={event=>{
   if(event.button!==0)return;
   if(event.target instanceof Element&&event.target.closest(INTERACTIVE_SELECTOR))return;
   if(pointer.current&&Math.hypot(event.clientX-pointer.current.x,event.clientY-pointer.current.y)>18)return;
   const rect=event.currentTarget.getBoundingClientRect();
   navigate(directionFromPoint(event.clientX,rect.left,rect.width));
 }}>
   <div className="stage" aria-busy={Boolean(change)}>{change&&renderLayer(change.from,true)}{renderLayer(index,false)}</div>
   <p className="sr-only" aria-live="polite">{index===FINALE_INDEX?'Escena final':`Diapositiva ${index+1} de 17: ${current.title}`}</p>
   <div className="navigation-hint" data-visible={hint} aria-hidden={!hint}>Izquierda: anterior <span>·</span> Derecha: siguiente</div>
   <footer className="presentation-footer" data-no-nav>
     <div className="footer-left">{index!==FINALE_INDEX&&<><span className="counter" data-testid="counter">{String(index+1).padStart(2,'0')} <span>/ 17</span></span><span className="footer-speaker">{current.speaker}</span></>}</div>
     <div className="toolbar">
       <button onClick={()=>navigate(-1)} disabled={index===0} aria-label="Diapositiva anterior" title="Anterior (←)"><ArrowLeft/></button>
       <button onClick={()=>navigate(1)} aria-label={index===FINALE_INDEX?'Volver al inicio':'Diapositiva siguiente'} title="Siguiente (→)"><ArrowRight/></button>
       <span className="toolbar-divider"/>
       <button ref={presenterButton} onClick={()=>setPresenter(p=>!p)} aria-label="Modo presentador" aria-pressed={presenter} title="Modo presentador (P)"><PresentIcon/></button>
       <button onClick={()=>void toggleFullscreen()} aria-label={fullscreen?'Salir de pantalla completa':'Activar pantalla completa'} aria-pressed={fullscreen} title="Pantalla completa (F)">{fullscreen?<Minimize/>:<Maximize/>}</button>
     </div>
   </footer>
   {index!==FINALE_INDEX&&<div className="progress-track" role="progressbar" aria-label="Progreso de la presentación" aria-valuemin={1} aria-valuemax={17} aria-valuenow={index+1}><div style={{width:`${index/16*100}%`}}/></div>}
   {message&&<div className="message" role="status" data-no-nav>{message}<button onClick={()=>setMessage('')} aria-label="Cerrar aviso"><X/></button></div>}
   {presenter&&<aside className="presenter-panel" role="dialog" aria-modal="false" aria-labelledby="presenter-title" data-no-nav onKeyDown={event=>{
     if(event.key!=='Tab')return;
     const controls=event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
     const first=controls[0],last=controls[controls.length-1];
     if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
     else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
   }}>
     <div className="presenter-header"><h2 id="presenter-title">Modo presentador</h2><button ref={closeButton} onClick={closePresenter} aria-label="Cerrar modo presentador"><X/></button></div>
     <p className="presenter-position">{index===FINALE_INDEX?'Escena final':`Diapositiva ${index+1} / 17`}</p>
     <h3>{current?.title??'Gracias por su atención'}</h3>
     <div className="presenter-meta"><span>{current?.speaker??'Cierre'}</span><span>{current?.time??'Sin límite de tiempo'}</span></div>
     <p className="presenter-section">{current?.section??'Síntesis editorial'}</p>
     <ul>{(current?.note??['Las frases finales son una síntesis editorial; no son citas textuales de Rousseau.','Esperar hasta decidir cuándo finalizar la exposición.','Izquierda: regresar a reflexiones. Derecha: reiniciar la presentación.']).map(note=><li key={note}>{note}</li>)}</ul>
     <div className="next-preview"><span>A continuación</span><p>{index===FINALE_INDEX?slides[0].title:slides[index+1]?.title??'Cierre cinematográfico · Gracias por su atención'}</p></div>
     <div className="presenter-nav"><button onClick={()=>navigate(-1)} disabled={index===0}><ArrowLeft size={17}/> Anterior</button><button onClick={()=>navigate(1)}>{index===FINALE_INDEX?'Reiniciar':'Siguiente'} <ArrowRight size={17}/></button></div>
     <p className="offline-status">{offlineReady?<CircleCheck size={14}/>:<WifiOff size={14}/>} {offlineReady?'Recursos guardados para usar sin conexión':process.env.NODE_ENV==='production'?'Preparando recursos para uso sin conexión':'Uso sin conexión disponible en producción'}</p>
     <p className="presenter-help">P: mostrar / ocultar · F: pantalla completa<br/>← / → · Espacio · PageUp / PageDown<br/>Las notas son visibles en esta pantalla. Ciérralas antes de proyectar.</p>
   </aside>}
 </main>;
}
