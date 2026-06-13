import { useState, useEffect, useRef } from "react";

// ─── MULTICAM PALETTE ────────────────────────────────────────────────────────
const MC = {
  // Backgrounds
  bg:       "#0F1009",   // near-black, olive-tinged
  card:     "#171A0F",   // dark olive
  mid:      "#1E2314",   // darker field drab
  surface:  "#252C18",   // field drab
  // Multicam earth tones
  tan:      "#8B7355",   // coyote tan
  khaki:    "#6B6B47",   // dark khaki
  olive:    "#4A5230",   // olive drab
  green:    "#2D4A1E",   // dark military green
  greenLt:  "#3D6B2A",   // lighter military green
  brown:    "#5C3D1E",   // dark brown
  sand:     "#C4A882",   // sand/light tan
  // Accents
  accent:   "#4A7C2F",   // military green accent
  accentLt: "#6AAF3D",   // bright military green
  warn:     "#C4820A",   // amber warning
  danger:   "#8B2020",   // dark red danger
  dangerLt: "#C42B2B",   // red
  // Text
  text:     "#E8E0CC",   // warm off-white
  sub:      "#8A8570",   // muted warm grey
  muted:    "#565248",   // very muted
  border:   "#2A3018",   // dark olive border
  // Status
  green:    "#4A9B2F",
  yellow:   "#C4820A",
  red:      "#C42B2B",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const GBRS_STANDARDS = [
  { key: "broadJump",   label: "Broad Jump",         unit: "m",    norm: 2.36,  higher: true,  dec: 2 },
  { key: "benchAmrap",  label: "Bench AMRAP @ BW",   unit: "reps", norm: 20,    higher: true,  dec: 0 },
  { key: "pullups",     label: "Pull-ups",            unit: "reps", norm: 20,    higher: true,  dec: 0 },
  { key: "trapBar5rm",  label: "Trap Bar DL 5RM",    unit: "kg",   norm: 150,   higher: true,  dec: 0 },
  { key: "plank",       label: "Plank",               unit: "s",    norm: 180,   higher: true,  dec: 0 },
  { key: "farmerCarry", label: "Farmer's Carry",      unit: "m",    norm: 76,    higher: true,  dec: 0 },
  { key: "run800",      label: "800m Run",            unit: "s",    norm: 165,   higher: false, dec: 0 },
];

const BASELINE = { broadJump:2.30, benchAmrap:5, pullups:18, trapBar5rm:140, plank:185, farmerCarry:100, run800:160 };

const SESSIONS_B1 = {
  A: {
    label:"Sessie A", sub:"Lower Body", day:"Ma", color: MC.accent,
    warmup:[
      {name:"Airbike Z1",sets:"5 min",cue:"HR <135 bpm"},
      {name:"McGill Bird Dog",sets:"2×8/zij",cue:"Spine neutral"},
      {name:"Hip 90/90 + thoracale rotatie",sets:"2×8/zij",cue:"Heupflexor open"},
      {name:"Goblet Squat (licht)",sets:"2×10",cue:"Diepte zoeken"},
      {name:"Tib Raise (grond)",sets:"2×15",cue:"Dorsaalflexie activatie"},
    ],
    exercises:[
      {id:"A_zercher",   name:"Zercher Squat",       type:"P",bp:"lower",weeks:["4×6 @ 105kg RIR3","4×6 @ 109kg RIR2","5×5 @ 115kg RIR2"],tr:[6,6,5],tk:[105,109,115],rest:"2:30",doel:"Max kracht fundament"},
      {id:"A_trapbar",   name:"Trap Bar Deadlift",    type:"P",bp:"lower",weeks:["4×5 @ 105kg RIR3","4×5 @ 112kg RIR2","4×5 @ 119kg RIR1"],tr:[5,5,5],tk:[105,112,119],rest:"2:30",doel:"GBRS 5RM gap"},
      {id:"A_sandbag",   name:"Sandbag Squat",        type:"A",bp:"lower",weeks:["3×10 @ 60kg RIR2","3×10 @ 70kg RIR2","3×8 @ 80kg RIR2"],tr:[10,10,8],tk:[60,70,80],rest:"90s",doel:"Functionele hypertrofie"},
      {id:"A_hip",       name:"Hip Thruster Machine", type:"A",bp:"lower",weeks:["3×12 RIR2","3×12 RIR1-2","4×10 RIR1-2"],tr:[12,12,10],tk:[0,0,0],rest:"75s",doel:"Glute dominant"},
      {id:"A_singleleg", name:"Single Leg Press",     type:"A",bp:"lower",weeks:["3×10/been RIR2","3×10/been RIR2","3×10/been RIR1"],tr:[10,10,10],tk:[0,0,0],rest:"60s",doel:"Asymmetrie correctie"},
    ],
    conditioning:[
      {name:"Sled Push (10m)",weeks:["6×10m / 60s","8×10m / 45s","10×10m / 45s"]},
      {name:"Airbike Sprints 10s",weeks:["6 rondes","8 rondes","10 rondes"]},
    ],
    cooldown:[{name:"Pec Minor Stretch",sets:"4×45s"},{name:"Lat Stretch",sets:"3×30s"},{name:"Breath & Flow",sets:"10 min"}],
    finisher:null,
  },
  B: {
    label:"Sessie B", sub:"Upper Push", day:"Wo", color: MC.accent,
    warmup:[
      {name:"Band Pull-Apart",sets:"3×15",cue:"Scapulaire retractie"},
      {name:"Thoracale extensie mob.",sets:"2×10",cue:"Foam roller"},
      {name:"Bench aantippen (bar)",sets:"2×10",cue:"2s pause op borst"},
      {name:"Enkel Dorsaalflexie",sets:"2×10/zij",cue:"Knie over teen"},
    ],
    exercises:[
      {id:"B_bench",   name:"Flat Bench Press ★",    type:"P",bp:"upper",weeks:["4×8 @ 55kg RIR3","4×8 @ 60kg RIR2","5×6 @ 64kg RIR1-2"],tr:[8,8,6],tk:[55,60,64],rest:"2:30",doel:"GBRS AMRAP >20"},
      {id:"B_incline", name:"Incline DB Press",       type:"A",bp:"upper",weeks:["3×10 RIR2","3×10 RIR2","4×8 RIR2"],tr:[10,10,8],tk:[0,0,0],rest:"90s",doel:"Anterieur delt"},
      {id:"B_pullup",  name:"Pull-ups (strict) ★",   type:"P",bp:"upper",weeks:["4×6 RIR2-3","5×6 RIR2","5×6-8 max ls"],tr:[6,6,8],tk:[0,0,0],rest:"90s",doel:"GBRS >20 gap"},
      {id:"B_pulldown",name:"Lat Pulldown",           type:"A",bp:"upper",weeks:["3×10 RIR2","3×10 RIR2","3×10 RIR1-2"],tr:[10,10,10],tk:[0,0,0],rest:"75s",doel:"Volume suppl."},
      {id:"B_lateral", name:"DB Lateral Raise",       type:"A",bp:"upper",weeks:["3×15 RIR1","3×15 RIR1","3×15 RIR1"],tr:[15,15,15],tk:[0,0,0],rest:"45s",doel:"Laterale deltoid"},
      {id:"B_tricep",  name:"Tricep Pushdown / Dips", type:"A",bp:"upper",weeks:["3×12 RIR2","3×12 RIR2","3×10 RIR1-2"],tr:[12,12,10],tk:[0,0,0],rest:"60s",doel:"Bench lockout"},
    ],
    conditioning:[{name:"Roeier 30s @85% / 90s herstel",weeks:["6 rondes","8 rondes","10 rondes"]}],
    cooldown:[{name:"Pec Minor Stretch",sets:"4×45s"},{name:"Neck Series",sets:"4×30s/richting"},{name:"Breath & Flow",sets:"10 min"}],
    finisher:{
      title:"TRAP & NEK",
      exercises:[
        {id:"B_shrug",   name:"Barbell Shrug",            type:"T",bp:"upper",weeks:["4×12 @ 80kg RIR2","4×12 @ 85kg RIR2","4×10 @ 90kg RIR1"],tr:[12,12,10],tk:[80,85,90],rest:"60s",doel:"Bovenste trap",cue:"Recht omhoog"},
        {id:"B_facepull",name:"Face Pull",                 type:"T",bp:"upper",weeks:["3×15 RIR1","3×15 RIR1","3×15 RIR1"],tr:[15,15,15],tk:[0,0,0],rest:"45s",doel:"Mid trap + rear delt",cue:"Ellebogen hoog"},
        {id:"B_nek_ext", name:"Nek Extensie (harnas)",     type:"N",bp:"upper",weeks:["3×12 RIR2","3×12 RIR2","4×10 RIR1"],tr:[12,12,10],tk:[0,0,0],rest:"60s",doel:"Nek extensoren",cue:"Vol ROM"},
        {id:"B_nek_flex",name:"Nek Flexie (gewicht)",      type:"N",bp:"upper",weeks:["3×12 RIR2","3×12 RIR2","4×10 RIR1"],tr:[12,12,10],tk:[0,0,0],rest:"60s",doel:"Nek flexoren",cue:"Langzaam"},
        {id:"B_nek_lat", name:"Laterale Nekflexie",        type:"N",bp:"upper",weeks:["3×10/zij RIR2","3×10/zij RIR2","3×12/zij RIR1"],tr:[10,10,12],tk:[0,0,0],rest:"45s",doel:"Laterale nek",cue:"Oor naar schouder"},
      ],
    },
  },
  C: {
    label:"Sessie C", sub:"Full Body", day:"Vr", color: MC.accent,
    warmup:[
      {name:"Roeier Z1",sets:"5 min",cue:"HR <135 bpm"},
      {name:"McGill Dead Bug",sets:"2×8/zij",cue:"Tempo 3-1-3"},
      {name:"Shoulder CARs",sets:"2×10",cue:"FMS shoulder prep"},
      {name:"Tib Raise (grond)",sets:"2×15",cue:"Enkel activatie"},
    ],
    exercises:[
      {id:"C_row",        name:"Barbell Row",          type:"P",bp:"upper",weeks:["4×8 @ 55kg RIR2","4×8 @ 60kg RIR2","4×8 @ 62kg RIR1-2"],tr:[8,8,8],tk:[55,60,62],rest:"90s",doel:"Rug massa"},
      {id:"C_pullup",     name:"Pull-ups (variatie)",  type:"P",bp:"upper",weeks:["4×6 RIR2","4×6 +5kg>8 RIR2","4×max cluster"],tr:[6,6,8],tk:[0,0,0],rest:"90s",doel:"Pull-up volume"},
      {id:"C_goodmorning",name:"Zercher Good Morning", type:"A",bp:"lower",weeks:["3×10 @ 50kg RIR3","3×10 @ 60kg RIR2","3×10 @ 65kg RIR2"],tr:[10,10,10],tk:[50,60,65],rest:"90s",doel:"Posterior chain"},
      {id:"C_farmer",     name:"Farmer's Carry ★",     type:"P",bp:"lower",weeks:["4×40m @ 60kg","4×50m @ 65kg","4×60m @ 70kg"],tr:[4,4,4],tk:[60,65,70],rest:"60s",doel:"GBRS carry >76m"},
      {id:"C_facepull2",  name:"Face Pull / Rear Delt",type:"A",bp:"upper",weeks:["3×15 RIR1","3×15 RIR1","3×15 RIR1"],tr:[15,15,15],tk:[0,0,0],rest:"45s",doel:"Rotator cuff"},
      {id:"C_curl",       name:"EZ-bar Curl",           type:"A",bp:"upper",weeks:["3×10 RIR2","3×10 RIR2","3×10 RIR1-2"],tr:[10,10,10],tk:[0,0,0],rest:"60s",doel:"Bicep massa"},
    ],
    conditioning:[{name:"Sled Pull 10m → Airbike 15s",weeks:["5 rondes / 75s","6 rondes / 75s","8 rondes / 75s"]}],
    cooldown:[{name:"Thoracale extensie mob.",sets:"2×10"},{name:"Lat Stretch",sets:"3×30s"},{name:"Breath & Flow",sets:"10 min"}],
    finisher:null,
  },
  D: {
    label:"Sessie D", sub:"MMA Conditioning", day:"Za", color: MC.warn,
    intro:"Daru alactic-aerobic protocol. 30-40 min.",
    warmup:[
      {name:"Roeier Z1",sets:"5 min",cue:"HR <140 bpm"},
      {name:"Schaduwboksen",sets:"2×2 min",cue:"Licht, technisch"},
      {name:"Hip CARs + Shoulder CARs",sets:"1×8/zij",cue:"Gewrichtsvoorbereiding"},
      {name:"Explosieve squat jumps",sets:"2×5",cue:"Max intent"},
    ],
    blocks:[
      {id:"D_b1",name:"ALACTISCH",sub:"1-6 sec · volledig herstel",color:MC.dangerLt,exercises:[
        {id:"D_sled",   name:"Sled Push Max Effort",           bp:"lower",weeks:["6×10m / 90s","8×10m / 90s","8×10m / 75s"],tr:[6,8,8],tk:[0,0,0],cue:"100% elke rep"},
        {id:"D_medball",name:"Med Ball Slam / Rotational",      bp:"upper",weeks:["4×5 / 60s","5×5 / 60s","6×5 / 45s"],tr:[5,5,5],tk:[8,8,10],cue:"Max kracht — 8-10kg"},
      ]},
      {id:"D_b2",name:"GLYCOLYTISCH",sub:"20-40 sec · gedeeltelijk herstel",color:MC.warn,exercises:[
        {id:"D_bag",    name:"Slagzak Combinaties",             bp:"upper",weeks:["5×30s / 90s","6×30s / 75s","6×40s / 75s"],tr:[5,6,6],tk:[0,0,0],cue:"Jab-cross-hook-low kick"},
        {id:"D_airbike",name:"Airbike Allout",                  bp:"lower",weeks:["5×20s / 100s","6×20s / 90s","6×30s / 90s"],tr:[5,6,6],tk:[0,0,0],cue:"HR >90% max"},
      ]},
      {id:"D_b3",name:"AEROOB CIRCUIT",sub:"HR 130-150 bpm · cardiac output",color:MC.accent,exercises:[
        {id:"D_circuit",name:"Grappling Circuit BW",            bp:"lower",weeks:["3 rondes / 60s","4 rondes / 60s","4 rondes / 45s"],tr:[3,4,4],tk:[0,0,0],cue:"Sprawls+sit-outs+granby+shots"},
      ]},
    ],
    cooldown:[{name:"Roeier Z1",sets:"5 min",cue:"HR omlaag"},{name:"Neck Series",sets:"4×30s"},{name:"Breath & Flow restorative",sets:"15 min"}],
    hrv_note:"Rood → Z1 + yin yoga. Geel → Blok 1 + Blok 3 only.",
    finisher:{
      title:"TRAP & NEK",
      exercises:[
        {id:"D_shrug",  name:"DB / KB Shrug",             type:"T",bp:"upper",weeks:["4×15 @ 30kg RIR2","4×15 @ 32kg RIR2","4×12 @ 35kg RIR1"],tr:[15,15,12],tk:[30,32,35],rest:"45s",doel:"Trap volume",cue:"1s hold bovenin"},
        {id:"D_uprow",  name:"Upright Row",                type:"T",bp:"upper",weeks:["3×12 RIR2","3×12 RIR2","3×10 RIR1"],tr:[12,12,10],tk:[0,0,0],rest:"45s",doel:"Bovenste trap + delt",cue:"Ellebogen hoog"},
        {id:"D_nek2",   name:"Nek Extensie (harnas)",      type:"N",bp:"upper",weeks:["3×15 RIR2","4×12 RIR2","4×12 RIR1"],tr:[15,12,12],tk:[0,0,0],rest:"60s",doel:"Impact resistentie",cue:"Vol ROM"},
        {id:"D_nekiso", name:"Isometrische Nekdruk",       type:"N",bp:"upper",weeks:["3×20s/richting","4×20s/richting","4×30s/richting"],tr:[3,4,4],tk:[0,0,0],rest:"30s",doel:"Nekstabiliteit",cue:"Alle 4 richtingen"},
      ],
    },
  },
};

const SESSIONS_B2 = {
  E: {
    label:"Sessie E", sub:"Max Kracht Lower", day:"Ma", color: MC.tan,
    warmup:[
      {name:"Airbike Z1",sets:"8 min",cue:"HR <135 bpm"},
      {name:"McGill Big 3",sets:"2×8/zij",cue:"Spine neutral"},
      {name:"Hip CARs",sets:"2×8/zij",cue:"Heup prep voor zwaar werk"},
      {name:"Zercher aantippen (60%)",sets:"2×3",cue:"Patroon activeren"},
    ],
    exercises:[
      {id:"E_zercher",  name:"Zercher Squat",       type:"P",bp:"lower",weeks:["5×3 @ 118kg RIR3","5×3 @ 124kg RIR2","3×3 @ 130kg RIR1"],tr:[3,3,3],tk:[118,124,130],rest:"3 min",doel:"Max kracht opbouw"},
      {id:"E_trapbar",  name:"Trap Bar DL",          type:"P",bp:"lower",weeks:["5×3 @ 125kg RIR3","4×3 @ 132kg RIR2","3×3 @ 140kg RIR1"],tr:[3,3,3],tk:[125,132,140],rest:"3 min",doel:"GBRS 150kg target"},
      {id:"E_legpress", name:"Leg Press (bilateral)",type:"A",bp:"lower",weeks:["4×6 RIR2","4×6 RIR2","4×5 RIR1"],tr:[6,6,5],tk:[0,0,0],rest:"2 min",doel:"Volume ondersteuning"},
      {id:"E_rdl",      name:"Romanian DL",          type:"A",bp:"lower",weeks:["3×8 @ 90kg RIR2","3×8 @ 95kg RIR2","3×6 @ 100kg RIR1"],tr:[8,8,6],tk:[90,95,100],rest:"90s",doel:"Hamstring kracht"},
    ],
    conditioning:[{name:"Sled Push heavy 10m",weeks:["5×10m / 2min","6×10m / 2min","6×10m / 90s"]}],
    cooldown:[{name:"Thoracale mob.",sets:"2×10"},{name:"Lat stretch",sets:"3×30s"},{name:"Breath & Flow",sets:"10 min"}],
    finisher:null,
  },
  F: {
    label:"Sessie F", sub:"Max Kracht Upper", day:"Wo", color: MC.tan,
    warmup:[
      {name:"Band pull-apart",sets:"3×15",cue:"Schouder activatie"},
      {name:"Thoracale extensie mob.",sets:"2×10",cue:"Foam roller"},
      {name:"Bench opwarmen 50%×5, 65%×3, 75%×1",sets:"3 sets",cue:"CNS voorbereiden"},
    ],
    exercises:[
      {id:"F_bench",   name:"Flat Bench Press ★",   type:"P",bp:"upper",weeks:["5×3 @ 72kg RIR3","5×3 @ 76kg RIR2","3×3 @ 80kg RIR1"],tr:[3,3,3],tk:[72,76,80],rest:"3 min",doel:"Max kracht bench"},
      {id:"F_weighted",name:"Weighted Pull-ups ★",  type:"P",bp:"upper",weeks:["5×3 +10kg RIR3","5×3 +12kg RIR2","4×3 +15kg RIR1"],tr:[3,3,3],tk:[10,12,15],rest:"3 min",doel:"Relatieve kracht pull"},
      {id:"F_incline", name:"Incline Bench Press",  type:"A",bp:"upper",weeks:["4×5 @ 65kg RIR2","4×5 @ 68kg RIR2","4×4 @ 72kg RIR1"],tr:[5,5,4],tk:[65,68,72],rest:"2 min",doel:"Kracht transfer"},
      {id:"F_row",     name:"Barbell Row (heavy)",  type:"A",bp:"upper",weeks:["4×5 @ 72kg RIR2","4×5 @ 76kg RIR2","4×4 @ 80kg RIR1"],tr:[5,5,4],tk:[72,76,80],rest:"2 min",doel:"Antagonist balans"},
    ],
    conditioning:[{name:"Roeier steady state",weeks:["15 min Z2","15 min Z2","12 min Z2"]}],
    cooldown:[{name:"Pec minor stretch",sets:"4×45s"},{name:"Neck Series",sets:"4×30s"},{name:"Breath & Flow",sets:"10 min"}],
    finisher:{
      title:"TRAP & NEK",
      exercises:[
        {id:"F_shrug",  name:"Heavy Barbell Shrug",  type:"T",bp:"upper",weeks:["4×8 @ 100kg RIR2","4×8 @ 105kg RIR2","4×6 @ 110kg RIR1"],tr:[8,8,6],tk:[100,105,110],rest:"60s",doel:"Trap max kracht",cue:"Explosief omhoog, langzaam omlaag"},
        {id:"F_nek_ext",name:"Nek Extensie (harnas)",type:"N",bp:"upper",weeks:["4×10 RIR2","4×10 RIR1","4×8 RIR1"],tr:[10,10,8],tk:[0,0,0],rest:"60s",doel:"Nek kracht",cue:"Vol ROM"},
        {id:"F_nek_flex",name:"Nek Flexie (zwaar)",  type:"N",bp:"upper",weeks:["4×10 RIR2","4×10 RIR1","4×8 RIR1"],tr:[10,10,8],tk:[0,0,0],rest:"60s",doel:"Anterieure nek",cue:"Gecontroleerd"},
      ],
    },
  },
  G: {
    label:"Sessie G", sub:"Kracht + Carry", day:"Vr", color: MC.tan,
    warmup:[
      {name:"Roeier Z1",sets:"5 min",cue:"HR <135 bpm"},
      {name:"McGill Dead Bug",sets:"2×8/zij",cue:"Core activatie"},
      {name:"Shoulder CARs",sets:"2×8/zij",cue:"Schouder prep"},
    ],
    exercises:[
      {id:"G_zerchergm", name:"Zercher Good Morning",type:"P",bp:"lower",weeks:["4×5 @ 80kg RIR2","4×5 @ 85kg RIR2","4×4 @ 90kg RIR1"],tr:[5,5,4],tk:[80,85,90],rest:"2 min",doel:"Posterior chain kracht"},
      {id:"G_farmer",    name:"Farmer's Carry ★",    type:"P",bp:"lower",weeks:["5×50m @ 72kg","5×60m @ 75kg","4×70m @ 77kg"],tr:[5,5,4],tk:[72,75,77],rest:"60s",doel:"GBRS carry >76m"},
      {id:"G_pullup2",   name:"Pull-ups (volume)",   type:"P",bp:"upper",weeks:["3×8 RIR1","3×8 RIR1","4×6 RIR1"],tr:[8,8,6],tk:[0,0,0],rest:"90s",doel:"Volume maintenance"},
      {id:"G_dip",       name:"Weighted Dips",       type:"A",bp:"upper",weeks:["3×8 +10kg RIR2","3×8 +12kg RIR2","3×6 +15kg RIR1"],tr:[8,8,6],tk:[10,12,15],rest:"90s",doel:"Tricep + kracht"},
    ],
    conditioning:[{name:"Sled pull + airbike circuit",weeks:["4 rondes","5 rondes","6 rondes"]}],
    cooldown:[{name:"Thoracale mob.",sets:"2×10"},{name:"Lat stretch",sets:"3×30s"},{name:"Breath & Flow",sets:"10 min"}],
    finisher:null,
  },
  H: {
    label:"Sessie H", sub:"MMA Conditioning", day:"Za", color: MC.warn,
    intro:"Daru alactic-aerobic protocol. Hogere intensiteit dan Blok 1.",
    warmup:[
      {name:"Roeier Z1",sets:"5 min",cue:"HR <140 bpm"},
      {name:"Schaduwboksen",sets:"3×2 min",cue:"Intensiteit opbouwen"},
      {name:"Explosive jumps",sets:"3×5",cue:"CNS activeren"},
    ],
    blocks:[
      {id:"H_b1",name:"ALACTISCH +",sub:"Max power output",color:MC.dangerLt,exercises:[
        {id:"H_sled",   name:"Sled Push Explosief",  bp:"lower",weeks:["8×10m / 75s","10×10m / 60s","10×10m / 60s"],tr:[8,10,10],tk:[0,0,0],cue:"100% — sneller dan Blok 1"},
        {id:"H_jump",   name:"Box Jump / Broad Jump", bp:"lower",weeks:["5×3 / 90s","6×3 / 75s","6×3 / 60s"],tr:[3,3,3],tk:[0,0,0],cue:"Max hoogte/afstand"},
      ]},
      {id:"H_b2",name:"GLYCOLYTISCH +",sub:"Hogere volume",color:MC.warn,exercises:[
        {id:"H_bag",    name:"Slagzak Rounds",        bp:"upper",weeks:["5×2min / 60s","6×2min / 60s","6×2min / 45s"],tr:[5,6,6],tk:[0,0,0],cue:"Combinaties + clinch"},
        {id:"H_airbike",name:"Airbike Tabata",        bp:"lower",weeks:["8×20s / 10s rust","10×20s / 10s","10×20s / 10s"],tr:[8,10,10],tk:[0,0,0],cue:"Tabata protocol"},
      ]},
      {id:"H_b3",name:"AEROOB CAPACITY",sub:"HR 130-155 bpm",color:MC.accent,exercises:[
        {id:"H_circuit",name:"MMA Circuit",           bp:"lower",weeks:["4 rondes / 60s","5 rondes / 45s","5 rondes / 45s"],tr:[4,5,5],tk:[0,0,0],cue:"Sprawls+shots+clinch+ground"},
      ]},
    ],
    cooldown:[{name:"Roeier Z1",sets:"8 min"},{name:"Neck Series",sets:"4×30s"},{name:"Breath & Flow",sets:"15 min"}],
    hrv_note:"Rood → Z1 + yin yoga. Geel → Blok 1 only.",
    finisher:{
      title:"TRAP & NEK",
      exercises:[
        {id:"H_shrug",  name:"DB Shrug Superset",  type:"T",bp:"upper",weeks:["4×12 @ 35kg RIR1","4×12 @ 37kg RIR1","4×10 @ 40kg RIR1"],tr:[12,12,10],tk:[35,37,40],rest:"45s",doel:"Trap volume",cue:"Geen rust tussen L/R"},
        {id:"H_nek3",   name:"Nek Extensie + Flexie",type:"N",bp:"upper",weeks:["3×12 RIR1","4×12 RIR1","4×10 RIR1"],tr:[12,12,10],tk:[0,0,0],rest:"45s",doel:"Nek hypertrofie",cue:"Superset ext+flex"},
      ],
    },
  },
};

const SESSIONS_B3 = {
  I: {
    label:"Sessie I", sub:"Power + PAP Lower", day:"Ma", color: MC.sand,
    warmup:[
      {name:"Airbike Z1",sets:"5 min",cue:"HR <135 bpm"},
      {name:"Dynamic mobility",sets:"5 min",cue:"Volledig lichaam"},
      {name:"CMJ aantippen",sets:"3×3",cue:"CNS activeren"},
    ],
    exercises:[
      {id:"I_zercher",  name:"Zercher Squat (PAP)",    type:"P",bp:"lower",weeks:["4×2 @ 85% RIR3","4×2 @ 88% RIR2","3×1 @ 90% RIR1"],tr:[2,2,1],tk:[119,123,126],rest:"3 min",doel:"PAP activatie"},
      {id:"I_jump",     name:"CMJ / Broad Jump",        type:"P",bp:"lower",weeks:["4×3 na Zercher","4×3 na Zercher","3×3 na Zercher"],tr:[3,3,3],tk:[0,0,0],rest:"3 min",doel:"Power expressie — GBRS broad jump"},
      {id:"I_trapbar2", name:"Trap Bar DL (speed)",     type:"P",bp:"lower",weeks:["5×2 @ 70% RIR4","5×2 @ 72% RIR4","4×2 @ 75% RIR3"],tr:[2,2,2],tk:[105,108,112],rest:"2 min",doel:"Rate of force development"},
      {id:"I_sled2",    name:"Sled Sprint 10m",         type:"A",bp:"lower",weeks:["6×10m / 90s","8×10m / 75s","8×10m / 60s"],tr:[6,8,8],tk:[0,0,0],rest:"2 min",doel:"Alactisch power output"},
    ],
    conditioning:[{name:"Med Ball Slam circuit",weeks:["5×5 / 60s","6×5 / 45s","6×5 / 45s"]}],
    cooldown:[{name:"Thoracale mob.",sets:"2×10"},{name:"Lat stretch",sets:"3×30s"},{name:"Breath & Flow",sets:"10 min"}],
    finisher:null,
  },
  J: {
    label:"Sessie J", sub:"Power + PAP Upper", day:"Wo", color: MC.sand,
    warmup:[
      {name:"Band pull-apart",sets:"3×15",cue:"Schouder activatie"},
      {name:"Bench opwarmen 50%×5, 70%×3",sets:"2 sets",cue:"CNS prep"},
      {name:"Med ball chest pass",sets:"2×5",cue:"Explosieve activatie"},
    ],
    exercises:[
      {id:"J_bench",    name:"Bench Press (PAP)",    type:"P",bp:"upper",weeks:["4×2 @ 82% RIR3","4×2 @ 85% RIR2","3×1 @ 88% RIR1"],tr:[2,2,1],tk:[70,72,74],rest:"3 min",doel:"PAP activatie bench"},
      {id:"J_medball",  name:"Med Ball Chest Pass",  type:"P",bp:"upper",weeks:["4×5 na bench","4×5 na bench","3×5 na bench"],tr:[5,5,5],tk:[0,0,0],rest:"3 min",doel:"Power expressie upper"},
      {id:"J_pullup3",  name:"Weighted Pull-ups",    type:"P",bp:"upper",weeks:["5×2 +15kg RIR3","5×2 +17kg RIR2","4×2 +20kg RIR1"],tr:[2,2,2],tk:[15,17,20],rest:"2:30",doel:"Max pull kracht"},
      {id:"J_row2",     name:"Explosive DB Row",     type:"A",bp:"upper",weeks:["4×5 RIR2","4×5 RIR2","4×4 RIR1"],tr:[5,5,4],tk:[0,0,0],rest:"90s",doel:"Power posterior"},
    ],
    conditioning:[{name:"Roeier intervals 30s @95%",weeks:["6 rondes","8 rondes","8 rondes"]}],
    cooldown:[{name:"Pec minor stretch",sets:"4×45s"},{name:"Neck Series",sets:"4×30s"},{name:"Breath & Flow",sets:"10 min"}],
    finisher:{
      title:"TRAP & NEK PEAK",
      exercises:[
        {id:"J_shrug2",  name:"Power Shrug",           type:"T",bp:"upper",weeks:["4×6 @ 110kg RIR2","4×6 @ 115kg RIR1","3×5 @ 120kg RIR1"],tr:[6,6,5],tk:[110,115,120],rest:"90s",doel:"Trap power",cue:"Explosief — hang position"},
        {id:"J_nek4",    name:"Nek Extensie (zwaar)",   type:"N",bp:"upper",weeks:["4×8 RIR1","4×8 RIR1","3×6 RIR1"],tr:[8,8,6],tk:[0,0,0],rest:"60s",doel:"Peak nek kracht",cue:"Gecontroleerd naar beneden"},
      ],
    },
  },
  K: {
    label:"Sessie K", sub:"Power + MMA Peak", day:"Za", color: MC.warn,
    intro:"Daru peak protocol. Pre-retest. Max alactisch output.",
    warmup:[
      {name:"Roeier Z1",sets:"5 min",cue:"HR <135 bpm"},
      {name:"Schaduwboksen",sets:"3×2 min",cue:"Technisch, scherp"},
      {name:"Broad jump aantippen",sets:"3×2",cue:"80% intent"},
    ],
    blocks:[
      {id:"K_b1",name:"PEAK ALACTISCH",sub:"Max single effort",color:MC.dangerLt,exercises:[
        {id:"K_sled",   name:"Sled Sprint 10m",      bp:"lower",weeks:["6×10m / 2min","6×10m / 2min","4×10m / 3min"],tr:[6,6,4],tk:[0,0,0],cue:"PR snelheid — volledig herstel"},
        {id:"K_jump2",  name:"Broad Jump / CMJ",     bp:"lower",weeks:["5×3 / 2min","5×3 / 2min","4×2 / 3min"],tr:[5,5,4],tk:[0,0,0],cue:"Max afstand/hoogte — meten"},
      ]},
      {id:"K_b2",name:"FIGHT SIMULATION",sub:"Match pace",color:MC.warn,exercises:[
        {id:"K_fight",  name:"5×5min Rounds (bag/shadow)",bp:"upper",weeks:["3×5min / 1min rust","4×5min / 1min rust","3×5min / 1min rust"],tr:[3,4,3],tk:[0,0,0],cue:"Match intensiteit — technisch scherp"},
      ]},
    ],
    cooldown:[{name:"Roeier Z1",sets:"10 min"},{name:"Neck Series",sets:"4×30s"},{name:"Breath & Flow restorative",sets:"20 min"}],
    hrv_note:"Rood → volledig rust. Geel → alleen Blok 1.",
    finisher:null,
  },
};

const PREHAB = [
  {name:"McGill Bird Dog",sets:"3×10/zij",cue:"Spine neutral"},
  {name:"McGill Dead Bug",sets:"3×8/zij",cue:"Tempo 3-1-3"},
  {name:"McGill Side Plank",sets:"3×20s/zij",cue:"Neutraal bekken"},
  {name:"Pec Minor Stretch",sets:"4×45s",cue:"FMS — anterieur schouder"},
  {name:"Lat Stretch",sets:"4×30s",cue:"Hangend of half-knielend"},
  {name:"Thoracale extensie mob.",sets:"2×10",cue:"Foam roller"},
  {name:"Enkel Dorsaalflexie",sets:"3×10/zij",cue:"Knie over teen"},
  {name:"Tib Raise (grond)",sets:"3×15",cue:"Tibialis anterior"},
  {name:"Band Pull-Apart",sets:"3×15",cue:"Scapulaire retractie"},
  {name:"Neck Series",sets:"4×30s/richting",cue:"Licht, geen momentum"},
  {name:"Neck CARs",sets:"2×5 rondes",cue:"Vol ROM, bewust"},
  {name:"Hanging Knee Raise",sets:"3×10",cue:"Spine neutral, geen swing"},
];

const BLOCKS = [
  {id:"b1", label:"BLOK 1", sub:"Work Capacity · Hypertrofie", weeks:"Wk 2-4", color: MC.accent, sessions: SESSIONS_B1, weekPlan:[
    {day:"Ma",label:"Sessie A",sub:"Lower Body",key:"A",color:MC.accent},
    {day:"Di",label:"MMA",sub:"Techniek + sparren",key:null,color:MC.muted},
    {day:"Wo",label:"Sessie B",sub:"Upper Push + Trap/Nek",key:"B",color:MC.accent},
    {day:"Do",label:"MMA",sub:"Techniek + sparren",key:null,color:MC.muted},
    {day:"Vr",label:"Sessie C",sub:"Full Body",key:"C",color:MC.accent},
    {day:"Za",label:"Sessie D",sub:"MMA Conditioning + Trap/Nek",key:"D",color:MC.warn},
    {day:"Zo",label:"Rust",sub:"Restoratief",key:null,color:MC.green},
  ]},
  {id:"b2", label:"BLOK 2", sub:"Max Strength", weeks:"Wk 5-7", color: MC.tan, sessions: SESSIONS_B2, weekPlan:[
    {day:"Ma",label:"Sessie E",sub:"Max Kracht Lower",key:"E",color:MC.tan},
    {day:"Di",label:"MMA",sub:"Techniek + sparren",key:null,color:MC.muted},
    {day:"Wo",label:"Sessie F",sub:"Max Kracht Upper + Trap/Nek",key:"F",color:MC.tan},
    {day:"Do",label:"MMA",sub:"Techniek + sparren",key:null,color:MC.muted},
    {day:"Vr",label:"Sessie G",sub:"Kracht + Carry",key:"G",color:MC.tan},
    {day:"Za",label:"Sessie H",sub:"MMA Conditioning + Trap/Nek",key:"H",color:MC.warn},
    {day:"Zo",label:"Rust",sub:"Restoratief",key:null,color:MC.green},
  ]},
  {id:"b3", label:"BLOK 3", sub:"Power · Peak · Retest", weeks:"Wk 8-9", color: MC.sand, sessions: SESSIONS_B3, weekPlan:[
    {day:"Ma",label:"Sessie I",sub:"Power + PAP Lower",key:"I",color:MC.sand},
    {day:"Di",label:"MMA",sub:"Techniek + sparren",key:null,color:MC.muted},
    {day:"Wo",label:"Sessie J",sub:"Power + PAP Upper + Trap/Nek",key:"J",color:MC.sand},
    {day:"Do",label:"MMA",sub:"Techniek + sparren",key:null,color:MC.muted},
    {day:"Vr",label:"Rust / Mobiliteit",sub:"Pre-retest deload",key:null,color:MC.green},
    {day:"Za",label:"Sessie K",sub:"Power + MMA Peak",key:"K",color:MC.warn},
    {day:"Zo",label:"GBRS RETEST",sub:"Alle 7 standards",key:"RETEST",color:MC.accentLt},
  ]},
];

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const SK = "hardtokill_v1";
function load() { try { const d=localStorage.getItem(SK); return d?JSON.parse(d):{}; } catch{return{};} }
function save(s) { try{localStorage.setItem(SK,JSON.stringify(s));}catch{} }

// ─── 2-FOR-2 SUGGESTIE ───────────────────────────────────────────────────────
function calcSug(sets, tr, tk, bp) {
  if(!sets||sets.length===0) return null;
  const last=sets[sets.length-1];
  const lr=parseInt(last.reps)||0, lk=parseFloat(last.weight)||0;
  if(!lr) return null;
  const diff=lr-tr, inc=bp==="lower"?5:2.5;
  if(diff>=2) return {type:"up",msg:`↑ Volgende sessie: ${lk>0?lk+inc:tk+inc}kg — ${diff} reps boven target`,col:MC.accentLt};
  if(diff>=0) return {type:"ok",msg:`→ Op target — ${lk>0?lk+"kg":"gewicht behouden"}`,col:MC.warn};
  return {type:"down",msg:`↓ ${Math.abs(diff)} reps onder target — gewicht vasthouden`,col:MC.dangerLt};
}

// ─── FORMAT ──────────────────────────────────────────────────────────────────
function fmtTime(s) { const m=Math.floor(s/60),sec=s%60; return `${m}:${String(sec).padStart(2,"0")}`; }
function fmtVal(key,val) {
  if(key==="plank"||key==="run800") return fmtTime(val);
  const s=GBRS_STANDARDS.find(x=>x.key===key);
  return s?val.toFixed(s.dec)+" "+s.unit:val;
}
function getGBRSStatus(key,val) {
  const s=GBRS_STANDARDS.find(x=>x.key===key); if(!s) return "neutral";
  const pct=s.higher?(val/s.norm)*100:(s.norm/val)*100;
  return pct>=100?"green":pct>=90?"yellow":"red";
}

// ─── EX ROW ──────────────────────────────────────────────────────────────────
function ExRow({ex, weekIdx, allLogs, onSave}) {
  const logKey=`${ex.id}_w${weekIdx}`;
  const sets=allLogs[logKey]||[];
  const [open,setOpen]=useState(false);
  const [wt,setWt]=useState(""); const [rp,setRp]=useState(""); const [rir,setRir]=useState("");
  const typeColor={P:MC.accentLt,A:MC.khaki,T:MC.warn,N:"#8B7AD4"};
  const typeLabel={P:"PRIMAIR",A:"ACC",T:"TRAP",N:"NEK"};
  const hasSets=sets.length>0;
  const sug=hasSets?calcSug(sets,ex.tr?.[weekIdx]||0,ex.tk?.[weekIdx]||0,ex.bp):null;
  const addSet=()=>{ if(!wt&&!rp) return; onSave(logKey,[...sets,{wt,rp,rir,id:Date.now()}]); setWt("");setRp("");setRir(""); };

  return (
    <div style={{background:hasSets?`${MC.green}18`:MC.card,border:`1px solid ${hasSets?MC.green+"44":ex.type?typeColor[ex.type]+"22":MC.border}`,borderRadius:6,marginBottom:5,overflow:"hidden"}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"10px 12px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
            <span style={{fontSize:12,fontWeight:700,color:hasSets?MC.accentLt:MC.text,letterSpacing:"0.02em"}}>{ex.name}</span>
            {ex.type&&<span style={{fontSize:8,fontWeight:800,padding:"1px 5px",borderRadius:2,background:`${typeColor[ex.type]}22`,color:typeColor[ex.type],letterSpacing:"0.08em"}}>{typeLabel[ex.type]}</span>}
          </div>
          <div style={{fontSize:10,color:MC.accentLt,fontWeight:700,fontFamily:"monospace"}}>{ex.weeks?.[weekIdx]||"—"}</div>
          {ex.doel&&<div style={{fontSize:9,color:MC.sub,marginTop:1}}>{ex.rest&&`${ex.rest} · `}{ex.doel}</div>}
          {ex.cue&&<div style={{fontSize:9,color:MC.warn,marginTop:2}}>// {ex.cue}</div>}
          {sug&&<div style={{marginTop:6,padding:"4px 8px",background:`${sug.col}15`,border:`1px solid ${sug.col}33`,borderRadius:4}}><span style={{fontSize:9,fontWeight:700,color:sug.col,fontFamily:"monospace"}}>{sug.msg}</span></div>}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0,marginLeft:8}}>
          {hasSets&&<span style={{fontSize:10,color:MC.accentLt,fontWeight:700}}>{sets.length}×✓</span>}
          <span style={{color:MC.muted,fontSize:12}}>{open?"▲":"▼"}</span>
        </div>
      </div>
      {open&&(
        <div style={{borderTop:`1px solid ${MC.border}`,padding:"10px 12px"}}>
          {sets.length>0&&(
            <div style={{marginBottom:10}}>
              <div style={{fontSize:8,color:MC.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,fontFamily:"monospace"}}>// GELOGDE SETS</div>
              {sets.map((s,i)=>(
                <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px",background:`${MC.green}10`,border:`1px solid ${MC.green}33`,borderRadius:4,marginBottom:3}}>
                  <span style={{fontSize:11,color:MC.accentLt,fontWeight:600,fontFamily:"monospace"}}>SET {i+1} — {s.wt?`${s.wt}kg`:"—"} × {s.rp?`${s.rp}`:"—"} reps{s.rir?` · RIR ${s.rir}`:""}</span>
                  <button onClick={()=>onSave(logKey,sets.filter(x=>x.id!==s.id))} style={{background:"none",border:"none",color:MC.dangerLt,fontSize:16,cursor:"pointer",padding:"0 4px"}}>×</button>
                </div>
              ))}
            </div>
          )}
          <div style={{fontSize:8,color:MC.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,fontFamily:"monospace"}}>// SET {sets.length+1}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
            {[["KG",wt,setWt,"0"],["REPS",rp,setRp,"0"],["RIR",rir,setRir,"2"]].map(([l,v,s,p])=>(
              <div key={l}>
                <div style={{fontSize:8,color:MC.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"monospace"}}>{l}</div>
                <input type="number" value={v} onChange={e=>s(e.target.value)} placeholder={p} onKeyDown={e=>e.key==="Enter"&&addSet()}
                  style={{width:"100%",background:MC.bg,border:`1px solid ${MC.border}`,borderRadius:4,color:MC.text,padding:"7px 8px",fontSize:13,boxSizing:"border-box",outline:"none",fontFamily:"monospace"}}/>
              </div>
            ))}
          </div>
          <button onClick={addSet} style={{width:"100%",background:MC.accent,border:"none",borderRadius:4,color:MC.text,padding:"9px",fontSize:11,fontWeight:800,cursor:"pointer",letterSpacing:"0.1em",fontFamily:"monospace"}}>+ SET TOEVOEGEN</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function App() {
  const [store,setStore]=useState({});
  const [mainTab,setMainTab]=useState("ops");
  const [activeBlock,setActiveBlock]=useState("b1");
  const [activeSession,setActiveSession]=useState("A");
  const [weekIdx,setWeekIdx]=useState(0);
  const [prehabChecks,setPrehabChecks]=useState({});
  const [hrvLog,setHrvLog]=useState([]);
  const [hrvInput,setHrvInput]=useState("");
  const [toast,setToast]=useState(null);
  const [retestInput,setRetestInput]=useState({});
  const [retestScores,setRetestScores]=useState({});
  const [plankM,setPlankM]=useState(""); const [plankS,setPlankS]=useState("");
  const [runM,setRunM]=useState(""); const [runS,setRunS]=useState("");

  const isFirst=useRef(true);
  useEffect(()=>{
    const d=load();
    if(d.store) setStore(d.store);
    if(d.prehab) setPrehabChecks(d.prehab);
    if(d.hrvLog) setHrvLog(d.hrvLog);
    if(d.weekIdx!=null) setWeekIdx(d.weekIdx);
    if(d.activeBlock) setActiveBlock(d.activeBlock);
    if(d.activeSession) setActiveSession(d.activeSession);
    if(d.retestScores) setRetestScores(d.retestScores);
  },[]);

  useEffect(()=>{
    if(isFirst.current){isFirst.current=false;return;}
    save({store,prehab:prehabChecks,hrvLog,weekIdx,activeBlock,activeSession,retestScores});
  },[store,prehabChecks,hrvLog,weekIdx,activeBlock,activeSession,retestScores]);

  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(null),2000);};

  const handleSaveSet=(logKey,updatedSets)=>{
    setStore(prev=>({...prev,[logKey]:updatedSets}));
    showToast("Set opgeslagen ✓");
  };

  const submitHRV=()=>{
    if(!hrvInput) return;
    setHrvLog(prev=>[...prev,{date:new Date().toLocaleDateString("nl-NL"),hrv:parseFloat(hrvInput)}].slice(-14));
    setHrvInput(""); showToast("HRV opgeslagen ✓");
  };

  const submitRetest=()=>{
    const updated={...retestScores,...retestInput};
    if(plankM||plankS) updated.plank=(parseInt(plankM||0)*60)+parseInt(plankS||0);
    if(runM||runS) updated.run800=(parseInt(runM||0)*60)+parseInt(runS||0);
    setRetestScores(updated);
    setRetestInput({}); setPlankM(""); setPlankS(""); setRunM(""); setRunS("");
    showToast("Retest scores opgeslagen ✓");
  };

  const avg7=hrvLog.length?hrvLog.slice(-7).reduce((a,b)=>a+b.hrv,0)/Math.min(hrvLog.length,7):97;
  const getHRVStatus=(pct)=>pct===null?null:pct>=-5?"green":pct>=-10?"yellow":"red";
  const todayEntry=hrvLog[hrvLog.length-1];
  const todayPct=todayEntry?((todayEntry.hrv-avg7)/avg7)*100:null;
  const todayStatus=getHRVStatus(todayPct);
  const previewPct=parseFloat(hrvInput)>0?((parseFloat(hrvInput)-avg7)/avg7)*100:null;
  const previewStatus=getHRVStatus(previewPct);

  const statusInfo={
    green:{label:"GROEN",col:MC.accentLt,actie:"Plan uitvoeren zoals geschreven."},
    yellow:{label:"GEEL",col:MC.warn,actie:"Volume -20%. Intensiteit behouden."},
    red:{label:"ROOD",col:MC.dangerLt,actie:"Geen S&C. Z1 30 min + prehab + yin yoga."},
  };

  const currentBlock=BLOCKS.find(b=>b.id===activeBlock);
  const allSessions=currentBlock?.sessions||{};
  const session=allSessions[activeSession];

  const getAllExIds=(sessions,key)=>{
    const s=sessions?.[key]; if(!s) return [];
    const main=s.blocks?s.blocks.flatMap(b=>b.exercises.map(e=>e.id)):s.exercises?.map(e=>e.id)||[];
    const fin=s.finisher?s.finisher.exercises.map(e=>e.id):[];
    return [...main,...fin];
  };

  const allExIds=getAllExIds(allSessions,activeSession);
  const doneCnt=allExIds.filter(id=>(store[`${id}_w${weekIdx}`]||[]).length>0).length;
  const pct=allExIds.length?Math.round((doneCnt/allExIds.length)*100):0;
  const prehabDone=Object.values(prehabChecks).filter(Boolean).length;

  const WEEK_LABELS=["Week 1","Week 2","Week 3"];
  const WEEK_BLOCK_LABELS={b1:["Week 2","Week 3","Week 4"],b2:["Week 5","Week 6","Week 7"],b3:["Week 8","Week 9","Peakweek"]};

  function SH({title,sub,color}) {
    return (
      <div style={{background:MC.surface,borderRadius:4,padding:"7px 12px",marginBottom:8,borderLeft:color?`2px solid ${color}`:"none"}}>
        <div style={{fontSize:9,fontWeight:800,color:color||MC.tan,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"monospace"}}>{title}</div>
        {sub&&<div style={{fontSize:8,color:MC.muted,marginTop:1}}>{sub}</div>}
      </div>
    );
  }

  const tabBtn=(key,active)=>({background:"transparent",border:"none",color:active?MC.accentLt:MC.muted,fontSize:10,fontWeight:800,cursor:"pointer",paddingBottom:8,borderBottom:active?`2px solid ${MC.accentLt}`:"2px solid transparent",letterSpacing:"0.1em",textTransform:"uppercase",flexShrink:0,fontFamily:"monospace"});
  const inp={background:MC.bg,border:`1px solid ${MC.border}`,borderRadius:4,color:MC.text,padding:"8px 10px",fontSize:13,width:"100%",boxSizing:"border-box",outline:"none",fontFamily:"monospace"};

  return (
    <div style={{background:MC.bg,minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif",color:MC.text,maxWidth:480,margin:"0 auto"}}>

      {toast&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:MC.accent,color:MC.text,borderRadius:4,padding:"8px 20px",fontSize:11,fontWeight:800,zIndex:999,boxShadow:"0 4px 20px #0008",whiteSpace:"nowrap",letterSpacing:"0.08em",fontFamily:"monospace"}}>{toast}</div>}

      {/* HEADER */}
      <div style={{background:MC.mid,borderBottom:`1px solid ${MC.border}`,padding:"16px 16px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:18,fontWeight:900,letterSpacing:"0.08em",color:MC.text,fontFamily:"monospace"}}>
              HARD <span style={{color:MC.accentLt}}>TO</span> KILL
            </div>
            <div style={{fontSize:8,color:MC.khaki,textTransform:"uppercase",letterSpacing:"0.15em",marginTop:2}}>
              KORPS MARINIERS · 8-WEEK GBRS BLOCK
            </div>
          </div>
          {todayStatus&&(
            <div style={{background:`${statusInfo[todayStatus].col}18`,border:`1px solid ${statusInfo[todayStatus].col}44`,borderRadius:4,padding:"4px 10px",textAlign:"center"}}>
              <div style={{fontSize:8,color:statusInfo[todayStatus].col,fontWeight:800,letterSpacing:"0.1em",fontFamily:"monospace"}}>HRV</div>
              <div style={{fontSize:10,color:statusInfo[todayStatus].col,fontWeight:800,fontFamily:"monospace"}}>{statusInfo[todayStatus].label}</div>
            </div>
          )}
        </div>
      </div>

      {/* MAIN TABS */}
      <div style={{display:"flex",gap:4,padding:"10px 16px 0",borderBottom:`1px solid ${MC.border}`,overflowX:"auto",background:MC.mid}}>
        {[["ops","OPS PLAN"],["training","TRAINING"],["prehab","PREHAB"],["hrv","HRV"],["retest","RETEST"]].map(([k,l])=>(
          <button key={k} onClick={()=>setMainTab(k)} style={tabBtn(k,mainTab===k)}>{l}</button>
        ))}
      </div>

      <div style={{padding:"12px 16px 80px"}}>

        {/* ══ OPS PLAN ══ */}
        {mainTab==="ops"&&(
          <div>
            {/* Block selector */}
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {BLOCKS.map(b=>(
                <button key={b.id} onClick={()=>{setActiveBlock(b.id);setWeekIdx(0);}} style={{flex:1,background:activeBlock===b.id?`${b.color}22`:"transparent",border:`1px solid ${activeBlock===b.id?b.color:MC.border}`,borderRadius:4,padding:"8px 4px",cursor:"pointer"}}>
                  <div style={{fontSize:10,fontWeight:800,color:activeBlock===b.id?b.color:MC.muted,fontFamily:"monospace"}}>{b.label}</div>
                  <div style={{fontSize:7,color:MC.muted,marginTop:1}}>{b.weeks}</div>
                </button>
              ))}
            </div>

            {/* Week selector */}
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {WEEK_LABELS.map((w,i)=>(
                <button key={i} onClick={()=>setWeekIdx(i)} style={{background:weekIdx===i?currentBlock?.color+"33":"transparent",border:`1px solid ${weekIdx===i?currentBlock?.color:MC.border}`,color:weekIdx===i?currentBlock?.color:MC.muted,borderRadius:4,padding:"6px 12px",fontSize:10,fontWeight:800,cursor:"pointer",textTransform:"uppercase",fontFamily:"monospace"}}>
                  {WEEK_BLOCK_LABELS[activeBlock]?.[i]||w}
                </button>
              ))}
            </div>

            <div style={{fontSize:8,color:MC.muted,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:10,fontFamily:"monospace"}}>// {currentBlock?.sub}</div>

            {currentBlock?.weekPlan.map((d,i)=>{
              const ids=d.key&&d.key!=="RETEST"?getAllExIds(allSessions,d.key):[];
              const done=ids.filter(id=>(store[`${id}_w${weekIdx}`]||[]).length>0).length;
              const complete=ids.length>0&&done===ids.length;
              return (
                <div key={i} onClick={()=>{if(d.key&&d.key!=="RETEST"){setActiveSession(d.key);setMainTab("training");}if(d.key==="RETEST")setMainTab("retest");}}
                  style={{background:MC.card,border:`1px solid ${complete?"#2ECC7144":MC.border}`,borderLeft:`2px solid ${d.color}`,borderRadius:4,padding:"11px 12px",marginBottom:6,cursor:d.key?"pointer":"default",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                      <span style={{fontSize:9,fontWeight:800,color:MC.muted,minWidth:20,fontFamily:"monospace"}}>{d.day}</span>
                      <span style={{fontSize:12,fontWeight:700,color:complete?MC.accentLt:MC.text}}>{d.label}</span>
                      {complete&&<span style={{fontSize:10,color:MC.accentLt}}>✓</span>}
                    </div>
                    <div style={{fontSize:9,color:MC.muted,marginLeft:28}}>{d.sub}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {d.key&&ids.length>0&&(
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:9,color:done>0?MC.accentLt:MC.muted,fontWeight:700,fontFamily:"monospace"}}>{done}/{ids.length}</div>
                        <div style={{width:36,height:2,background:MC.border,borderRadius:1,marginTop:3}}>
                          <div style={{width:`${(done/ids.length)*100}%`,height:2,background:done===ids.length?MC.accentLt:MC.accent,borderRadius:1}}/>
                        </div>
                      </div>
                    )}
                    {d.key&&<span style={{color:MC.muted,fontSize:12}}>›</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ TRAINING ══ */}
        {mainTab==="training"&&(
          <div>
            {/* Block + Week */}
            <div style={{display:"flex",gap:5,marginBottom:10,overflowX:"auto"}}>
              {BLOCKS.map(b=>(
                <button key={b.id} onClick={()=>{setActiveBlock(b.id);setWeekIdx(0);const firstKey=Object.keys(b.sessions)[0];setActiveSession(firstKey);}} style={{flexShrink:0,background:activeBlock===b.id?`${b.color}22`:"transparent",border:`1px solid ${activeBlock===b.id?b.color:MC.border}`,borderRadius:4,padding:"6px 10px",cursor:"pointer"}}>
                  <div style={{fontSize:9,fontWeight:800,color:activeBlock===b.id?b.color:MC.muted,fontFamily:"monospace"}}>{b.label}</div>
                </button>
              ))}
            </div>

            <div style={{display:"flex",gap:5,marginBottom:10,overflowX:"auto"}}>
              {WEEK_LABELS.map((w,i)=>(
                <button key={i} onClick={()=>setWeekIdx(i)} style={{flexShrink:0,background:weekIdx===i?MC.surface:"transparent",border:`1px solid ${weekIdx===i?currentBlock?.color:MC.border}`,color:weekIdx===i?currentBlock?.color:MC.muted,borderRadius:4,padding:"5px 10px",fontSize:9,fontWeight:800,cursor:"pointer",fontFamily:"monospace"}}>
                  {WEEK_BLOCK_LABELS[activeBlock]?.[i]||w}
                </button>
              ))}
            </div>

            {/* Session tabs */}
            <div style={{display:"flex",gap:4,marginBottom:12,overflowX:"auto"}}>
              {Object.entries(allSessions).map(([key,s])=>(
                <button key={key} onClick={()=>setActiveSession(key)} style={{flexShrink:0,background:activeSession===key?MC.surface:"transparent",border:`1px solid ${activeSession===key?s.color:MC.border}`,borderRadius:4,padding:"7px 8px",cursor:"pointer",minWidth:60}}>
                  <div style={{fontSize:10,fontWeight:800,color:activeSession===key?s.color:MC.muted,fontFamily:"monospace"}}>{s.label}</div>
                  <div style={{fontSize:7,color:MC.muted,marginTop:1}}>{s.day}</div>
                </button>
              ))}
            </div>

            {session?.intro&&(
              <div style={{background:`${MC.warn}15`,border:`1px solid ${MC.warn}33`,borderLeft:`2px solid ${MC.warn}`,borderRadius:4,padding:"8px 12px",marginBottom:10}}>
                <div style={{fontSize:9,color:MC.warn,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"monospace",marginBottom:3}}>// DARU PROTOCOL</div>
                <div style={{fontSize:10,color:MC.sub}}>{session.intro}</div>
                {session.hrv_note&&<div style={{fontSize:9,color:MC.dangerLt,marginTop:4,fontFamily:"monospace"}}>⚠ {session.hrv_note}</div>}
              </div>
            )}

            {/* Progress */}
            <div style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:8,color:MC.muted,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"monospace"}}>// SESSIE VOORTGANG</span>
                <span style={{fontSize:9,color:pct===100?MC.accentLt:MC.accent,fontWeight:800,fontFamily:"monospace"}}>{doneCnt}/{allExIds.length}</span>
              </div>
              <div style={{height:3,background:MC.border,borderRadius:1}}>
                <div style={{height:3,width:`${pct}%`,background:pct===100?MC.accentLt:MC.accent,borderRadius:1,transition:"width 0.3s"}}/>
              </div>
            </div>

            {/* Warm-up */}
            <SH title="// WARM-UP" sub="10 min" />
            {session?.warmup?.map((w,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${MC.border}`}}>
                <div><div style={{fontSize:11,color:MC.text}}>{w.name}</div><div style={{fontSize:9,color:MC.muted}}>{w.cue}</div></div>
                <span style={{fontSize:10,color:MC.accentLt,fontWeight:700,flexShrink:0,marginLeft:8,fontFamily:"monospace"}}>{w.sets}</span>
              </div>
            ))}
            <div style={{height:12}}/>

            {/* A/B/C/E/F/G/I/J - main exercises */}
            {session&&!session.blocks&&(
              <>
                <SH title={`// HOOFDWERK · ${WEEK_BLOCK_LABELS[activeBlock]?.[weekIdx]}`} />
                {session.exercises?.map(ex=><ExRow key={`${ex.id}_${weekIdx}_${activeSession}_${activeBlock}`} ex={ex} weekIdx={weekIdx} allLogs={store} onSave={handleSaveSet}/>)}
                <div style={{height:8}}/>
                <SH title="// CONDITIONING" />
                {session.conditioning?.map((c,i)=>(
                  <div key={i} style={{background:MC.card,border:`1px solid ${MC.border}`,borderRadius:4,padding:"10px 12px",marginBottom:5}}>
                    <div style={{fontSize:11,fontWeight:700,color:MC.text,marginBottom:3}}>{c.name}</div>
                    <div style={{fontSize:10,color:MC.accentLt,fontWeight:600,fontFamily:"monospace"}}>{c.weeks?.[weekIdx]||"—"}</div>
                  </div>
                ))}
              </>
            )}

            {/* D/H/K - blocks */}
            {session?.blocks?.map(blok=>(
              <div key={blok.id} style={{marginBottom:12}}>
                <SH title={`// ${blok.name}`} sub={blok.sub} color={blok.color}/>
                {blok.exercises?.map(ex=><ExRow key={`${ex.id}_${weekIdx}`} ex={ex} weekIdx={weekIdx} allLogs={store} onSave={handleSaveSet}/>)}
              </div>
            ))}

            {/* Finisher */}
            {session?.finisher&&(
              <>
                <div style={{height:8}}/>
                <div style={{background:`#8B7AD422`,border:`1px solid #8B7AD444`,borderLeft:`2px solid #8B7AD4`,borderRadius:4,padding:"7px 12px",marginBottom:8}}>
                  <div style={{fontSize:9,fontWeight:800,color:"#A78BFA",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"monospace"}}>// {session.finisher.title}</div>
                </div>
                {session.finisher.exercises?.map(ex=><ExRow key={`${ex.id}_${weekIdx}_fin`} ex={ex} weekIdx={weekIdx} allLogs={store} onSave={handleSaveSet}/>)}
              </>
            )}

            <div style={{height:8}}/>
            <SH title="// COOLDOWN"/>
            {session?.cooldown?.map((c,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${MC.border}`}}>
                <div><div style={{fontSize:11,color:MC.text}}>{c.name}</div>{c.cue&&<div style={{fontSize:9,color:MC.muted}}>{c.cue}</div>}</div>
                <span style={{fontSize:10,color:MC.accentLt,fontWeight:700,flexShrink:0,marginLeft:8,fontFamily:"monospace"}}>{c.sets}</span>
              </div>
            ))}
          </div>
        )}

        {/* ══ PREHAB ══ */}
        {mainTab==="prehab"&&(
          <div>
            <div style={{background:MC.surface,borderRadius:4,padding:"12px",marginBottom:12,borderLeft:`2px solid ${MC.accent}`}}>
              <div style={{fontSize:9,color:MC.accentLt,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.12em",fontFamily:"monospace"}}>// DAGELIJKSE PREHAB — 15 MIN</div>
              <div style={{fontSize:8,color:MC.muted,marginTop:2}}>NSCA TSAC ch. 19 · Prioriteit: schouder + thoracaal</div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                <span style={{fontSize:10,color:MC.sub,fontFamily:"monospace"}}>{prehabDone} / {PREHAB.length}</span>
                {prehabDone===PREHAB.length&&<span style={{fontSize:10,color:MC.accentLt,fontWeight:800,fontFamily:"monospace"}}>✓ COMPLEET</span>}
              </div>
              <div style={{height:3,background:MC.border,borderRadius:1,marginTop:6}}>
                <div style={{height:3,width:`${(prehabDone/PREHAB.length)*100}%`,background:MC.accentLt,borderRadius:1,transition:"width 0.3s"}}/>
              </div>
            </div>
            {PREHAB.map((ex,i)=>{
              const done=!!prehabChecks[ex.name];
              return (
                <div key={i} onClick={()=>setPrehabChecks(prev=>({...prev,[ex.name]:!prev[ex.name]}))}
                  style={{background:done?`${MC.green}12`:MC.card,border:`1px solid ${done?MC.green+"44":MC.border}`,borderRadius:4,marginBottom:5,padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:18,height:18,borderRadius:3,flexShrink:0,border:`2px solid ${done?MC.accentLt:MC.border}`,background:done?MC.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {done&&<span style={{color:MC.text,fontSize:11,fontWeight:900}}>✓</span>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:done?MC.muted:MC.text,textDecoration:done?"line-through":"none"}}>{ex.name}</div>
                    <div style={{fontSize:9,color:MC.muted,marginTop:1}}>{ex.cue}</div>
                  </div>
                  <span style={{fontSize:10,color:MC.accentLt,fontWeight:700,flexShrink:0,fontFamily:"monospace"}}>{ex.sets}</span>
                </div>
              );
            })}
            <button onClick={()=>{setPrehabChecks({});showToast("Reset ✓");}} style={{marginTop:8,width:"100%",background:"transparent",border:`1px solid ${MC.border}`,borderRadius:4,color:MC.muted,padding:"9px",fontSize:10,cursor:"pointer",fontFamily:"monospace",letterSpacing:"0.08em"}}>// RESET CHECKLIST</button>
          </div>
        )}

        {/* ══ HRV ══ */}
        {mainTab==="hrv"&&(
          <div>
            <div style={{background:MC.surface,borderRadius:4,padding:"12px",marginBottom:12,borderLeft:`2px solid ${MC.khaki}`}}>
              <div style={{fontSize:9,color:MC.khaki,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.12em",fontFamily:"monospace",marginBottom:6}}>// HRV CHECK-IN</div>
              <div style={{fontSize:9,color:MC.muted,marginBottom:10,fontFamily:"monospace"}}>7-dag avg: <strong style={{color:MC.text}}>{avg7.toFixed(0)} ms</strong> · Baseline: 97 ms · RHR: 44</div>
              <label style={{fontSize:8,color:MC.muted,textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:4,fontFamily:"monospace"}}>HRV VANDAAG (ms)</label>
              <div style={{display:"flex",gap:8}}>
                <input type="number" value={hrvInput} onChange={e=>setHrvInput(e.target.value)} placeholder="bijv. 94" style={{...inp,flex:1}} onKeyDown={e=>e.key==="Enter"&&submitHRV()}/>
                <button onClick={submitHRV} style={{background:MC.accent,border:"none",borderRadius:4,color:MC.text,padding:"0 14px",fontSize:10,fontWeight:800,cursor:"pointer",flexShrink:0,fontFamily:"monospace",letterSpacing:"0.08em"}}>SAVE</button>
              </div>
            </div>

            {previewStatus&&(
              <div style={{background:MC.card,borderLeft:`3px solid ${statusInfo[previewStatus].col}`,borderRadius:4,padding:"10px 12px",marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:800,color:statusInfo[previewStatus].col,fontFamily:"monospace"}}>{statusInfo[previewStatus].label} — {hrvInput} ms ({previewPct>0?"+":""}{previewPct?.toFixed(1)}%)</div>
                <div style={{fontSize:10,color:MC.sub,marginTop:4}}>{statusInfo[previewStatus].actie}</div>
              </div>
            )}

            {hrvLog.length>0&&(
              <div style={{marginBottom:12}}>
                <SH title={`// LOGBOEK — ${hrvLog.length} METINGEN`}/>
                {[...hrvLog].reverse().slice(0,10).map((e,i)=>{
                  const p=((e.hrv-avg7)/avg7)*100;
                  const st=getHRVStatus(p);
                  return (
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${MC.border}`}}>
                      <span style={{fontSize:10,color:MC.muted,fontFamily:"monospace"}}>{e.date}</span>
                      <span style={{fontSize:12,fontWeight:700,color:st?statusInfo[st].col:MC.text,fontFamily:"monospace"}}>{e.hrv} ms</span>
                    </div>
                  );
                })}
              </div>
            )}

            {[{s:"green",sig:"±5% van avg",actie:"Plan uitvoeren zoals geschreven."},{s:"yellow",sig:"-5% tot -10%",actie:"Volume -20%. Intensiteit behouden."},{s:"red",sig:"<-10% of 2× geel",actie:"Geen S&C. Z1 + prehab + yin yoga."}].map((r,i)=>(
              <div key={i} style={{background:MC.card,borderLeft:`2px solid ${statusInfo[r.s].col}`,borderRadius:4,padding:"9px 12px",marginBottom:5}}>
                <div style={{fontSize:10,fontWeight:800,color:statusInfo[r.s].col,fontFamily:"monospace"}}>{statusInfo[r.s].label} — {r.sig}</div>
                <div style={{fontSize:9,color:MC.muted,marginTop:2}}>{r.actie}</div>
              </div>
            ))}
          </div>
        )}

        {/* ══ RETEST ══ */}
        {mainTab==="retest"&&(
          <div>
            <div style={{background:MC.surface,borderRadius:4,padding:"12px",marginBottom:14,borderLeft:`2px solid ${MC.accentLt}`}}>
              <div style={{fontSize:9,color:MC.accentLt,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.12em",fontFamily:"monospace",marginBottom:4}}>// GBRS RETEST — WEEK 9</div>
              <div style={{fontSize:9,color:MC.muted}}>Vul scores in na retest. Vergelijking met baseline wordt direct getoond.</div>
            </div>

            {/* Scores vergelijking */}
            <SH title="// BASELINE vs RETEST"/>
            {GBRS_STANDARDS.map(std=>{
              const base=BASELINE[std.key];
              const retest=retestScores[std.key];
              const baseStatus=getGBRSStatus(std.key,base);
              const retestStatus=retest!=null?getGBRSStatus(std.key,retest):null;
              const improved=retest!=null?(std.higher?retest>base:retest<base):null;
              const statusCol={green:MC.accentLt,yellow:MC.warn,red:MC.dangerLt,neutral:MC.muted};

              return (
                <div key={std.key} style={{background:MC.card,border:`1px solid ${MC.border}`,borderRadius:4,padding:"10px 12px",marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{fontSize:11,fontWeight:700,color:MC.text}}>{std.label}</div>
                    <div style={{fontSize:9,color:MC.muted,fontFamily:"monospace"}}>NORM: {fmtVal(std.key,std.norm)}</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <div style={{flex:1,textAlign:"center",background:MC.surface,borderRadius:3,padding:"6px 4px"}}>
                      <div style={{fontSize:8,color:MC.muted,fontFamily:"monospace",marginBottom:2}}>BASELINE</div>
                      <div style={{fontSize:13,fontWeight:800,color:statusCol[baseStatus],fontFamily:"monospace"}}>{fmtVal(std.key,base)}</div>
                    </div>
                    <div style={{fontSize:16,color:improved===true?MC.accentLt:improved===false?MC.dangerLt:MC.muted}}>
                      {improved===true?"▲":improved===false?"▼":"→"}
                    </div>
                    <div style={{flex:1,textAlign:"center",background:MC.surface,borderRadius:3,padding:"6px 4px",border:retest!=null?`1px solid ${statusCol[retestStatus||"neutral"]}33`:"none"}}>
                      <div style={{fontSize:8,color:MC.muted,fontFamily:"monospace",marginBottom:2}}>RETEST</div>
                      <div style={{fontSize:13,fontWeight:800,color:retest!=null?statusCol[retestStatus||"neutral"]:MC.muted,fontFamily:"monospace"}}>
                        {retest!=null?fmtVal(std.key,retest):"—"}
                      </div>
                    </div>
                  </div>
                  {retest!=null&&(
                    <div style={{marginTop:6,height:3,background:MC.border,borderRadius:1}}>
                      <div style={{height:3,width:`${Math.min((std.higher?(retest/std.norm)*100:(std.norm/retest)*100),100)}%`,background:statusCol[retestStatus||"neutral"],borderRadius:1}}/>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Input */}
            <div style={{height:16}}/>
            <SH title="// SCORES INVULLEN"/>
            {GBRS_STANDARDS.filter(s=>s.key!=="plank"&&s.key!=="run800").map(std=>(
              <div key={std.key} style={{marginBottom:10}}>
                <label style={{fontSize:8,color:MC.muted,textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:4,fontFamily:"monospace"}}>{std.label} ({std.unit})</label>
                <input type="number" step={std.dec>0?"0.01":"1"} placeholder={`Norm: ${std.norm}`}
                  value={retestInput[std.key]||""}
                  onChange={e=>setRetestInput(prev=>({...prev,[std.key]:parseFloat(e.target.value)}))}
                  style={inp}/>
              </div>
            ))}

            <div style={{marginBottom:10}}>
              <label style={{fontSize:8,color:MC.muted,textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:4,fontFamily:"monospace"}}>PLANK (min / sec)</label>
              <div style={{display:"flex",gap:8}}>
                <input type="number" placeholder="min" value={plankM} onChange={e=>setPlankM(e.target.value)} style={{...inp,width:"50%"}}/>
                <input type="number" placeholder="sec" value={plankS} onChange={e=>setPlankS(e.target.value)} style={{...inp,width:"50%"}}/>
              </div>
            </div>

            <div style={{marginBottom:16}}>
              <label style={{fontSize:8,color:MC.muted,textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:4,fontFamily:"monospace"}}>800M RUN (min / sec)</label>
              <div style={{display:"flex",gap:8}}>
                <input type="number" placeholder="min" value={runM} onChange={e=>setRunM(e.target.value)} style={{...inp,width:"50%"}}/>
                <input type="number" placeholder="sec" value={runS} onChange={e=>setRunS(e.target.value)} style={{...inp,width:"50%"}}/>
              </div>
            </div>

            <button onClick={submitRetest} style={{width:"100%",background:MC.accent,border:"none",borderRadius:4,color:MC.text,padding:"12px",fontSize:11,fontWeight:800,cursor:"pointer",letterSpacing:"0.1em",fontFamily:"monospace"}}>
              // RETEST SCORES OPSLAAN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
