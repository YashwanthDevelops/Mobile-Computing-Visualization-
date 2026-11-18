import type { Lesson } from '../types'

const lessons: Lesson[] = [
  {
    "slug": "sip",
    "title": "VoIP, SIP Call Flow and RTP/RTCP",
    "short": "SIP call flow",
    "question": "Which messages make a phone ring, and which packets carry the caller’s voice?",
    "mode": "ladder",
    "nodes": [
      {
        "id": "a",
        "label": "Caller",
        "kind": "phone",
        "x": 85,
        "y": 120,
        "detail": "The originating SIP user agent initiates and acknowledges the session."
      },
      {
        "id": "p",
        "label": "SIP proxy",
        "kind": "server",
        "x": 340,
        "y": 120,
        "detail": "This proxy forwards the initial INVITE and its responses. In this example it does not record-route, so later in-dialog requests go directly to the contact."
      },
      {
        "id": "b",
        "label": "Callee",
        "kind": "phone",
        "x": 590,
        "y": 120,
        "detail": "The answering SIP user agent advertises its media parameters and receives the voice stream."
      }
    ],
    "steps": [
      {
        "label": "Invite",
        "title": "Offer an audio session",
        "body": "The caller sends INVITE with an SDP offer. A proxy forwards it to the callee.",
        "idea": "SIP sets up the session. SDP describes proposed media addresses and codecs.",
        "active": [
          "a",
          "p",
          "b"
        ],
        "links": [
          [
            "a",
            "p",
            "INVITE"
          ],
          [
            "p",
            "b",
            "INVITE"
          ]
        ]
      },
      {
        "label": "Ring",
        "title": "Report that the phone is ringing",
        "body": "The callee sends 180 Ringing back along the signaling path. The caller can now present a ringing indication.",
        "idea": "A provisional response reports how setup is progressing.",
        "active": [
          "b",
          "p",
          "a"
        ],
        "links": [
          [
            "b",
            "p",
            "180 Ringing"
          ],
          [
            "p",
            "a",
            "180 Ringing"
          ]
        ]
      },
      {
        "label": "Accept",
        "title": "Answer the call",
        "body": "The callee answers with 200 OK, including the SDP answer. The response returns through the proxy.",
        "idea": "The endpoints now know the agreed media format and destination.",
        "active": [
          "b",
          "p",
          "a"
        ],
        "links": [
          [
            "b",
            "p",
            "200 OK"
          ],
          [
            "p",
            "a",
            "200 OK"
          ]
        ]
      },
      {
        "label": "Acknowledge",
        "title": "Confirm the final response",
        "body": "The caller sends ACK to the callee’s Contact. This example uses a proxy that did not request inclusion on later in-dialog requests.",
        "idea": "ACK completes the successful INVITE exchange.",
        "active": [
          "a",
          "b"
        ],
        "links": [
          [
            "a",
            "b",
            "ACK"
          ]
        ]
      },
      {
        "label": "Audio",
        "title": "Exchange voice packets",
        "body": "The endpoints exchange RTP audio on the negotiated media path. Sequence numbers and timestamps help order and time playback.",
        "idea": "RTP carries media packets on a path chosen during session setup.",
        "active": [
          "a",
          "b"
        ],
        "links": [
          [
            "a",
            "b",
            "RTP audio"
          ],
          [
            "b",
            "a",
            "RTP audio"
          ]
        ]
      },
      {
        "label": "Report",
        "title": "Report reception quality",
        "body": "RTCP reports summarize reception, including packet loss and interarrival jitter. The reports accompany the media session.",
        "idea": "Reception reports supply feedback to participants in the session.",
        "active": [
          "a",
          "b"
        ],
        "links": [
          [
            "b",
            "a",
            "RTCP report"
          ]
        ]
      },
      {
        "label": "Hang up",
        "title": "Release the session",
        "body": "The caller sends BYE. A 200 OK acknowledges this new request and the endpoints stop the session.",
        "idea": "A response code gets its meaning from the request it answers.",
        "active": [
          "a",
          "b"
        ],
        "links": [
          [
            "a",
            "b",
            "BYE"
          ],
          [
            "b",
            "a",
            "200 OK"
          ]
        ]
      }
    ]
  },
  {
    "slug": "h323",
    "title": "H.323 Framework",
    "short": "H.323 framework",
    "question": "How do two H.323 terminals obtain admission, agree on a codec, and open media channels?",
    "mode": "map",
    "nodes": [
      {
        "id": "a",
        "label": "Terminal A",
        "kind": "laptop",
        "x": 81,
        "y": 175,
        "detail": "A terminal originates or receives multimedia calls on a packet network."
      },
      {
        "id": "gk",
        "label": "Gatekeeper",
        "kind": "server",
        "x": 337,
        "y": 76,
        "detail": "The gatekeeper manages a zone. It can translate aliases, control admission and apply bandwidth policies."
      },
      {
        "id": "b",
        "label": "Terminal B",
        "kind": "tablet",
        "x": 595,
        "y": 175,
        "detail": "The receiving H.323 terminal exchanges call signaling, capabilities and media with its peer."
      },
      {
        "id": "mcu",
        "label": "MCU",
        "kind": "chip",
        "x": 229,
        "y": 248,
        "detail": "A multipoint control unit coordinates a conference among several terminals."
      },
      {
        "id": "gw",
        "label": "Gateway",
        "kind": "gate",
        "x": 449,
        "y": 248,
        "detail": "The gateway interworks between H.323 and another network or protocol, such as a circuit-switched telephone network."
      }
    ],
    "steps": [
      {
        "label": "Register",
        "title": "Register an endpoint alias",
        "body": "Terminal A registers with the gatekeeper using H.225.0 RAS. The gatekeeper records its alias and transport address.",
        "idea": "RAS covers registration, admission and status in a gatekeeper zone.",
        "active": [
          "a",
          "gk"
        ],
        "links": [
          [
            "a",
            "gk",
            "RRQ"
          ],
          [
            "gk",
            "a",
            "RCF"
          ]
        ]
      },
      {
        "label": "Admit",
        "title": "Request permission to call",
        "body": "A sends an admission request for B. The gatekeeper confirms admission and supplies the call signaling address for this direct-routed example.",
        "idea": "The gatekeeper may admit the call while endpoints exchange signaling directly.",
        "active": [
          "a",
          "gk"
        ],
        "links": [
          [
            "a",
            "gk",
            "ARQ"
          ],
          [
            "gk",
            "a",
            "ACF"
          ]
        ]
      },
      {
        "label": "Set up",
        "title": "Signal the receiving terminal",
        "body": "H.225.0 Setup reaches B. After obtaining its required admission, B answers with Connect.",
        "idea": "Call signaling establishes the call relationship.",
        "active": [
          "a",
          "b",
          "gk"
        ],
        "links": [
          [
            "a",
            "b",
            "Setup"
          ],
          [
            "b",
            "gk",
            "Admission"
          ],
          [
            "b",
            "a",
            "Connect"
          ]
        ]
      },
      {
        "label": "Negotiate",
        "title": "Choose a common codec",
        "body": "In this classic H.245 flow the terminals exchange capabilities and open logical media channels.",
        "idea": "Each sender needs an agreed codec and channel parameters.",
        "active": [
          "a",
          "b"
        ],
        "links": [
          [
            "a",
            "b",
            "Capabilities"
          ],
          [
            "b",
            "a",
            "Open channel"
          ]
        ]
      },
      {
        "label": "Media",
        "title": "Exchange audio",
        "body": "The terminals send RTP over the agreed channels. A simple two-party IP call can use a direct media path.",
        "idea": "The gateway and MCU have roles when a call crosses systems or grows into a conference.",
        "active": [
          "a",
          "b"
        ],
        "links": [
          [
            "a",
            "b",
            "RTP audio"
          ]
        ]
      }
    ],
    "scenarios": [
      {
        "label": "Interworking",
        "description": "Compare a call to a legacy phone with an IP conference.",
        "steps": [
          {
            "label": "Translate",
            "title": "Call into a second network",
            "body": "Terminal A selects an address served by the gateway. The gatekeeper can resolve that address to the gateway’s transport address.",
            "idea": "The selected endpoint can be a gateway serving another system.",
            "active": [
              "a",
              "gk",
              "gw"
            ],
            "links": [
              [
                "a",
                "gk",
                "Resolve alias"
              ],
              [
                "gk",
                "a",
                "Gateway address"
              ]
            ]
          },
          {
            "label": "Bridge",
            "title": "Bridge the two call legs",
            "body": "The gateway terminates the H.323 call leg and establishes the corresponding leg in the other network.",
            "idea": "A gateway translates signaling and adapts media where required.",
            "active": [
              "a",
              "gw"
            ],
            "links": [
              [
                "a",
                "gw",
                "H.323 leg"
              ]
            ]
          },
          {
            "label": "Conference",
            "title": "Join a multipoint session",
            "body": "For a separate conference, terminals A and B connect to the MCU. The multipoint controller coordinates the conference.",
            "idea": "Conference control can handle more than two participants.",
            "active": [
              "a",
              "mcu",
              "b"
            ],
            "links": [
              [
                "a",
                "mcu",
                "Join"
              ],
              [
                "b",
                "mcu",
                "Join"
              ]
            ]
          },
          {
            "label": "Mix",
            "title": "Distribute conference audio",
            "body": "In this centralized example a multipoint processor mixes incoming audio and sends streams to the terminals.",
            "idea": "Media processing and conference control are distinct MCU functions.",
            "active": [
              "mcu",
              "a",
              "b"
            ],
            "links": [
              [
                "mcu",
                "a",
                "Mixed audio"
              ],
              [
                "mcu",
                "b",
                "Mixed audio"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "ims",
    "title": "IMS Architecture and Registration",
    "short": "IMS registration",
    "question": "How does IMS authenticate a handset and record where to reach it?",
    "mode": "ladder",
    "nodes": [
      {
        "id": "ue",
        "label": "Handset",
        "kind": "phone",
        "x": 70,
        "y": 100,
        "detail": "User equipment carries the subscriber credentials and originates SIP REGISTER."
      },
      {
        "id": "p",
        "label": "P-CSCF",
        "kind": "gate",
        "x": 200,
        "y": 100,
        "detail": "Proxy Call Session Control Function. The first IMS signaling contact for the handset."
      },
      {
        "id": "i",
        "label": "I-CSCF",
        "kind": "router",
        "x": 335,
        "y": 100,
        "detail": "Interrogating CSCF. The home-network entry point queries the HSS to help select or locate the S-CSCF."
      },
      {
        "id": "s",
        "label": "S-CSCF",
        "kind": "server",
        "x": 467,
        "y": 100,
        "detail": "Serving CSCF. It acts as SIP registrar, authenticates the subscriber and applies service profiles."
      },
      {
        "id": "h",
        "label": "HSS",
        "kind": "db",
        "x": 604,
        "y": 100,
        "detail": "Home Subscriber Server. It supplies authorization information, authentication data and the subscriber profile."
      }
    ],
    "steps": [
      {
        "label": "Contact",
        "title": "Reach the home network",
        "body": "After IP connectivity and proxy discovery, the handset sends its initial SIP REGISTER to the P-CSCF, which forwards it toward the home network.",
        "idea": "Access provides IP connectivity. Registration takes place in the IMS control layer.",
        "active": [
          "ue",
          "p",
          "i"
        ],
        "links": [
          [
            "ue",
            "p",
            "REGISTER"
          ],
          [
            "p",
            "i",
            "REGISTER"
          ]
        ]
      },
      {
        "label": "Select",
        "title": "Locate the serving CSCF",
        "body": "The I-CSCF queries the HSS for authorization and serving-node information, then forwards REGISTER to the selected S-CSCF.",
        "idea": "The I-CSCF routes registration to a serving function in the home network.",
        "active": [
          "i",
          "h",
          "s"
        ],
        "links": [
          [
            "i",
            "h",
            "Cx query"
          ],
          [
            "h",
            "i",
            "Serving info"
          ],
          [
            "i",
            "s",
            "REGISTER"
          ]
        ]
      },
      {
        "label": "Challenge",
        "title": "Issue an AKA challenge",
        "body": "The S-CSCF obtains authentication data from the HSS, then sends a 401 challenge back through both proxies.",
        "idea": "A 401 challenge starts the proof-of-possession exchange in this initial IMS AKA flow.",
        "active": [
          "s",
          "h",
          "i",
          "p",
          "ue"
        ],
        "links": [
          [
            "s",
            "h",
            "Auth data"
          ],
          [
            "s",
            "i",
            "401"
          ],
          [
            "i",
            "p",
            "401"
          ],
          [
            "p",
            "ue",
            "401"
          ]
        ]
      },
      {
        "label": "Prove",
        "title": "Return the calculated response",
        "body": "The handset validates the network challenge and calculates its response using subscriber credentials. A second REGISTER carries the response along the signaling path.",
        "idea": "The long-term subscriber secret stays with the authentication participants.",
        "active": [
          "ue",
          "p",
          "i",
          "s"
        ],
        "links": [
          [
            "ue",
            "p",
            "REGISTER + auth"
          ],
          [
            "p",
            "i",
            "Forward"
          ],
          [
            "i",
            "s",
            "Forward"
          ]
        ]
      },
      {
        "label": "Bind",
        "title": "Associate the public identity",
        "body": "The S-CSCF verifies the response, records the contact binding, and exchanges server assignment and profile information with the HSS.",
        "idea": "A binding associates the subscriber’s public identity with its reachable contact.",
        "active": [
          "s",
          "h"
        ],
        "links": [
          [
            "s",
            "h",
            "Assignment"
          ],
          [
            "h",
            "s",
            "User profile"
          ]
        ]
      },
      {
        "label": "Confirm",
        "title": "Confirm registration",
        "body": "200 OK returns through the I-CSCF and P-CSCF to the handset. The subscriber can now be reached through the registered contact.",
        "idea": "Application services can use the registered IMS identity.",
        "active": [
          "s",
          "i",
          "p",
          "ue"
        ],
        "links": [
          [
            "s",
            "i",
            "200 OK"
          ],
          [
            "i",
            "p",
            "200 OK"
          ],
          [
            "p",
            "ue",
            "200 OK"
          ]
        ]
      }
    ]
  },
  {
    "slug": "networked-multimedia",
    "title": "Next Generation Networks and Networked Multimedia Applications",
    "short": "Networked multimedia",
    "question": "How does a receiver smooth packet arrival times without adding too much delay?",
    "mode": "experiment",
    "nodes": [
      {
        "id": "service",
        "label": "Video service",
        "kind": "server",
        "x": 82,
        "y": 150,
        "detail": "The application provides a networked video session and identifies the content or source."
      },
      {
        "id": "control",
        "label": "Session control",
        "kind": "gate",
        "x": 241,
        "y": 78,
        "detail": "Service and session control coordinates setup. Transport control can manage resources separately."
      },
      {
        "id": "net",
        "label": "IP transport",
        "kind": "network",
        "x": 340,
        "y": 220,
        "detail": "The transport stratum forwards packets over the selected access and core networks."
      },
      {
        "id": "buffer",
        "label": "Playout buffer",
        "kind": "chip",
        "x": 469,
        "y": 106,
        "detail": "The receiver temporarily retains arriving media to absorb delay variation."
      },
      {
        "id": "view",
        "label": "Viewer",
        "kind": "phone",
        "x": 603,
        "y": 205,
        "detail": "The decoder and display consume media at scheduled playout times."
      }
    ],
    "steps": [
      {
        "label": "Request",
        "title": "Request a video session",
        "body": "The viewer requests a stream. Service functions identify the session and arrange delivery over the transport network.",
        "idea": "NGN separates service functions from the underlying transport.",
        "active": [
          "view",
          "control",
          "service"
        ],
        "links": [
          [
            "view",
            "control",
            "Request"
          ],
          [
            "control",
            "service",
            "Set up"
          ]
        ]
      },
      {
        "label": "Transmit",
        "title": "Send a timed media stream",
        "body": "The source timestamps media and sends packets through the IP network. The receiver uses media timing when scheduling playback.",
        "idea": "A steady source can still produce uneven arrivals at the receiver.",
        "active": [
          "service",
          "net",
          "buffer"
        ],
        "links": [
          [
            "service",
            "net",
            "Packets"
          ],
          [
            "net",
            "buffer",
            "Arrivals"
          ]
        ]
      },
      {
        "label": "Vary",
        "title": "Introduce network jitter",
        "body": "Increase jitter to spread out packet arrivals. Some packets now reach the receiver closer to their playout deadlines.",
        "idea": "Jitter describes variation in delay.",
        "active": [
          "net",
          "buffer"
        ],
        "links": [
          [
            "net",
            "buffer",
            "Variable delay"
          ]
        ]
      },
      {
        "label": "Buffer",
        "title": "Trade latency for headroom",
        "body": "Increase buffer depth. Waiting longer before playout gives more late packets time to arrive and increases startup latency.",
        "idea": "A larger buffer can absorb more variation at the cost of delay.",
        "active": [
          "buffer",
          "view"
        ],
        "links": [
          [
            "buffer",
            "view",
            "Timed playout"
          ]
        ]
      },
      {
        "label": "Compare",
        "title": "Compare two settings",
        "body": "Try high jitter with a shallow buffer, then raise the buffer depth. Watch how packet readiness at each deadline changes.",
        "idea": "A conversational call and a one-way stream can tolerate different playout delays.",
        "active": [
          "net",
          "buffer",
          "view"
        ],
        "links": [
          [
            "net",
            "buffer",
            "Receive"
          ],
          [
            "buffer",
            "view",
            "Play"
          ]
        ]
      }
    ]
  }
]

export default lessons
