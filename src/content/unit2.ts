import type { Lesson } from '../types'

// Technical references: 3GPP TS 23.018, 23.060 and 23.040; OMA WAP 1.x specifications;
// IETF RFC 5944 and 6275; Bluetooth SIG The Bluetooth LE Primer; IEEE 802.16 WirelessMAN.
const lessons: Lesson[] = [
  {
    slug: "gsm",
    title: "GSM Architecture and Call Routing",
    short: "GSM call routing",
    question: "How does a call find a handset that has roamed into another switching area?",
    mode: "map",
    nodes: [
      {
        id: "gmsc",
        label: "GMSC",
        kind: "gate",
        x: 78,
        y: 155,
        detail: "The Gateway Mobile-services Switching Centre receives the incoming call and requests routing information from the home network."
      },
      {
        id: "hlr",
        label: "HLR",
        kind: "db",
        x: 225,
        y: 65,
        detail: "The Home Location Register stores subscriber information, including which serving MSC/VLR currently handles the subscriber."
      },
      {
        id: "msc",
        label: "MSC",
        kind: "server",
        x: 300,
        y: 195,
        detail: "The serving Mobile-services Switching Centre routes the call and coordinates paging in the registered location area."
      },
      {
        id: "vlr",
        label: "VLR",
        kind: "db",
        x: 410,
        y: 75,
        detail: "The Visitor Location Register keeps temporary subscriber and location-area information for the serving MSC. MSC and VLR are often integrated."
      },
      {
        id: "bsc",
        label: "BSC",
        kind: "router",
        x: 425,
        y: 220,
        detail: "The Base Station Controller manages multiple radio base stations and forwards paging requests to the relevant cells."
      },
      {
        id: "bts",
        label: "BTS",
        kind: "tower",
        x: 545,
        y: 125,
        detail: "The Base Transceiver Station sends and receives the radio signals in its cell, including paging messages."
      },
      {
        id: "ms",
        label: "Handset",
        kind: "phone",
        x: 610,
        y: 250,
        detail: "The mobile station listens for its paging identity, responds over the radio and alerts the user."
      }
    ],
    steps: [
      {
        label: "Dial",
        title: "A call arrives at the gateway",
        body: "The caller dials the subscriber’s usual number. The GMSC receives the call before it knows which switch currently serves the handset.",
        idea: "A dialled number identifies the subscriber even as the handset changes cells.",
        active: ["gmsc"],
        value: "Incoming call"
      },
      {
        label: "Locate",
        title: "Ask the home register",
        body: "The GMSC sends a routing enquiry to the HLR. A previous location update has told the HLR which MSC/VLR serves this subscriber.",
        idea: "The home database knows the serving switch. Paging will find the handset within its location area.",
        active: ["gmsc","hlr"],
        links: [["gmsc","hlr","routing enquiry"]],
        value: "Routing enquiry"
      },
      {
        label: "Get route",
        title: "Allocate a roaming number",
        body: "The HLR asks the serving MSC/VLR for a temporary mobile station roaming number. The number returns to the GMSC via the HLR.",
        idea: "The temporary number gives the switching network a route to the serving MSC.",
        active: ["hlr","vlr","gmsc"],
        links: [["hlr","vlr","request MSRN"],["vlr","hlr","MSRN"],["hlr","gmsc","route"]],
        value: "MSRN allocated"
      },
      {
        label: "Route",
        title: "Reach the serving switch",
        body: "The GMSC uses the roaming number to route the call to the serving MSC. The MSC consults the local subscriber information.",
        idea: "The VLR supplies local context needed to deliver the call.",
        active: ["gmsc","msc","vlr"],
        links: [["gmsc","msc","call setup"],["msc","vlr","context"]],
        value: "Serving MSC"
      },
      {
        label: "Page",
        title: "Find the cell with the handset",
        body: "The MSC requests paging in the registered location area. The BSC distributes the request, and the BTS broadcasts the paging identity.",
        idea: "Paging can cover several cells because the last registered location area is coarser than a cell.",
        active: ["msc","bsc","bts","ms"],
        links: [["msc","bsc","page"],["bsc","bts","page"],["bts","ms","radio page"]],
        value: "Paging"
      },
      {
        label: "Connect",
        title: "Answer and open the speech path",
        body: "The handset responds. After radio assignment and call setup, answering connects speech through the BTS, BSC and switches.",
        idea: "HLR and VLR supply signaling data. The speech path runs through the radio and switching equipment.",
        active: ["ms","bts","bsc","msc","gmsc"],
        links: [["ms","bts","voice"],["bts","bsc","voice"],["bsc","msc","voice"],["msc","gmsc","voice"]],
        value: "Speech connected"
      }
    ]
  },
  {
    slug: "gprs",
    title: "GPRS Architecture and Applications",
    short: "GPRS packet delivery",
    question: "How does a small sensor update reach an internet service over a GSM radio network?",
    mode: "map",
    nodes: [
      {
        id: "ms",
        label: "Handset",
        kind: "phone",
        x: 78,
        y: 205,
        detail: "The mobile station initiates packet service and sends or receives IP packets over GPRS."
      },
      {
        id: "radio",
        label: "BSS / PCU",
        kind: "tower",
        x: 215,
        y: 90,
        detail: "The base station subsystem and packet control unit schedule packet radio resources and connect them to the SGSN."
      },
      {
        id: "sgsn",
        label: "SGSN",
        kind: "server",
        x: 345,
        y: 210,
        detail: "The Serving GPRS Support Node manages packet mobility and relays user traffic toward the subscriber’s current radio access."
      },
      {
        id: "ggsn",
        label: "GGSN",
        kind: "gate",
        x: 466,
        y: 90,
        detail: "The Gateway GPRS Support Node connects the GPRS packet core to an external packet data network."
      },
      {
        id: "app",
        label: "Data service",
        kind: "cloud",
        x: 595,
        y: 210,
        detail: "The external application exchanges ordinary IP packets with the mobile device."
      }
    ],
    steps: [
      {
        label: "Attach",
        title: "Register for packet service",
        body: "The handset attaches through the radio network. The SGSN establishes the mobility and security context needed for GPRS service.",
        idea: "Attach makes the device known to the serving packet network.",
        active: ["ms","radio","sgsn"],
        links: [["ms","radio","attach"],["radio","sgsn","attach"]],
        value: "Attached"
      },
      {
        label: "Activate",
        title: "Prepare an IP data session",
        body: "PDP context activation associates the mobile’s packet address and selected access point with a tunnel between SGSN and GGSN.",
        idea: "A PDP context tells the packet core how to deliver traffic for this session.",
        active: ["ms","sgsn","ggsn"],
        links: [["sgsn","ggsn","create context"]],
        value: "Context active"
      },
      {
        label: "Share radio",
        title: "Send a temperature reading",
        body: "The sensor app sends 21 °C. The radio network allocates packet capacity for the burst and forwards the data to the SGSN.",
        idea: "Packet users can share radio resources over time.",
        active: ["ms","radio","sgsn"],
        links: [["ms","radio","21 °C"],["radio","sgsn","data"]],
        value: "Uplink burst"
      },
      {
        label: "Tunnel",
        title: "Carry the packet across the core",
        body: "The SGSN wraps the mobile packet for transport to the GGSN using the GPRS Tunnelling Protocol.",
        idea: "The outer tunnel identifies the mobile session within the operator network.",
        active: ["sgsn","ggsn"],
        links: [["sgsn","ggsn","GTP-U"]],
        value: "GTP tunnel"
      },
      {
        label: "Deliver",
        title: "Exit to the external service",
        body: "The GGSN removes the tunnel wrapper and forwards the original IP packet. The application receives the temperature update.",
        idea: "A small uplink burst can finish while its PDP context stays available for later traffic.",
        active: ["ggsn","app"],
        links: [["ggsn","app","IP packet"]],
        value: "21 °C delivered"
      }
    ],
    scenarios: [
      {
        label: "Download",
        description: "Follow a multi-packet web response in the opposite direction.",
        steps: [
          {
            label: "Reply",
            title: "Start a web response",
            body: "An active PDP context already exists. The web server sends a response addressed to the mobile’s packet address.",
            idea: "An external server uses the mobile’s packet address to reply.",
            active: ["app","ggsn"],
            links: [["app","ggsn","IP packets"]],
            value: "Downlink"
          },
          {
            label: "Find tunnel",
            title: "Select the mobile session",
            body: "The GGSN finds the PDP context and places each incoming packet into the corresponding GTP tunnel toward the SGSN.",
            idea: "The context connects an external IP address to the correct serving node.",
            active: ["ggsn","sgsn"],
            links: [["ggsn","sgsn","GTP-U"]],
            value: "Tunnel selected"
          },
          {
            label: "Schedule",
            title: "Share consecutive radio blocks",
            body: "The SGSN forwards data toward the BSS. The scheduler assigns available radio blocks as the device receives the page.",
            idea: "A larger response needs more shared radio capacity than a single sensor reading.",
            active: ["sgsn","radio","ms"],
            links: [["sgsn","radio","downlink"],["radio","ms","radio blocks"]],
            value: "Response delivered"
          }
        ]
      }
    ]
  },
  {
    slug: "wap-sms",
    title: "WAP and Mobile Computing over SMS",
    short: "WAP and SMS",
    question: "How did early handsets look up a timetable over WAP or text messaging?",
    mode: "map",
    nodes: [
      {
        id: "ms",
        label: "Handset",
        kind: "phone",
        x: 85,
        y: 165,
        detail: "A classic microbrowser can request WML content. A messaging app can submit a short text query to a service number."
      },
      {
        id: "wap",
        label: "WAP gateway",
        kind: "gate",
        x: 335,
        y: 80,
        detail: "In this WAP 1.x example the gateway translates between the wireless protocol stack and HTTP and encodes WML for the device."
      },
      {
        id: "smsc",
        label: "SMS centre",
        kind: "db",
        x: 335,
        y: 250,
        detail: "The Short Message Service Centre accepts, stores and forwards messages, retrying delivery within the message validity period."
      },
      {
        id: "srv",
        label: "Timetable",
        kind: "server",
        x: 590,
        y: 165,
        detail: "The timetable application serves a WML deck for a browser or a short reply to an SMS keyword."
      }
    ],
    steps: [
      {
        label: "Choose",
        title: "Open the timetable link",
        body: "The handset’s microbrowser selects the station page, identified by its URI.",
        idea: "A WAP browser presents linked resources on a constrained display.",
        active: ["ms"],
        value: "Classic WAP 1.x"
      },
      {
        label: "Request",
        title: "Reach the WAP gateway",
        body: "The microbrowser sends the resource request through the wireless protocol stack to the gateway.",
        idea: "WSP supplies a compact session protocol for this classic example.",
        active: ["ms","wap"],
        links: [["ms","wap","WSP request"]],
        value: "WSP"
      },
      {
        label: "Fetch",
        title: "Ask the origin server",
        body: "The gateway maps the request to HTTP. The timetable service responds with a WML deck containing the station details.",
        idea: "The gateway bridges the handset protocol and the origin server’s web protocol.",
        active: ["wap","srv"],
        links: [["wap","srv","HTTP GET"],["srv","wap","WML"]],
        value: "WML deck"
      },
      {
        label: "Render",
        title: "Display the next train",
        body: "The gateway encodes the deck for transport to the device. The microbrowser renders a WML card with the departure time.",
        idea: "A deck can contain multiple cards that a small-screen browser can present.",
        active: ["wap","ms"],
        links: [["wap","ms","encoded deck"]],
        value: "09:42 departure"
      }
    ],
    scenarios: [
      {
        label: "SMS query",
        description: "Request the same timetable by text and receive it after returning to coverage.",
        steps: [
          {
            label: "Send",
            title: "Text the station code",
            body: "The handset submits “TIME A4” to the application’s short code via the SMS centre.",
            idea: "An SMS application can use a small command vocabulary.",
            active: ["ms","smsc"],
            links: [["ms","smsc","TIME A4"]],
            value: "SMS submitted"
          },
          {
            label: "Look up",
            title: "Create a text response",
            body: "The centre forwards the query to the timetable service. The service submits “Next train 09:42” as a new message.",
            idea: "A query and its answer travel as two separate messages.",
            active: ["smsc","srv"],
            links: [["smsc","srv","query"],["srv","smsc","09:42"]],
            value: "Reply queued"
          },
          {
            label: "Offline",
            title: "Hold the reply",
            body: "The recipient has left coverage. The SMS centre keeps the pending reply and may retry until the message validity period ends.",
            idea: "Store-and-forward decouples submission from final delivery.",
            active: ["smsc"],
            value: "Handset offline"
          },
          {
            label: "Deliver",
            title: "Return to coverage",
            body: "When the network can reach the phone again, the centre retries. The screen displays the departure time.",
            idea: "Delivery can happen well after the application prepares a response.",
            active: ["smsc","ms"],
            links: [["smsc","ms","Next train 09:42"]],
            value: "Reply delivered"
          }
        ],
        nodes: [
          {
            id: "ms",
            label: "Handset",
            kind: "phone",
            x: 85,
            y: 165,
            detail: "A classic microbrowser can request WML content. A messaging app can submit a short text query to a service number."
          },
          {
            id: "smsc",
            label: "SMS centre",
            kind: "db",
            x: 335,
            y: 95,
            detail: "The Short Message Service Centre accepts, stores and forwards messages, retrying delivery within the message validity period."
          },
          {
            id: "srv",
            label: "Timetable",
            kind: "server",
            x: 590,
            y: 165,
            detail: "The timetable application serves a WML deck for a browser or a short reply to an SMS keyword."
          }
        ]
      }
    ]
  },
  {
    slug: "mobile-ip",
    title: "Mobile IP and IPv6",
    short: "Mobile IP and IPv6",
    question: "How can a correspondent reach a phone after it leaves its home network?",
    mode: "map",
    nodes: [
      {
        id: "peer",
        label: "Correspondent",
        kind: "laptop",
        x: 85,
        y: 155,
        detail: "The correspondent node exchanges packets with the mobile’s stable home address. A capable IPv6 correspondent can learn a verified binding."
      },
      {
        id: "home",
        label: "Home agent",
        kind: "server",
        x: 290,
        y: 70,
        detail: "Maintains the binding from the mobile’s home address to its current care-of address and tunnels packets when needed."
      },
      {
        id: "visited",
        label: "Visited router",
        kind: "router",
        x: 395,
        y: 235,
        detail: "Provides access on the visited network. Mobile IPv6 can configure a care-of address directly on this link."
      },
      {
        id: "ms",
        label: "Mobile node",
        kind: "phone",
        x: 590,
        y: 153,
        detail: "Keeps its home address as its stable identity while acquiring a care-of address at a visited attachment point."
      }
    ],
    steps: [
      {
        label: "Home",
        title: "Begin on the home link",
        body: "The correspondent sends to the handset’s home address. While the handset is at home, normal routing delivers the packet.",
        idea: "The home address is a stable endpoint identity.",
        active: ["peer","ms"],
        links: [["peer","ms","home address"]],
        value: "At home"
      },
      {
        label: "Roam",
        title: "Join a visited IPv6 link",
        body: "The mobile moves and configures a care-of address on the visited link. Its existing home address still identifies it to peers.",
        idea: "A care-of address describes where the handset can currently receive packets.",
        active: ["visited","ms"],
        links: [["visited","ms","new prefix"]],
        value: "Care-of address"
      },
      {
        label: "Bind",
        title: "Update the home agent",
        body: "The mobile sends a protected Binding Update to its home agent, registering its new care-of address.",
        idea: "The home agent now has a home-address to care-of-address binding.",
        active: ["ms","home"],
        links: [["ms","home","binding update"]],
        value: "Binding active"
      },
      {
        label: "Tunnel",
        title: "Forward a packet via home",
        body: "A packet for the home address reaches the home link. The home agent intercepts it and tunnels it to the care-of address; the mobile decapsulates it.",
        idea: "An outer destination routes the tunnel while the inner packet retains the home address.",
        active: ["peer","home","visited","ms"],
        links: [["peer","home","home address"],["home","visited","tunnel"],["visited","ms","tunnel"]],
        value: "Via home agent"
      },
      {
        label: "Optimize",
        title: "Teach the correspondent the binding",
        body: "After the route-optimization checks, a capable correspondent accepts the mobile’s Binding Update. It can now send directly to the care-of address.",
        idea: "The shorter route depends on a valid correspondent binding.",
        active: ["peer","visited","ms"],
        links: [["peer","visited","optimized route"],["visited","ms","deliver"]],
        value: "Direct delivery"
      }
    ],
    scenarios: [
      {
        label: "Mobile IPv4",
        description: "Compare a classic Mobile IPv4 deployment with a foreign agent.",
        steps: [
          {
            label: "Visit",
            title: "Discover the foreign agent",
            body: "The mobile joins a visited IPv4 network. In this example its visited router operates as a foreign agent and advertises a care-of address.",
            idea: "Mobile IPv4 supports both foreign-agent and co-located care-of addresses.",
            active: ["ms","visited"],
            links: [["visited","ms","advertisement"]],
            value: "Foreign agent"
          },
          {
            label: "Register",
            title: "Register the visited address",
            body: "The mobile sends a Registration Request via the foreign agent to its home agent. The home agent accepts and returns a reply.",
            idea: "Registration associates a home address with a tunnel endpoint for a limited lifetime.",
            active: ["ms","visited","home"],
            links: [["ms","visited","request"],["visited","home","register"]],
            value: "Registration"
          },
          {
            label: "Forward",
            title: "Tunnel to the foreign agent",
            body: "The correspondent sends to the home address. The home agent tunnels the packet to the foreign agent, which removes the outer header and delivers locally.",
            idea: "Here the foreign agent is the tunnel endpoint on the visited link.",
            active: ["peer","home","visited","ms"],
            links: [["peer","home","home address"],["home","visited","IP tunnel"],["visited","ms","deliver"]],
            value: "Triangle route"
          }
        ]
      }
    ]
  },
  {
    slug: "bluetooth-wimax",
    title: "Bluetooth versus WiMAX",
    short: "Bluetooth vs WiMAX",
    question: "Which wireless link connects a nearby sensor, and which brings broadband to a building?",
    mode: "compare",
    nodes: [
      {
        id: "periph",
        label: "Wearable",
        kind: "sensor",
        x: 87,
        y: 160,
        detail: "A Bluetooth Low Energy peripheral can advertise its presence and expose data such as a step-count characteristic."
      },
      {
        id: "phone",
        label: "Phone",
        kind: "phone",
        x: 265,
        y: 160,
        detail: "The Bluetooth LE central scans for advertisements and initiates a connection to the selected peripheral."
      },
      {
        id: "station",
        label: "Subscriber",
        kind: "router",
        x: 415,
        y: 160,
        detail: "A WiMAX subscriber station provides the customer-side radio link into the operator’s broadband network."
      },
      {
        id: "base",
        label: "Base station",
        kind: "tower",
        x: 595,
        y: 160,
        detail: "An IEEE 802.16 base station controls shared air-interface resources and connects subscriber stations to a wider network."
      }
    ],
    steps: [
      {
        label: "Discover",
        title: "Find a nearby wearable",
        body: "A wearable advertises. The phone scans for the advertisement and identifies the step-count service it wants.",
        idea: "This Bluetooth LE example connects devices in a personal-area use case.",
        active: ["periph","phone"],
        links: [["periph","phone","advertise"]],
        value: "Personal area"
      },
      {
        label: "Connect",
        title: "Read the step count",
        body: "The phone initiates a connection. When the service requires protection, the devices can pair before the phone reads the characteristic.",
        idea: "Service discovery and attribute access give an app structured device data.",
        active: ["phone","periph"],
        links: [["phone","periph","read"],["periph","phone","steps"]],
        value: "Step count"
      },
      {
        label: "Access",
        title: "Connect a building",
        body: "Across town, a subscriber station performs network entry with a WiMAX base station connected to the operator network.",
        idea: "WiMAX uses a base station to provide broadband access across a service area.",
        active: ["station","base"],
        links: [["station","base","network entry"]],
        value: "Broadband access"
      },
      {
        label: "Schedule",
        title: "Allocate a broadband uplink",
        body: "The base station schedules radio resources. The subscriber station sends its user traffic in granted uplink capacity.",
        idea: "One base station can coordinate access for multiple subscriber stations.",
        active: ["station","base"],
        links: [["base","station","grant"],["station","base","uplink"]],
        value: "Scheduled uplink"
      },
      {
        label: "Compare",
        title: "Match the radio to the task",
        body: "For the wearable, nearby device support and low energy use matter. For the building, operator coverage and broadband capacity matter.",
        idea: "Usable range depends on radio configuration, obstacles and link budget.",
        active: ["periph","phone","station","base"],
        links: [["periph","phone","personal link"],["station","base","access link"]],
        value: "Two use cases"
      }
    ],
    scenarios: [
      {
        label: "Weaker signal",
        description: "Explore what changes as the endpoints move farther apart.",
        steps: [
          {
            label: "Wearable",
            title: "Walk away from the wearable",
            body: "A wall and increasing separation reduce the received Bluetooth signal. Retransmissions can appear while the link remains usable.",
            idea: "Bluetooth range varies with transmit power, receiver sensitivity and the environment.",
            active: ["periph","phone"],
            links: [["periph","phone","weaker link"]],
            value: "Lower signal"
          },
          {
            label: "Cell edge",
            title: "Move toward the service edge",
            body: "The WiMAX subscriber station can use a more robust radio mode when the link supports it. That mode may carry less data per radio resource.",
            idea: "Coverage and throughput depend on the link budget and the chosen radio mode.",
            active: ["station","base"],
            links: [["base","station","robust mode"]],
            value: "Lower throughput"
          },
          {
            label: "Out of range",
            title: "Lose usable coverage",
            body: "When neither endpoint can recover the signal, the link is lost. Reconnection needs sufficient signal and compatible network access.",
            idea: "Both technologies have a coverage boundary that depends on deployment conditions.",
            active: ["phone","station"],
            value: "Link unavailable"
          }
        ]
      }
    ]
  }
]

export default lessons
