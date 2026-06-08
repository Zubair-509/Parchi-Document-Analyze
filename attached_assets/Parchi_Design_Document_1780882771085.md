# Parchi — Design Document Specification

**Product:** Parchi (پرچی)  
**Version:** 2.1 — MVP (Updated with Evidence Layer + Test Report Reader)  
**Date:** June 7, 2026  
**Document Type:** Design System & UI Specification  
**Applies To:** Web Application (Mobile-first, Responsive)  

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Brand Identity](#2-brand-identity)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Grid System](#5-spacing--grid-system)
6. [Iconography](#6-iconography)
7. [Component Library](#7-component-library)
8. [Screen Layouts & Wireframes](#8-screen-layouts--wireframes)
9. [Motion & Micro-interactions](#9-motion--micro-interactions)
10. [Responsive Design](#10-responsive-design)
11. [Accessibility Standards](#11-accessibility-standards)
12. [Design Tokens (CSS Variables)](#12-design-tokens-css-variables)
13. [Asset Specifications](#13-asset-specifications)
14. [Builder Handoff Notes](#14-builder-handoff-notes)

---

## 1. Design Philosophy

### 1.1 Core Design Principle

Parchi now serves three moments in one product: the confused patient who cannot read their prescription; the patient who cannot afford their medicine; and the patient who has been handed information — a diagnosis, a test report, a prescription — that nobody has taken the time to explain.

Every design decision must pass this test:

> **"Does this make a patient more capable of participating in their own healthcare — without replacing the doctor's role?"**

If yes, build it. If no, remove it.

### 1.2 Design Pillars

**Calm, not clinical** — Warm tones, soft forms. A knowledgeable family member explaining, not a hospital form intimidating.

**Visual over textual** — Time chips, color-coded test values, evidence badges. Reduce reading load.

**Affordable first** — The generic alternatives section leads with Affordable. The evidence layer does not lead with judgment. The design reinforces empowerment, not fear.

**Information, not verdicts** — The evidence layer and test report reader provide facts. The UI never says "skip this" or "this is wrong." The design language must reflect this — factual, calm, non-confrontational.

**Bilingual throughout** — Urdu and English coexist on every card, every badge, every doctor question.

**Safety is loud** — Disclaimers are prominent, bilingual, and never collapsible.

### 1.3 Aesthetic Direction

**Healing Warmth meets Informed Confidence.**

v2.1 adds a layer of information density to the app without adding visual complexity. The evidence layer and test report cards use the same warm palette, the same font system, and the same card geometry as the rest of Parchi. The product feels cohesive — not like three features bolted together.

The test report section introduces a new color usage: status colors for Normal (green), High (coral), Low (blue), Borderline (amber). These are consistent with universal medical color conventions — but calibrated to Parchi's warm palette so they feel informative, not alarming.

---

## 2. Brand Identity

### 2.1 Name & Tagline

**Parchi (پرچی)** — the colloquial Pakistani word for a prescription slip.

**Tagline v2.1:** "Understand your prescription. Question it. Afford it."  
Urdu: "اپنا نسخہ سمجھیں۔ سوال کریں۔ خریدیں۔"

The tagline now has three beats:
- **Understand** → prescription explanation feature
- **Question it** → evidence layer (empowers the patient to ask informed questions)
- **Afford it** → generic alternatives feature

The word "Question" is chosen deliberately — it is empowering, not accusatory. Question = curiosity, not confrontation.

### 2.2 Brand Voice (Updated)

| Context | Tone | Example |
|---------|------|---------|
| Evidence layer | Factual, neutral | "Commonly indicated for bacterial infections. Limited evidence for viral illness." |
| Doctor question prompt | Curious, respectful | "Ask your doctor: Is my infection confirmed to be bacterial?" |
| Test value normal | Reassuring | "Your hemoglobin is within the normal range." |
| Test value high/low | Informative, calm | "This value is above the normal range — worth discussing with your doctor." |
| Test value urgent | Direct, supportive | "This result is significantly outside the normal range. Please contact your doctor today." |
| Evidence — limited | Factual | "Limited clinical trial evidence supports this use in international guidelines." |
| Evidence — strong | Factual | "Supported by WHO and multiple large clinical trials." |

**Words that never appear in Parchi's UI:** unnecessary, useless, wrong, skip, bad doctor, over-prescribed.  
**Words that always appear:** ask your doctor, confirm with pharmacist, guidance only, discuss with your doctor.

---

## 3. Color System

### 3.1 Primary Palette (Unchanged)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary-900` | `#2D5145` | Brand deep, button hover |
| `--color-primary-700` | `#3D6B5C` | Primary brand, buttons |
| `--color-primary-500` | `#5A8A6E` | Interactive elements |
| `--color-primary-300` | `#9CC2A6` | Accents |
| `--color-primary-100` | `#E0EBE2` | Success tints |
| `--color-primary-50`  | `#F2F7F3` | Hover tints |

### 3.2 Price Tier Colors (From v2.0)

| Tier | Background | Border | Text |
|------|-----------|--------|------|
| Affordable | `#F0FDF4` | `#22C55E` | `#14532D` |
| Medium | `#FFFBEB` | `#F59E0B` | `#78350F` |
| Expensive | `#F9FAFB` | `#D1D5DB` | `#374151` |

### 3.3 Evidence Strength Colors (NEW v2.1)

| Badge | Background | Border | Text | Meaning |
|-------|-----------|--------|------|---------|
| Strong Evidence | `#F0FDF4` | `#22C55E` | `#14532D` | WHO/Cochrane-backed |
| Common Practice | `#FFFBEB` | `#F59E0B` | `#78350F` | Widely used, mixed evidence |
| Limited Evidence | `#F5F5F5` | `#9CA3AF` | `#4B5563` | Few quality trials |

**Design rule:** Evidence strength colors deliberately mirror price tier colors (green/amber/grey). This is intentional — users who learn the color language in the price section instantly understand it in the evidence section. Cognitive load reduction through consistency.

### 3.4 Test Report Status Colors (NEW v2.1)

| Status | Background | Border | Text | Icon |
|--------|-----------|--------|------|------|
| Normal | `#F0FDF4` | `#22C55E` | `#14532D` | ✓ check-circle |
| High | `#FCEAE1` | `#E8826B` | `#B85A3E` | ↑ arrow-up |
| Low | `#EFF6FF` | `#93C5FD` | `#1E3A8A` | ↓ arrow-down |
| Borderline | `#FFFBEB` | `#F59E0B` | `#78350F` | ~ minus-circle |
| Urgent | `#FEE2E2` | `#EF4444` | `#991B1B` | ⚠ alert-triangle |
| Unclear | `#F9FAFB` | `#D1D5DB` | `#6B7280` | ? help-circle |

**Color rationale:** The High status uses Parchi's warm coral (`#E8826B`) rather than alarming red. This is deliberate — a high test value should prompt the patient to seek information, not panic. Only the Urgent status uses true red (`#EF4444`), reserved for values that genuinely require prompt medical attention.

### 3.5 Other Semantic Colors

| Role | Background | Border | Text |
|------|-----------|--------|------|
| Warning / Unclear | `#FCEAE1` | `#E8826B` | `#B85A3E` |
| Information / Disclaimer | `#DBEAFE` | `#3B82F6` | `#1E40AF` |
| Formula badge | `#EFF6FF` | `#93C5FD` | `#1E3A8A` |

### 3.6 Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-base` | `#FBF7F2` | Page background |
| `--color-bg-card` | `#FFFFFF` | Cards |
| `--color-bg-schedule` | `#F2F7F3` | Schedule section |
| `--color-bg-alternatives` | `#FAFAF8` | Generic alternatives panel |
| `--color-bg-evidence` | `#FAFAFA` | Evidence layer panel |
| `--color-bg-testreport` | `#F8F9FF` | Test report section (slight blue tint — lab feel) |

---

## 4. Typography

### 4.1 Font Families

| Font | Use | CSS |
|------|-----|-----|
| Fraunces | Medicine names, section titles, result page headers | `font-family: 'Fraunces', Georgia, serif` |
| Lexend | All UI labels, body text, badges, buttons | `font-family: 'Lexend', system-ui, sans-serif` |
| Noto Nastaliq Urdu | All Urdu text output | `font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; line-height: 2.2` |
| JetBrains Mono | Prices, test values, normal ranges | `font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums` |

### 4.2 Type Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `--text-display` | 40px | 700 | Hero titles |
| `--text-title-xl` | 28px | 600 | Screen titles |
| `--text-title-lg` | 22px | 600 | Medicine name, test section title |
| `--text-title-md` | 18px | 600 | Card section headers |
| `--text-body-lg` | 17px | 400 | Purpose, indications |
| `--text-body-md` | 15px | 400 | Secondary body |
| `--text-body-sm` | 13px | 400 | Metadata |
| `--text-label` | 12px | 600 | ALL CAPS chips, badges |
| `--text-price` | 20px | 700 | Price per tablet |
| `--text-value` | 28px | 700 | Test result value (prominent) |
| `--text-urdu-lg` | 18px | 400 | Urdu explanations |

### 4.3 Test Value Display

Patient's test value is the most important number on the test card — show it large:

```
HbA1c
━━━━━━━━━━━━━━━━━━━━━━
  8.2  %     ↑ HIGH
━━━━━━━━━━━━━━━━━━━━━━
Normal: Below 5.7%
```

- Patient value: JetBrains Mono, 28px, weight 700, status color
- Status label: Lexend, 12px, weight 700, ALL CAPS, status color
- Status icon: 16px, status color, inline right of value
- Normal range: Lexend, 13px, #6B7280

---

## 5. Spacing & Grid System

### 5.1 Base Unit

**4px base unit.** All spacing multiples of 4px.

| Token | Value |
|-------|-------|
| `--space-1` through `--space-16` | 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px |

### 5.2 Layout Grid

**Single column, 720px max-width, centered.** All content reads vertically.

**Mobile:** Full width, 20px side padding.
**Desktop:** 720px centered, 24px padding.

### 5.3 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Badges, chips |
| `--radius-md` | 10px | Buttons, inputs |
| `--radius-lg` | 16px | Medicine cards, test report cards |
| `--radius-xl` | 20px | Modals, upload areas |
| `--radius-full` | 9999px | Time chips, status pills |

---

## 6. Iconography

### 6.1 Icon Library

**Lucide Icons** — stroke 1.5px. Works with Bolt.new and Lovable.

### 6.2 Icon Map (Full v2.1)

| Concept | Icon | Size |
|---------|------|------|
| Prescription scan | `camera` | 22px |
| Test report scan | `file-medical` or `clipboard-list` | 22px |
| Active formula | `flask-conical` | 16px |
| WHO Essential | `shield-check` | 16px |
| Evidence strong | `check-circle` (green filled) | 16px |
| Evidence common | `info` (amber) | 16px |
| Evidence limited | `minus-circle` (grey) | 16px |
| Ask your doctor | `message-circle` or `help-circle` | 16px |
| Test value normal | `check-circle` (green) | 18px |
| Test value high | `chevron-up` or `arrow-up-circle` (coral) | 18px |
| Test value low | `chevron-down` or `arrow-down-circle` (blue) | 18px |
| Test value borderline | `minus-circle` (amber) | 18px |
| Test value urgent | `alert-triangle` (red) | 18px |
| Affordable tier | `check-circle` (green) | 18px |
| Medium tier | `minus-circle` (amber) | 18px |
| Expensive tier | `circle` (grey) | 18px |
| Savings | `piggy-bank` | 16px |
| Time: morning | ☀️ sunrise | 20px |
| Time: afternoon | 🌞 sun | 20px |
| Time: evening | 🌆 sunset | 20px |
| Time: night | 🌙 moon | 20px |
| Warning | `alert-triangle` | 18px |
| Disclaimer | `info` | 16px |

---

## 7. Component Library

### 7.1 Buttons (Unchanged from v2.0)

Primary: `#3D6B5C` bg, white text, Lexend 16px 600, 14px/24px padding, 10px radius, 52px min-height.
Secondary: transparent bg, sage border, sage text.
Ghost: transparent, neutral text.

### 7.2 Medicine Card (Updated v2.1)

Full card structure with all sections:

```
┌──────────────────────────────────────────────────────────────┐
│  💊  AUGMENTIN 625MG                              [Edit ✏]   │
│       Amoxicillin + Clavulanic Acid                          │
│  [ 🧪 Active Formula: Amoxicillin + Clavulanic Acid ]        │
│                                                              │
│  Antibiotic for throat or chest bacterial infections.        │
│                                                              │
│  [🌅 Morning]  [🌙 Night]   [🍽 After food]  [📅 5 days]    │
│                                                              │
│  ⚠ Complete the full 5-day course even if you feel better.  │
│                                                              │
│  ──────────────────────────────────────────────────────────  │
│  [✓ WHO Essential]  [Strong Evidence]  [💬 Ask doctor ↓]    │ ← NEW
│                                                              │
│  Common uses:                                                │
│  • Bacterial throat and chest infections                     │
│  • Urinary tract infections (bacterial)                      │
│  • NOT effective for viral infections like cold or flu       │
│                                                              │
│  Strong Evidence — Supported by WHO and multiple large       │
│  clinical trials for bacterial infections.                   │
│                                                              │
│  💬 Ask your doctor:                                         │
│  "Is my infection confirmed bacterial? Antibiotics don't     │
│   work for viral infections like the common cold."           │
│                                                              │
│  ڈاکٹر سے پوچھیں:                                           │
│  "کیا میرا انفیکشن بیکٹیریل ثابت ہوا ہے؟"                   │
│                                                              │
│  ──────────────────────────────────────────────────────────  │
│  [💰 Same Medicine, Different Prices ↓]                      │
│  [3 price tier cards — Affordable first]                     │
│                                                              │
│  ──────────────────────────────────────────────────────────  │
│  مقصد                                                        │
│  [Urdu explanation]                                          │
└──────────────────────────────────────────────────────────────┘
```

### 7.3 Evidence Layer Panel (NEW v2.1)

The evidence layer sits between the medicine explanation and the generic alternatives section.

**Collapsed state (default on mobile):**
```
┌──────────────────────────────────────────────────────────────┐
│  [✓ WHO Essential]  [⬤ Strong Evidence]  [💬 Ask doctor] ↓  │
└──────────────────────────────────────────────────────────────┘

Container:
  Background:    #FAFAFA
  Border:        1px solid #E5E7EB
  Border-radius: 10px
  Padding:       14px 16px
  Display:       flex-row, gap 8px, align-center
  Cursor:        pointer (expandable)
```

**Expanded state:**
```
┌──────────────────────────────────────────────────────────────┐
│  [✓ WHO Essential]  [Strong Evidence]  [💬 Ask doctor] ↑     │
│  ─────────────────────────────────────────────────────────   │
│  COMMONLY USED FOR                                           │
│  • Bacterial throat and chest infections                     │
│  • Urinary tract infections                                  │
│  • NOT effective for: viral infections like cold or flu      │
│                                                              │
│  EVIDENCE                                                    │
│  Supported by WHO and multiple large clinical trials for     │
│  bacterial infections.                                       │
│  WHO کی فہرست میں ہے اور مضبوط طبی ثبوت موجود ہے۔           │
│                                                              │
│  💬 ASK YOUR DOCTOR                                          │
│  "Is my infection confirmed to be bacterial? Antibiotics     │
│   are not effective for viral infections like the cold."     │
│                                                              │
│  ڈاکٹر سے سوال:                                             │
│  "کیا میرا انفیکشن بیکٹیریل ثابت ہوا ہے؟"                   │
│                                                              │
│  ⓘ This is publicly available medical information.          │
│    Always discuss your specific case with your doctor.       │
└──────────────────────────────────────────────────────────────┘
```

### 7.4 Evidence Badge Row

Three inline badges shown in collapsed state:

**WHO Essential Badge:**
```
[🛡 WHO Essential Medicine]

Background:    #F0FDF4
Border:        1px solid #22C55E
Border-radius: 9999px (full pill)
Text:          Lexend 11px weight 700 #14532D
Icon:          shield-check 14px #22C55E
Padding:       5px 10px
```

**Evidence Strength Badge:**
```
Strong:   [✓ Strong Evidence]  — green pill (#F0FDF4 bg, #22C55E border)
Practice: [~ Common Practice] — amber pill (#FFFBEB bg, #F59E0B border)
Limited:  [- Limited Evidence] — grey pill  (#F5F5F5 bg, #9CA3AF border)

Same sizing as WHO badge
```

**Doctor Question Trigger:**
```
[💬 Ask your doctor ↓]

Background:    #EFF6FF
Border:        1px solid #93C5FD
Text:          Lexend 11px weight 700 #1E40AF
Icon:          message-circle 14px #3B82F6
Padding:       5px 10px
Border-radius: 9999px
```

### 7.5 "Ask Your Doctor" Prompt Card

Within the expanded evidence panel:

```
┌──────────────────────────────────────────────────────────────┐
│  💬  ASK YOUR DOCTOR                                         │
│  ─────────────────────────────────────────────────────────   │
│  English:                                                    │
│  "Is my infection confirmed to be bacterial? Antibiotics     │
│  are not effective for viral infections like the common      │
│  cold or flu."                                               │
│                                                              │
│  اردو:                                                       │
│  "کیا میرا انفیکشن بیکٹیریل ثابت ہوا ہے؟ اینٹی بائیوٹک     │
│  وائرل انفیکشن جیسے نزلے میں کام نہیں کرتی۔"                │
│                                                              │
│  [📋 Copy question]                                          │
└──────────────────────────────────────────────────────────────┘

Container:
  Background:    #EFF6FF
  Border:        1px solid #93C5FD
  Border-radius: 10px
  Padding:       16px

Header:
  Lexend 12px weight 700 ALL CAPS #1E40AF
  Icon: message-circle 14px

Question text:
  English: Lexend 15px weight 500 #1E3A8A (in quotes, italicized)
  Divider: 1px solid #BFDBFE
  Urdu: Noto Nastaliq 17px RTL #1E3A8A line-height 2.2

Copy button:
  Ghost style, small, right-aligned
  Copies question to clipboard
  Shows "Copied ✓" for 2 seconds on tap
```

### 7.6 Generic Alternatives Panel (From v2.0)

Three stacked tier cards: Affordable (first, most prominent), Medium, Expensive.

Affordable tier:
- `#F0FDF4` bg, `#22C55E` border, `#14532D` text
- Price in JetBrains Mono bold
- Savings callout in green

Medium tier: `#FFFBEB` bg, amber border, slightly smaller text
Expensive tier: `#F9FAFB` bg, neutral border, plain weight

### 7.7 Test Report Screen (NEW v2.1)

#### Summary Row

Appears at the top of the test report results, before individual cards:

```
┌──────────────────────────────────────────────────────────────┐
│  YOUR TEST RESULTS SUMMARY                                   │
│                                                              │
│  [✓ 8 Normal]  [↑ 1 High]  [~ 1 Borderline]  [⚠ 0 Urgent] │
└──────────────────────────────────────────────────────────────┘

Container:
  Background:    #F8F9FF (slight blue tint — lab context)
  Border-radius: 16px
  Padding:       20px
  Margin-bottom: 24px

Each summary chip:
  Background:    matches status color
  Font:          Lexend 14px weight 600
  Icon:          status icon 16px
  Padding:       8px 16px
  Border-radius: 9999px
  Display:       flex-row gap 8px
```

#### Test Value Card

One card per test value:

```
┌──────────────────────────────────────────────────────────────┐
│  HbA1c                            ↑ HIGH                     │
│  شوگر کا اوسط                                                │
│  ──────────────────────────────────────────────────────────  │
│                 8.2  %                                       │
│         Normal range: Below 5.7%                             │
│  ──────────────────────────────────────────────────────────  │
│  HbA1c measures your average blood sugar over 3 months.      │
│  Your value of 8.2% is above the normal range.               │
│                                                              │
│  HbA1c پچھلے تین مہینوں کی اوسط بلڈ شوگر بتاتا ہے۔         │
│  آپ کی قدر 8.2% نارمل حد سے زیادہ ہے۔                      │
│                                                              │
│  💬 ASK YOUR DOCTOR                                          │
│  "My HbA1c is 8.2% — what changes do you recommend?"        │
└──────────────────────────────────────────────────────────────┘

Container:
  Background:    status background color
  Border:        1.5px solid status border color
  Border-radius: 16px
  Padding:       20px
  Margin-bottom: 16px

Test name:
  Font: Fraunces 20px weight 600, status text color
  Urdu name: Noto Nastaliq 16px RTL, grey #6B7280

Status badge (top right):
  Font: Lexend 12px weight 700 ALL CAPS
  Color: status text color
  Icon: status icon 16px inline-left

Patient value (centered, prominent):
  Font: JetBrains Mono 28px weight 700
  Color: status text color
  Text-align: center
  Margin: 12px 0

Normal range:
  Font: Lexend 13px #6B7280
  Text-align: center

Explanation:
  English: Lexend 15px #374151
  Divider: 1px solid status border (lighter opacity)
  Urdu: Noto Nastaliq 17px RTL #374151 line-height 2.2

Doctor question (only if status != normal):
  Same component as prescription doctor question
  But in status color scheme, not blue
```

#### Urgent Value — Special Handling

When any value has `urgency: "discuss_urgently"`:

```
┌──────────────────────────────────────────────────────────────┐
│  ⚠ URGENT — Please contact your doctor today                │
│  فوری — آج ہی اپنے ڈاکٹر سے رابطہ کریں                     │
└──────────────────────────────────────────────────────────────┘

This banner appears ABOVE the individual test value card,
full-width, cannot be dismissed.

Background:    #FEE2E2
Border:        2px solid #EF4444
Border-radius: 10px
Padding:       16px 20px
Font:          Lexend 15px weight 700 #991B1B
Icon:          alert-triangle 20px #EF4444

This is the ONE place in Parchi where the UI proactively prompts
an action rather than waiting for the patient to draw conclusions.
Patient safety requires it.
```

### 7.8 Navigation — Two Modes (NEW v2.1)

The app now has two primary input modes, accessible from both the landing screen and a persistent header tab.

**Landing screen CTAs:**
```
[📋 My Prescription]   [🧪 My Test Report]

Two equally-weighted buttons side by side on desktop.
Stacked on mobile (prescription on top — primary use case).
```

**Header tabs (after first scan):**
```
[My Prescription] ─────── [My Test Report]
         ^^^
     (active indicator: 2px sage bottom border)
```

### 7.9 Safety Disclaimer Blocks

Three distinct disclaimer blocks — each contextually placed:

**1. Full-page prescription disclaimer** (blue — same as v2.0)
**2. Generic alternatives in-panel disclaimer** (neutral — same as v2.0)
**3. Evidence layer disclaimer (NEW):**
```
ⓘ This is publicly available medical information about this medicine.
  It is not an evaluation of your specific prescription.
  Always discuss any questions with your doctor.

  یہ دوائی کے بارے میں عام طبی معلومات ہے، آپ کے نسخے کا جائزہ نہیں۔
  ہمیشہ اپنے ڈاکٹر سے مشورہ کریں۔

Background:    transparent (within the evidence panel)
Border-top:    1px solid #E5E7EB
Padding-top:   12px
Font:          Lexend 12px #6B7280
```

**4. Test report disclaimer (NEW):**
```
ⓘ These explanations are for your information only.
  Only your doctor can interpret results in the full context of your health.
  Parchi does not diagnose any condition.

  یہ وضاحتیں صرف آپ کی معلومات کے لیے ہیں۔
  صرف آپ کا ڈاکٹر ہی آپ کی صحت کے تناظر میں نتائج کی تشریح کر سکتا ہے۔

Background:    #DBEAFE
Border:        1px solid #3B82F6
Border-radius: 12px
Padding:       20px
Always visible, never collapsible
```

### 7.10 Upload Areas

**Prescription upload** (existing — sage bordered)
**Test report upload (NEW):**
```
Border: 2px dashed #93C5FD (blue — lab context)
Background: #F8F9FF
Icon: clipboard-list or file-text, 64px, #3B82F6
Title: "Upload your lab report"
Urdu: "اپنی لیب رپورٹ اپ لوڈ کریں"
```

---

## 8. Screen Layouts & Wireframes

### 8.1 Landing Screen (Updated v2.1)

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
├──────────────────────────────────────────────────────────────┤
│                        🍃                                    │
│                      Parchi                                  │
│   Understand your prescription. Question it. Afford it.      │
│   اپنا نسخہ سمجھیں۔ سوال کریں۔ خریدیں۔                      │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐           │
│  │  📋 My Prescription  │  │  🧪 My Test Report   │           │
│  │  ────────────────── │  │  ──────────────────  │           │
│  │  Tap to scan or     │  │  Tap to upload your  │           │
│  │  upload a           │  │  blood test or lab   │           │
│  │  prescription       │  │  report              │           │
│  └─────────────────────┘  └─────────────────────┘           │
│                                                              │
│  What Parchi does for you:                                   │
│  ✅  Explains every medicine in Urdu                         │
│  💰  Finds affordable alternatives                           │
│  🔬  Shows clinical evidence behind prescriptions            │
│  🧪  Explains your test report values                        │
│                                                              │
│  ⓘ Disclaimer block                                         │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 Prescription Results Screen (Updated v2.1)

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER with [My Prescription*] [My Test Report] tabs        │
├──────────────────────────────────────────────────────────────┤
│  Here is your prescription, explained                        │
│  💰 Affordable options found  |  🔬 Evidence data available  │ ← summary badges
│                                                              │
│  DAILY SCHEDULE                                              │
│  [4 time blocks]                                             │
│                                                              │
│  YOUR MEDICINES (2)                                          │
│  [Medicine Card 1 — full card including evidence layer]      │
│  [Medicine Card 2 — evidence shows "Limited Evidence"]       │
│  [Medicine Card 3 — Unclear, no evidence shown]              │
│                                                              │
│  ⓘ Full-page disclaimer                                      │
│  [📋 Scan Another Prescription]                              │
└──────────────────────────────────────────────────────────────┘
```

### 8.3 Test Report Results Screen (NEW v2.1)

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER with [My Prescription] [My Test Report*] tabs        │
├──────────────────────────────────────────────────────────────┤
│  Your test report, explained                                 │
│  آپ کی رپورٹ کی وضاحت                                        │
│                                                              │
│  SUMMARY ROW                                                 │
│  [✓ 8 Normal]  [↑ 1 High]  [~ 1 Borderline]  [⚠ 0 Urgent]  │
│                                                              │
│  ⚠ URGENT VALUE BANNER (if any)                             │
│  "This result is significantly outside normal range.         │
│   Please contact your doctor today."                         │
│                                                              │
│  FLAGGED VALUES FIRST                                        │
│  [HbA1c card — HIGH — coral bg]                              │
│  [Borderline card — amber bg]                                │
│                                                              │
│  NORMAL VALUES                                               │
│  [Hemoglobin card — green bg]                                │
│  [All other normal cards — collapsed by default on mobile]   │
│                                                              │
│  ⓘ Test report disclaimer                                    │
│  [🧪 Upload Another Report]                                  │
└──────────────────────────────────────────────────────────────┘
```

**Test card sort order:** Urgent first → High → Low → Borderline → Normal. Puts the most important results at the top. Normal results can be collapsed on mobile ("8 normal results — tap to see all").

### 8.4 Mobile Navigation

On mobile, a bottom tab bar (fixed) provides:

```
[📋 Prescription]  [🧪 Test Report]  [📅 Schedule]
```

This replaces the header tabs on mobile — more accessible, always visible, thumb-reachable.

---

## 9. Motion & Micro-interactions

### 9.1 Global

```css
transition-duration: 200ms;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

### 9.2 Medicine Card Stagger (unchanged)

Fade-up with 120ms delay between cards.

### 9.3 Evidence Panel Expand

```css
.evidence-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease;
}
.evidence-content.expanded {
  grid-template-rows: 1fr;
}
.evidence-chevron {
  transition: transform 200ms ease;
}
.expanded .evidence-chevron { transform: rotate(180deg); }
```

### 9.4 Test Value Cards — Status Reveal

After test report AI returns, cards animate in with a short stagger but with a status-specific timing:

- Urgent: appears immediately, 0ms delay, slight pulse animation (2 pulses only)
- High/Low/Borderline: 100ms delay between each
- Normal: 200ms delay, grouped fade-in

```css
/* Urgent card pulse — draws attention without alarming */
@keyframes urgentPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3); }
  50%       { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
}
.test-card-urgent {
  animation: urgentPulse 1s ease-in-out 2;
}
```

### 9.5 Doctor Question Copy Confirmation

```css
/* "Copied ✓" replaces button text for 2 seconds */
.copy-btn::after {
  content: 'Copied ✓';
  animation: showConfirm 2s ease forwards;
}
@keyframes showConfirm {
  0%   { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; }
}
```

### 9.6 Savings Counter (unchanged from v2.0)

Counts up to the savings amount in 600ms on Affordable tier reveal.

### 9.7 Motion Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Responsive Design

### 10.1 Breakpoints

| Name | Min-width |
|------|-----------|
| `xs` | 0px |
| `sm` | 480px |
| `md` | 768px |
| `lg` | 1024px |

### 10.2 Component Behavior

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Landing CTAs | Stacked vertically | Side by side |
| Navigation | Bottom tab bar | Header tabs |
| Medicine card | Full-width | Full-width in container |
| Evidence panel | Collapsed, "tap to expand" | Expanded |
| Generic alternatives | Collapsed | Expanded |
| Test value cards | Flagged shown, normals collapsed | All visible |
| Daily schedule | 4 vertical rows | 4 horizontal columns |
| Doctor question | Full-width card | Full-width in container |

### 10.3 Bottom Tab Bar (Mobile Only)

```
Fixed bottom, 64px height, white background, top border 1px #E5E7EB.
Three tabs: Prescription | Test Report | Schedule
Active tab: sage green icon + label, 2px top border
Inactive: grey icon + label
Tab icons: 24px
Tab labels: Lexend 11px weight 500
```

### 10.4 Tap Targets

**48×48px minimum** throughout. Doctor question "Copy" button: minimum 44×44px.

---

## 11. Accessibility Standards

### 11.1 Standard

WCAG 2.1 Level AA minimum. Several elements target AAA.

### 11.2 Evidence Layer Accessibility

- Evidence strength is conveyed by: color + icon + text label (triple redundancy)
- WHO badge has `aria-label="This medicine is on the WHO Essential Medicines List"`
- Evidence note has `role="note"`
- Doctor question has `aria-label="Suggested question to ask your doctor: [question text]"`
- Copy button has `aria-live="polite"` to announce "Copied" to screen readers

### 11.3 Test Report Accessibility

- Each test card has `aria-label="[test name]: [value], status [status], [explanation]"`
- Urgent banner has `role="alert"` and `aria-live="assertive"` — announced immediately
- Summary chips have descriptive labels: `aria-label="8 values within normal range"`
- Status icons have aria-labels: `aria-label="High value"`, `aria-label="Normal"`
- Normal values collapse button: `aria-expanded="false"` / `"true"` with count

### 11.4 Color Contrast (Key Combinations)

| Combination | Ratio | Pass |
|-------------|-------|------|
| `#14532D` on `#F0FDF4` | 7.8:1 | AAA ✓ |
| `#78350F` on `#FFFBEB` | 8.2:1 | AAA ✓ |
| `#4B5563` on `#F5F5F5` (limited) | 7.1:1 | AAA ✓ |
| `#B85A3E` on `#FCEAE1` (high) | 5.2:1 | AA ✓ |
| `#1E3A8A` on `#EFF6FF` (doctor Q) | 7.5:1 | AAA ✓ |
| `#991B1B` on `#FEE2E2` (urgent) | 6.2:1 | AA ✓ |

---

## 12. Design Tokens (CSS Variables)

```css
:root {
  /* ── BRAND ── */
  --color-primary-900: #2D5145;
  --color-primary-700: #3D6B5C;
  --color-primary-500: #5A8A6E;
  --color-primary-300: #9CC2A6;
  --color-primary-100: #E0EBE2;
  --color-primary-50:  #F2F7F3;

  /* ── PRICE TIERS ── */
  --color-affordable-bg:     #F0FDF4;
  --color-affordable-border: #22C55E;
  --color-affordable-text:   #14532D;
  --color-medium-bg:         #FFFBEB;
  --color-medium-border:     #F59E0B;
  --color-medium-text:       #78350F;
  --color-expensive-bg:      #F9FAFB;
  --color-expensive-border:  #D1D5DB;
  --color-expensive-text:    #374151;

  /* ── EVIDENCE STRENGTH (mirrors price tier colors) ── */
  --color-evidence-strong-bg:     #F0FDF4;
  --color-evidence-strong-border: #22C55E;
  --color-evidence-strong-text:   #14532D;
  --color-evidence-practice-bg:   #FFFBEB;
  --color-evidence-practice-border: #F59E0B;
  --color-evidence-practice-text: #78350F;
  --color-evidence-limited-bg:    #F5F5F5;
  --color-evidence-limited-border: #9CA3AF;
  --color-evidence-limited-text:  #4B5563;

  /* ── TEST REPORT STATUS ── */
  --color-test-normal-bg:     #F0FDF4;
  --color-test-normal-border: #22C55E;
  --color-test-normal-text:   #14532D;
  --color-test-high-bg:       #FCEAE1;
  --color-test-high-border:   #E8826B;
  --color-test-high-text:     #B85A3E;
  --color-test-low-bg:        #EFF6FF;
  --color-test-low-border:    #93C5FD;
  --color-test-low-text:      #1E3A8A;
  --color-test-borderline-bg:     #FFFBEB;
  --color-test-borderline-border: #F59E0B;
  --color-test-borderline-text:   #78350F;
  --color-test-urgent-bg:     #FEE2E2;
  --color-test-urgent-border: #EF4444;
  --color-test-urgent-text:   #991B1B;

  /* ── SEMANTIC ── */
  --color-formula-bg:        #EFF6FF;
  --color-formula-border:    #93C5FD;
  --color-formula-text:      #1E3A8A;
  --color-doctor-q-bg:       #EFF6FF;
  --color-doctor-q-border:   #93C5FD;
  --color-doctor-q-text:     #1E3A8A;
  --color-warning-bg:        #FCEAE1;
  --color-warning-border:    #E8826B;
  --color-warning-text:      #B85A3E;
  --color-info-bg:           #DBEAFE;
  --color-info-border:       #3B82F6;
  --color-info-text:         #1E40AF;

  /* ── NEUTRALS ── */
  --color-neutral-900: #1F2937;
  --color-neutral-700: #374151;
  --color-neutral-500: #6B7280;
  --color-neutral-300: #D1D5DB;
  --color-neutral-100: #F3F4F6;

  /* ── BACKGROUNDS ── */
  --color-bg-base:         #FBF7F2;
  --color-bg-card:         #FFFFFF;
  --color-bg-schedule:     #F2F7F3;
  --color-bg-alternatives: #FAFAF8;
  --color-bg-evidence:     #FAFAFA;
  --color-bg-testreport:   #F8F9FF;
  --color-bg-overlay:      rgba(31, 41, 55, 0.5);

  /* ── TYPOGRAPHY ── */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body:    'Lexend', system-ui, sans-serif;
  --font-urdu:    'Noto Nastaliq Urdu', serif;
  --font-mono:    'JetBrains Mono', monospace;

  --text-display:    2.5rem;
  --text-title-xl:   1.75rem;
  --text-title-lg:   1.375rem;
  --text-title-md:   1.125rem;
  --text-body-lg:    1.0625rem;
  --text-body-md:    0.9375rem;
  --text-body-sm:    0.8125rem;
  --text-label:      0.75rem;
  --text-price:      1.25rem;
  --text-value:      1.75rem;
  --text-urdu-lg:    1.125rem;

  /* ── SPACING ── */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px;

  /* ── RADIUS ── */
  --radius-sm:   6px;   --radius-md:   10px;
  --radius-lg:   16px;  --radius-xl:   20px;
  --radius-full: 9999px;

  /* ── SHADOWS ── */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.04);
  --shadow-md:  0 2px 8px rgba(0,0,0,0.06);
  --shadow-lg:  0 20px 60px rgba(0,0,0,0.15);

  /* ── TRANSITIONS ── */
  --transition-fast:   200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow:   500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 13. Asset Specifications

### 13.1 Favicon & Icons

Leaf + prescription-slip mark. Sage `#5A8A6E` on warm cream `#FBF7F2`. Rounded square.

| Format | Size |
|--------|------|
| `favicon.ico` | 32×32 |
| `icon-192.png` | 192×192 |
| `icon-512.png` | 512×512 |
| `apple-touch-icon.png` | 180×180 |

### 13.2 Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?
  family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700
  &family=Lexend:wght@400;500;600;700
  &family=Noto+Nastaliq+Urdu:wght@400;700
  &family=JetBrains+Mono:wght@400;500;700
  &display=swap" rel="stylesheet">
```

---

## 14. Builder Handoff Notes

### 14.1 Opening Prompt for Bolt.new / Lovable (v2.1 — Full)

```
Build a healthcare app called Parchi for Pakistani patients.
The app does three things: explains prescriptions in Urdu, finds
affordable medicine alternatives, and explains test report values.

DESIGN SYSTEM:
- Page background: #FBF7F2 (warm cream)
- Primary: #3D6B5C (sage green)
- Cards: #FFFFFF
- Display font: Fraunces | Body font: Lexend (NOT Inter, NOT Roboto)
- Urdu font: Noto Nastaliq Urdu (direction:rtl, text-align:right,
  line-height:2.2 on all Urdu text)
- Prices and test values: JetBrains Mono
- Max-width: 720px centered; full-width on mobile

LANDING SCREEN:
- Parchi logo + tagline: "Understand your prescription.
  Question it. Afford it."
- Urdu: "اپنا نسخہ سمجھیں۔ سوال کریں۔ خریدیں۔"
- Two upload sections side by side:
  "📋 My Prescription" and "🧪 My Test Report"
- 4 feature bullets: Explains in Urdu | Affordable alternatives
  | Clinical evidence | Test report values

PRESCRIPTION RESULTS (pre-populate with demo data below):

Medicine Card structure (top to bottom):
1. Medicine name (Fraunces ALL CAPS) + generic name
2. Formula badge: blue pill [🧪 Active Formula: X]
3. Purpose paragraph
4. Time chips (sage-tinted pills per time of day)
5. Food badge, dosage, duration
6. Warning banner (amber) if applicable

EVIDENCE LAYER (new — appears between step 6 and alternatives):
A collapsible row showing 3 pill badges:
  [✓ WHO Essential] (green pill, only if who_essential = true)
  [Strong/Common/Limited Evidence] (green/amber/grey pill)
  [💬 Ask doctor ↓] (blue pill)
On expand, shows:
  - "COMMONLY USED FOR" section with bullet list of indications
  - Evidence note (English + Urdu)
  - "ASK YOUR DOCTOR" card (blue bg #EFF6FF, border #93C5FD)
    showing the doctor question in English (italicized in quotes) then Urdu (RTL)
    with a [📋 Copy question] button
  - Small disclaimer: "This is publicly available medical information.
    Always discuss with your doctor."

GENERIC ALTERNATIVES (after evidence layer):
Three stacked cards, affordable FIRST:
  ✅ AFFORDABLE (سستا) — #F0FDF4 bg, #22C55E border
    Brand, manufacturer, Rs X/tablet, "Save Rs Y on this course" in green
  🟡 MEDIUM — #FFFBEB bg, #F59E0B border
  ⬜ EXPENSIVE (As Prescribed) — #F9FAFB bg, #D1D5DB border

Urdu explanation block at bottom of card (RTL, Noto Nastaliq)

DEMO PRESCRIPTION DATA:
Medicine 1: Augmentin 625mg
  Formula: Amoxicillin + Clavulanic Acid
  Purpose: Antibiotic for bacterial throat/chest infections
  Time: morning + night | After food | 5 days
  WHO Essential: YES | Evidence: Strong
  Indications: Bacterial throat infections; Bacterial chest infections;
    NOT effective for viral infections like cold or flu
  Evidence note: "Supported by WHO and multiple large clinical trials"
  Doctor question: "Is my infection confirmed bacterial? Antibiotics are
    not effective for viral infections."
  Affordable: Amoxclav Generic — Rs 22 (Save Rs 660 on this course)
  Medium: Curam 625mg (Atco) — Rs 55
  Expensive: Augmentin 625mg (GSK) — Rs 88

Medicine 2: Maxvita Syrup (Multivitamin)
  Formula: Multivitamin complex
  Purpose: Vitamin supplement
  Time: morning | With food
  WHO Essential: NO (don't show badge — absence is information)
  Evidence: Limited
  Indications: Confirmed vitamin deficiencies; Nutritional support during illness;
    Routine prescription without confirmed deficiency is debated in guidelines
  Evidence note: "Limited clinical trial evidence for use without confirmed deficiency"
  Doctor question: "Do my blood tests show a vitamin deficiency that makes
    this supplement necessary?"
  Affordable: Multivitamin Generic — Rs 3/day
  Expensive: Maxvita Syrup — Rs 18/day

TEST REPORT SCREEN (separate tab/section):
Pre-populate with demo data:

Summary row: [✓ 3 Normal] [↑ 1 High] [~ 1 Borderline]

Test value 1 — HbA1c: HIGH (coral #FCEAE1 bg)
  Value: 8.2% | Normal: Below 5.7%
  Explanation: HbA1c measures average blood sugar over 3 months.
    Your 8.2% is above the normal range.
  Urdu explanation (RTL)
  Doctor question: "My HbA1c is 8.2% — what changes do you recommend?"

Test value 2 — Hemoglobin: NORMAL (green #F0FDF4 bg)
  Value: 12.4 g/dL | Normal: 12.0–16.0

Test value 3 — Cholesterol: BORDERLINE (amber #FFFBEB bg)
  Value: 190 mg/dL | Normal: Below 200 mg/dL
  Doctor question: "My cholesterol is 190 — what lifestyle changes do you suggest?"

Test value 4 — Blood Pressure: NORMAL
  Value: 118/76 mmHg | Normal: Below 120/80

Safety disclaimers:
- On prescription results: blue banner at bottom
  "Always confirm with your doctor or pharmacist. Parchi does not diagnose."
- On evidence layer: small text "This is publicly available medical information."
- On test report: blue banner
  "Only your doctor can interpret results in the context of your full health.
   Parchi does not diagnose any condition."

Mobile: evidence layer and alternatives default to collapsed (green/amber
"tap to expand" buttons). Test report: show flagged values first, collapse
normal values under "3 normal results — tap to see all."
```

### 14.2 Critical Builder Rules

- Evidence badges: **three distinct pill styles** — green (strong/WHO), amber (practice), grey (limited)
- Doctor question card: **blue (#EFF6FF)** — distinct from sage greens everywhere else
- Test value patient number: **JetBrains Mono, 28px bold** — the largest number on the card
- Test report background: `#F8F9FF` (slight blue tint) — distinct from prescription's cream
- Urgent banner: `role="alert"` — appears before the urgent test card, full-width
- "Limited Evidence" never appears with any negative language — just a grey badge and factual note
- WHO badge only appears when `who_essential = true` — never a "Not WHO Essential" badge

### 14.3 Component Build Order (Day 1)

| Priority | Component | Why |
|----------|-----------|-----|
| 1 | Landing screen with both upload modes + pre-built demo data | Safety net |
| 2 | Medicine card with formula badge + evidence layer (pre-populated) | Biggest new feature |
| 3 | Evidence layer expanded view + doctor question card | The "Question it" demo moment |
| 4 | Generic alternatives panel (3 tiers + savings) | The "Afford it" demo moment |
| 5 | Test report screen with demo values (pre-populated) | The "Test report" demo moment |
| 6 | Test value cards (color-coded, Urdu explanation) | Visual impact of the test feature |
| 7 | Daily schedule | Supporting feature |
| 8 | All disclaimers | Non-negotiable |
| 9 | Gemini API integration (prescription) | Live "wow" |
| 10 | Gemini API integration (test report) | Second live "wow" |
| 11 | Animations (stagger, savings counter) | Polish only if time allows |

### 14.4 The Three Demo Moments

**Moment 1 — The Savings Reveal:**
Augmentin at Rs 88 → generic at Rs 22 → "Save Rs 660 on this course." Pause. Let the number land.

**Moment 2 — The Evidence Reveal:**
Open the Multivitamin card. Tap the evidence row. Show "Limited Evidence" in grey. Show doctor question: *"Do my blood tests show a deficiency that makes this necessary?"* Say: *"Millions of Pakistanis are prescribed vitamins every month without a confirmed deficiency. Parchi gives them the one question that changes that conversation."*

**Moment 3 — The Test Report Reveal:**
Upload the demo HbA1c report. Show the value card in coral: 8.2%, above normal. Show the Urdu explanation. Show the doctor question in Urdu. Say: *"A patient who left the clinic with this result and was told 'it's fine' — now has the knowledge to go back and ask the right question."*

Any one of these three moments wins the room. Having all three wins the competition.

---

*Parchi — Understand your prescription. Question it. Afford it.*  
*Design Document Specification v2.1 | Spectrum 26 — Vibe & Pitch | June 2026*
