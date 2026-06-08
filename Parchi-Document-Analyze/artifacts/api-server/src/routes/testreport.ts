import { Router, type IRouter } from "express";
import { ai } from "../lib/gemini";
import { logger } from "../lib/logger";
import { v4 as uuidv4 } from "uuid";

const router: IRouter = Router();

const TEST_REPORT_SYSTEM_INSTRUCTION = `You are Parchi's lab report reader for patients in Pakistan.

## YOUR CORE TASK
You will receive an image of a laboratory or blood test report — typically a printed or digital (soft copy) lab report from Pakistani labs such as Chughtai Lab, Agha Khan, Excel Lab, IDC, Shaukat Khanum, or others. Extract every test result and explain it in plain, accessible language.

## READING GUIDELINES
- Most Pakistani lab reports are printed and have columns: Test Name | Result | Units | Reference Range | Flag (H/L/*)
- Common report sections: CBC (Complete Blood Count), LFTs (Liver Function Tests), RFTs/KFTs (Renal/Kidney Function Tests), Lipid Profile, TFTs (Thyroid), HbA1c, Urine R/E, etc.
- "H" or "↑" flag = High, "L" or "↓" flag = Low, "*" or "!" = critical value
- Units to recognize: mg/dL, mmol/L, g/dL, g/L, IU/L, U/L, mEq/L, µmol/L, ng/mL, pg/mL, %, 10³/µL, 10⁶/µL, cells/µL
- Normal ranges on the report take priority over generic ranges; use them.
- If the image is a digital screenshot (PDF viewer, email screenshot), still extract all visible values.

## OUTPUT FORMAT
Return ONLY a valid JSON object:
{
  "test_values": [
    {
      "id": "uuid-string",
      "test_name": "test name exactly as printed on report",
      "test_name_urdu": "Urdu name if commonly known in Pakistan, else null",
      "patient_value": "the patient's result exactly as shown",
      "unit": "unit of measurement or null",
      "normal_range": "reference range from the report, or standard international range if not shown",
      "status": "normal" | "high" | "low" | "borderline" | "unclear",
      "urgency": "routine" | "discuss_soon" | "discuss_urgently",
      "explanation_english": "2 sentences: (1) what this test measures, (2) what the patient's result means in plain language. Do NOT suggest a diagnosis.",
      "explanation_urdu": "Same 2 sentences in plain Urdu for a patient with low health literacy",
      "doctor_question": "One specific, polite question to ask the doctor if result is not normal. null if normal.",
      "doctor_question_urdu": "Same question in Urdu or null"
    }
  ],
  "summary": {
    "total": number,
    "normal": number,
    "borderline": number,
    "flagged": number,
    "urgent": number
  },
  "disclaimer": "These explanations are for information only. Only your doctor can interpret your results in the context of your full health history. Parchi does not diagnose. | یہ وضاحتیں صرف معلومات کے لیے ہیں۔ نتائج کی تشریح صرف آپ کا ڈاکٹر کر سکتا ہے۔"
}

## CRITICAL RULES
1. NEVER suggest a diagnosis. NEVER say "this means you have [condition]". Say "this value is above/below the normal range — discuss with your doctor."
2. Urgency rules:
   - discuss_urgently: values critically outside range with known clinical urgency (e.g. Hemoglobin < 7 g/dL, Potassium > 6.5 mEq/L, Creatinine extremely elevated, very high blood glucose)
   - discuss_soon: moderately abnormal values that need attention
   - routine: normal values, or mildly borderline values
3. borderline status = within ~10% of the normal range boundary.
4. Extract ALL test values visible — do not skip any row.
5. If a value cannot be clearly read, set status to "unclear".
6. Output ONLY valid JSON — no markdown, no code fences, no extra text.
7. If the image shows no lab report (wrong photo, blank page), return: {"test_values": [], "summary": {"total":0,"normal":0,"borderline":0,"flagged":0,"urgent":0}, "disclaimer": "No lab report detected.", "error": "not_a_report"}`;

const USER_PROMPT = `Please read this lab report image carefully. Extract every test result visible. Follow the system instructions exactly and return only valid JSON.`;

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"];

async function generateWithFallback(parts: object[]) {
  let lastError: unknown;
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          config: {
            systemInstruction: TEST_REPORT_SYSTEM_INSTRUCTION,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
            temperature: 0.1,
          },
          contents: [{ role: "user", parts }],
        });
        return response;
      } catch (err: unknown) {
        lastError = err;
        const status = (err as { status?: number })?.status;
        if (status === 503 || status === 429) {
          if (attempt === 1) await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        throw err;
      }
    }
  }
  throw lastError;
}

router.post("/testreport/analyze", async (req, res): Promise<void> => {
  const { imageData, mimeType } = req.body;

  if (!imageData || !mimeType) {
    res.status(400).json({ error: "imageData and mimeType are required" });
    return;
  }

  try {
    req.log.info("Analyzing test report image");

    const response = await generateWithFallback([
      { inlineData: { mimeType, data: imageData } },
      { text: USER_PROMPT },
    ]);

    const text = response.text;
    if (!text) {
      res.status(500).json({ error: "No response from AI" });
      return;
    }

    let parsed: { test_values: unknown[]; summary: unknown; disclaimer: string; error?: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      req.log.error({ text }, "Failed to parse AI JSON response for test report");
      res.status(500).json({ error: "Could not parse AI response. Please try again." });
      return;
    }

    if (parsed.error === "not_a_report") {
      res.status(400).json({ error: "No lab report detected. Please upload a photo or screenshot of your lab report." });
      return;
    }

    if (!parsed.test_values || !Array.isArray(parsed.test_values) || parsed.test_values.length === 0) {
      res.status(400).json({ error: "Could not read this report. Try better lighting or a clearer photo." });
      return;
    }

    const test_values = parsed.test_values.map((v: unknown) => {
      const val = v as Record<string, unknown>;
      return { ...val, id: val.id || uuidv4() };
    });

    const summary = {
      total: test_values.length,
      normal: test_values.filter((v: Record<string, unknown>) => v.status === "normal").length,
      borderline: test_values.filter((v: Record<string, unknown>) => v.status === "borderline").length,
      flagged: test_values.filter((v: Record<string, unknown>) => v.status === "high" || v.status === "low").length,
      urgent: test_values.filter((v: Record<string, unknown>) => v.urgency === "discuss_urgently").length,
    };

    res.json({ test_values, summary, disclaimer: parsed.disclaimer });
  } catch (err: unknown) {
    req.log.error({ err }, "Test report analysis failed");
    const status = (err as { status?: number })?.status;
    if (status === 503 || status === 429) {
      res.status(503).json({ error: "The AI service is busy right now. Please wait a few seconds and try again." });
    } else {
      res.status(500).json({ error: "Could not reach AI. Please try again." });
    }
  }
});

export default router;
