/* ===================== DATA ===================== */
const LEAVES = [
  {id:"healthy", severity:"low", confidence:97, color:"#4B7340", spots:0},
  {id:"blight", severity:"high", confidence:89, color:"#7A5C33", spots:5},
  {id:"mildew", severity:"medium", confidence:84, color:"#8FA07A", spots:6},
  {id:"aphid", severity:"medium", confidence:91, color:"#5C7A46", spots:8},
  {id:"nitrogen", severity:"low", confidence:78, color:"#B7B24A", spots:0}
];

const DISTRICTS = [
  {id:"pune", risk:"medium", score:58, values:[40,55,60,58,65]},
  {id:"nashik", risk:"high", score:73, values:[60,70,75,80,78]},
  {id:"sambhajinagar", risk:"low", score:21, values:[20,22,25,20,18]},
  {id:"kolhapur", risk:"high", score:75, values:[65,72,80,77,82]},
  {id:"amravati", risk:"medium", score:45, values:[35,42,50,48,52]},
  {id:"nagpur", risk:"low", score:18, values:[15,18,20,17,19]}
];

const translations = {
  en:{
    nav:{brand:"AgriRakshak", tagline:"Guardian of Crops"},
    hero:{eyebrow:"Smart India Hackathon 2026 · PS 26131", title:"See the disease\nbefore it spreads.",
      sub:"Farmers often spot crop trouble only after the damage is done. AgriRakshak reads a leaf photo, checks the week's weather, and tells you what's wrong — and what to do — before it costs you the harvest.",
      cta:"Scan a leaf", cta2:"How it works"},
    demo:{eyebrow:"Try it", eyebrow2:"How it works", title:"Leaf health scanner",
      instruction:"Pick a leaf below, or drop your own photo.", upload:"Upload your photo", uploaded:"Your photo",
      scan:"Scan for disease", scanning:"Reading the leaf…",
      demoNote:"Demo mode — results are simulated from sample data, not a live model.",
      resultTitle:"Diagnosis", confidence:"Confidence", severity:"Severity",
      advisoryTitle:"What to do", talkToOfficer:"Send to extension officer", stamp:"VERIFIED",
      severityLabels:{low:"Low", medium:"Medium", high:"High"}},
    results:{
      healthy:{name:"Healthy leaf", advisory:"No action needed. Keep monitoring weekly and maintain current watering and spacing."},
      blight:{name:"Early leaf blight", advisory:"Remove and destroy affected leaves. Apply a copper-based fungicide within 48 hours and avoid overhead watering."},
      mildew:{name:"Powdery mildew", advisory:"Improve airflow by spacing plants further apart. Apply a sulfur-based spray in the evening; re-check in 5 days."},
      aphid:{name:"Aphid infestation", advisory:"Introduce ladybirds or spray a neem oil solution every 3 days. Avoid broad-spectrum pesticide unless spread continues."},
      nitrogen:{name:"Nitrogen deficiency", advisory:"Yellowing starts from older leaves first. Apply a nitrogen-rich top dressing and recheck soil in 2 weeks."}
    },
    risk:{eyebrow:"This week", title:"Field risk forecast", selectLabel:"Choose your district", next5:"Next 5 days"},
    districts:{
      pune:{name:"Pune", reasoning:"Humidity has stayed above 70% for three days running — fungal risk is climbing."},
      nashik:{name:"Nashik", reasoning:"Recent rainfall plus warm nights favour blight — inspect grape and onion plots this week."},
      sambhajinagar:{name:"Chhatrapati Sambhajinagar", reasoning:"Dry, clear conditions expected — disease pressure is low, but watch for aphids on cotton."},
      kolhapur:{name:"Kolhapur", reasoning:"Heavy monsoon carryover keeps fields waterlogged — root rot risk is elevated."},
      amravati:{name:"Amravati", reasoning:"Fluctuating temperatures are stressing cotton — bollworm activity is likely to rise."},
      nagpur:{name:"Nagpur", reasoning:"Stable, dry weather this week — a good window for preventive spraying."}
    },
    how:{title:"Four steps, in the field", steps:[
      {title:"Capture", body:"Take a photo of the affected leaf, or use a shared pest-trap reading from your extension worker."},
      {title:"Diagnose", body:"AgriRakshak matches the image and local weather against known disease and pest patterns."},
      {title:"Advisory", body:"You get a plain-language recommendation in your language — what it is, how bad, what to do."},
      {title:"Follow-up", body:"Confirmed cases feed a district map so officials can act before an outbreak spreads."}
    ]},
    footer:{line1:"Built for Smart India Hackathon 2026 — Problem Statement 26131",
      line2:"Government of Maharashtra · Maharashtra State Innovation Society",
      disclaimer:"This is a concept demo. Diagnoses shown are simulated, not agronomic or medical advice."}
  },
  hi:{
    nav:{brand:"एग्रीरक्षक", tagline:"फसलों का रक्षक"},
    hero:{eyebrow:"स्मार्ट इंडिया हैकाथॉन 2026 · समस्या 26131", title:"बीमारी फैलने से पहले\nपहचानें।",
      sub:"किसान को अक्सर फसल की समस्या तब पता चलती है जब नुकसान हो चुका होता है। एग्रीरक्षक पत्ती की फोटो और हफ्ते के मौसम को देखकर बताता है कि क्या गड़बड़ है — और नुकसान से पहले क्या करना है।",
      cta:"पत्ती स्कैन करें", cta2:"यह कैसे काम करता है"},
    demo:{eyebrow:"आज़माएं", eyebrow2:"यह कैसे काम करता है", title:"पत्ती स्वास्थ्य स्कैनर",
      instruction:"नीचे से एक पत्ती चुनें, या अपनी फोटो डालें।", upload:"अपनी फोटो अपलोड करें", uploaded:"आपकी फोटो",
      scan:"बीमारी जांचें", scanning:"पत्ती पढ़ी जा रही है…",
      demoNote:"डेमो मोड — परिणाम नमूना डेटा से बनाए गए हैं, यह लाइव मॉडल नहीं है।",
      resultTitle:"निदान", confidence:"विश्वास स्तर", severity:"गंभीरता",
      advisoryTitle:"क्या करें", talkToOfficer:"विस्तार अधिकारी को भेजें", stamp:"सत्यापित",
      severityLabels:{low:"कम", medium:"मध्यम", high:"अधिक"}},
    results:{
      healthy:{name:"स्वस्थ पत्ती", advisory:"कोई कार्रवाई ज़रूरी नहीं। हर हफ्ते निगरानी जारी रखें और सिंचाई व दूरी वैसी ही रखें।"},
      blight:{name:"आरंभिक पत्ती झुलसा रोग", advisory:"प्रभावित पत्तियों को हटाकर नष्ट करें। 48 घंटे में कॉपर आधारित फफूंदनाशक लगाएं और ऊपर से पानी देने से बचें।"},
      mildew:{name:"चूर्णिल आसिता (पाउडरी मिल्ड्यू)", advisory:"पौधों के बीच अधिक दूरी रखकर हवा का आवागमन बढ़ाएं। शाम को सल्फर आधारित स्प्रे करें; 5 दिन बाद फिर जांचें।"},
      aphid:{name:"माहू कीट प्रकोप", advisory:"लेडीबर्ड कीट छोड़ें या हर 3 दिन नीम तेल घोल का छिड़काव करें। फैलाव जारी रहने तक ही व्यापक कीटनाशक का उपयोग करें।"},
      nitrogen:{name:"नाइट्रोजन की कमी", advisory:"पुराने पत्तों से पीलापन शुरू होता है। नाइट्रोजन युक्त खाद डालें और 2 हफ्ते बाद मिट्टी की जांच करें।"}
    },
    risk:{eyebrow:"इस हफ्ते", title:"खेत जोखिम पूर्वानुमान", selectLabel:"अपना जिला चुनें", next5:"अगले 5 दिन"},
    districts:{
      pune:{name:"पुणे", reasoning:"तीन दिनों से नमी 70% से ऊपर है — फफूंद जनित जोखिम बढ़ रहा है।"},
      nashik:{name:"नासिक", reasoning:"हाल की बारिश और गर्म रातें झुलसा रोग को बढ़ावा दे रही हैं — अंगूर और प्याज़ के खेतों की जांच करें।"},
      sambhajinagar:{name:"छत्रपती संभाजीनगर", reasoning:"सूखा, साफ मौसम रहेगा — बीमारी का खतरा कम है, लेकिन कपास पर माहू पर नज़र रखें।"},
      kolhapur:{name:"कोल्हापुर", reasoning:"मानसून का असर अभी बना है, खेतों में पानी भरा है — जड़ सड़न का खतरा बढ़ा है।"},
      amravati:{name:"अमरावती", reasoning:"बदलता तापमान कपास पर असर डाल रहा है — बॉलवर्म की सक्रियता बढ़ सकती है।"},
      nagpur:{name:"नागपुर", reasoning:"इस हफ्ते मौसम स्थिर और सूखा रहेगा — बचावी छिड़काव के लिए अच्छा समय।"}
    },
    how:{title:"चार चरण, खेत में", steps:[
      {title:"फोटो लें", body:"प्रभावित पत्ती की फोटो लें, या अपने विस्तार कार्यकर्ता से कीट-ट्रैप की रीडिंग लें।"},
      {title:"निदान करें", body:"एग्रीरक्षक फोटो और स्थानीय मौसम की तुलना जानी-मानी बीमारी और कीट पैटर्न से करता है।"},
      {title:"सलाह पाएं", body:"आपको अपनी भाषा में सीधी सलाह मिलती है — समस्या क्या है, कितनी गंभीर है, और क्या करना है।"},
      {title:"फॉलो-अप", body:"पुष्ट मामले जिला मानचित्र में जुड़ते हैं जिससे अधिकारी फैलाव से पहले कार्रवाई कर सकें।"}
    ]},
    footer:{line1:"स्मार्ट इंडिया हैकाथॉन 2026 के लिए निर्मित — समस्या विवरण 26131",
      line2:"महाराष्ट्र सरकार · महाराष्ट्र राज्य नवोन्मेष सोसायटी",
      disclaimer:"यह एक अवधारणा डेमो है। दिखाए गए निदान अनुरूपित हैं, कृषि या चिकित्सा सलाह नहीं।"}
  },
  mr:{
    nav:{brand:"अ‍ॅग्रीरक्षक", tagline:"पिकांचा रक्षक"},
    hero:{eyebrow:"स्मार्ट इंडिया हॅकाथॉन 2026 · समस्या 26131", title:"रोग पसरण्याआधी\nओळखा.",
      sub:"नुकसान झाल्यावरच शेतकऱ्यांना पिकातील समस्या लक्षात येते. अ‍ॅग्रीरक्षक पानाचा फोटो आणि आठवड्याचे हवामान पाहून सांगतो काय बिघडलंय — आणि नुकसान होण्याआधी काय करायचं.",
      cta:"पान स्कॅन करा", cta2:"हे कसं काम करतं"},
    demo:{eyebrow:"वापरून पहा", eyebrow2:"हे कसं काम करतं", title:"पान आरोग्य स्कॅनर",
      instruction:"खालून एक पान निवडा, किंवा तुमचा फोटो टाका.", upload:"तुमचा फोटो अपलोड करा", uploaded:"तुमचा फोटो",
      scan:"रोग तपासा", scanning:"पान वाचत आहे…",
      demoNote:"डेमो मोड — निकाल नमुना डेटावरून तयार केले आहेत, हे लाइव्ह मॉडेल नाही.",
      resultTitle:"निदान", confidence:"विश्वासार्हता", severity:"तीव्रता",
      advisoryTitle:"काय करावे", talkToOfficer:"विस्तार अधिकाऱ्याला पाठवा", stamp:"तपासणी पूर्ण",
      severityLabels:{low:"कमी", medium:"मध्यम", high:"जास्त"}},
    results:{
      healthy:{name:"निरोगी पान", advisory:"काहीही करण्याची गरज नाही. दर आठवड्याला निरीक्षण सुरू ठेवा आणि पाणी व अंतर तसंच ठेवा."},
      blight:{name:"प्रारंभिक पानांवरील करपा रोग", advisory:"बाधित पाने काढून नष्ट करा. 48 तासांत कॉपरयुक्त बुरशीनाशक फवारा आणि वरून पाणी देणं टाळा."},
      mildew:{name:"भुरी रोग", advisory:"रोपांमध्ये अधिक अंतर ठेवून हवा खेळती राहू द्या. संध्याकाळी गंधकयुक्त फवारणी करा; 5 दिवसांनी पुन्हा तपासा."},
      aphid:{name:"मावा कीड प्रादुर्भाव", advisory:"लेडीबर्ड कीटक सोडा किंवा दर 3 दिवसांनी निंबोळी तेल फवारा. प्रसार सुरूच राहिला तरच व्यापक कीटकनाशक वापरा."},
      nitrogen:{name:"नत्राची कमतरता", advisory:"जुन्या पानांपासून पिवळेपणा सुरू होतो. नत्रयुक्त खत द्या आणि 2 आठवड्यांनी मातीची तपासणी करा."}
    },
    risk:{eyebrow:"या आठवड्यात", title:"शेत जोखीम अंदाज", selectLabel:"तुमचा जिल्हा निवडा", next5:"पुढील 5 दिवस"},
    districts:{
      pune:{name:"पुणे", reasoning:"तीन दिवसांपासून आर्द्रता 70% पेक्षा जास्त आहे — बुरशीजन्य धोका वाढतोय."},
      nashik:{name:"नाशिक", reasoning:"अलीकडचा पाऊस आणि उष्ण रात्री करपा रोगाला पोषक — द्राक्ष व कांदा पिकांची तपासणी करा."},
      sambhajinagar:{name:"छत्रपती संभाजीनगर", reasoning:"कोरडे, स्वच्छ हवामान राहील — रोगाचा धोका कमी आहे, पण कापसावरील मावा कीडीवर लक्ष ठेवा."},
      kolhapur:{name:"कोल्हापूर", reasoning:"मान्सूनचा प्रभाव अजून टिकून आहे, शेतात पाणी साचलंय — मूळकुज होण्याचा धोका वाढला आहे."},
      amravati:{name:"अमरावती", reasoning:"बदलते तापमान कापसावर परिणाम करत आहे — बोंडअळीची सक्रियता वाढू शकते."},
      nagpur:{name:"नागपूर", reasoning:"या आठवड्यात हवामान स्थिर आणि कोरडे राहील — प्रतिबंधात्मक फवारणीसाठी चांगली वेळ."}
    },
    how:{title:"चार टप्पे, शेतात", steps:[
      {title:"फोटो घ्या", body:"बाधित पानाचा फोटो घ्या, किंवा तुमच्या विस्तार कार्यकर्त्याकडून कीड-सापळ्याचं वाचन घ्या."},
      {title:"निदान करा", body:"अ‍ॅग्रीरक्षक फोटो आणि स्थानिक हवामानाची तुलना ज्ञात रोग व कीड पॅटर्नशी करतो."},
      {title:"सल्ला मिळवा", body:"तुम्हाला तुमच्या भाषेत साधा सल्ला मिळतो — समस्या काय आहे, किती गंभीर आहे, आणि काय करायचं."},
      {title:"फॉलो-अप", body:"पुष्टी झालेली प्रकरणं जिल्हा मॅपमध्ये जोडली जातात, ज्यामुळे अधिकारी प्रसार होण्याआधी कारवाई करू शकतात."}
    ]},
    footer:{line1:"स्मार्ट इंडिया हॅकाथॉन 2026 साठी तयार — समस्या विवरण 26131",
      line2:"महाराष्ट्र शासन · महाराष्ट्र राज्य नवोन्मेष सोसायटी",
      disclaimer:"ही एक संकल्पना डेमो आहे. दाखवलेले निदान अनुकरण केलेले आहेत, कृषी किंवा वैद्यकीय सल्ला नाही."}
  }
};

let currentLang = "en";
let selectedLeafId = null;
let uploadedDataUrl = null;
let currentDistrictId = "pune";

/* ===================== HELPERS ===================== */
function t(lang){ return translations[lang]; }
function severityColor(sev){
  return sev==="high" ? "var(--alert-high)" : sev==="medium" ? "var(--alert-med)" : "var(--alert-low)";
}
function riskGaugeColor(score){
  return score>=65 ? "var(--alert-high)" : score>=35 ? "var(--alert-med)" : "var(--alert-low)";
}

function leafSvg(leaf){
  const c = leaf.color;
  let spotsMarkup = "";
  const positions = [[24,20],[40,16],[16,34],[34,36],[22,44],[42,42],[30,26],[18,22]];
  for(let i=0;i<leaf.spots;i++){
    const p = positions[i % positions.length];
    spotsMarkup += `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="#7a3b2b" opacity="0.6"/>`;
  }
  return `<svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true">
    <path d="M28 50C28 50 8 40 8 24C8 14 16 8 28 8C40 8 48 14 48 24C48 40 28 50 28 50Z" fill="${c}"/>
    <path d="M28 50V16" stroke="#2f2517" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/>
    ${spotsMarkup}
  </svg>`;
}

/* ===================== RENDER: LEAF GRID ===================== */
function renderLeafGrid(){
  const grid = document.getElementById("leafGrid");
  grid.innerHTML = "";
  LEAVES.forEach(leaf=>{
    const card = document.createElement("button");
    card.className = "leaf-card";
    card.setAttribute("role","listitem");
    card.dataset.id = leaf.id;
    if(leaf.id === selectedLeafId) card.classList.add("selected");
    card.innerHTML = `<div class="thumb">${leafSvg(leaf)}</div><div class="label">${t(currentLang).results[leaf.id].name}</div>`;
    card.addEventListener("click", ()=>selectLeaf(leaf.id));
    grid.appendChild(card);
  });
  const upCard = document.createElement("button");
  upCard.className = "upload-card";
  upCard.id = "uploadCard";
  upCard.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke-linecap="round"/></svg><span id="uploadLabel">${t(currentLang).demo.upload}</span>`;
  upCard.addEventListener("click", ()=>document.getElementById("fileInput").click());
  grid.appendChild(upCard);
}

function selectLeaf(id){
  selectedLeafId = id;
  uploadedDataUrl = null;
  document.querySelectorAll(".leaf-card").forEach(c=>c.classList.toggle("selected", c.dataset.id===id));
  document.getElementById("resultCard").style.display = "none";
  document.getElementById("scanPanel").style.display = "none";
  enableScan();
}

function enableScan(){
  const btn = document.getElementById("scanBtn");
  btn.disabled = false;
  btn.classList.remove("btn-disabled");
}

/* handle custom upload: replace grid preview + pick a plausible mock result */
document.getElementById("fileInput").addEventListener("change", (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    uploadedDataUrl = reader.result;
    const nonHealthy = LEAVES.filter(l=>l.id!=="healthy");
    const pick = nonHealthy[Math.floor(Math.random()*nonHealthy.length)];
    selectedLeafId = pick.id;
    const upCard = document.getElementById("uploadCard");
    upCard.innerHTML = `<div class="thumb"><img src="${uploadedDataUrl}" alt=""></div><div class="label">${t(currentLang).demo.uploaded}</div>`;
    document.querySelectorAll(".leaf-card").forEach(c=>c.classList.remove("selected"));
    document.getElementById("resultCard").style.display = "none";
    document.getElementById("scanPanel").style.display = "none";
    enableScan();
  };
  reader.readAsDataURL(file);
});

/* ===================== SCAN ANIMATION ===================== */
document.getElementById("scanBtn").addEventListener("click", runScan);
function runScan(){
  if(!selectedLeafId) return;
  const panel = document.getElementById("scanPanel");
  const fill = document.getElementById("scanFill");
  const resultCard = document.getElementById("resultCard");
  resultCard.style.display = "none";
  document.getElementById("stamp").classList.remove("show");
  panel.style.display = "block";
  fill.style.width = "0%";
  let pct = 0;
  const interval = setInterval(()=>{
    pct += 4 + Math.random()*6;
    if(pct >= 100){
      pct = 100;
      clearInterval(interval);
      setTimeout(()=>{
        panel.style.display = "none";
        renderResult(selectedLeafId);
      }, 220);
    }
    fill.style.width = pct + "%";
  }, 90);
}

function renderResult(id){
  const leaf = LEAVES.find(l=>l.id===id);
  const data = t(currentLang).results[id];
  const demo = t(currentLang).demo;
  const card = document.getElementById("resultCard");
  document.getElementById("resultName").textContent = data.name;
  const badge = document.getElementById("severityBadge");
  badge.textContent = demo.severityLabels[leaf.severity];
  badge.className = "severity-badge severity-" + leaf.severity;
  document.getElementById("confidenceValue").textContent = leaf.confidence + "%";
  document.getElementById("advisoryText").textContent = data.advisory;
  card.style.display = "block";
  const fill = document.getElementById("confidenceFill");
  fill.style.width = "0%";
  requestAnimationFrame(()=>{ setTimeout(()=>{ fill.style.width = leaf.confidence + "%"; }, 30); });
  const stampCircles = document.querySelectorAll("#stamp circle, #stamp path:not(#stampPath)");
  stampCircles.forEach(el=>el.setAttribute("stroke", severityColor(leaf.severity)));
  const stampText = document.getElementById("stampText");
  const stampTextParent = stampText.closest("text");
  if(stampTextParent) stampTextParent.setAttribute("fill", severityColor(leaf.severity));
  setTimeout(()=>document.getElementById("stamp").classList.add("show"), 260);
}

/* ===================== RISK SECTION ===================== */
function populateDistrictSelect(){
  const select = document.getElementById("districtSelect");
  select.innerHTML = "";
  DISTRICTS.forEach(d=>{
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = t(currentLang).districts[d.id].name;
    if(d.id === currentDistrictId) opt.selected = true;
    select.appendChild(opt);
  });
}
document.getElementById("districtSelect").addEventListener("change", (e)=>{
  currentDistrictId = e.target.value;
  renderRisk();
});

function renderRisk(){
  const d = DISTRICTS.find(x=>x.id===currentDistrictId);
  const info = t(currentLang).districts[d.id];
  const demo = t(currentLang).demo;
  document.getElementById("gaugeFill").style.width = d.score + "%";
  document.getElementById("gaugeFill").style.background = riskGaugeColor(d.score);
  document.getElementById("gaugeScore").textContent = d.score + "%";
  document.getElementById("riskReasoning").textContent = info.reasoning;
  const chip = document.getElementById("riskChip");
  chip.textContent = demo.severityLabels[d.risk];
  chip.style.background = d.risk==="high" ? "var(--alert-high-bg)" : d.risk==="medium" ? "var(--alert-med-bg)" : "var(--alert-low-bg)";
  chip.style.color = severityColor(d.risk);

  const barChart = document.getElementById("barChart");
  barChart.innerHTML = "";
  d.values.forEach((v,i)=>{
    const col = document.createElement("div");
    col.className = "bar-col";
    col.innerHTML = `<div class="bar" style="height:${v}%; background:${riskGaugeColor(v)}"></div><div class="bar-day">${i+1}</div>`;
    barChart.appendChild(col);
  });
}

/* ===================== HOW IT WORKS ===================== */
function renderSteps(){
  const grid = document.getElementById("stepsGrid");
  grid.innerHTML = "";
  t(currentLang).how.steps.forEach((s,i)=>{
    const card = document.createElement("div");
    card.className = "step";
    card.innerHTML = `<div class="num">0${i+1}</div><h3>${s.title}</h3><p>${s.body}</p>`;
    grid.appendChild(card);
  });
}

/* ===================== STATIC TEXT + LANGUAGE SWITCH ===================== */
function applyStaticText(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const path = el.getAttribute("data-i18n").split(".");
    let val = t(currentLang);
    for(const p of path){ val = val && val[p]; }
    if(typeof val === "string"){
      el.textContent = val;
    }
  });
}

function switchLang(lang){
  currentLang = lang;
  document.documentElement.setAttribute("lang", lang);
  document.body.className = "lang-" + lang;
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("active", b.dataset.lang===lang));
  applyStaticText();
  renderLeafGrid();
  if(uploadedDataUrl){
    const upCard = document.getElementById("uploadCard");
    upCard.innerHTML = `<div class="thumb"><img src="${uploadedDataUrl}" alt=""></div><div class="label">${t(currentLang).demo.uploaded}</div>`;
  }
  if(selectedLeafId){
    document.querySelectorAll(".leaf-card").forEach(c=>c.classList.toggle("selected", c.dataset.id===selectedLeafId));
  }
  if(document.getElementById("resultCard").style.display === "block"){
    renderResult(selectedLeafId);
  }
  populateDistrictSelect();
  renderRisk();
  renderSteps();
}

document.querySelectorAll(".lang-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>switchLang(btn.dataset.lang));
});

document.getElementById("heroCta").addEventListener("click", ()=>{
  document.getElementById("demo").scrollIntoView({behavior:"smooth"});
});
document.getElementById("heroCta2").addEventListener("click", ()=>{
  document.getElementById("how").scrollIntoView({behavior:"smooth"});
});

/* ===================== INIT ===================== */
renderLeafGrid();
populateDistrictSelect();
renderRisk();
renderSteps();