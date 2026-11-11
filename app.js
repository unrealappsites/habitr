var KEY="habitr-v1", habits=[];
try{habits=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){habits=[]}
function save(){try{localStorage.setItem(KEY,JSON.stringify(habits))}catch(e){}}
function fmt(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function lastDays(n){var a=[];for(var i=n-1;i>=0;i--){var d=new Date();d.setDate(d.getDate()-i);a.push(d)}return a}
function streak(h){var c=0,d=new Date();if(!h.done[fmt(d)])d.setDate(d.getDate()-1);while(h.done[fmt(d)]){c++;d.setDate(d.getDate()-1)}return c}
function esc(s){return s.replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function summary(){var t=fmt(new Date()),n=habits.length,d=habits.filter(function(h){return h.done[t]}).length;
document.getElementById("sum").textContent=n?d+" of "+n+" done today":"Add a habit to start";
document.getElementById("bar").style.width=(n?d/n*100:0)+"%";document.getElementById("glow").classList.toggle("all",n>0&&d===n)}
function render(){summary();
var el=document.getElementById("list");
if(!habits.length){el.innerHTML='<p class="empty">Nothing on the manifest yet. Add your first habit above.</p>';return}
var days=lastDays(7),today=fmt(new Date());
el.innerHTML=habits.map(function(h,i){
var s=streak(h);
return '<section class="habit"><div class="top"><span class="name">'+esc(h.name)+'</span><span class="label">'+s+(s===1?' day streak':' day streak')+'</span></div><div class="days">'+
days.map(function(d){var k=fmt(d);return '<div class="day'+(k===today?' today':'')+'"><button aria-pressed="'+(!!h.done[k])+'" aria-label="'+esc(h.name)+' on '+d.toDateString()+'" data-i="'+i+'" data-k="'+k+'">'+''+'</button>'+d.toLocaleDateString(undefined,{weekday:"short"}).slice(0,2)+'</div>'}).join("")+
'</div><button class="del" data-del="'+i+'">Delete habit</button></section>'}).join("")}
document.getElementById("list").addEventListener("click",function(e){
var b=e.target.closest("button");if(!b)return;
if(b.dataset.k){var h=habits[b.dataset.i];if(h.done[b.dataset.k])delete h.done[b.dataset.k];else h.done[b.dataset.k]=1;save();render()}
else if(b.dataset.del){if(confirm("Delete this habit and its history?")){habits.splice(b.dataset.del,1);save();render()}}});
function add(){var i=document.getElementById("new"),v=i.value.trim();if(!v)return;habits.push({name:v,done:{}});i.value="";save();render()}
document.getElementById("addBtn").addEventListener("click",add);
document.getElementById("new").addEventListener("keydown",function(e){if(e.key==="Enter")add()});
render();
