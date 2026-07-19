export default async function handler(req, res) {

    if(req.method !== "POST"){
        return res.status(405).json({
            error:"Method not allowed"
        });
    }

    try{

        const { patient } = req.body;

        const prompt = `
You are an Emergency Medical Triage AI.

Analyze this patient data:

Name: ${patient.name || "Unknown"}
Age: ${patient.age || "Unknown"}
Gender: ${patient.gender || "Unknown"}

Symptoms:
${patient.symptoms || "Unknown"}

Vitals:
Pulse: ${patient.pulse || "Unknown"}
Blood Pressure: ${patient.bloodPressure || "Unknown"}
Temperature: ${patient.temperature || "Unknown"}
SpO2: ${patient.spo2 || "Unknown"}

Return ONLY valid JSON:

{
"risk":"Low/Medium/High",
"condition":"Possible condition",
"firstAid":["Point 1","Point 2","Point 3"],
"guidance":["Point 1","Point 2","Point 3"],
"hospital":"Hospital recommendation",
"reason":"Reason",
"confidence":90,
"summary":"Short patient summary"
}
`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + process.env.GROQ_API_KEY
                },
                body:JSON.stringify({
                    model:"llama-3.3-70b-versatile",
                    messages:[
                        {
                            role:"system",
                            content:"You are an Emergency Triage Medical AI. Respond only JSON."
                        },
                        {
                            role:"user",
                            content:prompt
                        }
                    ],
                    temperature:0.2
                })
            }
        );


        const data = await response.json();

        res.status(200).json(data);

    }
    catch(error){

        console.error(error);

        res.status(500).json({
            error:"Server error"
        });

    }

}