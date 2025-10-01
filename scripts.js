// DARK MODE
let darkMode = true;
function toggleDarkMode() {
  darkMode = !darkMode;
  const root = document.documentElement;
  if(darkMode){
    root.style.setProperty('--bg-color','#0f172a');
    root.style.setProperty('--panel-bg','#1e293b');
    root.style.setProperty('--text-color','#f1f5f9');
    root.style.setProperty('--accent-color','#3b82f6');
    root.style.setProperty('--accent-hover','#2563eb');
    root.style.setProperty('--card-bg','#1e40af');
    root.style.setProperty('--caption-color','#cbd5e1');
  } else {
    root.style.setProperty('--bg-color','#f0f2f5');
    root.style.setProperty('--panel-bg','#ffffff');
    root.style.setProperty('--text-color','#1e293b');
    root.style.setProperty('--accent-color','#3b82f6');
    root.style.setProperty('--accent-hover','#2563eb');
    root.style.setProperty('--card-bg','#e0e7ff');
    root.style.setProperty('--caption-color','#475569');
  }
}

// DATA
const techTypes = ["FTTP","HFC","FTTN/FTTB","LTE/4G","ADSL/VDSL","Satellite"];
const issueTypes = ["No Internet","Packet Loss","Slow Internet","No Power"];

// OPERATIONAL TROUBLESHOOTING STEPS
const stepsData = {
  "No Internet":[
    "Confirm device is powered",
    "Check known NBN outage",
    "Check Connection / NTD Status",
    "UNI-D Status",
    "Loopback Test",
    "Kick Connection",
    "Port Reset",
    "Restart Modem/Router",
    "Raise with ISP",
    "Onsite",
    "Replace Hardware"
  ],
  "Packet Loss":[
    "Confirm device is powered",
    "Check known NBN outage",
    "Check Cabling",
    "Check Connection / NTD Status",
    "Loopback Test",
    "Restart Router",
    "Check for Interference",
    "Raise with ISP",
    "Onsite"
  ],
  "Slow Internet":[
    "Confirm device is powered",
    "Check known NBN outage",
    "Speed Test",
    "Restart Modem",
    "Check Cabling",
    "Check Background Traffic",
    "Loopback Test",
    "Raise with ISP"
  ],
  "No Power":[
    "Confirm device is powered",
    "Check known NBN outage",
    "Check Power Supply",
    "Reset NTD",
    "Raise with ISP"
  ]
};

// MARK STEPS WITH OUTAGE WARNING
const stepsOutageRisk = {
  "Loopback Test": "Minor Outage ⚠️",
  "Kick Connection": "Will Disrupt Connection ⚠️",
  "Port Reset": "Will Disrupt Connection ⚠️",
  "Restart Modem/Router": "Will Disrupt Connection ⚠️",
  "Restart Router": "Will Disrupt Connection ⚠️"
};

// HFC only images/models for now
const techInfo = {
  "HFC": [
    { 
      model: "Arris CM8200",
      images: [
        { src: "images/Older HFC NTD - Arris CM8200_Front.png", caption: "Front view – check lights" },
        { src: "images/Older HFC NTD - Arris CM8200_Back.jpg", caption: "Back view – check ports" }
      ]
    }
  ]
};

// Lights table data
const lightsData = {
  "HFC": {
    "Arris CM8200": [
      ["Power","Downstream","Upstream","Online","Meaning"],
      ["Off","Off","Off","Off","No power to the NBN connection box"],
      ["On","Flashing","Flashing","Flashing","Power-on self test"],
      ["On","Flashing","Off","Off","Downstream search"],
      ["On","On","Flashing","Off","Downstream found, upstream search"],
      ["On","On","On","Flashing","Downstream and upstream found - retrieving setup information from NBN"],
      ["On","On","On","On","Ready for service"]
    ]
  }
};

let selectedTech = "";
let selectedIssue = "";
let currentModelIndex = 0;

// Populate tech cards
const techContainer = document.getElementById("techTypeGrid");
techTypes.forEach(t=>{
  const card = document.createElement("div");
  card.className="card";
  card.textContent = t;
  card.onclick=()=>{
    selectedTech=t;
    currentModelIndex=0;
    document.querySelectorAll("#techTypeGrid .card").forEach(c=>c.classList.remove("selected"));
    card.classList.add("selected");
    updateImage(t);
  };
  techContainer.appendChild(card);
});

// Populate issue cards
const issueContainer = document.getElementById("issueTypeGrid");
issueTypes.forEach(i=>{
  const card = document.createElement("div");
  card.className="card";
  card.textContent = i;
  card.onclick=()=>{
    selectedIssue=i;
    document.querySelectorAll("#issueTypeGrid .card").forEach(c=>c.classList.remove("selected"));
    card.classList.add("selected");
    populateSteps(i);
  };
  issueContainer.appendChild(card);
});

// Populate checkboxes
function populateSteps(issue){
  const container = document.getElementById("checkboxes");
  container.innerHTML="";
  document.getElementById("nextStepsOutput").innerHTML="";
  if(stepsData[issue]){
    stepsData[issue].forEach(step=>{
      const label = document.createElement("label");
      label.innerHTML=`<input type="checkbox"> ${step}${stepsOutageRisk[step] ? ' ('+stepsOutageRisk[step]+')' : ''}`;
      container.appendChild(label);
    });
  }
}

// Next step + copy button
function showNextStep(){
  const container = document.getElementById("nextStepsOutput");
  if(!selectedIssue) return;

  let steps = stepsData[selectedIssue] || [];
  const extraActions = ["Raise with ISP","Onsite","Replace Hardware"];
  const allSteps = steps.concat(extraActions);

  const checkboxes = document.querySelectorAll("#checkboxes input[type='checkbox']");
  let firstIncomplete = true;

  container.innerHTML = `
    <div style="position: relative; padding:16px; border-radius:16px; background:var(--panel-bg); box-shadow:0 6px 15px rgba(0,0,0,0.3);">
      <button id="copySmallBtn" onclick="copyNextSteps()" 
              style="position:absolute; top:10px; right:10px; background:var(--accent-color); border:none; color:white; border-radius:8px; padding:6px 10px; cursor:pointer; font-size:0.9rem;">
        Copy
      </button>
      <h3 style="margin-top:0; margin-bottom:10px;">Recommended Next Steps</h3>
      <ol style="padding-left:20px; margin:0;" id="stepList">
        ${allSteps.map((step, i) => {
          const done = checkboxes[i] && checkboxes[i].checked;
          let style = done ? "color:#94a3b8;" : "";
          if(!done && firstIncomplete) {
            style += "font-weight:700; border-left:4px solid var(--accent-color); padding-left:6px;";
            firstIncomplete = false;
          }
          const risk = stepsOutageRisk[step] ? ` <span style="color:red;">(${stepsOutageRisk[step]})</span>` : "";
          return `<li style="margin-bottom:8px; ${style}">${step}${risk}</li>`;
        }).join('')}
      </ol>
    </div>
  `;
}

function copyNextSteps(){
  const steps = document.querySelectorAll("#stepList li");
  if(!steps.length) return;
  const text = Array.from(steps).map(li=>li.textContent).join("\n");
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("copySmallBtn");
    btn.textContent = "Copied!";
    setTimeout(()=>{ btn.textContent = "Copy"; }, 1500);
  });
}

// Update images + caption
function updateImage(tech){
  const container = document.getElementById("equipmentImagesContainer");
  container.innerHTML="";

  if(techInfo[tech] && techInfo[tech].length>0){
    const modelData = techInfo[tech][currentModelIndex];

    modelData.images.forEach(imgData=>{
      const imgWrapper = document.createElement("div");
      imgWrapper.className = "img-wrapper";

      const img = document.createElement("img");
      img.src = imgData.src;
      img.alt = modelData.model;

      img.addEventListener("click", () => {
        openLightbox(imgData.src, `${modelData.model} – ${imgData.caption}`);
      });

      const caption = document.createElement("div");
      caption.className = "caption";
      caption.innerHTML = `<strong>${modelData.model}</strong> – ${imgData.caption}`;

      imgWrapper.appendChild(img);
      imgWrapper.appendChild(caption);
      container.appendChild(imgWrapper);
    });
  } else {
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "img-wrapper";

    const img = document.createElement("img");
    img.src = "images/default.png";
    img.addEventListener("click", () => {
      openLightbox("images/default.png", "Equipment image will appear here.");
    });

    const caption = document.createElement("div");
    caption.className="caption";
    caption.textContent = "Equipment image will appear here.";

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(caption);
    container.appendChild(imgWrapper);
  }

  updateLightsTable(tech);
}

// Lights table
function updateLightsTable(tech){
  const container = document.getElementById("lightsTableContainer");
  container.innerHTML="";
  if(!techInfo[tech]) return;

  const model = techInfo[tech][currentModelIndex].model;
  const tableData = (lightsData[tech] && lightsData[tech][model]) || [];

  if(tableData.length){
    const table = document.createElement("table");
    tableData.forEach((row,i)=>{
      const tr = document.createElement("tr");
      row.forEach(cell=>{
        const td = i===0 ? document.createElement("th") : document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    container.appendChild(table);
  }
}

// Model navigation
function showNextModel(){
  if(!selectedTech || !techInfo[selectedTech]) return;
  currentModelIndex = (currentModelIndex +1) % techInfo[selectedTech].length;
  updateImage(selectedTech);
}
function showPreviousModel(){
  if(!selectedTech || !techInfo[selectedTech]) return;
  currentModelIndex = (currentModelIndex -1 + techInfo[selectedTech].length) % techInfo[selectedTech].length;
  updateImage(selectedTech);
}

// Lightbox functions
function openLightbox(src, caption){
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCaption = document.getElementById("lightbox-caption");

  lb.style.display = "block";
  lbImg.src = src;
  lbCaption.textContent = caption;
}

function closeLightbox(){
  document.getElementById("lightbox").style.display = "none";
}
