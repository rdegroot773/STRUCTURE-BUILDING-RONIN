import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const SESSIONS = {
  A: {
    label: "Sessie A", sub: "Lower Body", day: "Maandag",
    warmup: [
      { name: "Airbike Z1", sets: "5 min", cue: "HR <135 bpm" },
      { name: "McGill Bird Dog", sets: "2×8/zij", cue: "Spine neutral" },
      { name: "Hip 90/90 + thoracale rotatie", sets: "2×8/zij", cue: "Heupflexor open" },
      { name: "Goblet Squat (licht)", sets: "2×10", cue: "Diepte zoeken" },
      { name: "Tib Raise (grond)", sets: "2×15", cue: "Dorsaalflexie activatie" },
    ],
    exercises: [
      { id: "A_zercher",   name: "Zercher Squat",        type: "P", bodyPart: "lower", weeks: ["4×6 @ 105kg  RIR3", "4×6 @ 109kg  RIR2", "5×5 @ 115kg  RIR2"], targetReps: [6,6,5], targetKg: [105,109,115], rest: "2:30-3 min", doel: "Max kracht fundament" },
      { id: "A_trapbar",   name: "Trap Bar Deadlift",     type: "P", bodyPart: "lower", weeks: ["4×5 @ 105kg  RIR3", "4×5 @ 112kg  RIR2", "4×5 @ 119kg  RIR1"], targetReps: [5,5,5], targetKg: [105,112,119], rest: "2:30-3 min", doel: "GBRS 5RM gap sluiten" },
      { id: "A_sandbag",   name: "Sandbag Squat",         type: "A", bodyPart: "lower", weeks: ["3×10 @ 60kg  RIR2", "3×10 @ 70kg  RIR2", "3×8  @ 80kg  RIR2"],  targetReps: [10,10,8], targetKg: [60,70,80], rest: "90s", doel: "Functionele hypertrofie" },
      { id: "A_hip",       name: "Hip Thruster Machine",  type: "A", bodyPart: "lower", weeks: ["3×12  RIR2", "3×12  RIR1-2", "4×10  RIR1-2"], targetReps: [12,12,10], targetKg: [0,0,0], rest: "75s", doel: "Glute dominant" },
      { id: "A_singleleg", name: "Single Leg Press",      type: "A", bodyPart: "lower", weeks: ["3×10/been RIR2", "3×10/been RIR2", "3×10/been RIR1"], targetReps: [10,10,10], targetKg: [0,0,0], rest: "60s", doel: "Asymmetrie correctie" },
    ],
    conditioning: [
      { name: "Sled Push (10m)", weeks: ["6×10m / 60s rust", "8×10m / 45s rust", "10×10m / 45s rust"] },
      { name: "Airbike Sprints 10s", weeks: ["6 rondes", "8 rondes", "10 rondes"] },
    ],
    cooldown: [{ name: "Pec Minor Stretch", sets: "4×45s" }, { name: "Lat Stretch hangend", sets: "3×30s" }, { name: "Breath & Flow", sets: "10 min" }],
    finisher: null,
  },
  B: {
    label: "Sessie B", sub: "Upper Push", day: "Woensdag",
    warmup: [
      { name: "Band Pull-Apart", sets: "3×15", cue: "Scapulaire retractie" },
      { name: "Thoracale extensie mob.", sets: "2×10", cue: "Foam roller" },
      { name: "Bench aantippen (bar)", sets: "2×10", cue: "2s pause op borst" },
      { name: "Enkel Dorsaalflexie", sets: "2×10/zij", cue: "Knie over teen" },
    ],
    exercises: [
      { id: "B_bench",    name: "Flat Bench Press ★",     type: "P", bodyPart: "upper", weeks: ["4×8 @ 55kg  RIR3", "4×8 @ 60kg  RIR2", "5×6 @ 64kg  RIR1-2"], targetReps: [8,8,6], targetKg: [55,60,64], rest: "2:30 min", doel: "GBRS AMRAP >20 opbouwen" },
      { id: "B_incline",  name: "Incline DB Press",        type: "A", bodyPart: "upper", weeks: ["3×10  RIR2", "3×10  RIR2", "4×8   RIR2"], targetReps: [10,10,8], targetKg: [0,0,0], rest: "90s", doel: "Anterieur delt" },
      { id: "B_pullup",   name: "Pull-ups (strict) ★",    type: "P", bodyPart: "upper", weeks: ["4×6  RIR2-3", "5×6  RIR2", "5×6-8 max ls"], targetReps: [6,6,8], targetKg: [0,0,0], rest: "90s", doel: "GBRS >20 gap" },
      { id: "B_pulldown", name: "Lat Pulldown",            type: "A", bodyPart: "upper", weeks: ["3×10  RIR2", "3×10  RIR2", "3×10  RIR1-2"], targetReps: [10,10,10], targetKg: [0,0,0], rest: "75s", doel: "Volume suppl." },
      { id: "B_lateral",  name: "DB Lateral Raise",        type: "A", bodyPart: "upper", weeks: ["3×15  RIR1", "3×15  RIR1", "3×15  RIR1"], targetReps: [15,15,15], targetKg: [0,0,0], rest: "45s", doel: "Laterale deltoid" },
      { id: "B_tricep",   name: "Tricep Pushdown / Dips",  type: "A", bodyPart: "upper", weeks: ["3×12  RIR2", "3×12  RIR2", "3×10  RIR1-2"], targetReps: [12,12,10], targetKg: [0,0,0], rest: "60s", doel: "Bench lockout" },
    ],
    conditioning: [{ name: "Roeier 30s @85% / 90s herstel", weeks: ["6 rondes", "8 rondes", "10 rondes"] }],
    cooldown: [{ name: "Pec Minor Stretch", sets: "4×45s" }, { name: "Neck Series (NSCA)", sets: "4×30s/richting" }, { name: "Breath & Flow", sets: "10 min" }],
    finisher: {
      title: "TRAP & NEK FINISHER",
      sub: "Hypertrofie + functionaliteit · 10-12 min",
      exercises: [
        { id: "B_shrug",    name: "Barbell Shrug",           type: "T", bodyPart: "upper", weeks: ["4×12 @ 80kg  RIR2", "4×12 @ 85kg  RIR2", "4×10 @ 90kg  RIR1"], targetReps: [12,12,10], targetKg: [80,85,90], rest: "60s", doel: "Bovenste trap massa", cue: "Recht omhoog — geen rolbeweging" },
        { id: "B_facepull", name: "Face Pull",                type: "T", bodyPart: "upper", weeks: ["3×15  RIR1", "3×15  RIR1", "3×15  RIR1"], targetReps: [15,15,15], targetKg: [0,0,0], rest: "45s", doel: "Mid trap + rear delt", cue: "Trek naar voorhoofd, ellebogen hoog" },
        { id: "B_nek_ext",  name: "Nek Extensie (harnas)",    type: "N", bodyPart: "upper", weeks: ["3×12  RIR2", "3×12  RIR2", "4×10  RIR1"], targetReps: [12,12,10], targetKg: [0,0,0], rest: "60s", doel: "Nek extensoren massa", cue: "Vol ROM — kin naar borst, hoofd achteruit" },
        { id: "B_nek_flex", name: "Nek Flexie (gewicht)",     type: "N", bodyPart: "upper", weeks: ["3×12  RIR2", "3×12  RIR2", "4×10  RIR1"], targetReps: [12,12,10], targetKg: [0,0,0], rest: "60s", doel: "Nek flexoren massa", cue: "Gewicht op voorhoofd. Langzaam." },
        { id: "B_nek_lat",  name: "Laterale Nekflexie (harnas)", type: "N", bodyPart: "upper", weeks: ["3×10/zij  RIR2", "3×10/zij  RIR2", "3×12/zij  RIR1"], targetReps: [10,10,12], targetKg: [0,0,0], rest: "45s", doel: "Laterale nekspieren", cue: "Oor naar schouder. Beide kanten." },
      ],
    },
  },
  C: {
    label: "Sessie C", sub: "Full Body", day: "Vrijdag",
    warmup: [
      { name: "Roeier Z1", sets: "5 min", cue: "HR <135 bpm" },
      { name: "McGill Dead Bug", sets: "2×8/zij", cue: "Tempo 3-1-3" },
      { name: "Shoulder CARs", sets: "2×10", cue: "FMS shoulder prep" },
      { name: "Tib Raise (grond)", sets: "2×15", cue: "Enkel activatie" },
    ],
    exercises: [
      { id: "C_row",         name: "Barbell Row",           type: "P", bodyPart: "upper", weeks: ["4×8 @ 55kg  RIR2", "4×8 @ 60kg  RIR2", "4×8 @ 62kg  RIR1-2"], targetReps: [8,8,8], targetKg: [55,60,62], rest: "90s", doel: "Rug massa" },
      { id: "C_pullup",      name: "Pull-ups (variatie)",   type: "P", bodyPart: "upper", weeks: ["4×6  RIR2", "4×6 +5kg>8  RIR2", "4×max cluster"], targetReps: [6,6,8], targetKg: [0,0,0], rest: "90s", doel: "Pull-up volume" },
      { id: "C_goodmorning", name: "Zercher Good Morning",  type: "A", bodyPart: "lower", weeks: ["3×10 @ 50kg  RIR3", "3×10 @ 60kg  RIR2", "3×10 @ 65kg  RIR2"], targetReps: [10,10,10], targetKg: [50,60,65], rest: "90s", doel: "Posterior chain" },
      { id: "C_farmer",      name: "Farmer's Carry ★",      type: "P", bodyPart: "lower", weeks: ["4×40m @ 60kg", "4×50m @ 65kg", "4×60m @ 70kg"], targetReps: [4,4,4], targetKg: [60,65,70], rest: "60s", doel: "GBRS carry >76m" },
      { id: "C_facepull2",   name: "Face Pull / Rear Delt", type: "A", bodyPart: "upper", weeks: ["3×15  RIR1", "3×15  RIR1", "3×15  RIR1"], targetReps: [15,15,15], targetKg: [0,0,0], rest: "45s", doel: "Rotator cuff" },
      { id: "C_curl",        name: "EZ-bar Curl",            type: "A", bodyPart: "upper", weeks: ["3×10  RIR2", "3×10  RIR2", "3×10  RIR1-2"], targetReps: [10,10,10], targetKg: [0,0,0], rest: "60s", doel: "Bicep massa" },
    ],
    conditioning: [{ name: "Sled Pull 10m → Airbike 15s", weeks: ["5 rondes / 75s", "6 rondes / 75s", "8 rondes / 75s"] }],
    cooldown: [{ name: "Thoracale extensie mob.", sets: "2×10" }, { name: "Lat Stretch", sets: "3×30s" }, { name: "Breath & Flow", sets: "10 min" }],
    finisher: null,
  },
  D: {
    label: "Sessie D", sub: "MMA Conditioning", day: "Zaterdag",
    intro: "Alactic-aerobic protocol. 30-40 min totaal.",
    warmup: [
      { name: "Roeier Z1", sets: "5 min", cue: "HR <140 bpm" },
      { name: "Schaduwboksen", sets: "2×2 min", cue: "Licht, technisch" },
      { name: "Hip CARs + Shoulder CARs", sets: "1×8/zij", cue: "Gewrichtsvoorbereiding" },
      { name: "Explosieve squat jumps (BW)", sets: "2×5", cue: "Max intent" },
    ],
    blocks: [
      {
        id: "D_blok1", name: "BLOK 1 — Alactisch", sub: "1-6 sec max effort · volledig herstel", color: "#E94560",
        exercises: [
          { id: "D_sledpush", name: "Sled Push Max Effort",            bodyPart: "lower", weeks: ["6×10m / 90s rust", "8×10m / 90s rust", "8×10m / 75s rust"],  targetReps: [6,8,8], targetKg: [0,0,0], cue: "100% effort elke rep" },
          { id: "D_medball",  name: "Med Ball Slam / Rotational Throw", bodyPart: "upper", weeks: ["4×5 / 60s rust", "5×5 / 60s rust", "6×5 / 45s rust"],       targetReps: [5,5,5], targetKg: [8,8,10], cue: "Max kracht — 8-10kg bal" },
        ],
      },
      {
        id: "D_blok2", name: "BLOK 2 — Glycolytisch", sub: "20-40 sec hoge intensiteit", color: "#F39C12",
        exercises: [
          { id: "D_bag",     name: "Slagzak Combinaties", bodyPart: "upper", weeks: ["5×30s / 90s rust", "6×30s / 75s rust", "6×40s / 75s rust"],  targetReps: [5,6,6], targetKg: [0,0,0], cue: "Jab-cross-hook-low kick" },
          { id: "D_airbike", name: "Airbike Allout",      bodyPart: "lower", weeks: ["5×20s / 100s rust", "6×20s / 90s rust", "6×30s / 90s rust"], targetReps: [5,6,6], targetKg: [0,0,0], cue: "HR >90% max elke bout" },
        ],
      },
      {
        id: "D_blok3", name: "BLOK 3 — Aeroob Circuit", sub: "Cardiac output · HR 130-150 bpm", color: "#2ECC71",
        exercises: [
          { id: "D_circuit", name: "Grappling Circuit (BW)", bodyPart: "lower", weeks: ["3 rondes / 60s rust", "4 rondes / 60s rust", "4 rondes / 45s rust"], targetReps: [3,4,4], targetKg: [0,0,0], cue: "30s sprawls + 30s sit-outs + 30s granby + 30s shots" },
        ],
      },
    ],
    cooldown: [
      { name: "Roeier Z1", sets: "5 min", cue: "HR actief omlaag" },
      { name: "Neck Series (NSCA)", sets: "4×30s", cue: "Post combat sport" },
      { name: "Breath & Flow restorative", sets: "15 min", cue: "Parasympathisch" },
    ],
    hrv_note: "Rood → Z1 30 min + Breath & Flow yin. Geel → alleen Blok 1 + Blok 3.",
    finisher: {
      title: "TRAP & NEK FINISHER",
      sub: "Hypertrofie + MMA-functionaliteit · 10 min",
      exercises: [
        { id: "D_shrug",    name: "DB / KB Shrug",              type: "T", bodyPart: "upper", weeks: ["4×15 @ 30kg/hand  RIR2", "4×15 @ 32kg/hand  RIR2", "4×12 @ 35kg/hand  RIR1"], targetReps: [15,15,12], targetKg: [30,32,35], rest: "45s", doel: "Trap volume", cue: "1s hold bovenin" },
        { id: "D_uprow",    name: "Upright Row",                 type: "T", bodyPart: "upper", weeks: ["3×12  RIR2", "3×12  RIR2", "3×10  RIR1"], targetReps: [12,12,10], targetKg: [0,0,0], rest: "45s", doel: "Bovenste trap + laterale delt", cue: "Ellebogen hoog" },
        { id: "D_nek_ext2", name: "Nek Extensie (harnas)",       type: "N", bodyPart: "upper", weeks: ["3×15  RIR2", "4×12  RIR2", "4×12  RIR1"], targetReps: [15,12,12], targetKg: [0,0,0], rest: "60s", doel: "MMA impact resistentie", cue: "Vol ROM. Langzaam." },
        { id: "D_nek_iso",  name: "Isometrische Nekdruk (hand)", type: "N", bodyPart: "upper", weeks: ["3×20s / richting", "4×20s / richting", "4×30s / richting"], targetReps: [3,4,4], targetKg: [0,0,0], rest: "30s", doel: "Nekstabiliteit", cue: "Alle 4 richtingen" },
      ],
    },
  },
};

const WEEK_LABELS = ["Week 2", "Week 3", "Week 4"];

const PREHAB = [
  { name: "McGill Bird Dog", sets: "3×10/zij", cue: "Spine neutral" },
  { name: "McGill Dead Bug", sets: "3×8/zij", cue: "Tempo 3-1-3" },
  { name: "McGill Side Plank", sets: "3×20s/zij", cue: "Neutraal bekken" },
  { name: "Pec Minor Stretch", sets: "4×45s", cue: "FMS flag — anterieur schouder" },
  { name: "Lat Stretch", sets: "4×30s", cue: "Hangend of half-knielend" },
  { name: "Thoracale extensie mob.", sets: "2×10", cue: "Foam roller" },
  { name: "Enkel Dorsaalflexie", sets: "3×10/zij", cue: "Knie over teen" },
  { name: "Tib Raise (grond)", sets: "3×15", cue: "Tibialis anterior" },
  { name: "Band Pull-Apart", sets: "3×15", cue: "Scapulaire retractie" },
  { name: "Neck Series (NSCA)", sets: "4×30s/richting", cue: "Licht, geen momentum" },
  { name: "Neck CARs", sets: "2×5 rondes", cue: "Vol ROM, bewust" },
  { name: "Hanging Knee Raise", sets: "3×10", cue: "Spine neutral, geen swing" },
];

const WEEK_PLAN = [
  { day: "Ma", label: "Sessie A", sub: "Lower Body", key: "A", color: "#E94560" },
  { day: "Di", label: "MMA", sub: "Techniek + sparren", key: null, color: "#9CA3AF" },
  { day: "Wo", label: "Sessie B", sub: "Upper Push + Trap/Nek", key: "B", color: "#E94560" },
  { day: "Do", label: "MMA", sub: "Techniek + sparren", key: null, color: "#9CA3AF" },
  { day: "Vr", label: "Sessie C", sub: "Full Body", key: "C", color: "#E94560" },
  { day: "Za", label: "Sessie D", sub: "MMA Conditioning + Trap/Nek", key: "D", color: "#F39C12" },
  { day: "Zo", label: "Rust", sub: "Restoratief", key: null, color: "#2ECC71" },
];

const C = { bg:"#0D0F1A", card:"#161929", mid:"#1E2235", accent:"#E94560", green:"#2ECC71", yellow:"#F39C12", text:"#E8EAF0", sub:"#9CA3AF", border:"#252840" };
const SK = "robin_blok1_v6";

function loadState() { try { const d = localStorage.getItem(SK); return d ? JSON.parse(d) : null; } catch { return null; } }
function saveState(s) { try { localStorage.setItem(SK, JSON.stringify(s)); } catch {} }

// ─── 2-FOR-2 SUGGESTIE ───────────────────────────────────────────────────────
function calcSuggestion(sets, targetReps, targetKg, bodyPart) {
  if (!sets || sets.length === 0) return null;
  const lastSet = sets[sets.length - 1];
  const lastReps = parseInt(lastSet.reps) || 0;
  const lastKg = parseFloat(lastSet.weight) || 0;
  if (!lastReps) return null;

  const diff = lastReps - targetReps;
  const increment = bodyPart === "lower" ? 5 : 2.5;

  if (diff >= 2) {
    const nextKg = lastKg > 0 ? lastKg + increment : targetKg;
    return { type: "up", msg: `Volgende sessie: ${nextKg}kg — je zat ${diff} reps boven target ↑`, col: C.green };
  } else if (diff >= 0) {
    return { type: "ok", msg: `Op target — zelfde gewicht volgende sessie (${lastKg > 0 ? lastKg + "kg" : "gewicht behouden"})`, col: C.yellow };
  } else {
    return { type: "down", msg: `${Math.abs(diff)} reps onder target — gewicht vasthouden of -${increment}kg`, col: C.accent };
  }
}

// ─── EX ROW ──────────────────────────────────────────────────────────────────
function ExRow({ ex, week, allLogs, onSaveSet }) {
  const logKey = `${ex.id}_w${week}`;
  const sets = allLogs[logKey] || [];
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rir, setRir] = useState("");

  const typeColor = { P: C.accent, A: C.sub, T: C.yellow, N: "#A78BFA" };
  const typeLabel = { P: "PRIMAIR", A: "ACC.", T: "TRAP", N: "NEK" };
  const hasSets = sets.length > 0;

  const suggestion = hasSets ? calcSuggestion(sets, ex.targetReps?.[week] || 0, ex.targetKg?.[week] || 0, ex.bodyPart) : null;

  const addSet = () => {
    if (!weight && !reps) return;
    onSaveSet(logKey, [...sets, { weight, reps, rir, id: Date.now() }]);
    setWeight(""); setReps(""); setRir("");
  };

  return (
    <div style={{ background: hasSets ? "#0e2a0e" : C.card, border: `1px solid ${hasSets ? "#2ECC7144" : ex.type ? `${typeColor[ex.type] || C.border}33` : C.border}`, borderRadius: 8, marginBottom: 6, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "10px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: hasSets ? C.green : C.text }}>{ex.name}</span>
            {ex.type && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: `${typeColor[ex.type]}22`, color: typeColor[ex.type] }}>{typeLabel[ex.type]}</span>}
          </div>
          <div style={{ fontSize: 10, color: C.accent, fontWeight: 600 }}>{ex.weeks[week]}</div>
          <div style={{ fontSize: 9, color: C.sub, marginTop: 1 }}>{ex.rest && `Rust: ${ex.rest} · `}{ex.doel}</div>
          {ex.cue && <div style={{ fontSize: 9, color: C.yellow, marginTop: 2 }}>↳ {ex.cue}</div>}
          {/* SUGGESTIE */}
          {suggestion && (
            <div style={{ marginTop: 6, padding: "5px 8px", background: `${suggestion.col}18`, border: `1px solid ${suggestion.col}44`, borderRadius: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: suggestion.col }}>
                {suggestion.type === "up" ? "▲" : suggestion.type === "ok" ? "→" : "▼"} {suggestion.msg}
              </span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0, marginLeft: 8 }}>
          {hasSets && <span style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>{sets.length}× ✓</span>}
          <span style={{ color: C.sub, fontSize: 13 }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 12px" }}>
          {sets.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, color: C.sub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Gelogde sets</div>
              {sets.map((s, i) => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 8px", background: "#0e2a0e", border: `1px solid #2ECC7133`, borderRadius: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>
                    Set {i+1} — {s.weight ? `${s.weight}kg` : "—"} × {s.reps ? `${s.reps} reps` : "—"}{s.rir !== "" ? ` · RIR ${s.rir}` : ""}
                  </span>
                  <button onClick={() => onSaveSet(logKey, sets.filter(x => x.id !== s.id))} style={{ background: "none", border: "none", color: C.accent, fontSize: 16, cursor: "pointer", padding: "0 4px", lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 9, color: C.sub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Set {sets.length + 1} toevoegen</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            {[["Gewicht (kg)", weight, setWeight, "kg"], ["Reps", reps, setReps, "#"], ["RIR", rir, setRir, "0-3"]].map(([lbl, val, set, ph]) => (
              <div key={lbl}>
                <div style={{ fontSize: 9, color: C.sub, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{lbl}</div>
                <input type="number" value={val} onChange={e => set(e.target.value)} placeholder={ph} onKeyDown={e => e.key === "Enter" && addSet()}
                  style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, padding: "7px 8px", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
              </div>
            ))}
          </div>
          <button onClick={addSet} style={{ width: "100%", background: C.accent, border: "none", borderRadius: 6, color: "#fff", padding: "9px", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em" }}>
            + SET TOEVOEGEN
          </button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]               = useState("week");
  const [activeSession, setSession] = useState("A");
  const [week, setWeek]             = useState(0);
  const [logs, setLogs]             = useState({});
  const [prehab, setPrehab]         = useState({});
  const [hrvLog, setHrvLog]         = useState([]);
  const [hrvInput, setHrvInput]     = useState("");
  const [toast, setToast]           = useState(null);

  useEffect(() => {
    const d = loadState();
    if (d) {
      if (d.logs)    setLogs(d.logs);
      if (d.prehab)  setPrehab(d.prehab);
      if (d.hrvLog)  setHrvLog(d.hrvLog);
      if (d.week != null) setWeek(d.week);
      if (d.session)      setSession(d.session);
    }
  }, []);

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    saveState({ logs, prehab, hrvLog, week, session: activeSession });
  }, [logs, prehab, hrvLog, week, activeSession]);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 1800); };
  const handleSaveSet = (logKey, updatedSets) => { setLogs(prev => ({ ...prev, [logKey]: updatedSets })); showToast("Set opgeslagen ✓"); };
  const togglePrehab = (name) => setPrehab(prev => ({ ...prev, [name]: !prev[name] }));
  const submitHRV = () => {
    if (!hrvInput) return;
    setHrvLog(prev => [...prev, { date: new Date().toLocaleDateString("nl-NL"), hrv: parseFloat(hrvInput) }].slice(-14));
    setHrvInput(""); showToast("HRV opgeslagen ✓");
  };

  const avg7 = hrvLog.length ? hrvLog.slice(-7).reduce((a,b) => a+b.hrv,0) / Math.min(hrvLog.length,7) : 97;
  const getStatus = (pct) => pct === null ? null : pct >= -5 ? "green" : pct >= -10 ? "yellow" : "red";
  const todayEntry = hrvLog[hrvLog.length - 1];
  const todayStatus = getStatus(todayEntry ? ((todayEntry.hrv - avg7) / avg7) * 100 : null);
  const previewPct = parseFloat(hrvInput) > 0 ? ((parseFloat(hrvInput) - avg7) / avg7) * 100 : null;
  const previewStatus = getStatus(previewPct);

  const statusInfo = {
    green:  { label:"GROEN", col:C.green,  actie:"Plan uitvoeren zoals geschreven." },
    yellow: { label:"GEEL",  col:C.yellow, actie:"Volume -20%. Intensiteit behouden. Cooldown +10 min." },
    red:    { label:"ROOD",  col:C.accent, actie:"Geen S&C. Z1 30 min + prehab + Breath & Flow yin." },
  };

  const prehabDone = Object.values(prehab).filter(Boolean).length;
  const session = SESSIONS[activeSession];

  const getAllExIds = (key) => {
    const s = SESSIONS[key]; if (!s) return [];
    const main = key === "D" ? s.blocks.flatMap(b => b.exercises.map(e => e.id)) : s.exercises.map(e => e.id);
    const fin = s.finisher ? s.finisher.exercises.map(e => e.id) : [];
    return [...main, ...fin];
  };

  const allExIds = getAllExIds(activeSession);
  const doneCnt = allExIds.filter(id => (logs[`${id}_w${week}`] || []).length > 0).length;
  const pct = allExIds.length ? Math.round((doneCnt / allExIds.length) * 100) : 0;

  function SH({ title, sub, color }) {
    return (
      <div style={{ background: C.mid, borderRadius: 8, padding: "8px 12px", marginBottom: 8, borderLeft: color ? `3px solid ${color}` : "none" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: color || C.text, letterSpacing: "0.06em", textTransform: "uppercase" }}>{title}</div>
        {sub && <div style={{ fontSize: 9, color: C.sub, marginTop: 1 }}>{sub}</div>}
      </div>
    );
  }

  const tabBtn = (key) => ({ background:"transparent", border:"none", color: tab===key ? C.accent : C.sub, fontSize:11, fontWeight:700, cursor:"pointer", paddingBottom:8, borderBottom: tab===key ? `2px solid ${C.accent}` : "2px solid transparent", letterSpacing:"0.05em", textTransform:"uppercase", flexShrink:0 });
  const inp = { background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:"8px 10px", fontSize:14, width:"100%", boxSizing:"border-box", outline:"none" };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"'Inter',system-ui,sans-serif", color:C.text, maxWidth:480, margin:"0 auto" }}>

      {toast && <div style={{ position:"fixed", top:16, left:"50%", transform:"translateX(-50%)", background:C.green, color:"#fff", borderRadius:8, padding:"8px 20px", fontSize:12, fontWeight:700, zIndex:999, boxShadow:"0 4px 20px #0006", whiteSpace:"nowrap" }}>{toast}</div>}

      <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:"14px 16px 10px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:15, fontWeight:900, letterSpacing:"0.06em" }}>ROBIN <span style={{ color:C.accent }}>//</span> BLOK 1</div>
            <div style={{ fontSize:9, color:C.sub, textTransform:"uppercase", letterSpacing:"0.1em" }}>Work Capacity · Hypertrofie · Week 2–4</div>
          </div>
          {todayStatus && <div style={{ background:`${statusInfo[todayStatus].col}22`, border:`1px solid ${statusInfo[todayStatus].col}44`, borderRadius:6, padding:"4px 10px", fontSize:10, fontWeight:700, color:statusInfo[todayStatus].col }}>HRV {statusInfo[todayStatus].label}</div>}
        </div>
      </div>

      <div style={{ display:"flex", gap:4, padding:"10px 16px 0", borderBottom:`1px solid ${C.border}`, overflowX:"auto" }}>
        {[["week","Week"],["sessie","Training"],["prehab","Prehab"],["hrv","HRV"]].map(([k,l]) => <button key={k} onClick={() => setTab(k)} style={tabBtn(k)}>{l}</button>)}
      </div>

      <div style={{ padding:"12px 16px 80px" }}>

        {/* ══ WEEK ══ */}
        {tab === "week" && (
          <div>
            <div style={{ fontSize:10, color:C.sub, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Weekstructuur Blok 1</div>
            <div style={{ display:"flex", gap:6, marginBottom:14 }}>
              {WEEK_LABELS.map((w,i) => <button key={i} onClick={() => setWeek(i)} style={{ background:week===i?C.accent:"transparent", border:`1px solid ${week===i?C.accent:C.border}`, color:week===i?"#fff":C.sub, borderRadius:6, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>{w}</button>)}
            </div>
            {WEEK_PLAN.map((d,i) => {
              const ids = d.key ? getAllExIds(d.key) : [];
              const done = ids.filter(id => (logs[`${id}_w${week}`]||[]).length > 0).length;
              const complete = ids.length > 0 && done === ids.length;
              return (
                <div key={i} onClick={() => { if (d.key) { setSession(d.key); setTab("sessie"); } }}
                  style={{ background:C.card, border:`1px solid ${complete?"#2ECC7144":C.border}`, borderLeft:`3px solid ${d.color}`, borderRadius:8, padding:"12px", marginBottom:8, cursor:d.key?"pointer":"default", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                      <span style={{ fontSize:11, fontWeight:800, color:C.sub, minWidth:24 }}>{d.day}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:complete?C.green:C.text }}>{d.label}</span>
                      {complete && <span style={{ fontSize:10, color:C.green }}>✓</span>}
                    </div>
                    <div style={{ fontSize:10, color:C.sub, marginLeft:32 }}>{d.sub}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {d.key && ids.length > 0 && (
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:10, color:done>0?C.green:C.sub, fontWeight:700 }}>{done}/{ids.length}</div>
                        <div style={{ width:40, height:3, background:C.border, borderRadius:2, marginTop:4 }}>
                          <div style={{ width:`${(done/ids.length)*100}%`, height:3, background:done===ids.length?C.green:C.accent, borderRadius:2 }} />
                        </div>
                      </div>
                    )}
                    {d.key && <span style={{ color:C.sub, fontSize:14 }}>›</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ TRAINING ══ */}
        {tab === "sessie" && (
          <div>
            <div style={{ display:"flex", gap:6, marginBottom:10 }}>
              {WEEK_LABELS.map((w,i) => <button key={i} onClick={() => setWeek(i)} style={{ background:week===i?C.accent:"transparent", border:`1px solid ${week===i?C.accent:C.border}`, color:week===i?"#fff":C.sub, borderRadius:6, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase" }}>{w}</button>)}
            </div>
            <div style={{ display:"flex", gap:5, marginBottom:12, overflowX:"auto" }}>
              {Object.entries(SESSIONS).map(([key,s]) => (
                <button key={key} onClick={() => setSession(key)} style={{ flexShrink:0, background:activeSession===key?C.mid:"transparent", border:`1px solid ${activeSession===key?(key==="D"?C.yellow:C.accent):C.border}`, borderRadius:8, padding:"8px 10px", cursor:"pointer", minWidth:68 }}>
                  <div style={{ fontSize:11, fontWeight:800, color:activeSession===key?C.text:C.sub }}>{s.label}</div>
                  <div style={{ fontSize:8, color:C.sub, marginTop:1 }}>{s.day}</div>
                </button>
              ))}
            </div>

            {activeSession === "D" && (
              <div style={{ background:"#F39C1222", border:`1px solid #F39C1244`, borderRadius:8, padding:"10px 12px", marginBottom:12 }}>
                <div style={{ fontSize:10, color:C.yellow, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>Daru — Alactic-Aerobic Protocol</div>
                <div style={{ fontSize:11, color:C.sub }}>{session.intro}</div>
                <div style={{ marginTop:6, fontSize:10, color:C.accent }}>⚠️ {session.hrv_note}</div>
              </div>
            )}

            <div style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:10, color:C.sub, textTransform:"uppercase", letterSpacing:"0.06em" }}>Sessie voortgang</span>
                <span style={{ fontSize:10, color:pct===100?C.green:C.accent, fontWeight:700 }}>{doneCnt}/{allExIds.length}</span>
              </div>
              <div style={{ height:4, background:C.border, borderRadius:2 }}>
                <div style={{ height:4, width:`${pct}%`, background:pct===100?C.green:C.accent, borderRadius:2, transition:"width 0.3s" }} />
              </div>
            </div>

            <SH title="Warm-up" sub="10 min" />
            {session.warmup.map((w,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
                <div><div style={{ fontSize:11, color:C.text }}>{w.name}</div><div style={{ fontSize:9, color:C.sub }}>{w.cue}</div></div>
                <span style={{ fontSize:11, color:C.accent, fontWeight:700, flexShrink:0, marginLeft:8 }}>{w.sets}</span>
              </div>
            ))}
            <div style={{ height:12 }} />

            {activeSession !== "D" && (
              <>
                <SH title="Hoofdwerk" sub={`${WEEK_LABELS[week]} — klik → sets loggen`} />
                {session.exercises.map(ex => <ExRow key={`${ex.id}_${week}_${activeSession}`} ex={ex} week={week} allLogs={logs} onSaveSet={handleSaveSet} />)}
                <div style={{ height:8 }} />
                <SH title="Conditioning" sub="Na hoofdwerk" />
                {session.conditioning.map((c,i) => (
                  <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", marginBottom:6 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:4 }}>{c.name}</div>
                    <div style={{ fontSize:10, color:C.accent, fontWeight:600 }}>{c.weeks[week]}</div>
                  </div>
                ))}
              </>
            )}

            {activeSession === "D" && session.blocks.map(blok => (
              <div key={blok.id} style={{ marginBottom:12 }}>
                <SH title={blok.name} sub={blok.sub} color={blok.color} />
                {blok.exercises.map(ex => <ExRow key={`${ex.id}_${week}`} ex={ex} week={week} allLogs={logs} onSaveSet={handleSaveSet} />)}
              </div>
            ))}

            {session.finisher && (
              <>
                <div style={{ height:8 }} />
                <div style={{ background:"#A78BFA22", border:`1px solid #A78BFA44`, borderLeft:`3px solid #A78BFA`, borderRadius:8, padding:"8px 12px", marginBottom:8 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"#A78BFA", letterSpacing:"0.06em", textTransform:"uppercase" }}>{session.finisher.title}</div>
                  <div style={{ fontSize:9, color:C.sub, marginTop:1 }}>{session.finisher.sub}</div>
                </div>
                {session.finisher.exercises.map(ex => <ExRow key={`${ex.id}_${week}_${activeSession}`} ex={ex} week={week} allLogs={logs} onSaveSet={handleSaveSet} />)}
              </>
            )}

            <div style={{ height:8 }} />
            <SH title="Cooldown" />
            {session.cooldown.map((c,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
                <div><div style={{ fontSize:11, color:C.text }}>{c.name}</div>{c.cue && <div style={{ fontSize:9, color:C.sub }}>{c.cue}</div>}</div>
                <span style={{ fontSize:11, color:C.accent, fontWeight:700, flexShrink:0, marginLeft:8 }}>{c.sets}</span>
              </div>
            ))}
          </div>
        )}

        {/* ══ PREHAB ══ */}
        {tab === "prehab" && (
          <div>
            <div style={{ background:C.mid, borderRadius:8, padding:"12px", marginBottom:12 }}>
              <div style={{ fontSize:10, color:C.accent, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>Dagelijkse Prehab — 15 min</div>
              <div style={{ fontSize:9, color:C.sub, marginTop:2 }}>NSCA TSAC ch. 19</div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                <span style={{ fontSize:11, color:C.sub }}>{prehabDone} / {PREHAB.length}</span>
                {prehabDone === PREHAB.length && <span style={{ fontSize:11, color:C.green, fontWeight:700 }}>✓ Compleet</span>}
              </div>
              <div style={{ height:4, background:C.border, borderRadius:2, marginTop:6 }}>
                <div style={{ height:4, width:`${(prehabDone/PREHAB.length)*100}%`, background:C.green, borderRadius:2, transition:"width 0.3s" }} />
              </div>
            </div>
            {PREHAB.map((ex,i) => {
              const done = !!prehab[ex.name];
              return (
                <div key={i} onClick={() => togglePrehab(ex.name)} style={{ background:done?"#0e2a0e":C.card, border:`1px solid ${done?"#2ECC7144":C.border}`, borderRadius:8, marginBottom:6, padding:"10px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:20, height:20, borderRadius:4, flexShrink:0, border:`2px solid ${done?C.green:C.border}`, background:done?C.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {done && <span style={{ color:"#fff", fontSize:12, fontWeight:900 }}>✓</span>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, color:done?C.sub:C.text, textDecoration:done?"line-through":"none" }}>{ex.name}</div>
                    <div style={{ fontSize:9, color:C.sub, marginTop:2 }}>{ex.cue}</div>
                  </div>
                  <span style={{ fontSize:11, color:C.accent, fontWeight:700, flexShrink:0 }}>{ex.sets}</span>
                </div>
              );
            })}
            <button onClick={() => { setPrehab({}); showToast("Reset ✓"); }} style={{ marginTop:8, width:"100%", background:"transparent", border:`1px solid ${C.border}`, borderRadius:6, color:C.sub, padding:"9px", fontSize:11, cursor:"pointer" }}>Reset checklist</button>
          </div>
        )}

        {/* ══ HRV ══ */}
        {tab === "hrv" && (
          <div>
            <div style={{ background:C.mid, borderRadius:8, padding:"12px", marginBottom:12 }}>
              <div style={{ fontSize:10, color:C.sub, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>HRV Check-in</div>
              <div style={{ fontSize:9, color:C.sub, marginBottom:10 }}>7-dag avg: <strong style={{ color:C.text }}>{avg7.toFixed(0)} ms</strong> · Baseline: 97 ms</div>
              <label style={{ fontSize:9, color:C.sub, textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:4 }}>HRV vandaag (ms)</label>
              <div style={{ display:"flex", gap:8 }}>
                <input type="number" value={hrvInput} onChange={e => setHrvInput(e.target.value)} placeholder="bijv. 94" style={{ ...inp, flex:1 }} onKeyDown={e => e.key==="Enter" && submitHRV()} />
                <button onClick={submitHRV} style={{ background:C.accent, border:"none", borderRadius:6, color:"#fff", padding:"0 16px", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0 }}>Opslaan</button>
              </div>
            </div>
            {previewStatus && (
              <div style={{ background:C.card, borderLeft:`4px solid ${statusInfo[previewStatus].col}`, borderRadius:8, padding:"10px 12px", marginBottom:12 }}>
                <div style={{ fontSize:12, fontWeight:800, color:statusInfo[previewStatus].col }}>{statusInfo[previewStatus].label} — {hrvInput} ms ({previewPct>0?"+":""}{previewPct.toFixed(1)}%)</div>
                <div style={{ fontSize:11, color:C.sub, marginTop:4 }}>{statusInfo[previewStatus].actie}</div>
              </div>
            )}
            {hrvLog.length > 0 && (
              <div style={{ marginBottom:12 }}>
                <SH title={`Logboek — ${hrvLog.length} metingen`} />
                {[...hrvLog].reverse().slice(0,10).map((e,i) => {
                  const st = getStatus(((e.hrv-avg7)/avg7)*100);
                  return (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                      <span style={{ fontSize:11, color:C.sub }}>{e.date}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:st?statusInfo[st].col:C.text }}>{e.hrv} ms</span>
                    </div>
                  );
                })}
              </div>
            )}
            {[{s:"green",sig:"±5% van avg",actie:"Plan uitvoeren zoals geschreven."},{s:"yellow",sig:"-5% tot -10%",actie:"Volume -20%. Intensiteit behouden."},{s:"red",sig:"<-10% of 2× geel",actie:"Geen S&C. Z1 + prehab + yin yoga 30 min."}].map((r,i) => (
              <div key={i} style={{ background:C.card, borderLeft:`3px solid ${statusInfo[r.s].col}`, borderRadius:8, padding:"10px 12px", marginBottom:6 }}>
                <div style={{ fontSize:11, fontWeight:800, color:statusInfo[r.s].col }}>{statusInfo[r.s].label} — {r.sig}</div>
                <div style={{ fontSize:10, color:C.sub, marginTop:3 }}>{r.actie}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
