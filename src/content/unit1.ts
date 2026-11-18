import type { Lesson } from '../types'

// Technical references: IETF TLS 1.3 (RFC 8446), Han & Kim, IEEE Transactions on Evolutionary Computation (2002),
// NIST Diamond NV Center Magnetometry. Cost examples and sensor scenarios are illustrative.
const lessons: Lesson[] = [
  {
    slug: "mobile-architecture",
    title: "Mobile Computing Architecture, Middleware and Gateways",
    short: "Mobile architecture",
    question: "How does a tap on a phone become a request a service can answer?",
    mode: "map",
    nodes: [
      {
        id: "phone",
        label: "Mobile app",
        kind: "phone",
        x: 90,
        y: 180,
        detail: "Collects the input and renders the reply. A request ID lets the service recognise a retried submission."
      },
      {
        id: "access",
        label: "Access point",
        kind: "router",
        x: 240,
        y: 85,
        detail: "The access point carries frames between the wireless link and the wired network."
      },
      {
        id: "gateway",
        label: "API gateway",
        kind: "gate",
        x: 395,
        y: 150,
        detail: "Accepts the app’s external API request and routes it to the appropriate internal service."
      },
      {
        id: "middleware",
        label: "Middleware",
        kind: "chip",
        x: 415,
        y: 265,
        detail: "Provides shared handling for identity, message formats and retries across applications."
      },
      {
        id: "service",
        label: "Shelf service",
        kind: "db",
        x: 590,
        y: 190,
        detail: "Owns the catalogue data and looks up a shelf location for the supplied book identifier."
      }
    ],
    steps: [
      {
        label: "Tap",
        title: "Ask for a shelf location",
        body: "A library app needs the shelf for book B17. Tapping Find creates a small request containing that identifier.",
        idea: "An application request describes an operation and its input.",
        active: ["phone"],
        value: "Book B17"
      },
      {
        label: "Transmit",
        title: "Cross the wireless hop",
        body: "The handset sends frames to the access point, which bridges them onto the campus network.",
        idea: "The radio link is one hop in a longer request path.",
        active: ["phone","access"],
        links: [["phone","access","Wi-Fi frames"]],
        value: "Wi-Fi"
      },
      {
        label: "Route",
        title: "Choose the catalogue route",
        body: "The gateway receives the request for /books/B17. Its route table identifies the catalogue handler.",
        idea: "A gateway connects the external interface to internal services.",
        active: ["access","gateway"],
        links: [["access","gateway","HTTPS"]],
        value: "GET /books/B17"
      },
      {
        label: "Adapt",
        title: "Translate the app request",
        body: "Middleware maps B17 into the catalogue’s lookup format and passes the caller’s identity along.",
        idea: "Shared middleware keeps service-specific translations out of the app.",
        active: ["gateway","middleware","service"],
        links: [["gateway","middleware","dispatch"],["middleware","service","lookup"]],
        value: "lookup(B17)"
      },
      {
        label: "Return",
        title: "Show the shelf on screen",
        body: "The service finds shelf A4. Middleware formats the result and the gateway returns it through the access network.",
        idea: "The client receives a stable response format even when the internal catalogue changes.",
        active: ["service","middleware","gateway","access","phone"],
        links: [["service","middleware","A4"],["middleware","gateway","result"],["gateway","access","reply"],["access","phone","A4"]],
        value: "Shelf A4"
      }
    ]
  },
  {
    slug: "mobile-generations",
    title: "1G–5G Evolution and Dialogue Control",
    short: "1G–5G evolution",
    question: "What changed as mobile networks moved from analog calls to programmable packet services?",
    mode: "timeline",
    nodes: [
      {
        id: "g1",
        label: "1G",
        kind: "radio",
        x: 80,
        y: 170,
        detail: "Early cellular systems carried analog voice. Cell reuse let limited radio spectrum serve many callers."
      },
      {
        id: "g2",
        label: "2G",
        kind: "phone",
        x: 210,
        y: 170,
        detail: "Digital cellular systems such as GSM carried voice and short messages. GPRS later added packet data."
      },
      {
        id: "g3",
        label: "3G",
        kind: "tower",
        x: 340,
        y: 170,
        detail: "UMTS and other 3G systems expanded mobile data alongside circuit-switched services."
      },
      {
        id: "g4",
        label: "4G",
        kind: "router",
        x: 470,
        y: 170,
        detail: "LTE packet access supports mobile broadband. Operators can carry voice over IMS using VoLTE."
      },
      {
        id: "g5",
        label: "5G",
        kind: "network",
        x: 600,
        y: 170,
        detail: "5G NR provides radio access. Standalone deployments use a 5G core and can support network slicing."
      }
    ],
    steps: [
      {
        label: "1G",
        title: "Carry speech as an analog signal",
        body: "A cell assigns a radio channel to a call. Nearby cells coordinate reuse so more callers can share the available spectrum.",
        idea: "A cellular layout makes frequency reuse practical.",
        active: ["g1"],
        value: "Analog voice"
      },
      {
        label: "2G",
        title: "Encode speech and short messages",
        body: "GSM digitises voice and provides a signaling path for SMS. Later GPRS additions carry packet bursts.",
        idea: "Voice calls and short messages use different network resources.",
        active: ["g2"],
        value: "Digital voice + SMS"
      },
      {
        label: "3G",
        title: "Give mobile data more capacity",
        body: "A 3G handset can browse or send richer media over packet service while circuit-switched voice remains available.",
        idea: "Packet data can coexist with an existing voice core.",
        active: ["g3"],
        value: "Mobile internet"
      },
      {
        label: "4G",
        title: "Carry services over IP",
        body: "An LTE handset uses packet bearers. With VoLTE, IMS signaling establishes a voice session and IP packets carry its media.",
        idea: "Voice becomes a service carried by the packet network.",
        active: ["g4"],
        value: "IP broadband"
      },
      {
        label: "5G",
        title: "Choose service treatment",
        body: "A standalone 5G network can assign different service policies to devices with different needs, such as sensors and video clients.",
        idea: "Radio capability, core configuration and coverage all influence the user experience.",
        active: ["g5"],
        value: "5G NR + 5G core"
      }
    ],
    scenarios: [
      {
        label: "Dialogue modes",
        description: "Compare transmission direction independently of the network generation.",
        steps: [
          {
            label: "Simplex",
            title: "Only one endpoint transmits",
            body: "A broadcast transmitter sends information to a receiver. The receiver has no return path in this example.",
            idea: "Simplex describes a one-way exchange.",
            active: ["a","b"],
            links: [["a","b","broadcast"]],
            value: "A → B"
          },
          {
            label: "Half-duplex",
            title: "Take turns on the channel",
            body: "Endpoint A holds the floor and transmits. When A releases the channel, B can take a turn.",
            idea: "Half-duplex permits both directions at different times.",
            active: ["a","b"],
            links: [["a","b","push to talk"]],
            value: "A → B, then B → A"
          },
          {
            label: "Reply",
            title: "Change the talker",
            body: "A releases the talk button. B now holds it and sends a response on the same half-duplex channel.",
            idea: "Control of the floor prevents overlapping transmissions.",
            active: ["a","b"],
            links: [["b","a","reply"]],
            value: "B → A"
          },
          {
            label: "Full-duplex",
            title: "Talk and listen together",
            body: "During a telephone conversation, participants can hear one another while speaking.",
            idea: "Dialogue direction describes an exchange and can be illustrated across generations.",
            active: ["a","b"],
            links: [["a","b","speech"],["b","a","speech"]],
            value: "A ⇄ B"
          }
        ],
        mode: "map",
        nodes: [
          {
            id: "a",
            label: "Endpoint A",
            kind: "radio",
            x: 155,
            y: 160,
            detail: "The first participant. Its ability to send or receive depends on the selected exchange."
          },
          {
            id: "b",
            label: "Endpoint B",
            kind: "phone",
            x: 525,
            y: 160,
            detail: "The second participant. Follow the arrows to see who can transmit during this exchange."
          }
        ]
      }
    ]
  },
  {
    slug: "mobile-security",
    title: "Security in Mobile Computing",
    short: "Mobile security",
    question: "Who can read a phone’s message as it crosses a public hotspot?",
    mode: "map",
    nodes: [
      {
        id: "phone",
        label: "Handset",
        kind: "phone",
        x: 95,
        y: 175,
        detail: "The TLS client checks the service identity and protects application data before handing it to the network."
      },
      {
        id: "ap",
        label: "Public hotspot",
        kind: "router",
        x: 335,
        y: 110,
        detail: "Forwards packets. With TLS, the access point can still observe routing information, timing and ciphertext size."
      },
      {
        id: "server",
        label: "Notes service",
        kind: "server",
        x: 590,
        y: 175,
        detail: "The TLS endpoint proves its identity in this example and decrypts a record after verifying its authentication tag."
      }
    ],
    steps: [
      {
        label: "Connect",
        title: "Join the public hotspot",
        body: "The phone prepares to send a note to its service. Nearby infrastructure carries the traffic to the server.",
        idea: "Link access and service identity are separate decisions.",
        active: ["phone","ap"],
        links: [["phone","ap","connect"]],
        value: "Public Wi-Fi"
      },
      {
        label: "Verify",
        title: "Check the service identity",
        body: "During this certificate-based TLS handshake, the client checks the certificate chain and hostname and verifies the server’s proof of its private key.",
        idea: "A valid certificate binds an expected service name to a public key.",
        active: ["phone","server"],
        links: [["server","phone","handshake"]],
        value: "Identity verified"
      },
      {
        label: "Protect",
        title: "Send an encrypted record",
        body: "The client protects the note with a traffic key. A hotspot forwarding the record sees ciphertext and network metadata.",
        idea: "TLS protects application content while it travels between the endpoints.",
        active: ["phone","ap"],
        links: [["phone","ap","ciphertext"]],
        value: "Encrypted record"
      },
      {
        label: "Read",
        title: "Verify and open at the server",
        body: "The service verifies the record’s authentication tag before releasing the note to its application. A modified record fails this check.",
        idea: "Integrity checking detects changes to a protected record.",
        active: ["ap","server"],
        links: [["ap","server","ciphertext"]],
        value: "Note delivered"
      }
    ],
    scenarios: [
      {
        label: "Plaintext",
        description: "Inspect the same harmless note over an unencrypted application connection.",
        steps: [
          {
            label: "Compose",
            title: "Write the sample note",
            body: "The app writes the text “Shelf A4” into an ordinary HTTP message.",
            idea: "The payload will cross this open hotspot in readable form.",
            active: ["phone"],
            value: "Shelf A4"
          },
          {
            label: "Forward",
            title: "Look at the hotspot",
            body: "The access point receives the message and can see the note as it forwards the traffic.",
            idea: "Plaintext exposes application content to observers along the path.",
            active: ["phone","ap"],
            links: [["phone","ap","Shelf A4"]],
            value: "Visible at hotspot"
          },
          {
            label: "Deliver",
            title: "Read the note at its destination",
            body: "The service receives the text. This exchange has provided no TLS-based proof of service identity or message integrity.",
            idea: "A successful delivery alone gives the sender no assurance of confidentiality.",
            active: ["ap","server"],
            links: [["ap","server","Shelf A4"]],
            value: "Plaintext delivered"
          }
        ]
      }
    ]
  },
  {
    slug: "quantum-optimization",
    title: "Quantum-Inspired Algorithms for Mobile Applications",
    short: "Quantum-inspired search",
    question: "Which parts of an image-processing job should a phone send to an edge server?",
    mode: "experiment",
    nodes: [
      {
        id: "phone",
        label: "On device",
        kind: "phone",
        x: 90,
        y: 175,
        detail: "Local tasks consume phone energy and avoid network transfer."
      },
      {
        id: "sample",
        label: "Sampler",
        kind: "chip",
        x: 270,
        y: 85,
        detail: "A classical program samples three binary placement choices from stored probabilities."
      },
      {
        id: "edge",
        label: "Edge server",
        kind: "server",
        x: 560,
        y: 175,
        detail: "Offloaded work saves local compute but adds communication time and energy."
      },
      {
        id: "score",
        label: "Cost model",
        kind: "app",
        x: 335,
        y: 250,
        detail: "The teaching model adds local-task and offload costs. Scores are illustrative dimensionless values. Lower is better."
      }
    ],
    steps: [
      {
        label: "Set up",
        title: "Place three tasks",
        body: "Resize, infer and archive can each run locally (L) or at the edge (E). Three binary choices give eight placements.",
        idea: "The search space doubles each time another independent binary task is added.",
        active: ["phone","edge","sample"],
        value: "8 placements"
      },
      {
        label: "Sample",
        title: "Draw a placement",
        body: "Begin with a 50% chance of offloading each task. One example draw, LLL, keeps all three tasks on the phone.",
        idea: "Sampling converts stored probabilities into a concrete assignment.",
        active: ["sample","phone"],
        links: [["sample","phone","LLL"]],
        value: "LLL"
      },
      {
        label: "Score",
        title: "Compare two candidates",
        body: "For resize, infer and archive, local costs are 2, 7 and 3. With a fast link, edge costs are 4, 2 and 2. LLL costs 12, while LEL costs 7.",
        idea: "The objective combines device and communication costs into one score.",
        active: ["phone","edge","score"],
        links: [["phone","score","LLL = 12"],["edge","score","LEL = 7"]],
        value: "Best seen 7"
      },
      {
        label: "Update",
        title: "Favor a better candidate",
        body: "An update toward LEL increases the chance of offloading inference and reduces the chance of offloading the other two tasks.",
        idea: "Quantum-inspired rotation updates can be computed on a classical processor.",
        active: ["score","sample"],
        links: [["score","sample","favor LEL"]],
        value: "Favor LEL"
      },
      {
        label: "Resample",
        title: "Keep the best observed score",
        body: "The next sample can still differ. A draw of LEE costs 2 + 2 + 2 = 6 and becomes the new best observed placement.",
        idea: "Keeping a best-so-far solution preserves a good result across later samples.",
        active: ["sample","phone","edge","score"],
        links: [["sample","edge","offload"],["edge","score","LEE = 6"]],
        value: "Best seen 6"
      }
    ],
    scenarios: [
      {
        label: "Slow uplink",
        description: "Repeat the same candidate comparison with more expensive transfers.",
        steps: [
          {
            label: "Cost change",
            title: "Increase the transfer cost",
            body: "Local costs remain 2, 7 and 3. In this illustrative slow-link model the edge costs rise to 6, 9 and 5.",
            idea: "A placement objective depends on the network as well as the processors.",
            active: ["edge","score"],
            links: [["edge","score","6 / 9 / 5"]],
            value: "Slow uplink"
          },
          {
            label: "Compare",
            title: "Score the old favorite",
            body: "LEE now costs 2 + 9 + 5 = 16. Sampling LLL yields 2 + 7 + 3 = 12.",
            idea: "A placement that worked on a fast link can cost more on a slow link.",
            active: ["phone","edge","score"],
            links: [["edge","score","LEE = 16"],["phone","score","LLL = 12"]],
            value: "Best seen 12"
          },
          {
            label: "Update",
            title: "Favor on-device work",
            body: "A probability update toward LLL shifts all three choices toward local execution. Later draws can still explore the edge.",
            idea: "A quantum-inspired search changes probabilities instead of fixing all decisions immediately.",
            active: ["score","sample","phone"],
            links: [["score","sample","favor LLL"],["sample","phone","local"]],
            value: "Favor LLL"
          }
        ]
      }
    ]
  },
  {
    slug: "quantum-devices",
    title: "Quantum-Enhanced Mobile Devices",
    short: "Quantum-enhanced devices",
    question: "How could a portable diamond sensor turn a magnetic field into a phone reading?",
    mode: "map",
    nodes: [
      {
        id: "field",
        label: "Magnetic field",
        kind: "signal",
        x: 85,
        y: 170,
        detail: "The surrounding magnetic field shifts electron spin resonances inside the sensor."
      },
      {
        id: "sensor",
        label: "Diamond sensor",
        kind: "sensor",
        x: 245,
        y: 90,
        detail: "Nitrogen-vacancy defects in diamond have spin states whose resonances respond to a magnetic field."
      },
      {
        id: "optics",
        label: "Optical readout",
        kind: "radio",
        x: 420,
        y: 190,
        detail: "Light prepares the sensor, and a photodetector measures fluorescence while a microwave frequency is swept."
      },
      {
        id: "phone",
        label: "Mobile display",
        kind: "phone",
        x: 595,
        y: 110,
        detail: "A classical processor fits the resonance positions and displays a calibrated estimate of the field projection."
      }
    ],
    steps: [
      {
        label: "Expose",
        title: "Place the prototype near a field",
        body: "This illustrative accessory couples a diamond magnetometer to a phone. The field being measured has a component along the sensor axis.",
        idea: "A quantum sensor uses a physical quantum state to measure its surroundings.",
        active: ["field","sensor"],
        links: [["field","sensor","field"]],
        value: "Weak field"
      },
      {
        label: "Prepare",
        title: "Prepare the diamond spins",
        body: "Optical excitation prepares electron spins at defects in the diamond. The reader then sweeps a microwave frequency across the spin resonances.",
        idea: "The measurement uses a repeatable preparation and readout cycle.",
        active: ["sensor","optics"],
        links: [["optics","sensor","excite"]],
        value: "Frequency sweep"
      },
      {
        label: "Observe",
        title: "Find the fluorescence dips",
        body: "At resonance the fluorescence intensity changes. The reader records the frequencies at which the dips appear.",
        idea: "The dip positions encode the field projection along the sensor axis.",
        active: ["sensor","optics"],
        links: [["sensor","optics","photons"]],
        value: "Narrow splitting"
      },
      {
        label: "Display",
        title: "Convert the spacing to a reading",
        body: "The processor uses calibration to turn the measured frequency separation into a field estimate for this axis.",
        idea: "The phone handles classical processing while the accessory provides quantum sensing.",
        active: ["optics","phone"],
        links: [["optics","phone","estimate"]],
        value: "Lower field"
      }
    ],
    scenarios: [
      {
        label: "Stronger field",
        description: "Increase the simulated field component along the same sensor axis.",
        steps: [
          {
            label: "Change field",
            title: "Increase the axial component",
            body: "Keep the sensor orientation fixed and move the illustrative source closer. The axial field component grows.",
            idea: "Holding orientation fixed makes two readings easier to compare.",
            active: ["field","sensor"],
            links: [["field","sensor","stronger field"]],
            value: "Stronger field"
          },
          {
            label: "Read peaks",
            title: "Observe a wider separation",
            body: "In this simple axial-field model the two resonance frequencies move farther apart. The detector locates the two fluorescence dips.",
            idea: "The splitting responds to the magnitude of the axial field component.",
            active: ["sensor","optics"],
            links: [["sensor","optics","photons"]],
            value: "Wider splitting"
          },
          {
            label: "Display",
            title: "Compare the estimates",
            body: "The same calibration maps the wider separation to a larger field estimate on the mobile display.",
            idea: "The plotted change follows the simulated field under the same measurement conditions.",
            active: ["optics","phone"],
            links: [["optics","phone","estimate"]],
            value: "Higher field"
          }
        ]
      }
    ]
  }
]

export default lessons
