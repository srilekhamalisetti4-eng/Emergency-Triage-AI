const form=document.getElementById("triageForm");
console.log(form);
const loading=document.getElementById("loading");
const analyzeBtn=document.getElementById("analyzeBtn");

form.addEventListener("submit",async(e)=>{
e.preventDefault();

analyzeBtn.disabled=true;
loading.classList.remove("hidden");

const patient={
name:document.getElementById("name").value.trim(),
age:document.getElementById("age").value.trim(),
gender:document.getElementById("gender").value,
weight:document.getElementById("weight").value.trim(),
height:document.getElementById("height").value.trim(),
temperature:document.getElementById("temperature").value.trim(),
pulse:document.getElementById("pulse").value.trim(),
bloodPressure:document.getElementById("bp").value.trim(),
spo2:document.getElementById("spo2").value.trim(),
history:document.getElementById("history").value.trim(),
symptoms:document.getElementById("symptoms").value.trim()
};

const prompt = `
You are an Emergency Medical Triage AI.

Analyze the patient using ONLY the information provided.
Do not assume missing values.

Patient Details:

Name: ${patient.name || "Unknown"}
Age: ${patient.age || "Unknown"}
Gender: ${patient.gender || "Unknown"}

Symptoms:
${patient.symptoms || "Unknown"}

Vitals:

Heart Rate:
${patient.pulse || "Unknown"}

Blood Pressure:
${patient.bloodPressure || "Unknown"}

Temperature:
${patient.temperature || "Unknown"}

Oxygen Saturation:
${patient.spo2 || "Unknown"}

Height:
${patient.height || "Unknown"}

Weight:
${patient.weight || "Unknown"}

Return ONLY valid JSON.

{
"risk":"Low/Medium/High",
"condition":"Possible condition",
"firstAid":[
"Point 1",
"Point 2",
"Point 3"
],
"guidance":[
"Point 1",
"Point 2",
"Point 3"
],
"hospital":"Hospital recommendation",
"reason":"Reason",
"confidence":90,
"summary":"Short summary of patient's emergency condition and recommended actions.",
"disclaimer":"This AI assessment is not a substitute for professional medical advice."
}
`;
try{
console.log("API CALL STARTED");
const response=await fetch("/api/analyze",{
method:"POST",
headers:{
"Content-Type":"application/json",
},
body:JSON.stringify({
model:CONFIG.MODEL,
messages:[
{
role:"system",
content:"You are an Emergency Triage Medical AI. Always respond ONLY in valid JSON."
},
{
role:"user",
content:prompt
}],
temperature:0.2,
response_format:{
type:"json_object"
}
})
});

if(!response.ok){
throw new Error("API Error");
}

const data=await response.json();

let result=data.choices[0].message.content;

if(typeof result==="string"){
result=JSON.parse(result);
}
console.log("AI RESULT:", result);
const finalData={
patient,
analysis:result,
generatedAt:new Date().toLocaleString()
};

localStorage.setItem(
"triageReport",
JSON.stringify(finalData)
);

window.location.href="result.html";

}
catch(error){

console.error(error);

alert(
"Unable to analyze patient.\n\nPlease check your API Key or Internet connection."
);

}
finally{

loading.classList.add("hidden");

analyzeBtn.disabled=false;

}

});