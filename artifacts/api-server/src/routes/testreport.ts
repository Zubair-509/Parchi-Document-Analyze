import { Router, type IRouter } from "express";
import { ai } from "../lib/gemini";
import { logger } from "../lib/logger";
import { v4 as uuidv4 } from "uuid";

const router: IRouter = Router();

const TEST_REPORT_SYSTEM_PROMPT = `You are Parchi's test report reader for patients in Pakistan.
When given an image of a laboratory or blood test report, identify each test value and explain it in plain, non-medical language.

For each test value, return:
{
  "id": "uuid-string",
  "test_name": "name of the test as shown on report",
  "test_name_urdu": "Urdu name if commonly known, else null",
  "patient_value": "the patient's result exactly as shown",
  "unit": "unit of measurement (e.g. mg/dL, g/L, %)",
  "normal_range": "standard normal range as shown on report, or internationally accepted standard if not shown",
  "status": "normal" or "high" or "low" or "borderline" or "unclear",
  "urgency": "routine" or "discuss_soon" or "discuss_urgently",
  "explanation_english": "2 sentences: what this test measures + what the patient's result means in plain language. Do NOT suggest a diagnosis.",
  "explanation_urdu": "Same in plain Urdu",
  "doctor_question": "One specific question to ask the doctor IF the result is not normal. Null if normal.",
  "doctor_question_urdu": "Same in Urdu or null"
}

CRITICAL RULES:
1. NEVER suggest a diagnosis. NEVER say "this means you have [condition]". Say: "this value is above/below the normal range — worth discussing."
2. Urgency rules: discuss_urgently only for values far outside range with known clinical urgency (e.g. critically low hemoglobin, very high potassium). discuss_soon for moderately abnormal values. routine for all normal values.
3. If a value cannot be read clearly, set status to "unclear".
4. Output ONLY valid JSON — no markdown, no code blocks, no extra text.

Return: {
  "test_values": [...],
  "summary": {
    "total": number,
    "normal": number,
    "borderline": number,
    "flagged": number,
    "urgent": number
  },
  "disclaimer": "These explanations are for information only. Only your doctor can interpret your results in the context of your full health history. Parchi does not diagnose. | یہ وضاحتیں صرف معلومات کے لیے ہیں۔ نتائج کی تشریح صرف آپ کا ڈاکٹر کر سکتا ہے۔"
}`;

router.post("/testreport/analyze", async (req, res): Promise<void> => {
  const { imageData, mimeType } = req.body;

  if (!imageData || !mimeType) {
    res.status(400).json({ error: "imageData and mimeType are required" });
    return;
  }

  try {
    req.log.info("Analyzing test report image");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType,
                data: imageData,
              },
            },
            {
              text: TEST_REPORT_SYSTEM_PROMPT,
            },
          ],
        },
      ],
      config: {
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      res.status(500).json({ error: "No response from AI" });
      return;
    }

    let parsed: { test_values: unknown[]; summary: unknown; disclaimer: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      req.log.error({ text }, "Failed to parse AI JSON response for test report");
      res.status(500).json({ error: "Could not parse AI response. Please try again." });
      return;
    }

    if (!parsed.test_values || !Array.isArray(parsed.test_values)) {
      res.status(400).json({ error: "Could not read this report. Try better lighting or a clearer photo." });
      return;
    }

    // Ensure each test value has a uuid id
    const test_values = parsed.test_values.map((v: unknown) => {
      const val = v as Record<string, unknown>;
      return { ...val, id: val.id || uuidv4() };
    });

    // Recalculate summary from actual test values to ensure accuracy
    const summary = {
      total: test_values.length,
      normal: test_values.filter((v: Record<string, unknown>) => v.status === "normal").length,
      borderline: test_values.filter((v: Record<string, unknown>) => v.status === "borderline").length,
      flagged: test_values.filter((v: Record<string, unknown>) => v.status === "high" || v.status === "low").length,
      urgent: test_values.filter((v: Record<string, unknown>) => v.urgency === "discuss_urgently").length,
    };

    res.json({ test_values, summary, disclaimer: parsed.disclaimer });
  } catch (err) {
    req.log.error({ err }, "Test report analysis failed");
    res.status(500).json({ error: "Could not reach AI. Please try again." });
  }
});

export default router;
