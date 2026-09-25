const form=document.getElementById("predictionForm");
const result=document.getElementById("result");
const resultTitle=document.getElementById("resultTitle");
const resultText=document.getElementById("resultText");
const probabilityValue=document.getElementById("probabilityValue");
const classValue=document.getElementById("classValue");
const scoreRing=document.getElementById("scoreRing");
const button=document.getElementById("predictButton");
const reset=document.getElementById("resetButton");
const progress=document.getElementById("progressBar");
const ids=["age","gender","height","weight","ap_hi","ap_lo","cholesterol","gluc","smoke","alco","active"];

function updateProgress(){
  const filled=ids.filter(id=>document.getElementById(id).value!=="").length;
  progress.style.width=(filled/ids.length*100)+"%";
}
ids.forEach(id=>{
  document.getElementById(id).addEventListener("input",updateProgress);
  document.getElementById(id).addEventListener("change",updateProgress);
});

form.addEventListener("submit",async e=>{
  e.preventDefault();
  const data={};
  ids.forEach(id=>data[id]=Number(document.getElementById(id).value));
  button.disabled=true;
  button.querySelector(".btn-text").textContent="Analyzing profile";
  try{
    const response=await fetch("/predict",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    if(!response.ok) throw new Error("Prediction request failed");
    showResult(await response.json());
  }catch(err){
    result.classList.remove("hidden");
    resultTitle.textContent="Connection error";
    resultText.textContent="The prediction service could not be reached. Please check the Flask backend.";
    probabilityValue.textContent="--";
    classValue.textContent="Unavailable";
    result.scrollIntoView({behavior:"smooth",block:"center"});
    console.error(err);
  }finally{
    button.disabled=false;
    button.querySelector(".btn-text").textContent="Analyze cardiovascular risk";
  }
});

function showResult(prediction){
  const percent=Number(prediction.probability||0)*100;
  result.classList.remove("hidden");
  if(prediction.prediction===1){
    resultTitle.textContent="Higher predicted risk";
    resultText.textContent="The trained model predicted class 1 for the supplied information.";
  }else{
    resultTitle.textContent="Lower predicted risk";
    resultText.textContent="The trained model predicted class 0 for the supplied information.";
  }
  classValue.textContent=`Class ${prediction.prediction}`;
  probabilityValue.textContent="0%";
  const start=performance.now();
  function animate(now){
    const t=Math.min((now-start)/900,1);
    const value=percent*(1-Math.pow(1-t,3));
    probabilityValue.textContent=value.toFixed(2)+"%";
    const deg=value*3.6;
    scoreRing.style.background=`conic-gradient(var(--p) 0deg,var(--a) ${deg}deg,#e6eef1 ${deg}deg)`;
    if(t<1) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  result.scrollIntoView({behavior:"smooth",block:"center"});
}

reset.addEventListener("click",()=>{
  form.reset();
  result.classList.add("hidden");
  progress.style.width="0%";
  window.scrollTo({top:document.querySelector(".workspace").offsetTop-80,behavior:"smooth"});
});
updateProgress();
