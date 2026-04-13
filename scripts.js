'use strict';

// ================================================================
// TECH-SPECIFIC TROUBLESHOOTING STEPS
// ================================================================

// ── Reusable field schemas ────────────────────────────────────────
const F = {
  speed: [
    { label: "Download",     key: "dl",      unit: "Mbps", inputType: "number", placeholder: "0" },
    { label: "Upload",       key: "ul",      unit: "Mbps", inputType: "number", placeholder: "0" },
    { label: "Ping",         key: "ping",    unit: "ms",   inputType: "number", placeholder: "0" }
  ],
  ping: [
    { label: "Packet Loss",  key: "loss",    unit: "%",    inputType: "number", placeholder: "0" },
    { label: "Avg Latency",  key: "latency", unit: "ms",   inputType: "number", placeholder: "0" },
    { label: "Pattern",      key: "pattern", inputType: "select",
      options: ["Stable – 0% loss", "Intermittent drops", "Consistent loss", "Total loss – no connectivity"] }
  ],
  satPing: [
    { label: "Packet Loss",  key: "loss",    unit: "%",    inputType: "number", placeholder: "0" },
    { label: "Avg Latency",  key: "latency", unit: "ms",   inputType: "number", placeholder: "600" },
    { label: "Pattern",      key: "pattern", inputType: "select",
      options: ["Normal (~600ms latency, 0% loss)", "High latency, no loss", "Intermittent drops", "Total loss – no connectivity"] }
  ],
  dslSync: [
    { label: "Sync Rate",    key: "sync",    unit: "Mbps", inputType: "number", placeholder: "" },
    { label: "SNR Margin",   key: "snr",     unit: "dB",   inputType: "number", placeholder: "" },
    { label: "Status",       key: "status",  inputType: "select",
      options: ["Stable", "Fluctuating / dropping", "Not synced", "Cannot access admin"] }
  ],
  signal: [
    { label: "Signal Bars",  key: "bars",    unit: "/ 5",  inputType: "number", placeholder: "0–5" },
    { label: "Signal Level", key: "dbm",     unit: "dBm",  inputType: "number", placeholder: "" },
    { label: "Status",       key: "status",  inputType: "select",
      options: ["Strong (> −70 dBm)", "Moderate (−70 to −85 dBm)", "Weak (< −85 dBm)", "No signal"] }
  ],
  fault: [
    { label: "Outcome",      key: "outcome", inputType: "select",
      options: ["Fault raised with ISP", "ISP confirmed network fault", "ISP advising onsite required", "ISP: scheduled investigation"] },
    { label: "ISP Ref #",    key: "ref",     inputType: "text", placeholder: "e.g. INC-12345" }
  ],
  faultCarrier: [
    { label: "Outcome",      key: "outcome", inputType: "select",
      options: ["Fault raised with carrier", "Carrier confirmed network issue", "Carrier: coverage issue confirmed", "Carrier: scheduled investigation"] },
    { label: "IMEI",         key: "imei",    inputType: "text", placeholder: "15-digit IMEI" },
    { label: "Carrier Ref #",key: "ref",     inputType: "text", placeholder: "e.g. INC-12345" }
  ],
  satData: [
    { label: "Usage Status", key: "status",  inputType: "select",
      options: ["Within peak quota – not throttled", "Peak quota reached – speeds throttled", "Off-peak quota only available"] },
    { label: "Throttle Speed",key:"throttle",unit: "Mbps", inputType: "number", placeholder: "if throttled" }
  ],
  satSignal: [
    { label: "Signal Level", key: "signal",  inputType: "text", placeholder: "e.g. −65 dBm" },
    { label: "Status",       key: "status",  inputType: "select",
      options: ["Normal – within expected range", "Below expected – possible misalignment", "Cannot access modem admin"] }
  ]
};

const stepsData = {
  "FTTP": {
    "No Internet": [
      { text: "Confirm NTD has power – Power LED should be solid green", disruptive: false,
        options: ["Power LED solid green – OK", "Power LED off – no power", "Power LED amber/red – fault"] },
      { text: "Check for known NBN outages at outages.nbnco.com.au", disruptive: false,
        options: ["No outages listed", "Active outage confirmed in area", "Scheduled maintenance listed"] },
      { text: "Check PON LED – solid green = synced, flashing = connecting, off = no fibre signal", disruptive: false,
        options: ["PON LED solid green – synced OK", "PON LED flashing – still connecting", "PON LED off – no fibre signal"] },
      { text: "Check LOS LED – if red, there is a fibre fault (cut, bend, dirty connector)", disruptive: false,
        options: ["LOS LED off – no fault", "LOS LED red – fibre fault indicated"] },
      { text: "Confirm Ethernet cable is in the UNI-D 1 port on the NTD", disruptive: false,
        options: ["Cable in UNI-D 1 – confirmed", "Cable was in wrong port – moved to UNI-D 1", "Cable was unplugged – reseated"] },
      { text: "Check Ethernet cable from NTD UNI-D port to router WAN port", disruptive: false,
        options: ["Cable seated at both ends – OK", "Cable replaced – fault resolved", "Cable replaced – no change"] },
      { text: "Reboot router", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved", "Rebooted – briefly connected then dropped"] },
      { text: "Test with laptop directly on UNI-D 1 port to bypass router", disruptive: false,
        options: ["Laptop gets internet – router confirmed faulty", "Laptop gets IP but no internet – NTD/line issue", "Laptop no IP – NTD fault"] },
      { text: "Power cycle NTD – unplug 30 sec, allow ~2 min to reconnect", disruptive: true,
        options: ["Power cycled – no change", "Power cycled – resolved", "Power cycled – connecting but no internet"] },
      { text: "Raise fault with ISP – provide NTD serial number and LED status", disruptive: false, fields: F.fault },
      { text: "Escalate to NBN onsite visit", disruptive: false,
        options: ["Onsite visit booked", "Escalation submitted – pending scheduling"] }
    ],
    "Packet Loss": [
      { text: "Confirm NTD has power", disruptive: false,
        options: ["Power LED solid green – OK", "Power LED off – no power"] },
      { text: "Check for known NBN outages", disruptive: false,
        options: ["No outages listed", "Active outage confirmed", "Scheduled maintenance listed"] },
      { text: "Check all Ethernet cabling – NTD to router, router to device", disruptive: false,
        options: ["All cables secure – OK", "Cable fault found and replaced", "Cables reseated – no change"] },
      { text: "Run continuous ping to 8.8.8.8 – note pattern and loss percentage", disruptive: false, fields: F.ping },
      { text: "Check PON LED for instability – intermittent flashing may indicate a fibre issue", disruptive: false,
        options: ["PON LED stable solid green", "PON LED intermittent flashing – unstable", "PON LED off – no fibre"] },
      { text: "Reboot router", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved", "Rebooted – briefly improved then dropped"] },
      { text: "Test with laptop directly on UNI-D port to isolate router", disruptive: false,
        options: ["Laptop: same loss – not the router", "Laptop: no loss – router at fault", "Laptop: also losing packets – line/NTD issue"] },
      { text: "Raise fault with ISP – provide ping test results", disruptive: false, fields: F.fault },
      { text: "Escalate to NBN onsite – possible fibre degradation", disruptive: false,
        options: ["Onsite booked", "Escalation submitted"] }
    ],
    "Slow Internet": [
      { text: "Confirm NTD has power", disruptive: false,
        options: ["Power LED solid green – OK", "Power LED off – no power"] },
      { text: "Check for known NBN outages", disruptive: false,
        options: ["No outages listed", "Active outage confirmed"] },
      { text: "Run speed test – record download, upload, and ping", disruptive: false, fields: F.speed },
      { text: "Test wired vs wireless – isolate whether issue is Wi-Fi", disruptive: false,
        options: ["Wired OK, wireless slow – Wi-Fi issue confirmed", "Both wired and wireless slow – not Wi-Fi", "Wired not possible – wireless only tested"] },
      { text: "Check for background traffic (streaming, cloud backup, Windows updates)", disruptive: false,
        options: ["Background traffic found and paused – speeds improved", "No background traffic found", "Updates running – paused and retested"] },
      { text: "Reboot router", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved"] },
      { text: "Test with laptop directly on UNI-D port", disruptive: false,
        options: ["Laptop speed OK – router confirmed faulty", "Laptop also slow – line/ISP issue"] },
      { text: "Confirm service plan – check expected vs actual speeds", disruptive: false,
        options: ["Plan speed – actual within acceptable range", "Plan speed vs actual speed mismatch confirmed"] },
      { text: "Raise fault with ISP – provide speed test results and test method", disruptive: false, fields: F.fault }
    ],
    "No Power": [
      { text: "Check power outlet is live – test with another device", disruptive: false,
        options: ["Outlet live – confirmed with test device", "Outlet dead – switched to another outlet", "Outlet on switched board – board was off"] },
      { text: "Check power cable is firmly connected to the NTD", disruptive: false,
        options: ["Cable secure at both ends – OK", "Cable was loose – reseated, no change", "Cable was loose – reseated, power restored"] },
      { text: "Try an alternative power cable if available", disruptive: false,
        options: ["Alt cable tried – still no power", "Alt cable – power restored"] },
      { text: "Check UPS or power board if in use", disruptive: false,
        options: ["UPS/power board OK – not the cause", "UPS fault found – device bypassed directly to wall"] },
      { text: "Inspect NTD for physical damage or burn marks", disruptive: false,
        options: ["No visible damage", "Physical damage or burn marks found – replacement required"] },
      { text: "Raise fault with ISP – NTD likely needs replacement", disruptive: false, fields: F.fault }
    ]
  },
  "HFC": {
    "No Internet": [
      { text: "Confirm NTD has power – Power LED should be on", disruptive: false,
        options: ["Power LED on – OK", "Power LED off – no power", "Power LED amber/red – fault"] },
      { text: "Check for known NBN outages at outages.nbnco.com.au", disruptive: false,
        options: ["No outages listed", "Active outage confirmed in area", "Scheduled maintenance listed"] },
      { text: "Check DS (Downstream) LED – should be solid, not flashing", disruptive: false,
        options: ["DS LED solid – OK", "DS LED flashing – acquiring downstream", "DS LED off – no downstream signal"] },
      { text: "Check US (Upstream) LED – should be solid", disruptive: false,
        options: ["US LED solid – OK", "US LED flashing – not registered upstream", "US LED off"] },
      { text: "Check Online LED – solid = registered and connected", disruptive: false,
        options: ["Online LED solid – registered OK", "Online LED flashing – registering", "Online LED off – not registered"] },
      { text: "Check coaxial cable from wall plate to NTD – hand-tighten both ends", disruptive: false,
        options: ["Coax cable secure – OK", "Coax was loose – tightened, no change", "Coax was loose – tightened, resolved"] },
      { text: "Check Ethernet cable from NTD to router WAN port", disruptive: false,
        options: ["Ethernet cable secure – OK", "Cable replaced – no change", "Cable replaced – resolved"] },
      { text: "Reboot router", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved", "Rebooted – briefly connected then dropped"] },
      { text: "Power cycle NTD – unplug 30 sec, allow ~5 min to reconnect", disruptive: true,
        options: ["Power cycled – no change", "Power cycled – resolved", "Power cycled – DS/US LEDs recovered, still no internet"] },
      { text: "Request loopback test from ISP", disruptive: true,
        options: ["Loopback test passed – fault not confirmed at ISP end", "Loopback test failed – ISP confirmed fault"] },
      { text: "Request port reset from ISP / NBN", disruptive: true,
        options: ["Port reset performed – no change", "Port reset performed – resolved"] },
      { text: "Raise fault with ISP – provide LED status and NTD serial", disruptive: false, fields: F.fault },
      { text: "Escalate to NBN onsite visit", disruptive: false,
        options: ["Onsite visit booked", "Escalation submitted – pending scheduling"] }
    ],
    "Packet Loss": [
      { text: "Confirm NTD has power", disruptive: false,
        options: ["Power LED on – OK", "Power LED off – no power"] },
      { text: "Check for known NBN outages", disruptive: false,
        options: ["No outages listed", "Active outage confirmed", "Scheduled maintenance"] },
      { text: "Inspect coaxial cable for damage, kinks, or corrosion", disruptive: false,
        options: ["Coax cable OK – no visible damage", "Kink or damage found – cable replaced", "Corrosion found at connector – cleaned/replaced"] },
      { text: "Check DS/US LEDs – intermittent flashing indicates signal instability", disruptive: false,
        options: ["DS/US LEDs stable solid – OK", "DS/US LEDs intermittently flashing – signal unstable"] },
      { text: "Check for coax splitters – remove if possible, run direct to NTD", disruptive: false,
        options: ["No splitters present", "Splitter removed – direct connection – improved", "Splitter removed – no change"] },
      { text: "Run continuous ping to 8.8.8.8 and record results", disruptive: false, fields: F.ping },
      { text: "Reboot router", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved", "Rebooted – briefly improved then dropped"] },
      { text: "Power cycle NTD", disruptive: true,
        options: ["Power cycled – no change", "Power cycled – resolved"] },
      { text: "Raise fault with ISP – HFC signal quality check required", disruptive: false, fields: F.fault },
      { text: "Escalate to onsite – check coax splitters and wall plate quality", disruptive: false,
        options: ["Onsite booked", "Escalation submitted"] }
    ],
    "Slow Internet": [
      { text: "Confirm NTD has power", disruptive: false,
        options: ["Power LED on – OK", "Power LED off – no power"] },
      { text: "Check for known NBN outages", disruptive: false,
        options: ["No outages listed", "Active outage confirmed"] },
      { text: "Run speed test – record download, upload, and ping", disruptive: false, fields: F.speed },
      { text: "Test wired vs wireless to isolate the issue", disruptive: false,
        options: ["Wired OK, wireless slow – Wi-Fi issue", "Both slow – not Wi-Fi related"] },
      { text: "Check for background traffic", disruptive: false,
        options: ["Background traffic found and stopped – improved", "No background traffic found"] },
      { text: "Check coaxial cable and connectors for damage", disruptive: false,
        options: ["Coax OK – no damage", "Cable damage found – replaced"] },
      { text: "Reboot router", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved"] },
      { text: "Power cycle NTD", disruptive: true,
        options: ["Power cycled – no change", "Power cycled – resolved"] },
      { text: "Raise fault with ISP – provide speed test results", disruptive: false, fields: F.fault }
    ],
    "No Power": [
      { text: "Check power outlet is live", disruptive: false,
        options: ["Outlet live – confirmed", "Outlet dead – switched outlet"] },
      { text: "Check power cable is secured to NTD", disruptive: false,
        options: ["Cable secure – OK", "Cable reseated – power restored", "Cable reseated – no change"] },
      { text: "Check battery backup unit (BBU) if present – may need a charge or replacement", disruptive: false,
        options: ["No BBU present", "BBU present – charged and OK", "BBU fault – bypassed, NTD powered directly"] },
      { text: "Inspect NTD for physical damage", disruptive: false,
        options: ["No visible damage", "Physical damage found – replacement required"] },
      { text: "Raise fault with ISP – NTD replacement likely", disruptive: false, fields: F.fault }
    ]
  },
  "FTTN/FTTB": {
    "No Internet": [
      { text: "Confirm modem has power – Power LED should be solid green", disruptive: false,
        options: ["Power LED solid green – OK", "Power LED off – no power", "Power LED amber/red – fault"] },
      { text: "Check for known NBN outages", disruptive: false,
        options: ["No outages listed", "Active outage confirmed", "Scheduled maintenance"] },
      { text: "Check DSL LED – solid = synced, flashing = training, off = no signal", disruptive: false,
        options: ["DSL LED solid green – synced OK", "DSL LED flashing – training/not yet synced", "DSL LED off – no DSL signal"] },
      { text: "Check phone line / wall socket is active", disruptive: false,
        options: ["Wall socket active – confirmed with another device", "Wall socket dead – no dial tone"] },
      { text: "Remove any inline phone filters or splitters – DSL uses the full line", disruptive: false,
        options: ["No filters/splitters present", "Filter removed – DSL synced", "Filter removed – no change"] },
      { text: "Try a different phone cable from wall to modem", disruptive: false,
        options: ["New cable – no change", "New cable – DSL synced, issue resolved"] },
      { text: "Reboot modem", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved", "Rebooted – DSL synced but still no internet"] },
      { text: "Test at the master socket / test socket (remove wall plate faceplate) to rule out internal wiring", disruptive: false,
        options: ["Master socket test – same result, not internal wiring", "Master socket test – works, internal wiring fault confirmed"] },
      { text: "Raise fault with ISP – provide DSL sync speed and attenuation", disruptive: false, fields: F.fault },
      { text: "Escalate to onsite", disruptive: false,
        options: ["Onsite booked", "Escalation submitted"] }
    ],
    "Packet Loss": [
      { text: "Confirm modem has power", disruptive: false,
        options: ["Power LED solid green – OK", "Power LED off – no power"] },
      { text: "Check for known NBN outages", disruptive: false,
        options: ["No outages listed", "Active outage confirmed"] },
      { text: "Check DSL sync rate in modem admin (192.168.0.1 or 192.168.1.1)", disruptive: false, fields: F.dslSync },
      { text: "Inspect phone cabling condition – damaged wire causes DSL instability", disruptive: false,
        options: ["Cabling OK – no visible damage", "Damaged/frayed cable found – replaced"] },
      { text: "Check for DECT phones, alarm systems, or other devices on the line causing interference", disruptive: false,
        options: ["No interfering devices found", "DECT phone/alarm removed – improved", "DECT phone/alarm removed – no change"] },
      { text: "Run continuous ping to 8.8.8.8 and record loss pattern", disruptive: false, fields: F.ping },
      { text: "Reboot modem", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved"] },
      { text: "Raise fault with ISP – provide sync rates and SNR margin", disruptive: false, fields: F.fault }
    ],
    "Slow Internet": [
      { text: "Confirm modem has power", disruptive: false,
        options: ["Power LED solid green – OK", "Power LED off – no power"] },
      { text: "Check for known NBN outages", disruptive: false,
        options: ["No outages listed", "Active outage confirmed"] },
      { text: "Run speed test – record results", disruptive: false, fields: F.speed },
      { text: "Check DSL sync rate in modem admin – compare to expected rate for line length", disruptive: false, fields: F.dslSync },
      { text: "Test wired vs wireless", disruptive: false,
        options: ["Wired OK, wireless slow – Wi-Fi issue", "Both slow – not Wi-Fi related"] },
      { text: "Check for interference sources on the phone line", disruptive: false,
        options: ["No interference sources found", "Interfering device found and removed – improved"] },
      { text: "Reboot modem", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved"] },
      { text: "Raise fault with ISP – provide sync stats and speed test results", disruptive: false, fields: F.fault }
    ],
    "No Power": [
      { text: "Check power outlet is live", disruptive: false,
        options: ["Outlet live – confirmed", "Outlet dead – switched outlet"] },
      { text: "Confirm power adapter voltage matches modem label", disruptive: false,
        options: ["Adapter voltage matches – OK", "Wrong adapter found – correct adapter fitted"] },
      { text: "Inspect modem for physical damage", disruptive: false,
        options: ["No visible damage", "Physical damage found – replacement required"] },
      { text: "Raise fault with ISP – modem replacement required", disruptive: false, fields: F.fault }
    ]
  },
  "LTE/4G": {
    "No Internet": [
      { text: "Confirm device has power – Power LED should be on", disruptive: false,
        options: ["Power LED on – OK", "Power LED off – no power"] },
      { text: "Check for known network outages in the area", disruptive: false,
        options: ["No outages listed", "Active outage confirmed in area", "Coverage issue in this location"] },
      { text: "Check signal LEDs / bars – low signal may require repositioning the device", disruptive: false, fields: F.signal },
      { text: "Relocate device to a higher position, near a window, or outside obstruction", disruptive: false,
        options: ["Repositioned – signal improved, internet connected", "Repositioned – signal improved, still no internet", "Repositioned – no improvement"] },
      { text: "Check SIM card is seated correctly (if accessible)", disruptive: false,
        options: ["SIM seated correctly – OK", "SIM was loose – reseated, improved", "SIM not detected – reseated, retrying"] },
      { text: "Reboot device", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved", "Rebooted – signal recovered but no internet"] },
      { text: "Confirm APN settings are correct for the carrier", disruptive: false,
        options: ["APN settings correct – confirmed", "APN incorrect – corrected, resolved", "APN corrected – no change"] },
      { text: "Check if device is locked to a specific band – try auto band selection", disruptive: false,
        options: ["Band auto-selection set – improved", "Band was locked – unlocked, resolved", "Band auto-selection – no change"] },
      { text: "Raise fault with ISP / carrier – provide signal strength and IMEI", disruptive: false, fields: F.faultCarrier }
    ],
    "Packet Loss": [
      { text: "Check signal strength – low or marginal signal causes packet loss", disruptive: false, fields: F.signal },
      { text: "Check for local network congestion (peak evening hours)", disruptive: false,
        options: ["Peak hours – congestion likely", "Off-peak – congestion unlikely", "Congestion confirmed by carrier"] },
      { text: "Check for physical obstructions, metallic surfaces, or interference sources nearby", disruptive: false,
        options: ["No obstructions or interference sources found", "Obstruction identified and addressed – improved"] },
      { text: "Reposition device for better signal", disruptive: false,
        options: ["Repositioned – signal improved, loss reduced", "Repositioned – no significant improvement"] },
      { text: "Reboot device", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved"] },
      { text: "Raise fault with ISP – provide signal strength readings", disruptive: false, fields: F.faultCarrier }
    ],
    "Slow Internet": [
      { text: "Check signal strength – low signal reduces throughput significantly", disruptive: false, fields: F.signal },
      { text: "Run speed test – record download, upload, and ping", disruptive: false, fields: F.speed },
      { text: "Check for network congestion at current time", disruptive: false,
        options: ["Peak hours – congestion expected", "Off-peak – congestion not expected", "Carrier confirmed congestion in area"] },
      { text: "Reposition device for better signal", disruptive: false,
        options: ["Repositioned – speeds improved", "Repositioned – no improvement"] },
      { text: "Reboot device", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved"] },
      { text: "Check if data cap / fair use policy has been triggered", disruptive: false,
        options: ["Data cap not triggered – OK", "Data cap reached – speeds throttled", "Fair use policy applied – shaping confirmed"] },
      { text: "Raise fault with ISP – provide speed test results and signal readings", disruptive: false, fields: F.faultCarrier }
    ],
    "No Power": [
      { text: "Check power outlet is live", disruptive: false,
        options: ["Outlet live – confirmed", "Outlet dead – switched outlet"] },
      { text: "Check power cable is secured to device", disruptive: false,
        options: ["Cable secure – OK", "Cable reseated – power restored", "Cable reseated – no change"] },
      { text: "Inspect device for physical damage", disruptive: false,
        options: ["No visible damage", "Physical damage found – replacement required"] },
      { text: "Raise fault with ISP", disruptive: false, fields: F.faultCarrier }
    ]
  },
  "ADSL/VDSL": {
    "No Internet": [
      { text: "Confirm modem has power", disruptive: false,
        options: ["Power LED solid green – OK", "Power LED off – no power"] },
      { text: "Check for known carrier outages", disruptive: false,
        options: ["No outages listed", "Active outage confirmed", "Scheduled maintenance"] },
      { text: "Check DSL LED – solid = synced, flashing = training", disruptive: false,
        options: ["DSL LED solid – synced OK", "DSL LED flashing – training/not yet synced", "DSL LED off – no DSL signal"] },
      { text: "Ensure phone line / wall socket is active", disruptive: false,
        options: ["Wall socket active – dial tone present", "Wall socket dead – no dial tone"] },
      { text: "Remove or bypass any inline phone filters or splitters", disruptive: false,
        options: ["No filters/splitters present", "Filter removed – DSL synced", "Filter removed – no change"] },
      { text: "Try a different phone cable from wall to modem", disruptive: false,
        options: ["New cable – DSL synced, resolved", "New cable – no change"] },
      { text: "Reboot modem", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved"] },
      { text: "Test at the master / test socket to rule out internal wiring", disruptive: false,
        options: ["Master socket test – same result, not internal wiring", "Master socket test – works, internal wiring fault confirmed"] },
      { text: "Raise fault with ISP – provide sync speed and line stats", disruptive: false, fields: F.fault }
    ],
    "Packet Loss": [
      { text: "Check DSL sync rate in modem admin", disruptive: false, fields: F.dslSync },
      { text: "Inspect phone line cabling condition", disruptive: false,
        options: ["Cabling OK – no damage", "Damaged cable found – replaced"] },
      { text: "Run continuous ping to 8.8.8.8 and record results", disruptive: false, fields: F.ping },
      { text: "Reboot modem", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved"] },
      { text: "Raise fault with ISP – provide sync rates and SNR", disruptive: false, fields: F.fault }
    ],
    "Slow Internet": [
      { text: "Run speed test – record results", disruptive: false, fields: F.speed },
      { text: "Check DSL sync rate and SNR margin in modem admin", disruptive: false, fields: F.dslSync },
      { text: "Test wired vs wireless", disruptive: false,
        options: ["Wired OK, wireless slow – Wi-Fi issue", "Both slow – not Wi-Fi related"] },
      { text: "Reboot modem", disruptive: true,
        options: ["Rebooted – no change", "Rebooted – resolved"] },
      { text: "Raise fault with ISP with sync stats and test results", disruptive: false, fields: F.fault }
    ],
    "No Power": [
      { text: "Check power outlet is live", disruptive: false,
        options: ["Outlet live – confirmed", "Outlet dead – switched outlet"] },
      { text: "Check power adapter is correct for the modem", disruptive: false,
        options: ["Correct adapter – OK", "Wrong adapter found – correct adapter fitted"] },
      { text: "Raise fault with ISP – modem replacement", disruptive: false, fields: F.fault }
    ]
  },
  "Satellite": {
    "No Internet": [
      { text: "Confirm indoor modem has power – check Power LED", disruptive: false,
        options: ["Power LED on – OK", "Power LED off – no power"] },
      { text: "Check for known Sky Muster / satellite outages", disruptive: false,
        options: ["No outages listed", "Active outage confirmed", "Satellite service degraded – known issue"] },
      { text: "Check Satellite LED – solid = link established, flashing = acquiring signal", disruptive: false,
        options: ["Satellite LED solid – link established OK", "Satellite LED flashing – acquiring signal", "Satellite LED off – no satellite link"] },
      { text: "Check weather conditions – heavy rain and storms cause rain fade on satellite", disruptive: false,
        options: ["Weather clear – rain fade not expected", "Heavy rain/storm present – rain fade likely cause"] },
      { text: "Visually inspect dish from a safe vantage – must not be obstructed or physically moved", disruptive: false,
        options: ["Dish clear – no obstruction or movement", "Obstruction found on dish – cleared", "Dish appears to have moved – technician required"] },
      { text: "Check coaxial cable from outdoor dish to indoor modem", disruptive: false,
        options: ["Coax cable OK – no visible damage", "Cable damage or loose connector found – investigated"] },
      { text: "Power cycle indoor modem – unplug 60 sec, allow ~5 min to reacquire signal", disruptive: true,
        options: ["Power cycled – signal reacquired, resolved", "Power cycled – still acquiring signal", "Power cycled – no change"] },
      { text: "Raise fault with ISP – dish realignment may be required (requires technician)", disruptive: false, fields: F.fault },
      { text: "Escalate to scheduled technician visit for dish alignment check", disruptive: false,
        options: ["Technician visit booked", "Escalation submitted"] }
    ],
    "Packet Loss": [
      { text: "Check weather – satellite signal is affected by rain fade and heavy cloud", disruptive: false,
        options: ["Weather clear – rain fade not expected", "Heavy rain/storm present – rain fade likely cause"] },
      { text: "Check Satellite LED for intermittent drops", disruptive: false,
        options: ["Satellite LED stable solid – OK", "Satellite LED intermittently flashing – signal unstable"] },
      { text: "Run continuous ping – note that satellite latency of ~600ms is normal", disruptive: false, fields: F.satPing },
      { text: "Power cycle indoor modem", disruptive: true,
        options: ["Power cycled – no change", "Power cycled – resolved"] },
      { text: "Raise fault with ISP – provide ping results", disruptive: false, fields: F.fault }
    ],
    "Slow Internet": [
      { text: "Run speed test – record results", disruptive: false, fields: F.speed },
      { text: "Check data usage – Sky Muster has peak / off-peak quota limits", disruptive: false, fields: F.satData },
      { text: "Check weather conditions", disruptive: false,
        options: ["Weather clear – not the cause", "Rain/cloud present – may be affecting signal"] },
      { text: "Check signal strength in modem admin if accessible", disruptive: false, fields: F.satSignal },
      { text: "Power cycle modem", disruptive: true,
        options: ["Power cycled – no change", "Power cycled – resolved"] },
      { text: "Raise fault with ISP – provide speed test results and quota status", disruptive: false, fields: F.fault }
    ],
    "No Power": [
      { text: "Check power outlet is live", disruptive: false,
        options: ["Outlet live – confirmed", "Outlet dead – switched outlet"] },
      { text: "Check power cable to indoor modem", disruptive: false,
        options: ["Cable secure – OK", "Cable reseated – power restored", "Cable reseated – no change"] },
      { text: "Inspect modem for physical damage", disruptive: false,
        options: ["No visible damage", "Physical damage found – replacement required"] },
      { text: "Raise fault with ISP – hardware replacement required", disruptive: false, fields: F.fault }
    ]
  }
};

// ================================================================
// HARDWARE DATABASE
// ================================================================

const TECH_TYPES  = ["FTTP", "HFC", "FTTN/FTTB", "LTE/4G", "ADSL/VDSL", "Satellite"];
const ISSUE_TYPES = ["No Internet", "Packet Loss", "Slow Internet", "No Power"];

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

const lightsData = {
  "FTTP": {
    "Nokia G-010G-P": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["Power","Off","No power – check supply"],
      ["PON","Solid Green","Synchronised with NBN network"],
      ["PON","Flashing Green","Connecting to network"],
      ["PON","Off","No PON signal – check fibre connection"],
      ["LOS","Solid Red","Loss of signal – fibre fault or cut"],
      ["LOS","Off","Normal – no fault detected"],
      ["LAN1","Solid Green","Ethernet link active"],
      ["LAN1","Flashing Green","Ethernet traffic"],
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
      ["LAN","Solid Green","Ethernet link active"],
      ["LAN","Flashing Green","Ethernet traffic"]
    ],
    "Sercomm NF8 ONT": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["PON","Solid Green","Fibre link established"],
      ["PON","Flashing Green","Registering with network"],
      ["Internet","Solid Green","Internet active"],
      ["Internet","Off","No internet connection"],
      ["LAN","Solid Green","Ethernet link"],
      ["LAN","Flashing Green","Ethernet traffic"]
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
      ["DS","Flashing White","Scanning for downstream"],
      ["US","Solid White","Upstream channel locked"],
      ["US","Flashing White","Ranging / upstream registration"],
      ["Online","Solid White","Registered and connected"],
      ["Online","Flashing White","Connecting to NBN"],
      ["Online","Off","Not connected – check DS/US"]
    ]
  },
  "FTTN/FTTB": {
    "Sagemcom F@ST 3864OP": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["DSL","Solid Green","VDSL sync established"],
      ["DSL","Flashing Green","Training / syncing with DSLAM"],
      ["DSL","Off","No DSL signal – check line or filters"],
      ["Internet","Solid Green","Internet connection active"],
      ["Internet","Flashing Green","Internet traffic"],
      ["Internet","Off","No internet – check DSL status"],
      ["WLAN","Solid Green","Wi-Fi active"],
      ["WLAN","Flashing Green","Wi-Fi traffic"],
      ["LAN 1-4","Solid Green","Ethernet link active"]
    ],
    "Netgear DM200": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["DSL","Solid Green","DSL sync established"],
      ["DSL","Flashing Amber","Training / waiting for line"],
      ["DSL","Off","No DSL signal"],
      ["Internet","Solid Green","Internet active"],
      ["Internet","Solid Amber","Connected to modem – no internet"],
      ["Internet","Off","Not connected"]
    ]
  },
  "LTE/4G": {
    "Nokia FastMile 4G": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["Signal","3 bars solid","Strong LTE signal"],
      ["Signal","2 bars solid","Moderate signal"],
      ["Signal","1 bar solid","Weak signal – consider repositioning"],
      ["Signal","Off","No signal detected"],
      ["Internet","Solid Green","Internet active"],
      ["Internet","Off","No internet connection"],
      ["LAN","Solid Green","Ethernet link active"],
      ["LAN","Flashing Green","Ethernet traffic"]
    ],
    "Wavesat LTE CPE": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["LTE","Solid Green","LTE connected"],
      ["LTE","Flashing Green","Searching for signal"],
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
      ["DSL","Off","No DSL signal – check line and filters"],
      ["Internet","Solid Green","Internet connection active"],
      ["Internet","Off","No internet"],
      ["WLAN","Solid Green","Wi-Fi active"],
      ["LAN","Solid Green","Ethernet link active"]
    ],
    "Netgear D7800": [
      ["LED","Status","Meaning"],
      ["Power","Solid White","Device powered on"],
      ["DSL","Solid Green","DSL sync established"],
      ["DSL","Flashing Amber","Training"],
      ["Internet","Solid White","Internet active"],
      ["Internet","Solid Amber","No internet – DSL sync present"],
      ["2.4 GHz","Solid White","2.4 GHz Wi-Fi active"],
      ["5 GHz","Solid White","5 GHz Wi-Fi active"]
    ]
  },
  "Satellite": {
    "ViaSat SurfBeam 2 (Indoor)": [
      ["LED","Status","Meaning"],
      ["Power","Solid Green","Device powered on"],
      ["Satellite","Solid Green","Satellite link established"],
      ["Satellite","Flashing Green","Acquiring satellite signal"],
      ["Satellite","Off","No satellite signal – check dish alignment and weather"],
      ["Internet","Solid Green","Internet active"],
      ["Internet","Off","No internet connection"],
      ["LAN","Solid Green","Ethernet link active"],
      ["LAN","Flashing Green","Ethernet traffic"]
    ],
    "Sky Muster Dish": [
      ["Check","Status","Notes"],
      ["Dish alignment","Correct","Pointed to Sky Muster at 140.0°E"],
      ["Dish alignment","Off-axis","Re-align – call installer, do not adjust yourself"],
      ["Coax cable","Intact","Coax from dish to indoor modem connected and undamaged"],
      ["Coax cable","Damaged","Replace coax cable and check F-connectors"],
      ["LNB","Secure","LNB attached to dish arm without movement"],
      ["Weather","Clear","Good satellite signal expected"],
      ["Weather","Heavy rain / storm","Rain fade expected – wait for weather to pass"]
    ]
  }
};

// ================================================================
// APPLICATION STATE
// ================================================================

const state = {
  tech:              null,
  issue:             null,
  steps:             [],
  modelIndex:        0,
  imageTab:          0,
  timerSeconds:      0,
  timerInterval:     null,
  pendingStepIndex:  null,
  pendingResolution: false,
  isDark:            true,
  resolved:          false,
  resolvedAtStep:    null,
  sessionStartTime:  null,
  faultStartTime:    '',
};

// ================================================================
// INIT
// ================================================================

function showFaultDetailsCard() {
  document.getElementById('faultStartInput').value = '';
  document.getElementById('sessionStartDisplay').textContent =
    state.sessionStartTime
      ? state.sessionStartTime.toLocaleString('en-AU', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      : '—';
  show('faultDetailsCard');
}

function initResizeHandle() {
  const handle = document.getElementById('eqResizeHandle');
  const layout  = document.querySelector('.app-layout');

  handle.addEventListener('mousedown', e => {
    if (window.innerWidth <= 768) return; // mobile: no resize
    e.preventDefault();

    const startX     = e.clientX;
    const startWidth = document.getElementById('equipmentPanel').getBoundingClientRect().width;

    document.body.style.cursor    = 'col-resize';
    document.body.style.userSelect = 'none';

    function onMove(ev) {
      const dx   = startX - ev.clientX; // drag left = wider
      const newW = Math.max(220, Math.min(Math.floor(window.innerWidth * 0.5), startWidth + dx));
      layout.style.gridTemplateColumns = `var(--sidebar-w) 1fr ${newW}px`;
    }

    function onUp() {
      document.body.style.cursor    = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

function init() {
  renderTechGrid();
  renderIssueGrid();
  setupInfoTabs();
  setupMobileTabs();
  bindButtons();
  bindKeyboard();
  initResizeHandle();
}

// ================================================================
// GRID RENDERING
// ================================================================

function renderTechGrid() {
  const grid = document.getElementById('techGrid');
  grid.innerHTML = '';
  TECH_TYPES.forEach(tech => {
    const btn = document.createElement('button');
    btn.className = 'filter-item' + (state.tech === tech ? ' selected' : '');
    btn.textContent = tech;
    btn.addEventListener('click', () => selectTech(tech));
    grid.appendChild(btn);
  });
}

function renderIssueGrid() {
  const grid = document.getElementById('issueGrid');
  grid.innerHTML = '';
  ISSUE_TYPES.forEach(issue => {
    const btn = document.createElement('button');
    btn.className = 'filter-item' + (state.issue === issue ? ' selected' : '');
    btn.textContent = issue;
    btn.addEventListener('click', () => selectIssue(issue));
    grid.appendChild(btn);
  });
}

// ================================================================
// SELECTION
// ================================================================

function selectTech(tech) {
  state.tech = tech;
  state.modelIndex = 0;
  state.imageTab = 0;
  renderTechGrid();
  renderEquipmentPanel();
  if (state.issue) startSession();
}

function selectIssue(issue) {
  state.issue = issue;
  renderIssueGrid();
  if (state.tech) startSession();
}

// ================================================================
// SESSION
// ================================================================

function startSession() {
  const raw = (stepsData[state.tech] && stepsData[state.tech][state.issue]) || [];
  state.steps = raw.map((s, i) => ({
    ...s,
    status:          i === 0 ? 'active' : 'pending',
    result:          '',
    fieldValues:     {},
    resolvedChecked: false
  }));
  state.resolved        = false;
  state.resolvedAtStep  = null;
  state.sessionStartTime = new Date();
  state.faultStartTime  = '';

  stopTimer();
  state.timerSeconds = 0;
  startTimer();

  document.getElementById('resetBtn').hidden = false;
  show('sessionView');
  hide('emptyState');

  document.getElementById('sessionTechBadge').textContent  = state.tech;
  document.getElementById('sessionIssueBadge').textContent = state.issue;

  showFaultDetailsCard();
  renderSteps();
  updateProgress();
}

function resetSession() {
  stopTimer();
  Object.assign(state, {
    tech: null, issue: null, steps: [],
    modelIndex: 0, imageTab: 0, timerSeconds: 0,
    pendingStepIndex: null, pendingResolution: false, resolved: false, resolvedAtStep: null,
    sessionStartTime: null, faultStartTime: '',
  });

  document.getElementById('resetBtn').hidden = true;
  document.getElementById('sessionTimer').hidden = true;
  hide('sessionView');
  hide('faultDetailsCard');
  show('emptyState');
  hide('equipmentView');
  show('equipmentEmpty');
  renderTechGrid();
  renderIssueGrid();
}

// ================================================================
// STEP RENDERING
// ================================================================

function buildFieldResult(fields, values) {
  return fields
    .map(f => {
      const v = (values[f.key] || '').toString().trim();
      if (!v) return null;
      const unit = f.unit ? ' ' + f.unit : '';
      return f.label + ': ' + v + unit;
    })
    .filter(Boolean)
    .join(' · ');
}

function renderSteps() {
  const list = document.getElementById('stepsList');
  list.innerHTML = '';

  state.steps.forEach((step, i) => {
    const isCancelled = state.resolved && step.status === 'pending';
    const card = document.createElement('div');
    card.className = `step-card ${isCancelled ? 'cancelled' : step.status}`;
    card.id = `step-${i}`;

    // Number bubble
    const num = document.createElement('div');
    num.className = 'step-number';
    num.textContent = step.status === 'done' ? '✓' : step.status === 'skipped' ? '–' : i + 1;

    // Body
    const body = document.createElement('div');
    body.className = 'step-body';

    const textEl = document.createElement('div');
    textEl.className = 'step-text';
    textEl.textContent = step.text;
    body.appendChild(textEl);

    if (step.disruptive) {
      const meta = document.createElement('div');
      meta.className = 'step-meta';
      const badge = document.createElement('span');
      badge.className = 'risk-badge risk-disruptive';
      badge.textContent = '⚠ Service Disruption';
      meta.appendChild(badge);
      body.appendChild(meta);
    }

    const top = document.createElement('div');
    top.className = 'step-card-top';
    top.appendChild(num);
    top.appendChild(body);
    card.appendChild(top);

    if (step.status === 'active' && !state.resolved) {
      // ── Result capture ──
      const resultArea = document.createElement('div');
      resultArea.className = 'step-result-area';

      const resultLabel = document.createElement('div');
      resultLabel.className = 'result-label';
      resultLabel.textContent = 'Result';
      resultArea.appendChild(resultLabel);

      if (step.fields) {
        // ── Structured fields (speed test, ping, DSL sync, signal, raise fault…) ──
        const fieldsGrid = document.createElement('div');
        fieldsGrid.className = 'step-fields-grid';

        step.fields.forEach(f => {
          const item = document.createElement('div');
          item.className = 'step-field-item';

          const lbl = document.createElement('label');
          lbl.className = 'step-field-label';
          lbl.textContent = f.label;
          item.appendChild(lbl);

          const inputWrap = document.createElement('div');
          inputWrap.className = 'step-field-input-wrap';

          let control;
          if (f.inputType === 'select') {
            control = document.createElement('select');
            control.className = 'step-field-select';
            const blank = document.createElement('option');
            blank.value = '';
            blank.textContent = '— select —';
            control.appendChild(blank);
            f.options.forEach(o => {
              const opt = document.createElement('option');
              opt.value = o;
              opt.textContent = o;
              if (step.fieldValues[f.key] === o) opt.selected = true;
              control.appendChild(opt);
            });
          } else {
            control = document.createElement('input');
            control.className = 'step-field-input';
            control.type = f.inputType || 'text';
            control.placeholder = f.placeholder || '';
            if (f.inputType === 'number') { control.min = '0'; control.step = 'any'; }
            control.value = step.fieldValues[f.key] !== undefined ? step.fieldValues[f.key] : '';
          }

          control.addEventListener('change', () => {
            step.fieldValues[f.key] = control.value;
            step.result = buildFieldResult(step.fields, step.fieldValues);
          });
          control.addEventListener('input', () => {
            step.fieldValues[f.key] = control.value;
            step.result = buildFieldResult(step.fields, step.fieldValues);
          });

          inputWrap.appendChild(control);
          if (f.unit) {
            const unit = document.createElement('span');
            unit.className = 'step-field-unit';
            unit.textContent = f.unit;
            inputWrap.appendChild(unit);
          }
          item.appendChild(inputWrap);
          fieldsGrid.appendChild(item);
        });
        resultArea.appendChild(fieldsGrid);

      } else if (step.options) {
        // ── Single-select radio options ──
        const optList = document.createElement('div');
        optList.className = 'step-option-list';
        step.options.forEach(opt => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'step-option-btn' + (step.result === opt ? ' selected' : '');
          btn.textContent = opt;
          btn.addEventListener('click', () => {
            step.result = opt;
            // Update selection highlight without full re-render
            optList.querySelectorAll('.step-option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
          });
          optList.appendChild(btn);
        });
        resultArea.appendChild(optList);

      } else {
        // ── Fallback: free-text textarea ──
        const textarea = document.createElement('textarea');
        textarea.className = 'result-input';
        textarea.placeholder = 'What did you observe or do?';
        textarea.rows = 2;
        textarea.value = step.result || '';
        textarea.addEventListener('input', e => { step.result = e.target.value; });
        resultArea.appendChild(textarea);
      }

      card.appendChild(resultArea);

      // ── Actions ──
      const actions = document.createElement('div');
      actions.className = 'step-actions';

      // Primary: Mark Done → next step automatically, no prompts
      const doneBtn = document.createElement('button');
      doneBtn.className = 'btn-done';
      doneBtn.textContent = 'Mark Done';
      doneBtn.addEventListener('click', () => completeStep(i));

      // Skip: move on without recording a result
      const skipBtn = document.createElement('button');
      skipBtn.className = 'btn-skip';
      skipBtn.textContent = 'Skip';
      skipBtn.addEventListener('click', () => skipStep(i));

      // Divider
      const divider = document.createElement('span');
      divider.className = 'step-actions-divider';

      // Issue Fixed: deliberate single-click — marks done AND ends session
      const fixedBtn = document.createElement('button');
      fixedBtn.className = 'btn-issue-fixed';
      fixedBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Issue Fixed';
      fixedBtn.title = 'Mark this step as done and close the session as resolved';
      fixedBtn.addEventListener('click', () => completeAndResolve(i));

      actions.appendChild(doneBtn);
      actions.appendChild(skipBtn);
      actions.appendChild(divider);
      actions.appendChild(fixedBtn);
      card.appendChild(actions);

    } else if (step.status === 'done') {
      // ── Recorded result ──
      if (step.result) {
        const rd = document.createElement('div');
        rd.className = 'step-result-display';
        const arrow = document.createElement('span');
        arrow.className = 'result-arrow';
        arrow.textContent = '→';
        const resultText = document.createElement('span');
        resultText.textContent = step.result;
        rd.appendChild(arrow);
        rd.appendChild(resultText);
        card.appendChild(rd);
      }

      if (state.resolvedAtStep === i) {
        const tag = document.createElement('div');
        tag.className = 'step-resolved-tag';
        tag.textContent = '✓ Issue resolved here';
        card.appendChild(tag);
      } else {
        const lbl = document.createElement('div');
        lbl.className = 'step-status-label step-status-done';
        lbl.textContent = '✓ Completed';
        card.appendChild(lbl);
      }

    } else if (step.status === 'skipped') {
      if (step.result) {
        const rd = document.createElement('div');
        rd.className = 'step-result-display';
        rd.textContent = step.result;
        card.appendChild(rd);
      }
      const lbl = document.createElement('div');
      lbl.className = 'step-status-label step-status-skipped';
      lbl.textContent = 'Skipped';
      card.appendChild(lbl);
    }

    list.appendChild(card);
  });

  renderResolvedBanner();

  const active = document.querySelector('.step-card.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function snapshotResult(index) {
  // For fields-type steps the result is kept up-to-date via input listeners.
  // For fallback textarea, snapshot it now in case listener missed a change.
  const textarea = document.querySelector(`#step-${index} .result-input`);
  if (textarea) state.steps[index].result = textarea.value.trim();
}

function completeStep(index) {
  snapshotResult(index);

  if (state.steps[index].disruptive) {
    state.pendingStepIndex = index;
    document.getElementById('confirmModalText').textContent =
      `"${state.steps[index].text}" will disrupt the client's internet connection. Are you sure you want to proceed?`;
    show('confirmModalBackdrop');
    return;
  }
  doCompleteStep(index);
}

function doCompleteStep(index) {
  state.steps[index].status = 'done';
  activateNext(index);
  renderSteps();
  updateProgress();
}

// Called from the "Issue Fixed" button on the active step card
function completeAndResolve(index) {
  snapshotResult(index);

  if (state.steps[index].disruptive) {
    // Reuse disruptive confirm, but flag that we should resolve after
    state.pendingStepIndex  = index;
    state.pendingResolution = true;
    document.getElementById('confirmModalText').textContent =
      `"${state.steps[index].text}" will disrupt the client's connection. Proceed and mark the issue as resolved?`;
    show('confirmModalBackdrop');
    return;
  }
  state.steps[index].status = 'done';
  markSessionResolved(index);
}

function markSessionResolved(resolvedIdx) {
  // resolvedIdx = the step that fixed the issue; defaults to last completed step
  if (resolvedIdx === undefined) {
    resolvedIdx = 0;
    state.steps.forEach((s, i) => { if (s.status === 'done') resolvedIdx = i; });
  }
  state.resolved       = true;
  state.resolvedAtStep = resolvedIdx;
  stopTimer();
  renderSteps();
  updateProgress();
  generateTicket();
}

function skipStep(index) {
  state.steps[index].status          = 'skipped';
  state.steps[index].resolvedChecked = true;
  activateNext(index);
  renderSteps();
  updateProgress();
}

function renderResolvedBanner() {
  const existing = document.getElementById('resolvedBanner');
  if (existing) existing.remove();

  if (!state.resolved) return;

  const banner = document.createElement('div');
  banner.id = 'resolvedBanner';
  banner.className = 'resolved-banner';

  const iconEl = document.createElement('div');
  iconEl.className = 'resolved-banner-icon';
  iconEl.textContent = '✓';

  const content = document.createElement('div');
  content.className = 'resolved-banner-content';

  const title = document.createElement('strong');
  title.textContent = 'Issue Resolved';

  const detail = document.createElement('span');
  const resolvedStep = state.steps[state.resolvedAtStep];
  detail.textContent = `Fixed at step ${state.resolvedAtStep + 1}: ${resolvedStep.text}`;

  content.appendChild(title);
  content.appendChild(detail);
  banner.appendChild(iconEl);
  banner.appendChild(content);

  const sessionView = document.getElementById('sessionView');
  sessionView.insertBefore(banner, sessionView.firstChild);
}

function activateNext(from) {
  for (let i = from + 1; i < state.steps.length; i++) {
    if (state.steps[i].status === 'pending') {
      state.steps[i].status = 'active';
      return;
    }
  }
}

function updateProgress() {
  const total = state.steps.length;
  const done  = state.steps.filter(s => s.status === 'done').length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressText').textContent = `${done} / ${total} complete`;
}

// ================================================================
// EQUIPMENT PANEL
// ================================================================

function renderEquipmentPanel() {
  if (!state.tech || !techInfo[state.tech]) return;

  hide('equipmentEmpty');
  show('equipmentView');

  const models = techInfo[state.tech];
  const model  = models[state.modelIndex];

  document.getElementById('modelTitle').textContent = model.model;
  document.getElementById('modelIndex').textContent =
    models.length > 1 ? `Model ${state.modelIndex + 1} of ${models.length}` : '';

  renderImageTabs(model);
  renderEquipmentImage(model);
  renderLightsTable();
}

function renderEquipmentImage(model) {
  const wrap = document.getElementById('equipmentImageWrap');
  wrap.innerHTML = '';

  const imgData = model.images[state.imageTab] || model.images[0];
  if (!imgData) { wrap.appendChild(makePlaceholder('No image available')); return; }

  const img = document.createElement('img');
  img.src = imgData.src;
  img.alt = `${model.model} – ${imgData.caption}`;
  img.addEventListener('click', () => openLightbox(imgData.src, `${model.model} – ${imgData.caption}`));
  img.onerror = () => {
    wrap.innerHTML = '';
    wrap.appendChild(makePlaceholder(imgData.caption));
  };
  wrap.appendChild(img);
}

function renderImageTabs(model) {
  const bar = document.getElementById('imageTabs');
  bar.innerHTML = '';

  const labels = ['Front', 'Back', 'Side', 'Detail'];
  model.images.forEach((imgData, i) => {
    const btn = document.createElement('button');
    btn.className = 'img-tab' + (i === state.imageTab ? ' active' : '');
    btn.textContent = labels[i] || `View ${i + 1}`;
    btn.addEventListener('click', () => {
      state.imageTab = i;
      document.querySelectorAll('.img-tab').forEach((t, j) => t.classList.toggle('active', j === i));
      renderEquipmentImage(model);
    });
    bar.appendChild(btn);
  });

  bar.style.display = model.images.length <= 1 ? 'none' : 'flex';
}

function renderLightsTable() {
  const container = document.getElementById('ledPanel');
  container.innerHTML = '';

  if (!techInfo[state.tech]) return;
  const model     = techInfo[state.tech][state.modelIndex];
  const tableData = lightsData[state.tech] && lightsData[state.tech][model.model];

  if (!tableData || !tableData.length) {
    container.innerHTML = '<p style="color:var(--text-3);font-size:0.78rem;padding:8px 0;">LED data not yet available for this model.</p>';
    return;
  }

  const table = document.createElement('table');
  table.className = 'led-table';

  tableData.forEach((row, ri) => {
    const tr = document.createElement('tr');
    row.forEach((cell, ci) => {
      const el = ri === 0 ? document.createElement('th') : document.createElement('td');

      // Add LED dot for non-header, non-last (meaning) columns
      if (ri > 0 && ci < row.length - 1) {
        const dot = makeLedDot(cell);
        if (dot) el.appendChild(dot);
      }
      el.appendChild(document.createTextNode(cell));
      tr.appendChild(el);
    });
    table.appendChild(tr);
  });

  container.appendChild(table);
}

function makeLedDot(status) {
  const s = status.toLowerCase();
  let cls = null;
  if (s.includes('green') || s === 'on')              cls = 'led-green';
  else if (s.includes('red'))                          cls = 'led-red';
  else if (s.includes('amber') || s.includes('orange')) cls = 'led-amber';
  else if (s.includes('white'))                        cls = 'led-white';
  else if (s === 'off')                                cls = 'led-off';
  if (!cls) return null;
  const flashing = s.includes('flash') || s.includes('blink');
  const dot = document.createElement('span');
  dot.className = `led-dot ${cls}${flashing ? ' led-flashing' : ''}`;
  return dot;
}

function makePlaceholder(caption) {
  const div = document.createElement('div');
  div.className = 'img-placeholder';
  div.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    </svg>
    <span>Photo needed</span>
    <small>${caption || ''}</small>`;
  return div;
}

// ================================================================
// TIMER
// ================================================================

function startTimer() {
  const el = document.getElementById('sessionTimer');
  el.hidden = false;
  state.timerInterval = setInterval(() => {
    state.timerSeconds++;
    el.textContent = fmtTime(state.timerSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function fmtTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ================================================================
// TICKET GENERATION
// ================================================================

function generateTicket() {
  if (!state.tech || !state.issue) return;

  const now       = new Date();
  const dateStr   = now.toLocaleDateString('en-AU');
  const timeStr   = now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
  const modelName = techInfo[state.tech] ? techInfo[state.tech][state.modelIndex].model : 'Unknown';
  const outcome   = state.resolved
    ? `Resolved – fixed at step ${state.resolvedAtStep + 1}`
    : 'Unresolved – further action required';

  // Fault / session times
  let faultStartStr = '';
  if (state.faultStartTime) {
    const fd = new Date(state.faultStartTime);
    faultStartStr = fd.toLocaleString('en-AU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
  const sessionStartStr = state.sessionStartTime
    ? state.sessionStartTime.toLocaleString('en-AU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    : timeStr;

  // Build the chronological steps log with results inline
  let stepLog = '';
  state.steps.forEach((s, i) => {
    if (s.status === 'pending' && state.resolved) return; // skip cancelled steps
    const num    = String(i + 1).padStart(2, ' ');
    const flag   = s.disruptive ? ' [DISRUPTIVE]' : '';
    const marker = s.status === 'done' ? '✓' : s.status === 'skipped' ? '–' : '○';
    stepLog += `  ${num}. ${marker} ${s.text}${flag}\n`;
    if (s.result) {
      stepLog += `        Result: ${s.result}\n`;
    }
    if (state.resolvedAtStep === i) {
      stepLog += `        → Issue resolved here\n`;
    }
  });

  // Remaining steps (only when session not resolved)
  let remainingLog = '';
  if (!state.resolved) {
    const remaining = state.steps.filter(s => s.status === 'pending' || s.status === 'active');
    if (remaining.length) {
      remainingLog = `\nREMAINING STEPS:\n` +
        remaining.map((s, i) => {
          const flag = s.disruptive ? ' [DISRUPTIVE]' : '';
          return `  ${i + 1}. ${s.text}${flag}`;
        }).join('\n') + '\n';
    }
  }

  const completedCount = state.steps.filter(s => s.status === 'done').length;
  const skippedCount   = state.steps.filter(s => s.status === 'skipped').length;

  const faultLine   = faultStartStr   ? `\nFault started: ${faultStartStr}` : '';
  const sessionLine = `\nTroubleshooting started: ${sessionStartStr}`;

  const ticket =
`TROUBLESHOOTING SESSION
──────────────────────────────────
Date:       ${dateStr} ${timeStr}${faultLine}${sessionLine}
Duration:   ${fmtTime(state.timerSeconds)}
Technology: ${state.tech}
Device:     ${modelName}
Issue:      ${state.issue}
Outcome:    ${outcome}
──────────────────────────────────

STEPS LOG (${completedCount} completed, ${skippedCount} skipped):
${stepLog || '  No steps completed\n'}${remainingLog}
──────────────────────────────────
Generated by Tracely`;

  document.getElementById('ticketPre').textContent = ticket;
  show('ticketModalBackdrop');
}

// ================================================================
// BIND BUTTONS
// ================================================================

function bindButtons() {
  // Fault start time input
  document.getElementById('faultStartInput').addEventListener('change', e => {
    state.faultStartTime = e.target.value;
  });

  // Reset
  document.getElementById('resetBtn').addEventListener('click', resetSession);

  // Equipment model nav
  document.getElementById('prevModelBtn').addEventListener('click', () => {
    if (!state.tech || !techInfo[state.tech]) return;
    const len = techInfo[state.tech].length;
    state.modelIndex = (state.modelIndex - 1 + len) % len;
    state.imageTab = 0;
    renderEquipmentPanel();
  });
  document.getElementById('nextModelBtn').addEventListener('click', () => {
    if (!state.tech || !techInfo[state.tech]) return;
    const len = techInfo[state.tech].length;
    state.modelIndex = (state.modelIndex + 1) % len;
    state.imageTab = 0;
    renderEquipmentPanel();
  });

  // Ticket modal
  document.getElementById('generateTicketBtn').addEventListener('click', generateTicket);
  document.getElementById('closeModalBtn').addEventListener('click', () => hide('ticketModalBackdrop'));
  document.getElementById('ticketModalBackdrop').addEventListener('click', e => {
    if (e.target === e.currentTarget) hide('ticketModalBackdrop');
  });
  document.getElementById('copyTicketBtn').addEventListener('click', () => {
    const text = document.getElementById('ticketPre').textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copyTicketBtn');
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy to Clipboard'; }, 2000);
    });
  });

  // Confirm modal (disruptive step)
  document.getElementById('confirmCancelBtn').addEventListener('click', () => {
    state.pendingStepIndex  = null;
    state.pendingResolution = false;
    hide('confirmModalBackdrop');
  });
  document.getElementById('confirmProceedBtn').addEventListener('click', () => {
    hide('confirmModalBackdrop');
    if (state.pendingStepIndex !== null) {
      const idx = state.pendingStepIndex;
      state.pendingStepIndex = null;
      if (state.pendingResolution) {
        state.pendingResolution = false;
        state.steps[idx].status = 'done';
        markSessionResolved(idx);
      } else {
        doCompleteStep(idx);
      }
    }
  });
  document.getElementById('confirmModalBackdrop').addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      state.pendingStepIndex = null;
      hide('confirmModalBackdrop');
    }
  });

  // Lightbox
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeLightbox();
  });

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Search filter
  document.getElementById('searchInput').addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('#techGrid .filter-item').forEach(btn => {
      btn.style.display = !q || btn.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
    document.querySelectorAll('#issueGrid .filter-item').forEach(btn => {
      btn.style.display = !q || btn.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// ================================================================
// INFO TABS (LED Status / Port Guide)
// ================================================================

function setupInfoTabs() {
  document.querySelectorAll('.info-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.info-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.target;
      document.getElementById('ledPanel').classList.toggle('d-none', target !== 'ledPanel');
      document.getElementById('portsPanel').classList.toggle('d-none', target !== 'portsPanel');
    });
  });
}

// ================================================================
// MOBILE TABS
// ================================================================

function setupMobileTabs() {
  document.querySelectorAll('.mobile-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.mobile-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const panel = tab.dataset.panel;
      document.getElementById('sidebar').classList.remove('mobile-visible');
      document.getElementById('equipmentPanel').classList.remove('mobile-visible');
      document.getElementById('mainPanel').classList.remove('mobile-hidden');
      if (panel === 'sidebar') {
        document.getElementById('sidebar').classList.add('mobile-visible');
        document.getElementById('mainPanel').classList.add('mobile-hidden');
      } else if (panel === 'equipment') {
        document.getElementById('equipmentPanel').classList.add('mobile-visible');
        document.getElementById('mainPanel').classList.add('mobile-hidden');
      }
    });
  });
}

// ================================================================
// LIGHTBOX
// ================================================================

function openLightbox(src, caption) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxCaption').textContent = caption;
  show('lightbox');
}

function closeLightbox() {
  hide('lightbox');
}

// ================================================================
// THEME
// ================================================================

function toggleTheme() {
  state.isDark = !state.isDark;
  document.body.className = state.isDark ? 'dark' : 'light';
  document.getElementById('themeIconDark').hidden  =  state.isDark ? false : true;
  document.getElementById('themeIconLight').hidden = !state.isDark ? false : true;
}

// ================================================================
// KEYBOARD
// ================================================================

function bindKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox();
      hide('ticketModalBackdrop');
      hide('confirmModalBackdrop');
      state.pendingStepIndex = null;
    }
  });
}

// ================================================================
// UTILITIES
// ================================================================

function show(id) { document.getElementById(id).classList.remove('d-none'); }
function hide(id) { document.getElementById(id).classList.add('d-none'); }

// ================================================================
// BOOT
// ================================================================

init();
