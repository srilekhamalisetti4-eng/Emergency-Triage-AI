const report=JSON.parse(localStorage.getItem("triageReport"));

if(!report){
alert("No report found.");
window.location.href="index.html";
}

const patient=report.patient;
const analysis=report.analysis;

document.getElementById("name").textContent=patient.name||"-";
document.getElementById("age").textContent=patient.age||"-";
document.getElementById("gender").textContent=patient.gender||"-";
document.getElementById("weight").textContent=patient.weight?patient.weight+" kg":"-";
document.getElementById("height").textContent=patient.height?patient.height+" cm":"-";
document.getElementById("temperature").textContent=patient.temperature?patient.temperature+" °C":"-";
document.getElementById("pulse").textContent=patient.pulse?patient.pulse+" BPM":"-";
document.getElementById("bp").textContent=patient.bloodPressure||"-";
document.getElementById("spo2").textContent=patient.spo2?patient.spo2+" %":"-";
document.getElementById("history").textContent=patient.history||"None";
document.getElementById("symptoms").textContent=patient.symptoms||"-";
document.getElementById("generated").textContent=report.generatedAt||"-";

document.getElementById("riskText").textContent=analysis.risk;
const badge=document.getElementById("riskBadge");
badge.textContent=analysis.risk+" Risk";

badge.classList.remove("low","medium","high");

switch((analysis.risk||"").toLowerCase()){
case "low":
badge.classList.add("low");
break;

case "medium":
badge.classList.add("medium");
break;

default:
badge.classList.add("high");
}

const confidence=parseInt(analysis.confidence)||0;

document.getElementById("confidenceText").textContent=confidence+"%";

setTimeout(()=>{
document.getElementById("confidenceFill").style.width=confidence+"%";
},300);

document.getElementById("conditionTitle").textContent =
analysis.condition || "-";

document.getElementById("conditionExplanation").textContent =
analysis.reason || "-";

const firstAid=document.getElementById("firstAid");

if(Array.isArray(analysis.firstAid)){
firstAid.innerHTML=
analysis.firstAid
.map(item=>`<li>${item}</li>`)
.join("");
}else{
firstAid.innerHTML=`<li>${analysis.firstAid||"-"}</li>`;
}

const guidance=document.getElementById("guidance");

if(Array.isArray(analysis.guidance)){
guidance.innerHTML=
analysis.guidance
.map(item=>`<li>${item}</li>`)
.join("");
}else{
guidance.innerHTML=`<li>${analysis.guidance||"-"}</li>`;
}

document.getElementById("hospital").textContent =
analysis.hospital || "-";

const alertBox=document.getElementById("alertBox");
if((analysis.risk||"").toLowerCase()==="high"){

alertBox.innerHTML=`
🚨 Immediate medical attention recommended.
Please visit the nearest hospital or call emergency services.
`;

}else if((analysis.risk||"").toLowerCase()==="medium"){

alertBox.innerHTML=`
⚠ Monitor symptoms carefully.
Consult a doctor as soon as possible.
`;

}else{

alertBox.innerHTML=`
✅ No immediate emergency detected.
Follow the first aid guidance and monitor symptoms.
`;

}

alertBox.classList.remove(
"alert-green",
"alert-yellow",
"alert-red"
);

switch((analysis.risk||"").toLowerCase()){

case "low":
alertBox.classList.add("alert-green");
break;

case "medium":
alertBox.classList.add("alert-yellow");
break;

default:
alertBox.classList.add("alert-red");
}

document
.getElementById("downloadPdfBtn")
.addEventListener("click",()=>{

const options={
margin:0.4,
filename:`Emergency_Triage_Report_${patient.name||"Patient"}.pdf`,
image:{
type:"jpeg",
quality:1
},
html2canvas:{
scale:2
},
jsPDF:{
unit:"in",
format:"a4",
orientation:"portrait"
}
};

html2pdf()
.set(options)
.from(document.body)
.save();

});