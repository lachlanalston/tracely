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
const stepsData = {
  "No Internet":["Check NTD Lights","Restart NTD","Kick Connection","Loopback Test","Port Reset","Stability Profile"],
  "Packet Loss":["Check Cabling","Restart Router","Ping Test","Check for Interference"],
  "Slow Internet":["Speed Test","Restart Modem","Check Cabling","Check Background Traffic"],
  "No Power":["Check Power Supply","Reset NTD","Check Outlet"]
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

const serviceClassesData = {
  "FTTP":[
    ["Service Class 0","The location will be serviceable by Fibre to the Premises (FTTP) in the future, but it's not ready yet – NBN hasn’t finished connecting the local area. Aussie customers can pre-sign, but you will have to wait until the area is ready for service."],
    ["Service Class 1","The location is serviceable by fibre, however no NBN equipment has been installed at the premises yet. You’re able to order a service and an installation appointment can be made."],
    ["Service Class 2","The location is ready to connect with fibre technology. The external devices have been installed at the premises, but no internal equipment is installed yet. You’re able to order a service and an installation appointment can be made."],
    ["Service Class 3","The location is fully installed and serviceable by fibre, with both the external and internal devices installed at the premises. You can order a service and it will be activated in 1-5 days."]
  ],
  "FW":[
    ["Service Class 4","The location is planned to be serviceable by Fixed Wireless, but the tower is not built or ready for use. You can’t connect yet, but Aussie customers can pre-sign. You’ll have to wait for NBN to announce the area is ready for service."],
    ["Service Class 5","The location is now serviceable by NBN Fixed Wireless, but there’s no equipment installed at the premises. You are able to order a service and an installation appointment can be made."],
    ["Service Class 6","The location is ready to connect with Fixed Wireless technology. The antenna and the NTD (NBN connection device) are installed. You can order a service and it will be activated in 1-5 days."]
  ],
  "Satellite":[
    ["Service Class 7","The location is planned to be serviceable by Sky Muster (Satellite), but the infrastructure is not built or ready for use. You can’t connect yet, but you may be able to pre-sign. You’ll have to wait for NBN to announce the area is ready for service."],
    ["Service Class 8","The location is now serviceable by Satellite, but there’s no dish or NBN connection box installed at the property yet. You are able to order a service and an installation appointment can be made."],
    ["Service Class 9","The location is ready to connect with Satellite technology. The antenna and the NBN connection device are installed. You can order a service and it can be activated remotely."]
  ],
  "FTTN":[
    ["Service Class 10","The location is planned to be serviceable by copper for FTTN/FTTB but is not ready yet. Customers can pre-sign with us, but NBN are still in planning stages. Aussie customers can pre-sign, but you will have to wait until the area is ready for service."],
    ["Service Class 11","The location is ready to connect using copper technology, but additional works are needed. It’s best to make some arrangements prior to your installation for the lead-in cabling. You’re able to order a service and an installation appointment can be made."],
    ["Service Class 12","The location is ready to connect using copper technology, but additional works are needed. This class only requires jumper cabling to connect you to the network. You’re able to order a service and an installation appointment can be made if the line is not already active. The technician will not attend the home and will perform required work at the node."],
    ["Service Class 13","The location is ready to connect using copper technology, and all required cabling is installed and connected. You can order a service and it will be activated in 1-5 days."]
  ],
  "HFC":[
    ["Service Class 20","The location will be serviceable by Hybrid Fibre (HFC) in the future, but it’s not ready yet – NBN hasn’t finished connecting the local area. Aussie customers can pre-sign, but you will have to wait until the area is ready for service."],
    ["Service Class 21","The location is ready to connect using hybrid fibre technology, but additional works are needed to install lead-in cabling. You’re able to order a service and an installation appointment can be made."],
    ["Service Class 22","The location is ready to connect using HFC technology, but additional works are needed to install a network device and wall point. You’re able to order a service and an installation appointment can be made."],
    ["Service Class 23","The location is ready to connect using HFC technology, but additional works may be needed to install a network device. You’re able to order a service and an installation appointment can be made if a self-installation kit cannot be used."],
    ["Service Class 24","The location is ready to connect using HFC technology, and all required cabling/equipment has been installed. You can order a service and it will be activated in 1-5 days. ¹"]
  ],
  "FTTC":[
    ["Service Class 30","The location will be serviceable by copper and fibre (FTTC) in the future, but it’s not ready yet – NBN hasn’t finished connecting the local area. Aussie customers can pre-sign, but you will have to wait until the area is ready for service."],
    ["Service Class 31","The location is ready to connect using copper and fibre technologies, but additional works are needed to install lead-in cabling. You’re able to order a service and an installation appointment can be made."],
    ["Service Class 32","The location is ready to connect using copper and fibre technologies, but additional works are needed to connect the premises to a distribution point. You’re able to order a service and an installation appointment can be made."],
    ["Service Class 33","The location is ready to connect using FTTC, but additional works may be needed to install a network device. You’re able to order a service and an installation appointment can be made if a self-installation kit cannot be used."],
    ["Service Class 34","The location is ready to connect using FTTC, and all required cabling/equipment has been installed. You can order a service and it will be activated in 1-5 days. ²"]
  ]
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
    updateServiceClassesTable(t); // <-- NEW
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

// Populate Steps
function populateSteps(issue){
  const checkboxesDiv = document.getElementById("checkboxes");
  checkboxesDiv.innerHTML="";
  stepsData[issue].forEach(step=>{
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type="checkbox";
    label.appendChild(input);
    label.appendChild(document.createTextNode(step));
    checkboxesDiv.appendChild(label);
  });
}

// Show Next Step
function showNextStep(){
  const checkboxes = document.querySelectorAll("#checkboxes input");
  for(const cb of checkboxes){
    if(!cb.checked){
      cb.checked=true;
      document.getElementById("nextStepsOutput").innerHTML = `Step: ${cb.nextSibling.textContent}`;
      return;
    }
  }
  document.getElementById("nextStepsOutput").innerHTML = "All steps completed!";
}

// Update Equipment Images
function updateImage(t){
  const container = document.getElementById("equipmentImagesContainer");
  container.innerHTML="";
  const info = techInfo[t];
  if(!info) return;
  const model = info[currentModelIndex];
  model.images.forEach(img=>{
    const div = document.createElement("div");
    div.className="img-wrapper";
    const image = document.createElement("img");
    image.src=img.src;
    const caption = document.createElement("div");
    caption.className="caption";
    caption.textContent=img.caption;
    div.appendChild(image);
    div.appendChild(caption);
    container.appendChild(div);
    image.onclick=()=>openLightbox(img.src,img.caption);
  });
}

// Model Navigation
function showNextModel(){
  const info = techInfo[selectedTech];
  if(!info) return;
  currentModelIndex = (currentModelIndex+1)%info.length;
  updateImage(selectedTech);
}
function showPreviousModel(){
  const info = techInfo[selectedTech];
  if(!info) return;
  currentModelIndex = (currentModelIndex-1+info.length)%info.length;
  updateImage(selectedTech);
}

// Lightbox
function openLightbox(src,caption){
  document.getElementById("lightbox").style.display="block";
  document.getElementById("lightbox-img").src=src;
  document.getElementById("lightbox-caption").textContent=caption;
}
function closeLightbox(){ document.getElementById("lightbox").style.display="none"; }

// SERVICE CLASSES TABLE
function updateServiceClassesTable(tech){
  const container = document.getElementById("serviceClassesContainer");
  container.innerHTML="";
  const tableData = serviceClassesData[tech];
  if(!tableData) return;
  const table = document.createElement("table");
  const header = document.createElement("tr");
  ["Class","Definition"].forEach(h=>{
    const th = document.createElement("th");
    th.textContent=h;
    header.appendChild(th);
  });
  table.appendChild(header);
  tableData.forEach(row=>{
    const tr=document.createElement("tr");
    const td1=document.createElement("td"); td1.textContent=row[0];
    const td2=document.createElement("td"); td2.textContent=row[1];
    tr.appendChild(td1); tr.appendChild(td2);
    table.appendChild(tr);
  });
  container.appendChild(table);
}
