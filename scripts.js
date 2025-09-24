// Dark mode toggle
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

// Example data
const techTypes = ["FTTP","HFC","FTTN/FTTB","LTE/4G","ADSL/VDSL","Satellite"];
const issueTypes = ["No Internet","Packet Loss","Slow Internet","No Power"];
const stepsData = {
  "No Internet":["Check NTD Lights","Restart NTD","Kick Connection","Loopback Test","Port Reset","Stability Profile"],
  "Packet Loss":["Check Cabling","Restart Router","Ping Test","Check for Interference"],
  "Slow Internet":["Speed Test","Restart Modem","Check Cabling","Check Background Traffic"],
  "No Power":["Check Power Supply","Reset NTD","Check Outlet"]
};

const lightsData = {
  "HFC": [
    ["Power","Downstream","Upstream","Online","Meaning"],
    ["Off","Off","Off","Off","No power to the NBN connection box"],
    ["On","Flashing","Flashing","Flashing","Power-on self test"],
    ["On","Flashing","Off","Off","Downstream search"],
    ["On","On","Flashing","Off","Downstream found, upstream search"],
    ["On","On","On","Flashing","Downstream and upstream found - retrieving setup information from NBN"],
    ["On","On","On","On","Ready for service"]
  ]
  // Add other tech types here later
};

// Populate tech type cards
const techContainer = document.getElementById("techTypeGrid");
let selectedTech = "";
techTypes.forEach(t=>{
  const card = document.createElement("div");
  card.className="card";
  card.textContent = t;
  card.onclick=()=>{
    selectedTech=t;
    document.querySelectorAll("#techTypeGrid .card").forEach(c=>c.classList.remove("selected"));
    card.classList.add("selected");
    updateImage(t);
  };
  techContainer.appendChild(card);
});

// Populate issue type cards
const issueContainer = document.getElementById("issueTypeGrid");
let selectedIssue = "";
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
      label.innerHTML=`<input type="checkbox"> ${step}`;
      container.appendChild(label);
    });
  }
}

// Show next step with dynamic guidance + copy button
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
          return `<li style="margin-bottom:8px; ${style}">${step}</li>`;
        }).join('')}
      </ol>
    </div>
  `;
}

// Copy steps
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

// Update equipment image + lights table
function updateImage(tech){
  const img = document.getElementById("equipmentImage");
  const caption = document.getElementById("equipmentCaption");
  switch(tech){
    case "FTTP": img.src="images/fttp.png"; caption.textContent="FTTP NTD – check PON & UNI-D ports and lights"; break;
    case "HFC": img.src="images/hfc.png"; caption.textContent="HFC Modem – check coax and power lights"; break;
    case "FTTN/FTTB": img.src="images/fttn.png"; caption.textContent="FTTN NTD – check phone line & router connections"; break;
    case "LTE/4G": img.src="images/lte.png"; caption.textContent="LTE Modem – check SIM & signal indicator lights"; break;
    case "ADSL/VDSL": img.src="images/adsl.png"; caption.textContent="ADSL Modem – check DSL lights and connections"; break;
    case "Satellite": img.src="images/satellite.png"; caption.textContent="Satellite modem – check dish and power lights"; break;
    default: img.src="images/default.png"; caption.textContent="Equipment image will appear here.";
  }
  updateLightsTable(tech);
}

// Update lights table dynamically
function updateLightsTable(tech) {
  const container = document.getElementById("lightsTableContainer");
  container.innerHTML = "";
  const data = lightsData[tech];
  if(!data) return;

  const table = document.createElement("table");
  data.forEach((row, i) => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = i === 0 ? document.createElement("th") : document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  container.appendChild(table);
}
