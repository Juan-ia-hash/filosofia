/* Local, unoptimized images keep the complete presentation available offline. */
/* eslint-disable @next/next/no-img-element */
import { BookOpen, Brain, HeartHandshake, Leaf, MoveUpRight, Shield, Sprout, Users, Feather, Scale, Compass, Sun } from 'lucide-react';
import { slides, timeline } from '@/data/slides';

const icons = [Sprout, Shield, HeartHandshake, Compass, Brain, Users];
function Landscape({kind='forest'}:{kind?:'forest'|'peru'|'community'|'city'}) {
  return <div className={`landscape landscape-${kind} reveal-background`} role="img" aria-label={kind==='forest'?'Ilustración original de un bosque':kind==='community'?'Ilustración original de colaboración comunitaria en un paisaje peruano':'Ilustración original de un paisaje y distintas condiciones sociales'} style={{backgroundImage:`url(/images/${kind}.svg)`}}/>;
}
function Concepts({index, className=''}:{index:number;className?:string}) {
  return <div className={`concepts reveal-concepts ${className}`}>{slides[index].concepts?.map((c,i)=><div className="concept" key={c} style={{'--item':i} as React.CSSProperties}><span className="concept-mark" aria-hidden="true">{index===16?String(i+1).padStart(2,'0'):'✧'}</span><span>{c}</span></div>)}</div>;
}
export default function SlideArt({index,advance}:{index:number;advance:()=>void}) {
  const slide=slides[index];
  const heading=<h1 className="slide-title reveal-title">{slide.title}</h1>;
  const detail=slide.detail&&<p className="support reveal-graphics">{slide.detail}</p>;
  switch(index) {
    case 0: return <>
      <div className="cover-art reveal-background"><img src="/images/rousseau.jpg" alt="Retrato grabado de Jean-Jacques Rousseau por David Martin, según Allan Ramsay"/><span className="portrait-arch"/></div>
      <div className="cover-copy"><span className="cover-year" aria-hidden="true">1755</span><div className="small-label reveal-title">Jean-Jacques Rousseau</div>{heading}<div className="gold-rule reveal-concepts"/>{detail}<button className="begin reveal-graphics" onClick={advance}>Comenzar exposición <MoveUpRight size={20}/></button></div>
      <span className="art-caption">David Martin, según Allan Ramsay · Grabado, 1766</span>
    </>;
    case 1: return <><div className="split-scenery"><Landscape kind="peru"/><Landscape kind="city"/></div><div className="question-copy">{heading}<span className="question-rule reveal-graphics"/></div></>;
    case 2: return <div className="editorial centered">{heading}<div className="triptych reveal-concepts">{[Leaf,Users,Sun].map((Icon,i)=><div className="symbol-column" key={i}><div className="symbol-orbit"><Icon strokeWidth={1} aria-hidden="true"/></div><h2>{slide.concepts?.[i]}</h2></div>)}</div></div>;
    case 3: return <div className="editorial timeline-slide">{heading}<div className="timeline reveal-concepts">{timeline.map(([year,text],i)=><button className={`timeline-event ${i===5?'culmination':''}`} key={year} style={{'--item':i} as React.CSSProperties} onClick={e=>e.currentTarget.focus()} aria-label={`${year}: ${text}`}><span className="timeline-year">{year}</span><span className="timeline-dot"/><span className="timeline-symbol" aria-hidden="true">{['♫','✧','▤','ϟ','⚑','✒'][i]}</span><span>{text}</span></button>)}</div></div>;
    case 4: return <><div className="privilege-art reveal-background"><div className="palace"/><span className="quill"><Feather strokeWidth={.6}/></span></div><div className="editorial privilege-copy">{heading}<Concepts index={index}/>{detail}</div></>;
    case 5: return <><div className="biography-art reveal-background"><img src="/images/rousseau.jpg" alt="Jean-Jacques Rousseau, gravure historique"/></div><div className="editorial biography-copy"><div className="small-label reveal-graphics">El autor</div>{heading}<Concepts index={index} className="biography-facts"/></div></>;
    case 6: return <div className="editorial manuscript-slide"><div className="manuscript reveal-background" aria-hidden="true"><span>Académie de Dijon</span><i>Discurso sobre el origen<br/>de la desigualdad</i><div className="manuscript-lines"/><b>1755</b></div><div className="manuscript-copy">{heading}<blockquote className="reveal-concepts">«{slide.detail}»</blockquote><Concepts index={index}/></div></div>;
    case 7: return <div className="editorial centered inquiry">{heading}<div className="inquiry-orbit reveal-background"><div className="orbit-ring"/><Scale strokeWidth={.7} aria-hidden="true"/><Concepts index={index}/></div>{detail}</div>;
    case 8: return <div className="editorial comparison-slide">{heading}<div className="comparison reveal-concepts"><div className="comparison-half natural"><Leaf aria-hidden="true" strokeWidth={1}/><h2>DESIGUALDAD<br/>NATURAL O FÍSICA</h2><p>Edad · Salud · Fuerza</p></div><div className="comparison-half social"><Scale aria-hidden="true" strokeWidth={1}/><h2>DESIGUALDAD<br/>MORAL O POLÍTICA</h2><p>Riqueza · Poder · Privilegios</p></div></div></div>;
    case 9: return <div className="editorial ideas-slide">{heading}<div className="ideas-grid reveal-concepts">{slide.concepts?.map((concept,i)=>{const Icon=icons[i];return <div key={concept} className="idea" style={{'--item':i} as React.CSSProperties}><Icon strokeWidth={1} aria-hidden="true"/><h2>{concept}</h2>{i===1&&<p>Supervivencia</p>}{i===3&&<p>Elegir y resistir impulsos</p>}{i===4&&<p>Aprender y transformarnos</p>}</div>;})}</div></div>;
    case 10: return <><Landscape/><div className="editorial forest-copy">{heading}<Concepts index={index}/>{detail}</div><div className="independent-orbits reveal-graphics" aria-hidden="true"><span/><span/><span/></div></>;
    case 11: return <div className="editorial humanity-slide">{heading}<div className="humanity-columns reveal-concepts"><div><Compass strokeWidth={.7} aria-hidden="true"/><h2>LIBERTAD</h2><p>Capacidad de elegir y resistir impulsos.</p></div><div><div className="growth-symbol"><Sprout strokeWidth={.7} aria-hidden="true"/></div><h2>PERFECTIBILIDAD</h2><p>Capacidad de aprender y transformarnos.</p></div></div>{detail}</div>;
    case 12: return <div className="editorial philosophers-slide">{heading}<div className="philosophers reveal-concepts"><div><img src="/images/hobbes.jpg" alt="Retrato de Thomas Hobbes por John Michael Wright"/><div><h2>THOMAS HOBBES</h2><p>Inseguridad y conflicto</p></div></div><span className="philosophers-divider" aria-hidden="true">&</span><div><img src="/images/rousseau.jpg" alt="Retrato de Jean-Jacques Rousseau por David Martin"/><div><h2>JEAN-JACQUES ROUSSEAU</h2><p>Independencia relativa y piedad natural</p></div></div></div>{detail}</div>;
    case 13: return <><Landscape kind="peru"/><div className="editorial peru-copy">{heading}<Concepts index={index}/></div><span className="art-caption">Paisaje peruano · Ilustración original</span></>;
    case 14: return <div className="editorial connections-slide">{heading}<div className="connections reveal-concepts">{[['DESIGUALDAD SOCIAL','DIFERENCIAS DE OPORTUNIDADES'],['DEPENDENCIA','LIMITACIONES ECONÓMICAS'],['PRIVILEGIOS','RELACIONES DE PODER']].map(([a,b],i)=><div className="connection" key={a} style={{'--item':i} as React.CSSProperties}><span>{a}</span><span className="connection-arrow" aria-hidden="true">⟶</span><span>{b}</span></div>)}</div>{detail}</div>;
    case 15: return <><Landscape kind="community"/><div className="editorial community-copy">{heading}<Concepts index={index}/>{detail}</div><span className="art-caption">Colaboración comunitaria · Ilustración original</span></>;
    case 16: return <div className="editorial reflections-slide"><div className="reflection-emblem reveal-background"><BookOpen strokeWidth={.5} aria-hidden="true"/></div>{heading}{detail}<Concepts index={index}/></div>;
    default:return null;
  }
}
