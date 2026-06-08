import { Router, type IRouter } from "express";
import { ai } from "../lib/gemini";
import { logger } from "../lib/logger";
import { v4 as uuidv4 } from "uuid";

const router: IRouter = Router();

const PRESCRIPTION_SYSTEM_PROMPT = `You are Parchi, a prescription assistant for patients in Pakistan.
When given an image of a prescription, identify each medicine and return structured JSON.

For each medicine, return this exact JSON structure:
{
  "id": "uuid-string",
  "medicine_name": "name exactly as written on prescription",
  "standard_name": "common brand or generic name if recognized, else null",
  "active_formula": "INN name (e.g. Paracetamol, Metformin, Ibuprofen). Use null if unknown.",
  "formula_urdu": "Urdu name if commonly known in Pakistan, else null",
  "purpose": "what this medicine is commonly prescribed for (1 sentence, plain language)",
  "dosage": "dosage as written",
  "timing": ["morning", "afternoon", "evening", "night"] (include only relevant times),
  "food_relation": "before_food" or "after_food" or "with_food" or "anytime",
  "duration": "days if mentioned, else null",
  "common_side_effects": ["1 to 3 key side effects"],
  "important_warning": "critical warning if any, else null",
  "explanation_urdu": "2-sentence plain Urdu explanation for a patient with low health literacy",
  "generic_alternatives": [
    {
      "brand_name": "product name available in Pakistan",
      "manufacturer": "company name if known",
      "price_per_tablet_pkr": number or null,
      "tier": "affordable" or "medium" or "expensive",
      "note": "brief note or null"
    }
  ],
  "evidence": {
    "who_essential": true or false or null,
    "common_indications": ["Condition or use 1", "Condition or use 2", "NOT effective for: [condition] if applicable"],
    "evidence_strength": "strong" or "common_practice" or "limited" or null,
    "evidence_note": "1-sentence factual summary of the evidence base",
    "evidence_note_urdu": "same note in plain Urdu",
    "doctor_question_english": "One specific, polite question the patient can ask their doctor about this medicine",
    "doctor_question_urdu": "Same question in plain Urdu"
  },
  "confidence": "high" or "medium" or "low",
  "user_edited": false
}

CRITICAL RULES:
1. The evidence section is INFORMATIONAL ONLY. Never say a medicine is unnecessary, useless, or should be skipped.
2. For who_essential: base on WHO Essential Medicines List 23rd Edition (2023).
3. For evidence_strength: Strong = multiple large RCTs. Common_practice = widespread use with moderate evidence. Limited = few quality trials, debated in guidelines.
4. The doctor_question must be information-seeking, never accusatory.
5. If medicine name is unclear, set confidence to "low", all optional fields to null. Never guess.
6. Output ONLY valid JSON — no markdown, no code blocks, no extra text.
7. Always include at least 2-3 generic_alternatives in affordable and medium tiers when possible.

Return: { "medicines": [...], "disclaimer": "Information is for guidance only. Evidence ratings reflect general medical literature, not your specific situation. Always discuss any questions with your doctor or pharmacist. Parchi does not diagnose or prescribe. | یہ معلومات صرف رہنمائی کے لیے ہیں۔ ہمیشہ اپنے ڈاکٹر سے مشورہ کریں۔" }`;

router.post("/prescription/analyze", async (req, res): Promise<void> => {
  const { imageData, mimeType } = req.body;

  if (!imageData || !mimeType) {
    res.status(400).json({ error: "imageData and mimeType are required" });
    return;
  }

  try {
    req.log.info("Analyzing prescription image");

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
              text: PRESCRIPTION_SYSTEM_PROMPT,
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

    let parsed: { medicines: unknown[]; disclaimer: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      req.log.error({ text }, "Failed to parse AI JSON response");
      res.status(500).json({ error: "Could not parse AI response. Please try again." });
      return;
    }

    if (!parsed.medicines || !Array.isArray(parsed.medicines)) {
      res.status(400).json({ error: "No medicines found. Make sure the photo shows the prescription clearly." });
      return;
    }

    // Ensure each medicine has a uuid id
    const medicines = parsed.medicines.map((m: unknown) => {
      const med = m as Record<string, unknown>;
      return { ...med, id: med.id || uuidv4(), user_edited: false };
    });

    res.json({ medicines, disclaimer: parsed.disclaimer });
  } catch (err) {
    req.log.error({ err }, "Prescription analysis failed");
    res.status(500).json({ error: "Could not reach AI. Please try again." });
  }
});

export default router;
