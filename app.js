const drones=[
 ['DJI Mini 2','C0','< 250 g','Vérifier le marquage C0 et la configuration utilisée.'],
 ['DJI Mini 3','C0','< 250 g','Vérifier le marquage C0 et la configuration utilisée.'],
 ['DJI Mini 4 Pro','C0','< 250 g','Vérifier le marquage C0 et la documentation.'],
 ['DJI Mini 5 Pro','C0*','selon version','Vérifier impérativement la classe inscrite sur le drone.'],
 ['DJI Neo','C0','< 250 g','Vérifier le marquage C0 de la version utilisée.'],
 ['DJI Neo 2','C0*','selon version','Vérifier impérativement la classe inscrite sur le drone.'],
 ['DJI Flip','C0','< 250 g','Vérifier le marquage C0 et la configuration utilisée.']
];

const select=document.querySelector('#droneSelect');
const info=document.querySelector('#droneInfo');
drones.forEach((d,i)=>{const o=document.createElement('option');o.value=i;o.textContent=d[0];select.appendChild(o)});
function renderDrone(){const d=drones[Number(select.value)];info.innerHTML=`<strong>${d[0]} · ${d[1]} · ${d[2]}</strong><span>${d[3]}</span>`}
select.addEventListener('change',renderDrone);renderDrone();

const checks=[...document.querySelectorAll('.checks > label input')];
const decision=document.querySelector('#decision');
const decisionText=document.querySelector('#decisionText');
let r163='unknown';

function updateDecision(){
 const normalOk=checks.every(x=>x.checked);
 const allOk=normalOk && r163==='no';
 decision.className=`decision ${allOk?'green':'red'}`;
 decision.querySelector('.decision-icon').textContent=allOk?'✓':'✕';
 decision.querySelector('strong').textContent=allOk?'JE PEUX DÉCOLLER':'JE NE DÉCOLLE PAS';
 if(allOk){decisionText.textContent='Les 10 contrôles sont validés. Vérification officielle de la zone effectuée.'}
 else if(r163==='yes'){decisionText.textContent='La zone R163 A, B, C GROSTENQUIN-POLYGONE est indiquée comme activée : ne pas décoller.'}
 else if(r163==='unknown'){decisionText.textContent='Vérification incomplète : indique si la R163 est activée et valide les autres contrôles.'}
 else {decisionText.textContent=`Vérification incomplète : ${checks.filter(x=>!x.checked).length} contrôle(s) restant(s).`}
}
checks.forEach(x=>x.addEventListener('change',updateDecision));

document.querySelectorAll('[data-r163]').forEach(btn=>btn.addEventListener('click',()=>{
 r163=btn.dataset.r163;
 document.querySelectorAll('[data-r163]').forEach(b=>b.classList.remove('selected'));
 btn.classList.add('selected');
 document.querySelector('#r163Box').classList.toggle('r163-danger',r163==='yes');
 document.querySelector('#r163Box').classList.toggle('r163-safe',r163==='no');
 updateDecision();
}));

document.querySelector('#locateBtn').addEventListener('click',()=>{
 const s=document.querySelector('#locationStatus');
 if(!navigator.geolocation){s.textContent='Géolocalisation non disponible sur cet appareil.';return}
 s.textContent='Recherche de ta position…';
 navigator.geolocation.getCurrentPosition(p=>{
   const lat=p.coords.latitude,lon=p.coords.longitude;
   s.textContent=`Position : ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
   document.querySelector('#airOpsBtn').href=`https://airops-supuav.fr/map/#5.05/${lat.toFixed(5)}/${lon.toFixed(5)}`;
   s.classList.add('located');
 },()=>{s.textContent='Position indisponible : autorise la localisation puis réessaie.';s.classList.remove('located')},{enableHighAccuracy:true,timeout:10000,maximumAge:60000});
});

updateDecision();