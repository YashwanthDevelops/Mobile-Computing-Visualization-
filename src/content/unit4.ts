import type { Lesson } from '../types'

const lessons: Lesson[] = [
  {
    "slug": "symbian",
    "title": "Symbian OS Architecture and Application Development",
    "short": "Symbian OS",
    "question": "How can a contacts app open its database while the UI stays responsive?",
    "mode": "layers",
    "nodes": [
      {
        "id": "ui",
        "label": "Contacts UI",
        "kind": "phone",
        "x": 104,
        "y": 122,
        "detail": "The application UI receives input and paints the contacts list."
      },
      {
        "id": "ao",
        "label": "Active object",
        "kind": "app",
        "x": 260,
        "y": 85,
        "detail": "An active object owns a pending asynchronous request. Its RunL method handles completion on the active scheduler."
      },
      {
        "id": "session",
        "label": "Client API",
        "kind": "gate",
        "x": 420,
        "y": 112,
        "detail": "The contacts model API exposes database operations and a client-side interface to services."
      },
      {
        "id": "server",
        "label": "Contacts server",
        "kind": "server",
        "x": 565,
        "y": 172,
        "detail": "A server process handles requests and manages shared access to contacts data."
      },
      {
        "id": "kernel",
        "label": "Kernel / IPC",
        "kind": "chip",
        "x": 340,
        "y": 244,
        "detail": "The kernel mediates communication between separate client and server processes."
      },
      {
        "id": "store",
        "label": "Contact store",
        "kind": "db",
        "x": 560,
        "y": 258,
        "detail": "Persistent contact records are accessed through the contacts service."
      }
    ],
    "steps": [
      {
        "label": "Tap",
        "title": "Open the contacts app",
        "body": "The user opens a contacts view. Its event handler starts an asynchronous database-open operation.",
        "idea": "UI code can yield while a service operation is pending.",
        "active": [
          "ui",
          "ao"
        ],
        "links": [
          [
            "ui",
            "ao",
            "Open"
          ]
        ]
      },
      {
        "label": "Submit",
        "title": "Cross the client boundary",
        "body": "The client API sends the request through kernel-mediated interprocess communication to the contacts server.",
        "idea": "A client session gives the app a controlled interface to the service.",
        "active": [
          "ao",
          "session",
          "kernel",
          "server"
        ],
        "links": [
          [
            "ao",
            "session",
            "Request"
          ],
          [
            "session",
            "kernel",
            "IPC"
          ],
          [
            "kernel",
            "server",
            "Deliver"
          ]
        ]
      },
      {
        "label": "Wait",
        "title": "Keep processing UI events",
        "body": "The active scheduler can dispatch other ready events while the contacts server opens the store.",
        "idea": "The app thread does not need to poll the database.",
        "active": [
          "ui",
          "server",
          "store"
        ],
        "links": [
          [
            "server",
            "store",
            "Open store"
          ]
        ],
        "value": "Pending"
      },
      {
        "label": "Complete",
        "title": "Dispatch the completion",
        "body": "When the open operation finishes, the request status changes. The scheduler invokes the ready active object’s RunL handler.",
        "idea": "An active object turns an asynchronous completion into ordinary app code.",
        "active": [
          "server",
          "kernel",
          "ao"
        ],
        "links": [
          [
            "server",
            "kernel",
            "Complete"
          ],
          [
            "kernel",
            "ao",
            "Wake scheduler"
          ]
        ],
        "value": "Ready"
      },
      {
        "label": "Render",
        "title": "Show the first contact",
        "body": "The app uses the opened database to read a contact and update its view. The event loop then waits for more user input.",
        "idea": "Service access and display logic have separate jobs.",
        "active": [
          "ao",
          "ui"
        ],
        "links": [
          [
            "ao",
            "ui",
            "Update view"
          ]
        ]
      }
    ]
  },
  {
    "slug": "palm-os",
    "title": "Palm OS Architecture and Application Development",
    "short": "Palm OS",
    "question": "What happens between a stylus tap and saving a Palm OS record?",
    "mode": "map",
    "nodes": [
      {
        "id": "stylus",
        "label": "Stylus",
        "kind": "tablet",
        "x": 83,
        "y": 153,
        "detail": "A tap on the digitizer supplies input to the operating system."
      },
      {
        "id": "queue",
        "label": "Event queue",
        "kind": "chip",
        "x": 245,
        "y": 88,
        "detail": "The Event Manager supplies events to the app through EvtGetEvent."
      },
      {
        "id": "dispatch",
        "label": "Dispatch",
        "kind": "gate",
        "x": 424,
        "y": 88,
        "detail": "System, menu and application handlers get an opportunity to handle the event before form dispatch."
      },
      {
        "id": "form",
        "label": "Form handler",
        "kind": "app",
        "x": 553,
        "y": 212,
        "detail": "An application-defined handler responds to controls on the active form."
      },
      {
        "id": "data",
        "label": "Record DB",
        "kind": "db",
        "x": 310,
        "y": 249,
        "detail": "The Data Manager organizes application records in a Palm database."
      }
    ],
    "steps": [
      {
        "label": "Tap",
        "title": "Tap Save on a form",
        "body": "A stylus tap lands on a control. Palm OS processes the pen input and produces a control-selection event for the app.",
        "idea": "A physical gesture can produce higher-level application events.",
        "active": [
          "stylus",
          "queue"
        ],
        "links": [
          [
            "stylus",
            "queue",
            "Control select"
          ]
        ]
      },
      {
        "label": "Read",
        "title": "Read the next event",
        "body": "The app calls EvtGetEvent. The event carries its type and information identifying the selected control.",
        "idea": "The app handles one event and then returns to the loop.",
        "active": [
          "queue",
          "dispatch"
        ],
        "links": [
          [
            "queue",
            "dispatch",
            "ctlSelectEvent"
          ]
        ]
      },
      {
        "label": "Dispatch",
        "title": "Route to the active form",
        "body": "The system, menu and application-level handlers pass this event onward. FrmDispatchEvent invokes the active form’s handler.",
        "idea": "The same loop routes many kinds of input to their owners.",
        "active": [
          "dispatch",
          "form"
        ],
        "links": [
          [
            "dispatch",
            "form",
            "FrmDispatchEvent"
          ]
        ]
      },
      {
        "label": "Write",
        "title": "Update the record",
        "body": "The form handler recognizes the Save control, writes the edited fields through the Data Manager, and releases the record.",
        "idea": "Persistent records survive the next trip around the event loop.",
        "active": [
          "form",
          "data"
        ],
        "links": [
          [
            "form",
            "data",
            "Write record"
          ]
        ]
      },
      {
        "label": "Return",
        "title": "Wait for the next input",
        "body": "After handling Save, the app returns to EvtGetEvent. A later event may open another form or ask the app to stop.",
        "idea": "Short handlers keep the rest of the interface responsive.",
        "active": [
          "form",
          "queue"
        ],
        "links": [
          [
            "form",
            "queue",
            "Next event"
          ]
        ]
      }
    ]
  },
  {
    "slug": "client-hardware",
    "title": "Client Programming, Mobile Phone and PDA Hardware",
    "short": "Phone and PDA hardware",
    "question": "How does a physical input become a callback in a mobile application?",
    "mode": "compare",
    "nodes": [
      {
        "id": "touch",
        "label": "Digitizer",
        "kind": "tablet",
        "x": 82,
        "y": 154,
        "detail": "The digitizer detects contact and samples its position on a classic PDA."
      },
      {
        "id": "radio",
        "label": "Modem",
        "kind": "radio",
        "x": 82,
        "y": 254,
        "detail": "A cellular modem processes the radio protocols for phone service and signals changes in call state."
      },
      {
        "id": "driver",
        "label": "Driver",
        "kind": "chip",
        "x": 250,
        "y": 168,
        "detail": "A driver translates device-specific data into events the operating system understands."
      },
      {
        "id": "service",
        "label": "OS service",
        "kind": "server",
        "x": 420,
        "y": 165,
        "detail": "The input or telephony service translates system events into the application-facing event model."
      },
      {
        "id": "client",
        "label": "Client app",
        "kind": "phone",
        "x": 592,
        "y": 166,
        "detail": "The app subscribes to documented events, updates its state, and repaints the screen."
      }
    ],
    "steps": [
      {
        "label": "Touch",
        "title": "Tap a PDA screen",
        "body": "A stylus presses the digitizer. The sensor measures a position in its own coordinate space.",
        "idea": "The application starts with a physical event at a specific device.",
        "active": [
          "touch"
        ],
        "links": []
      },
      {
        "label": "Translate",
        "title": "Convert samples into input",
        "body": "The driver accepts samples and applies the device’s coordinate mapping. It reports a pen-down event to the OS.",
        "idea": "The driver hides the details of this particular digitizer.",
        "active": [
          "touch",
          "driver",
          "service"
        ],
        "links": [
          [
            "touch",
            "driver",
            "Sample"
          ],
          [
            "driver",
            "service",
            "Pen down"
          ]
        ]
      },
      {
        "label": "Dispatch",
        "title": "Deliver a UI event",
        "body": "The OS finds the target window and posts an event. The application’s event loop dispatches it to the appropriate callback.",
        "idea": "A GUI callback carries useful coordinates and a target.",
        "active": [
          "service",
          "client"
        ],
        "links": [
          [
            "service",
            "client",
            "Pen event"
          ]
        ]
      },
      {
        "label": "Paint",
        "title": "Update the selected item",
        "body": "The callback marks the tapped item as selected. The view redraws with the new state and returns to the event loop.",
        "idea": "User-visible work follows the app’s event model.",
        "active": [
          "client"
        ],
        "links": []
      }
    ],
    "scenarios": [
      {
        "label": "Incoming call",
        "description": "Follow a cellular event through a phone’s telephony stack.",
        "steps": [
          {
            "label": "Page",
            "title": "A call reaches the modem",
            "body": "The network signals an incoming call. The modem processes the radio signaling and reports the incoming call state.",
            "idea": "The modem handles radio protocols before the application sees the event.",
            "active": [
              "radio"
            ],
            "links": []
          },
          {
            "label": "Notify",
            "title": "Pass the modem event upward",
            "body": "The device interface passes the modem indication to the OS telephony service.",
            "idea": "Hardware-specific messages are translated at the device boundary.",
            "active": [
              "radio",
              "driver",
              "service"
            ],
            "links": [
              [
                "radio",
                "driver",
                "Indication"
              ],
              [
                "driver",
                "service",
                "Call state"
              ]
            ]
          },
          {
            "label": "Dispatch",
            "title": "Notify the dialer",
            "body": "The telephony service notifies the authorized dialer that the phone is ringing.",
            "idea": "Applications use a telephony API to observe platform call state.",
            "active": [
              "service",
              "client"
            ],
            "links": [
              [
                "service",
                "client",
                "Ringing"
              ]
            ]
          },
          {
            "label": "Display",
            "title": "Paint the call screen",
            "body": "The dialer displays the incoming call and its answer and decline controls.",
            "idea": "The UI reflects an event first observed by the modem.",
            "active": [
              "client"
            ],
            "links": []
          }
        ]
      }
    ]
  },
  {
    "slug": "quantum-frameworks",
    "title": "Quantum Programming Frameworks for Mobile Applications",
    "short": "Quantum frameworks",
    "question": "How does one circuit instruction change the measurements shown on a phone?",
    "mode": "experiment",
    "nodes": [
      {
        "id": "app",
        "label": "Mobile UI",
        "kind": "phone",
        "x": 83,
        "y": 155,
        "detail": "A classical mobile UI chooses the circuit settings and renders the result."
      },
      {
        "id": "circuit",
        "label": "Circuit",
        "kind": "chip",
        "x": 251,
        "y": 102,
        "detail": "A quantum framework describes operations on qubits and measurements into classical bits."
      },
      {
        "id": "backend",
        "label": "Simulator",
        "kind": "laptop",
        "x": 423,
        "y": 209,
        "detail": "The browser models one ideal qubit. A production framework can submit compatible circuits to a remote backend."
      },
      {
        "id": "result",
        "label": "Counts",
        "kind": "signal",
        "x": 592,
        "y": 154,
        "detail": "Counts summarize measured bit values over a finite number of repetitions."
      }
    ],
    "steps": [
      {
        "label": "Prepare",
        "title": "Start with a known state",
        "body": "The simulated qubit starts in |0⟩. Measuring it immediately in the computational basis yields 0.",
        "idea": "Initialization sets the starting state for each shot.",
        "active": [
          "app",
          "circuit"
        ],
        "links": [
          [
            "app",
            "circuit",
            "Prepare |0⟩"
          ]
        ]
      },
      {
        "label": "Gate",
        "title": "Choose the Hadamard gate",
        "body": "Enable H to give 0 and 1 equal measurement probabilities. With H disabled, the ideal qubit stays in |0⟩.",
        "idea": "A gate transforms the quantum state before measurement.",
        "active": [
          "circuit"
        ],
        "links": []
      },
      {
        "label": "Measure",
        "title": "Convert a qubit to one bit",
        "body": "Measure in the computational basis. Each individual shot returns one classical bit, even when both outcomes are possible.",
        "idea": "One measurement is a sample from the probabilities specified by the circuit.",
        "active": [
          "circuit",
          "backend"
        ],
        "links": [
          [
            "circuit",
            "backend",
            "Measure"
          ]
        ]
      },
      {
        "label": "Count",
        "title": "Compare repeated shots",
        "body": "Repeat the same preparation, gate, and measurement. With H enabled, larger samples typically bring the fraction of ones closer to one half.",
        "idea": "The histogram records observed outcomes from the simulated circuit.",
        "active": [
          "backend",
          "result",
          "app"
        ],
        "links": [
          [
            "backend",
            "result",
            "Bit samples"
          ],
          [
            "result",
            "app",
            "Histogram"
          ]
        ]
      }
    ]
  }
]

export default lessons
