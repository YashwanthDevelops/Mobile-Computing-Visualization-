import type { Lesson } from '../types'

const lessons: Lesson[] = [
  {
    "slug": "wlan",
    "title": "IEEE 802.11 WLAN Architecture, Mobility and Security",
    "short": "WLAN roaming",
    "question": "How does a moving phone keep using the same wireless LAN?",
    "mode": "map",
    "nodes": [
      {
        "id": "sta",
        "label": "Station",
        "kind": "phone",
        "x": 90,
        "y": 155,
        "detail": "The station chooses which access point to join. A client can use the same IP address when roaming inside this subnet."
      },
      {
        "id": "a",
        "label": "AP A",
        "kind": "radio",
        "x": 265,
        "y": 82,
        "detail": "Access point A advertises its basic service set and bridges associated stations onto the distribution system."
      },
      {
        "id": "b",
        "label": "AP B",
        "kind": "radio",
        "x": 265,
        "y": 245,
        "detail": "Access point B offers another cell in the same extended service set. Its BSSID identifies this individual access point."
      },
      {
        "id": "ds",
        "label": "Distribution",
        "kind": "router",
        "x": 442,
        "y": 155,
        "detail": "The distribution system links the access points to the same local network."
      },
      {
        "id": "host",
        "label": "Local host",
        "kind": "server",
        "x": 602,
        "y": 155,
        "detail": "A host reachable through the wired portion of the same LAN."
      }
    ],
    "steps": [
      {
        "label": "Discover",
        "title": "Find the two cells",
        "body": "Both access points announce the same network name. Their different BSSIDs tell the phone which radio sent each beacon.",
        "idea": "An extended service set can contain several basic service sets.",
        "active": [
          "a",
          "sta",
          "b"
        ],
        "links": [
          [
            "a",
            "sta",
            "Beacon"
          ],
          [
            "b",
            "sta",
            "Beacon"
          ]
        ]
      },
      {
        "label": "Join",
        "title": "Associate with AP A",
        "body": "The station authenticates at the 802.11 link layer and associates with AP A. It now has an association ID in that cell.",
        "idea": "Association identifies the access point currently serving this station.",
        "active": [
          "sta",
          "a"
        ],
        "links": [
          [
            "sta",
            "a",
            "Associate"
          ]
        ]
      },
      {
        "label": "Secure",
        "title": "Install session keys",
        "body": "In this WPA2-Personal example, the four-way handshake confirms possession of key material and derives fresh traffic keys.",
        "idea": "The radio link has its own protection between station and access point.",
        "active": [
          "a",
          "sta"
        ],
        "links": [
          [
            "a",
            "sta",
            "4-way handshake"
          ]
        ]
      },
      {
        "label": "Send",
        "title": "Bridge a data frame",
        "body": "AP A receives the protected wireless frame. It forwards the payload through the distribution system to the local host.",
        "idea": "One local conversation can cross wireless and wired links.",
        "active": [
          "sta",
          "a",
          "ds",
          "host"
        ],
        "links": [
          [
            "sta",
            "a",
            "Data"
          ],
          [
            "a",
            "ds",
            "Bridge"
          ],
          [
            "ds",
            "host",
            "Deliver"
          ]
        ]
      },
      {
        "label": "Roam",
        "title": "Switch to AP B",
        "body": "As the phone moves, it selects B, reassociates and establishes the keys for that link. Return traffic reaches the station through B.",
        "idea": "The serving BSSID changes while the network name and subnet stay the same.",
        "active": [
          "host",
          "ds",
          "b",
          "sta"
        ],
        "links": [
          [
            "host",
            "ds",
            "Reply"
          ],
          [
            "ds",
            "b",
            "Forward"
          ],
          [
            "b",
            "sta",
            "Protected frame"
          ]
        ],
        "value": "Serving AP B"
      }
    ]
  },
  {
    "slug": "in-ss7",
    "title": "IN Conceptual Model and SS#7 Signaling",
    "short": "IN and SS#7",
    "question": "Who translates a freephone number into a routable destination?",
    "mode": "map",
    "nodes": [
      {
        "id": "phone",
        "label": "Caller",
        "kind": "phone",
        "x": 82,
        "y": 175,
        "detail": "The caller dials a service number. The operator supplies the service logic."
      },
      {
        "id": "ssp",
        "label": "SSP",
        "kind": "gate",
        "x": 245,
        "y": 160,
        "detail": "Service switching point. A detection point in the call model can trigger an IN service request."
      },
      {
        "id": "stp",
        "label": "STP",
        "kind": "router",
        "x": 400,
        "y": 80,
        "detail": "Signaling transfer point. It relays SS7 messages toward their destinations."
      },
      {
        "id": "scp",
        "label": "SCP",
        "kind": "db",
        "x": 590,
        "y": 82,
        "detail": "Service control point. It executes service logic and can consult translation data."
      },
      {
        "id": "dest",
        "label": "Destination",
        "kind": "phone",
        "x": 450,
        "y": 245,
        "detail": "The switch uses a translated destination to continue setting up the call."
      }
    ],
    "steps": [
      {
        "label": "Service",
        "title": "Dial one service number",
        "body": "A customer dials a freephone number. At the service plane the feature is expressed from the caller’s point of view.",
        "idea": "The IN model describes a service at four levels of detail.",
        "active": [
          "phone",
          "ssp"
        ],
        "links": [
          [
            "phone",
            "ssp",
            "Freephone digits"
          ]
        ]
      },
      {
        "label": "Logic",
        "title": "Describe the service logic",
        "body": "The global functional plane represents the service as reusable service-independent building blocks. A translation operation supplies a routable destination.",
        "idea": "The global functional view describes the sequence of service actions.",
        "active": [
          "scp"
        ],
        "links": []
      },
      {
        "label": "Functions",
        "title": "Split switching and control",
        "body": "In the distributed functional plane, the service switching function asks the service control function for instructions. The physical plane maps those functions onto the SSP and SCP.",
        "idea": "The conceptual planes are views of one service.",
        "active": [
          "ssp",
          "scp"
        ],
        "links": []
      },
      {
        "label": "Query",
        "title": "Route the SS7 query",
        "body": "A trigger at the SSP starts a transaction. An INAP InitialDP message travels in TCAP over SCCP and MTP, via the STP, to the SCP.",
        "idea": "The STP routes the signaling message. The SCP interprets the service request.",
        "active": [
          "ssp",
          "stp",
          "scp"
        ],
        "links": [
          [
            "ssp",
            "stp",
            "InitialDP"
          ],
          [
            "stp",
            "scp",
            "Forward"
          ]
        ]
      },
      {
        "label": "Connect",
        "title": "Return a destination",
        "body": "The SCP sends a Connect instruction. The SSP uses its destination routing address to continue call setup.",
        "idea": "Voice follows the resulting bearer path. The service query followed the SS7 network.",
        "active": [
          "scp",
          "stp",
          "ssp",
          "dest"
        ],
        "links": [
          [
            "scp",
            "stp",
            "Connect"
          ],
          [
            "stp",
            "ssp",
            "Route digits"
          ],
          [
            "ssp",
            "dest",
            "Call setup"
          ]
        ]
      }
    ]
  },
  {
    "slug": "softswitch-vpn",
    "title": "Softswitch, Programmable Networks and VPN",
    "short": "Softswitch and VPN",
    "question": "Which component decides a route, and which components carry the traffic?",
    "mode": "map",
    "nodes": [
      {
        "id": "left",
        "label": "Caller",
        "kind": "phone",
        "x": 76,
        "y": 180,
        "detail": "The local endpoint produces the outgoing voice stream."
      },
      {
        "id": "ga",
        "label": "Gateway A",
        "kind": "gate",
        "x": 225,
        "y": 208,
        "detail": "The ingress gateway adapts media. In the VPN scenario it also acts as the security gateway."
      },
      {
        "id": "control",
        "label": "Controller",
        "kind": "server",
        "x": 337,
        "y": 60,
        "detail": "A softswitch controls media gateways. An SDN controller programs forwarding rules in the separate routing example."
      },
      {
        "id": "switch",
        "label": "IP switch",
        "kind": "router",
        "x": 340,
        "y": 242,
        "detail": "A forwarding device matches packet fields against installed rules."
      },
      {
        "id": "gb",
        "label": "Gateway B",
        "kind": "gate",
        "x": 478,
        "y": 208,
        "detail": "The remote gateway receives the media. In the tunnel scenario it authenticates and decrypts the encapsulated packet."
      },
      {
        "id": "right",
        "label": "Callee",
        "kind": "phone",
        "x": 603,
        "y": 180,
        "detail": "The destination plays the received voice stream."
      }
    ],
    "steps": [
      {
        "label": "Call",
        "title": "Signal the call",
        "body": "A call request reaches the softswitch, which identifies the destination and the two media gateways.",
        "idea": "Call control maintains session state.",
        "active": [
          "left",
          "control"
        ],
        "links": [
          [
            "left",
            "control",
            "Set up"
          ]
        ]
      },
      {
        "label": "Allocate",
        "title": "Configure media endpoints",
        "body": "The controller instructs the gateways to allocate terminations and supplies the remote media addresses.",
        "idea": "Gateway control gives each bearer endpoint the information needed to exchange media.",
        "active": [
          "control",
          "ga",
          "gb"
        ],
        "links": [
          [
            "control",
            "ga",
            "Configure"
          ],
          [
            "control",
            "gb",
            "Configure"
          ]
        ]
      },
      {
        "label": "Forward",
        "title": "Program a forwarding rule",
        "body": "In a programmable fabric, a controller installs a match and forwarding action at a switch. Later packets matching the rule use the chosen egress.",
        "idea": "The switch can forward a stream locally after rule installation.",
        "active": [
          "control",
          "switch"
        ],
        "links": [
          [
            "control",
            "switch",
            "Match → port"
          ]
        ]
      },
      {
        "label": "Media",
        "title": "Follow the bearer path",
        "body": "Voice packets enter gateway A and cross the IP fabric to gateway B. The softswitch remains responsible for call state.",
        "idea": "Control and media can travel along different paths.",
        "active": [
          "left",
          "ga",
          "switch",
          "gb",
          "right"
        ],
        "links": [
          [
            "left",
            "ga",
            "Voice"
          ],
          [
            "ga",
            "switch",
            "RTP"
          ],
          [
            "switch",
            "gb",
            "Forward"
          ],
          [
            "gb",
            "right",
            "Voice"
          ]
        ]
      }
    ],
    "scenarios": [
      {
        "label": "VPN tunnel",
        "description": "Inspect a site-to-site ESP tunnel using encryption and integrity protection.",
        "steps": [
          {
            "label": "Original",
            "title": "Receive an inner IP packet",
            "body": "Gateway A receives a packet addressed to the remote site. Its security policy selects the established IPsec association.",
            "idea": "The inner header identifies the original communicating hosts.",
            "active": [
              "left",
              "ga"
            ],
            "links": [
              [
                "left",
                "ga",
                "Inner IP"
              ]
            ]
          },
          {
            "label": "Wrap",
            "title": "Add the outer header",
            "body": "Gateway A encrypts and protects the inner packet with ESP and attaches an outer IP header addressed to gateway B.",
            "idea": "Transit routers use the outer destination to forward the tunnel packet.",
            "active": [
              "ga",
              "switch"
            ],
            "links": [
              [
                "ga",
                "switch",
                "Outer IP + ESP"
              ]
            ]
          },
          {
            "label": "Transit",
            "title": "Cross the IP fabric",
            "body": "The switch forwards the protected packet toward gateway B. The outer gateway addresses remain visible.",
            "idea": "The original packet travels inside the encrypted payload.",
            "active": [
              "switch",
              "gb"
            ],
            "links": [
              [
                "switch",
                "gb",
                "ESP"
              ]
            ]
          },
          {
            "label": "Unwrap",
            "title": "Deliver the inner packet",
            "body": "Gateway B verifies the protected packet, decrypts it, and routes the recovered inner packet to the remote host.",
            "idea": "Tunnel protection spans the two security gateways.",
            "active": [
              "gb",
              "right"
            ],
            "links": [
              [
                "gb",
                "right",
                "Inner IP"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "cloud-quantum",
    "title": "Cloud-Based Quantum Computing Integration",
    "short": "Cloud quantum jobs",
    "question": "Why does a mobile app receive a job ID before it receives a quantum result?",
    "mode": "map",
    "nodes": [
      {
        "id": "phone",
        "label": "Mobile app",
        "kind": "phone",
        "x": 85,
        "y": 170,
        "detail": "A classical client chooses parameters, displays job state and presents returned measurements."
      },
      {
        "id": "api",
        "label": "App service",
        "kind": "server",
        "x": 253,
        "y": 145,
        "detail": "The application service validates the request and submits a backend-compatible circuit."
      },
      {
        "id": "queue",
        "label": "Job queue",
        "kind": "cloud",
        "x": 417,
        "y": 85,
        "detail": "The service schedules waiting jobs subject to backend availability."
      },
      {
        "id": "qpu",
        "label": "Remote QPU",
        "kind": "chip",
        "x": 592,
        "y": 205,
        "detail": "A remote quantum processing unit runs the circuit and returns classical measurements."
      }
    ],
    "steps": [
      {
        "label": "Prepare",
        "title": "Build the circuit",
        "body": "A phone app picks the circuit and number of shots. Its application service prepares a job for the selected backend.",
        "idea": "Each shot repeats the same preparation and measurement.",
        "active": [
          "phone",
          "api"
        ],
        "links": [
          [
            "phone",
            "api",
            "Circuit + shots"
          ]
        ]
      },
      {
        "label": "Submit",
        "title": "Keep the job identifier",
        "body": "The quantum service accepts the job and returns an ID. The phone can release the connection and check the job later.",
        "idea": "The ID ties a later status query to the submitted circuit.",
        "active": [
          "api",
          "queue",
          "phone"
        ],
        "links": [
          [
            "api",
            "queue",
            "Submit job"
          ],
          [
            "api",
            "phone",
            "Job ID"
          ]
        ],
        "value": "Queued"
      },
      {
        "label": "Execute",
        "title": "Give the circuit a turn",
        "body": "The scheduler assigns the prepared job to a quantum processing unit. Its controller executes the gates and measures each shot.",
        "idea": "Waiting for a device and running the circuit take separate amounts of time.",
        "active": [
          "queue",
          "qpu"
        ],
        "links": [
          [
            "queue",
            "qpu",
            "Dispatch"
          ]
        ],
        "value": "Running"
      },
      {
        "label": "Retrieve",
        "title": "Read the result on the phone",
        "body": "The application service retrieves the completed measurement data. The phone displays how frequently each bit string occurred.",
        "idea": "The phone receives ordinary classical data from a remote quantum device.",
        "active": [
          "qpu",
          "api",
          "phone"
        ],
        "links": [
          [
            "qpu",
            "api",
            "Measurements"
          ],
          [
            "api",
            "phone",
            "Counts"
          ]
        ],
        "value": "Done"
      }
    ],
    "scenarios": [
      {
        "label": "Busy backend",
        "description": "Watch how a longer queue affects the same circuit.",
        "steps": [
          {
            "label": "Prepare",
            "title": "Build the circuit",
            "body": "A phone app picks the circuit and number of shots. Its application service prepares a job for the selected backend.",
            "idea": "Each shot repeats the same preparation and measurement.",
            "active": [
              "phone",
              "api"
            ],
            "links": [
              [
                "phone",
                "api",
                "Circuit + shots"
              ]
            ]
          },
          {
            "label": "Submit",
            "title": "Keep the job identifier",
            "body": "The quantum service accepts the job and returns an ID. The phone can release the connection and check the job later.",
            "idea": "The ID ties a later status query to the submitted circuit.",
            "active": [
              "api",
              "queue",
              "phone"
            ],
            "links": [
              [
                "api",
                "queue",
                "Submit job"
              ],
              [
                "api",
                "phone",
                "Job ID"
              ]
            ],
            "value": "Queued"
          },
          {
            "label": "Wait",
            "title": "The QPU is occupied",
            "body": "The app checks the existing job ID. Its state remains queued while another workload occupies the selected backend.",
            "idea": "Polling asks for status without submitting a duplicate job.",
            "active": [
              "phone",
              "api",
              "queue"
            ],
            "links": [
              [
                "phone",
                "api",
                "Status?"
              ],
              [
                "api",
                "queue",
                "Check ID"
              ]
            ],
            "value": "Queued"
          },
          {
            "label": "Execute",
            "title": "Give the circuit a turn",
            "body": "The scheduler assigns the prepared job to a quantum processing unit. Its controller executes the gates and measures each shot.",
            "idea": "Waiting for a device and running the circuit take separate amounts of time.",
            "active": [
              "queue",
              "qpu"
            ],
            "links": [
              [
                "queue",
                "qpu",
                "Dispatch"
              ]
            ],
            "value": "Running"
          },
          {
            "label": "Retrieve",
            "title": "Read the result on the phone",
            "body": "The application service retrieves the completed measurement data. The phone displays how frequently each bit string occurred.",
            "idea": "The phone receives ordinary classical data from a remote quantum device.",
            "active": [
              "qpu",
              "api",
              "phone"
            ],
            "links": [
              [
                "qpu",
                "api",
                "Measurements"
              ],
              [
                "api",
                "phone",
                "Counts"
              ]
            ],
            "value": "Done"
          }
        ]
      }
    ]
  }
]

export default lessons
