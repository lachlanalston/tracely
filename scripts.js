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

// NBN hardware database – add image files to images/<tech>/ as they become available
const techInfo = {
  "FTTP": [
    {
      model: "Nokia G-010G-P",
      images: [
        { src: "images/fttp/nokia-g010gp-front.jpg", caption: "Front view – check LEDs" },
        { src: "images/fttp/nokia-g010gp-back.jpg",  caption: "Back view – check ports" }
      ]
    },
    {
      model: "Nokia G-010G-Q",
      images: [
        { src: "images/fttp/nokia-g010gq-front.jpg", caption: "Front view – check LEDs" },
        { src: "images/fttp/nokia-g010gq-back.jpg",  caption: "Back view – check ports" }
      ]
    },
    {
      model: "Sercomm NF8 ONT",
      images: [
        { src: "images/fttp/sercomm-nf8-front.jpg", caption: "Front view – check LEDs" },
        { src: "images/fttp/sercomm-nf8-back.jpg",  caption: "Back view – check ports" }
      ]
    }
  ],
  "HFC": [
    {
      model: "Arris CM8200",
      images: [
        { src: "images/Older HFC NTD - Arris CM8200_Front.png", caption: "Front view – check lights" },
        { src: "images/Older HFC NTD - Arris CM8200_Back.jpg",  caption: "Back view – check ports" }
      ]
    },
    {
      model: "Technicolor TC4400",
      images: [
        { src: "images/hfc/technicolor-tc4400-front.jpg", caption: "Front view – check LEDs" },
        { src: "images/hfc/technicolor-tc4400-back.jpg",  caption: "Back view – check ports" }
      ]
    }
  ],
  "FTTN/FTTB": [
    {
      model: "Sagemcom F@ST 3864OP",
      images: [
        { src: "images/fttn/sagemcom-3864op-front.jpg", caption: "Front view – check LEDs" },
        { src: "images/fttn/sagemcom-3864op-back.jpg",  caption: "Back view – check ports" }
      ]
    },
    {
      model: "Netgear DM200",
      images: [
        { src: "images/fttn/netgear-dm200-front.jpg", caption: "Front view – check LEDs" },
        { src: "images/fttn/netgear-dm200-back.jpg",  caption: "Back view – check ports" }
      ]
    }
  ],
  "LTE/4G": [
    {
      model: "Nokia FastMile 4G",
      images: [
        { src: "images/lte/nokia-fastmile-4g-front.jpg", caption: "Front view – check LEDs" },
        { src: "images/lte/nokia-fastmile-4g-back.jpg",  caption: "Back view – check ports" }
      ]
    },
    {
      model: "Wavesat LTE CPE",
      images: [
        { src: "images/lte/wavesat-lte-front.jpg", caption: "Front view – check LEDs" },
        { src: "images/lte/wavesat-lte-back.jpg",  caption: "Back view – check ports" }
      ]
    }
  ],
  "ADSL/VDSL": [
    {
      model: "Sagemcom F@ST 3864V3",
      images: [
        { src: "images/adsl/sagemcom-3864v3-front.jpg", caption: "Front view – check LEDs" },
        { src: "images/adsl/sagemcom-3864v3-back.jpg",  caption: "Back view – check ports" }
      ]
    },
    {
      model: "Netgear D7800",
      images: [
        { src: "images/adsl/netgear-d7800-front.jpg", caption: "Front view – check LEDs" },
        { src: "images/adsl/netgear-d7800-back.jpg",  caption: "Back view – check ports" }
      ]
    }
  ],
  "Satellite": [
    {
      model: "ViaSat SurfBeam 2 (Indoor)",
      images: [
        { src: "images/satellite/viasat-surfbeam2-front.jpg", caption: "Indoor modem – front" },
        { src: "images/satellite/viasat-surfbeam2-back.jpg",  caption: "Indoor modem – back" }
      ]
    },
    {
      model: "Sky Muster Dish",
      images: [
        { src: "images/satellite/skymuster-dish.jpg", caption: "Outdoor dish / antenna" }
      ]
    }
  ]
};

// Lights table data
const lightsData = {
  "FTTP": {
    "Nokia G-010G-P": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["Power","Off","No power – check supply"],
      ["PON","Solid Green","Synchronised with NBN network"],
      ["PON","Flashing Green","Connecting to network"],
      ["PON","Off","No PON signal – check fibre"],
      ["LOS","Solid Red","Loss of signal – fibre fault or cut"],
      ["LOS","Off","Normal – no fault"],
      ["LAN1","Solid/Flashing Green","Ethernet link / activity"],
      ["LAN1","Off","No Ethernet connection"]
    ],
    "Nokia G-010G-Q": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["Power","Off","No power – check supply"],
      ["PON","Solid Green","Synchronised with NBN network"],
      ["PON","Flashing Green","Connecting to network"],
      ["LOS","Solid Red","Loss of signal – check fibre connection"],
      ["LOS","Off","Normal"],
      ["LAN","Solid/Flashing Green","Ethernet link / activity"]
    ],
    "Sercomm NF8 ONT": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["PON","Solid Green","Fibre link established"],
      ["PON","Flashing","Registering with network"],
      ["Internet","Solid Green","Internet active"],
      ["Internet","Off","No internet connection"],
      ["LAN","Solid/Flashing Green","Ethernet activity"]
    ]
  },
  "HFC": {
    "Arris CM8200": [
      ["Power","Downstream","Upstream","Online","Meaning"],
      ["Off","Off","Off","Off","No power to the NBN connection box"],
      ["On","Flashing","Flashing","Flashing","Power-on self test"],
      ["On","Flashing","Off","Off","Downstream search"],
      ["On","On","Flashing","Off","Downstream found, upstream search"],
      ["On","On","On","Flashing","Retrieving setup information from NBN"],
      ["On","On","On","On","Ready for service"]
    ],
    "Technicolor TC4400": [
      ["LED","Status","Meaning"],
      ["Power","Solid White","Device powered on"],
      ["Power","Off","No power – check supply"],
      ["DS","Solid White","Downstream channel locked"],
      ["DS","Flashing","Scanning for downstream"],
      ["US","Solid White","Upstream channel locked"],
      ["US","Flashing","Ranging / upstream registration"],
      ["Online","Solid White","Registered and connected"],
      ["Online","Flashing","Connecting to NBN"],
      ["Online","Off","Not connected"]
    ]
  },
  "FTTN/FTTB": {
    "Sagemcom F@ST 3864OP": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["DSL","Solid Green","VDSL sync established"],
      ["DSL","Flashing Green","Training / syncing"],
      ["DSL","Off","No DSL signal – check line"],
      ["Internet","Solid Green","Internet connection active"],
      ["Internet","Flashing Green","Internet traffic"],
      ["Internet","Off","No internet – check DSL"],
      ["WLAN","Solid/Flashing Green","Wi-Fi active / traffic"],
      ["LAN1-4","Solid/Flashing Green","Ethernet link / activity"]
    ],
    "Netgear DM200": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["DSL","Solid Green","DSL sync established"],
      ["DSL","Flashing Amber","Training"],
      ["DSL","Off","No DSL signal"],
      ["Internet","Solid Green","Internet active"],
      ["Internet","Solid Amber","Connected – no internet"],
      ["Internet","Off","Not connected"]
    ]
  },
  "LTE/4G": {
    "Nokia FastMile 4G": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["Signal","3 bars solid","Strong LTE signal"],
      ["Signal","2 bars solid","Moderate signal"],
      ["Signal","1 bar solid","Weak signal – check placement"],
      ["Signal","Off","No signal"],
      ["Internet","Solid Green","Internet active"],
      ["Internet","Off","No internet connection"],
      ["LAN","Solid/Flashing Green","Ethernet link / activity"]
    ],
    "Wavesat LTE CPE": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["LTE","Solid Green","LTE connected"],
      ["LTE","Flashing","Searching for signal"],
      ["Internet","Solid Green","Internet active"],
      ["LAN","Solid Green","Ethernet connected"]
    ]
  },
  "ADSL/VDSL": {
    "Sagemcom F@ST 3864V3": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["DSL","Solid Green","ADSL/VDSL sync established"],
      ["DSL","Flashing Green","Training / syncing"],
      ["DSL","Off","No DSL signal – check line"],
      ["Internet","Solid Green","Internet connection active"],
      ["Internet","Off","No internet"],
      ["WLAN","Solid/Flashing Green","Wi-Fi active"],
      ["LAN","Solid/Flashing Green","Ethernet link / activity"]
    ],
    "Netgear D7800": [
      ["LED","Status","Meaning"],
      ["Power","Solid White","Device powered on"],
      ["DSL","Solid Green","DSL sync established"],
      ["DSL","Flashing Amber","Training"],
      ["Internet","Solid White","Internet active"],
      ["Internet","Solid Amber","No internet – DSL present"],
      ["2.4GHz","Solid/Flashing White","Wi-Fi active"],
      ["5GHz","Solid/Flashing White","Wi-Fi active"]
    ]
  },
  "Satellite": {
    "ViaSat SurfBeam 2 (Indoor)": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["Satellite","Solid Green","Satellite link established"],
      ["Satellite","Flashing Green","Acquiring satellite signal"],
      ["Satellite","Off","No satellite signal – check dish alignment"],
      ["Internet","Solid Green","Internet active"],
      ["Internet","Off","No internet connection"],
      ["LAN","Solid/Flashing Green","Ethernet activity"]
    ],
    "Sky Muster Dish": [
      ["Indicator","Status","Meaning"],
      ["Alignment","Correct","Dish pointed to Sky Muster satellite at 140.0°E"],
      ["Alignment","Off-axis","Re-align dish – call installer if needed"],
      ["Cable","Intact","Coax from dish to indoor modem connected"],
      ["Cable","Damaged","Replace coax – check connectors"]
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

    // Model counter badge
    if(techInfo[tech].length > 1){
      const counter = document.createElement("div");
      counter.className = "model-counter";
      counter.textContent = `Model ${currentModelIndex + 1} of ${techInfo[tech].length}`;
      container.appendChild(counter);
    }

    modelData.images.forEach(imgData=>{
      const imgWrapper = document.createElement("div");
      imgWrapper.className = "img-wrapper";

      const img = document.createElement("img");
      img.src = imgData.src;
      img.alt = `${modelData.model} – ${imgData.caption}`;

      // Graceful fallback when photo not yet uploaded
      img.onerror = () => {
        imgWrapper.removeChild(img);
        const placeholder = document.createElement("div");
        placeholder.className = "img-placeholder";
        placeholder.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          <span>Photo needed</span>
          <small>${imgData.caption}</small>`;
        imgWrapper.insertBefore(placeholder, imgWrapper.firstChild);
      };

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
