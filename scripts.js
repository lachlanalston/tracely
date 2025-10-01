// LIGHTS DATA (model-specific)
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
  },
  "FTTP": {
    "NTD X100": [
      ["Power","Link","Internet","Meaning"],
      ["Off","Off","Off","No power to the NTD"],
      ["On","Flashing","Off","NTD is booting up"],
      ["On","On","Flashing","Connected to NBN, waiting for activation"],
      ["On","On","On","Ready for service"]
    ]
  },
  // Add FTTN, FTTC, Satellite, FW models here
};

// SERVICE CLASSES DATA (tech-type specific)
const serviceClassesData = {
  "FTTP":[
    ["Class","Definition"],
    ["Service Class 0","Location not ready yet"],
    ["Service Class 1","Location serviceable, no internal equipment installed"],
    ["Service Class 2","External devices installed, internal pending"],
    ["Service Class 3","Fully installed, ready to activate"]
  ],
  "FW":[
    ["Class","Definition"],
    ["Service Class 4","Planned, tower not built"],
    ["Service Class 5","Serviceable, no equipment installed"],
    ["Service Class 6","Ready to connect, NTD installed"]
  ],
  "Satellite":[
    ["Class","Definition"],
    ["Service Class 7","Planned, infrastructure not built"],
    ["Service Class 8","Serviceable, no dish/NTD installed"],
    ["Service Class 9","Ready to connect, NBN device installed"]
  ],
  "FTTN":[
    ["Class","Definition"],
    ["Service Class 10","Planned, copper not ready"],
    ["Service Class 11","Ready with additional works needed"],
    ["Service Class 12","Ready, jumper cabling only"],
    ["Service Class 13","Fully ready, activate in 1-5 days"]
  ],
  "HFC":[
    ["Class","Definition"],
    ["Service Class 20","Planned, not ready yet"],
    ["Service Class 21","Ready, additional works needed"],
    ["Service Class 22","Ready, install network device/wall point"],
    ["Service Class 23","Ready, additional works may be needed"],
    ["Service Class 24","Fully ready, activate in 1-5 days"]
  ],
  "FTTC":[
    ["Class","Definition"],
    ["Service Class 30","Planned, not ready yet"],
    ["Service Class 31","Ready, additional works needed for lead-in"],
    ["Service Class 32","Ready, connection to distribution point required"],
    ["Service Class 33","Ready, additional works may be needed"],
    ["Service Class 34","Fully ready, activate in 1-5 days"]
  ]
};

// UPDATE LIGHTS TABLE
function updateLightsTable(tech){
  const container = document.getElementById("lightsTableContainer");
  container.innerHTML="";
  if(!selectedTech || !techInfo[selectedTech]) return;

  const model = techInfo[selectedTech][currentModelIndex].model;
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

// UPDATE SERVICE CLASSES TABLE
function updateServiceClasses(tech){
  const container = document.getElementById("serviceClassesContainer");
  container.innerHTML="";

  const tableData = serviceClassesData[tech] || [];
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

// UPDATE IMAGES + BOTH TABLES WHEN TECH CLICKED
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

  // Always update both tables
  updateLightsTable(tech);
  updateServiceClasses(tech);
}
