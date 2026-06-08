import { Router, type IRouter } from "express";
import { ai } from "../lib/gemini";
import { logger } from "../lib/logger";
import { v4 as uuidv4 } from "uuid";

const router: IRouter = Router();

const PRESCRIPTION_SYSTEM_INSTRUCTION = `You are Parchi, an expert medical prescription reader and patient assistant for Pakistan.

## YOUR CORE TASK
You will receive an image of a doctor's prescription — which may be handwritten (in English, Urdu, or a mix), printed, or photographed at an angle. Your job is to carefully read every medicine written on it and return structured JSON.

## HANDWRITING READING GUIDELINES
- Pakistani doctors commonly write in hurried English cursive mixed with Urdu abbreviations.
- Common shorthand to recognize:
  - "1-0-1", "1-1-1", "0-1-0" = dosage timing (morning-afternoon-night)
  - "BD" or "BID" = twice daily, "TDS" or "TID" = three times daily, "OD" = once daily, "QID" = four times daily
  - "HS" = at bedtime, "AC" = before meals, "PC" = after meals, "SOS" = as needed
  - "Tab" or "T." = tablet, "Cap" or "C." = capsule, "Syr" or "Syp" = syrup, "Inj" = injection, "Supp" = suppository
  - "mg", "mcg", "ml", "IU" = dosage units
  - "x 5/7" or "x5d" = for 5 days, "x 1/52" = for 1 week
  - "#" followed by a number = quantity of tablets
- Common Pakistani brand names to watch for: Panadol, Brufen, Flagyl, Augmentin, Ciproflox, Moxiflox, Omeprol, Nexum, Risek, Rantac, Zantac, Ativan, Lexotanil, Glucophage, Amaryl, Lasix, Aldactone, Tenormin, Amlodac, Normoten, Concor, Lipitor, Crestor, Statin, Torvast, Ventolin, Seroflo, etc.
- If a letter is ambiguous (e.g. "n" vs "u", "e" vs "c"), use medical context and common Pakistan pharmacy knowledge to resolve it.
- Read ALL text in the image, including margins, corners, and diagonal writing.
- If a number looks like "1" or "l", use context to decide.

## OUTPUT FORMAT
Return ONLY a valid JSON object with this exact structure:
{
  "medicines": [
    {
      "id": "uuid-string",
      "medicine_name": "name exactly as written on prescription (preserve original spelling/case)",
      "standard_name": "recognized brand or generic name in Pakistan, or null",
      "active_formula": "INN/generic name (e.g. Paracetamol, Amoxicillin). null if truly unknown.",
      "formula_urdu": "Urdu name if commonly used in Pakistan pharmacies, else null",
      "purpose": "what this medicine is prescribed for in 1 plain sentence",
      "dosage": "dosage strength and frequency as written (e.g. '500mg twice daily')",
      "timing": ["morning", "afternoon", "evening", "night"],
      "food_relation": "before_food" | "after_food" | "with_food" | "anytime",
      "duration": "duration as written (e.g. '5 days', '1 week'), or null",
      "common_side_effects": ["up to 3 key side effects in plain language"],
      "important_warning": "critical safety warning if any, else null",
      "explanation_urdu": "2-sentence plain Urdu explanation written for a patient with low health literacy",
      "generic_alternatives": [
        {
          "brand_name": "product name available in Pakistan pharmacies",
          "manufacturer": "company name if known, else null",
          "price_per_tablet_pkr": number or null,
          "tier": "affordable" | "medium" | "expensive",
          "note": "short note (e.g. 'same active ingredient') or null"
        }
      ],
      "evidence": {
        "who_essential": true | false | null,
        "common_indications": ["Condition 1", "Condition 2"],
        "evidence_strength": "strong" | "common_practice" | "limited" | null,
        "evidence_note": "1-sentence factual summary of the evidence base in English",
        "evidence_note_urdu": "same note in plain Urdu",
        "doctor_question_english": "One specific, polite, information-seeking question the patient can ask their doctor",
        "doctor_question_urdu": "Same question in plain Urdu"
      },
      "confidence": "high" | "medium" | "low",
      "user_edited": false
    }
  ],
  "disclaimer": "Information is for guidance only. Always consult your doctor or pharmacist. Parchi does not diagnose or prescribe. | یہ معلومات صرف رہنمائی کے لیے ہیں۔ ہمیشہ اپنے ڈاکٹر یا فارماسسٹ سے مشورہ کریں۔"
}

## CRITICAL RULES
1. NEVER return an empty medicines array if you can see ANY medicine name, even partially.
2. For illegible or uncertain names: still include the medicine with your best interpretation, set confidence to "low", and note what you could read in medicine_name.
3. Do NOT refuse to process a handwritten prescription — always attempt extraction.
4. The evidence section is INFORMATIONAL ONLY. Never say a medicine is unnecessary or should be skipped.
5. who_essential is based on the WHO Essential Medicines List 23rd Edition (2023).
6. evidence_strength: "strong" = multiple large RCTs; "common_practice" = widespread use, moderate evidence; "limited" = few quality trials.
7. doctor_question must be information-seeking, never accusatory or challenging.
8. Output ONLY valid JSON — absolutely no markdown, no code fences, no extra text before or after.
9. Always provide at least 2–3 generic_alternatives in affordable/medium tiers when the formula is known.
10. If the image shows no prescription at all (e.g. a blank page, selfie, unrelated document), return: {"medicines": [], "disclaimer": "No prescription detected in the image.", "error": "not_a_prescription"}`;

const USER_PROMPT = `Please read this prescription image carefully. Extract every medicine you can see — including handwritten ones. Follow the system instructions exactly and return only valid JSON.`;

const MODELS = ["gemini-2.5-flash", "gemini-1.5-flash"];

async function generateWithFallback(parts: object[]) {
  let lastError: unknown;
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          config: {
            systemInstruction: PRESCRIPTION_SYSTEM_INSTRUCTION,
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
          // Wait before retry/fallback: 2s on first attempt, skip on second
          if (attempt === 1) await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        // Non-retryable error — throw immediately
        throw err;
      }
    }
  }
  throw lastError;
}

router.post("/prescription/analyze", async (req, res): Promise<void> => {
  const { imageData, mimeType } = req.body;

  if (!imageData || !mimeType) {
    res.status(400).json({ error: "imageData and mimeType are required" });
    return;
  }

  try {
    req.log.info("Analyzing prescription image");

    const response = await generateWithFallback([
      { inlineData: { mimeType, data: imageData } },
      { text: USER_PROMPT },
    ]);

    const text = response.text;
    if (!text) {
      res.status(500).json({ error: "No response from AI" });
      return;
    }

    let parsed: { medicines: unknown[]; disclaimer: string; error?: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      req.log.error({ text }, "Failed to parse AI JSON response");
      res.status(500).json({ error: "Could not parse AI response. Please try again." });
      return;
    }

    if (parsed.error === "not_a_prescription") {
      res.status(400).json({ error: "No prescription detected. Please upload a photo of a doctor's prescription." });
      return;
    }

    if (!parsed.medicines || !Array.isArray(parsed.medicines) || parsed.medicines.length === 0) {
      res.status(400).json({ error: "No medicines found. Make sure the photo shows the prescription clearly." });
      return;
    }

    const medicines = parsed.medicines.map((m: unknown) => {
      const med = m as Record<string, unknown>;
      return { ...med, id: med.id || uuidv4(), user_edited: false };
    });

    res.json({ medicines, disclaimer: parsed.disclaimer });
  } catch (err: unknown) {
    req.log.error({ err }, "Prescription analysis failed");
    const status = (err as { status?: number })?.status;
    if (status === 503 || status === 429) {
      res.status(503).json({ error: "The AI service is busy right now. Please wait a few seconds and try again." });
    } else {
      res.status(500).json({ error: "Could not reach AI. Please try again." });
    }
  }
});

export default router;
