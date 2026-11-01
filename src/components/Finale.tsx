export default function Finale() {
 return <div className="finale-content">
   <div className="particles" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{'--x':`${(i*37)%100}%`,'--y':`${(i*23)%100}%`,'--delay':`${i%7}s`} as React.CSSProperties}/>)}</div>
   <div className="finale-halo" aria-hidden="true"/>
   <div className="finale-question"><h1>¿Nacemos desiguales<br/>o la sociedad nos hace desiguales?</h1><p>La pregunta sigue abierta.</p></div>
   <div className="finale-thanks"><span className="finale-rule"/><h2>GRACIAS POR SU ATENCIÓN</h2><p>Jean-Jacques Rousseau · 1755</p></div>
   <p className="finale-editorial">Síntesis editorial de la presentación · No son citas textuales de Rousseau.</p>
   <p className="restart-hint">Toca a la derecha para volver al inicio <span aria-hidden="true">↗</span></p>
 </div>;
}
