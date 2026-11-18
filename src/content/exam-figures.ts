export type ExamFigure = {
  title:string
  publisher:string
  source:string
  image?:string
  preview?:string
  draw:string
  credit?:string
  license?:{name:string;url:string}
}

export const examFigures:Record<string,ExamFigure[]> = {
  "mobile-architecture": [
    {
      "title": "Schematic of a Mobile Computing Environment",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/raimundo-gonzales/mobile-computing",
      "image": "https://image3.slideserve.com/7055908/figure-1-a-schematic-representation-of-a-mobile-computing-environment-l.jpg",
      "draw": "Draw the handset, bearer network, gateway, middleware, and application server left to right. Keep the data store beside the server and show return traffic with a separate arrow."
    }
  ],
  "mobile-generations": [
    {
      "title": "Mobile Network Generations Timeline",
      "publisher": "Paul’s technical notes",
      "source": "https://paul.pub/5g-intro/",
      "image": "https://paul-pub.oss-cn-beijing.aliyuncs.com/2020/2020-08-5g-intro/1g-5g.png",
      "draw": "Draw a five-column timeline and stop at 5G. Label analog voice, digital voice and SMS, mobile data, all-IP broadband, and flexible 5G services."
    }
  ],
  "session-dialogue": [
    {
      "title": "Client and Server During an HTTP Session",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/fox/interprocess-communications",
      "image": "https://image.slideserve.com/631888/event-diagram-for-a-http-session-l.jpg",
      "draw": "Put the client and service on two lifelines. Draw a short request and response, then a session setup followed by several exchanges and a close. Label where session state is held."
    }
  ],
  "middleware": [
    {
      "title": "Mobile Computing Functions Architecture",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/marcin/mobile-computing",
      "image": "https://image2.slideserve.com/4378424/mobile-computing-functions-cont2-l.jpg",
      "draw": "Place the middleware between the device-facing network and the origin service. Label the common functions it provides, such as message queuing, adaptation, session handling, and synchronization."
    }
  ],
  "gateways": [
    {
      "title": "WAP Gateway Network Example",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/durin/introduction-and-overview-powerpoint-ppt-presentation",
      "image": "https://image1.slideserve.com/3026132/network-example-1-wap-gateway-l.jpg",
      "draw": "Draw the mobile client, gateway, and origin server. Label the two protocol legs and mark the translation boundary in the middle."
    }
  ],
  "mobile-app-development": [
    {
      "title": "Offline-First News Data Layer Architecture",
      "publisher": "Android Developers",
      "source": "https://developer.android.com/topic/architecture/data-layer/offline-first",
      "image": "https://developer.android.com/static/images/topic/architecture/data-layer/nia-sync.png",
      "draw": "Put the UI over a repository with local and remote data sources. Arrow cached reads toward the UI and queued writes toward the server, with a synchronization path back to the local store.",
      "preview": "./assets/gallery/offline-data.png",
      "credit": "Android Developers · Offline-first data layer",
      "license": {
        "name": "CC BY 2.5",
        "url": "https://creativecommons.org/licenses/by/2.5/"
      }
    }
  ],
  "mobile-security": [
    {
      "title": "BYOD Solution Architecture",
      "publisher": "NIST NCCoE",
      "source": "https://www.nccoe.nist.gov/publication/1800-22/VolB/index.html",
      "image": "https://www.nccoe.nist.gov/publication/1800-22/_images/VolB-image4.png",
      "draw": "Draw the device, untrusted network, security gateway or VPN, and protected resources. Mark which link is encrypted and where authentication and device-management policy are applied.",
      "credit": "NIST NCCoE · SP 1800-22B, BYOD example solution architecture"
    }
  ],
  "quantum-optimization": [
    {
      "title": "Quantum-Inspired Evolutionary Algorithm Workflow",
      "publisher": "Springer Nature",
      "source": "https://link.springer.com/article/10.1186/s13677-025-00777-2",
      "image": "https://media.springernature.com/lw685/springer-static/image/art%3A10.1186%2Fs13677-025-00777-2/MediaObjects/13677_2025_777_Fig4_HTML.png",
      "draw": "Draw candidate initialization, fitness evaluation, probability updates, and a convergence test. Loop back to sampling and label the selected mobile or edge assignment.",
      "preview": "./assets/gallery/quantum-optimization.png",
      "credit": "Umesh Kumar Lilhore et al. · QHRMOF (2025), Figure 4",
      "license": {"name":"CC BY-NC-ND 4.0","url":"https://creativecommons.org/licenses/by-nc-nd/4.0/"}
    }
  ],
  "quantum-devices": [
    {
      "title": "Diamond NV Center Measurement Setup",
      "publisher": "PubMed Central",
      "source": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9268007/",
      "image": "https://cdn.ncbi.nlm.nih.gov/pmc/blobs/1f81/9268007/ef998c3eaea4/nanomaterials-12-02234-g002.jpg",
      "draw": "Draw optical excitation into the diamond NV sensor, microwave control into the same sensor, and detected fluorescence through the photodiode to classical processing. The user interface can sit after the processor.",
      "preview": "./assets/gallery/nv-sensor.jpg",
      "credit": "Andris Berzins, Hugo Grube, Einars Sprugis, Guntars Vaivars and Ilja Fescenko · Nanomaterials 12 (2022), 2234, Figure 2",
      "license": {
        "name": "CC BY 4.0",
        "url": "https://creativecommons.org/licenses/by/4.0/"
      }
    }
  ],
  "bluetooth-wimax": [
    {
      "title": "Bluetooth Network Architecture",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/sophie/wireless-personal-area-networks-wpan-part-2-ieee802-15-bluetooth",
      "image": "https://image1.slideserve.com/3141605/bluetooth-network-architecture-n.jpg",
      "draw": "Draw one central device with a few peripheral links. Add a second piconet and mark the device participating in both if you are asked for a scatternet."
    }
  ],
  "rfid": [
    {
      "title": "RFID Middleware Architecture Overview",
      "publisher": "Frontiers in Mechanical Engineering",
      "source": "https://www.frontiersin.org/journals/mechanical-engineering/articles/10.3389/fmech.2023.1242612/full",
      "image": "https://www.frontiersin.org/files/Articles/1242612/xml-images/fmech-09-1242612-g013.webp",
      "draw": "Draw the tag and reader antenna facing each other. Show reader interrogation in one direction and the tag reply in the other. Connect the reader to middleware and the backend.",
      "preview": "./assets/gallery/rfid-middleware.webp",
      "credit": "A. Haibi, K. Oufaska, K. El Yassini, M. Boulmalf and M. Bouya · Frontiers in Mechanical Engineering (2023), Figure 13",
      "license": {
        "name": "CC BY 4.0",
        "url": "https://creativecommons.org/licenses/by/4.0/"
      }
    }
  ],
  "wimax": [
    {
      "title": "WiMAX Network Architecture Overview",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/garima/wimax",
      "image": "https://image1.slideserve.com/1637594/wimax-network-a-rchitecture-l.jpg",
      "draw": "Draw a subscriber station, serving base station, access network or ASN gateway, and connectivity network. Label the air interface separately from the service network’s backhaul."
    }
  ],
  "mobile-ip": [
    {
      "title": "Mobile IP Registration and Tunneling Diagram",
      "publisher": "Federal University of Rio de Janeiro",
      "source": "https://www.gta.ufrj.br/grad/09_1/versao-final/ipmovel/index.html",
      "image": "https://www.gta.ufrj.br/grad/09_1/versao-final/ipmovel/images/registration.jpg",
      "draw": "Draw the correspondent node, home agent, visited network, and mobile node. Label the registration path and the tunnel from the home agent to the care-of address, followed by decapsulation."
    }
  ],
  "ipv6": [
    {
      "title": "IPv6 SLAAC Router Solicitation and Advertisement Diagram",
      "publisher": "Study CCNA",
      "source": "https://study-ccna.com/ipv6-slaac-stateless-address-autoconfiguration/",
      "image": "https://images.surferseo.art/e5331474-6135-449c-b1cc-7381c54883f4.png",
      "draw": "Draw host and router, then Router Solicitation and Router Advertisement. Add address formation, duplicate-address detection and the default route as three numbered stages."
    }
  ],
  "gsm-architecture": [
    {
      "title": "GSM Network Architecture",
      "publisher": "Wikimedia Commons",
      "source": "https://commons.wikimedia.org/wiki/File:Gsm_network_architecture.png",
      "image": "./assets/gallery/gsm.png",
      "draw": "Group the mobile station, BTS and BSC under radio access, and MSC/GMSC under switching. Place HLR, VLR, AuC and EIR around the core. Label Um, Abis and A on the links.",
      "preview": "./assets/gallery/gsm.png",
      "credit": "Greno · GSM network architecture",
      "license": {
        "name": "Public domain",
        "url": "https://creativecommons.org/publicdomain/mark/1.0/"
      }
    }
  ],
  "gsm": [
    {
      "title": "GSM Mobile Terminated Call Sequence",
      "publisher": "SlideShare course slides",
      "source": "https://www.slideshare.net/slideshow/gsm-call-routing/15338008",
      "image": "https://image.slidesharecdn.com/gsmcallrouting-121125102051-phpapp02/75/Gsm-call-routing-17-2048.jpg",
      "draw": "Use lifelines for the caller, GMSC, HLR, serving MSC/VLR, radio access and handset. Label routing query, MSRN, paging, alerting and connect, then add a separate speech bearer."
    }
  ],
  "gsm-mobility": [
    {
      "title": "GSM Intercell Handover Sequence Diagram",
      "publisher": "BSC Parameter Reference",
      "source": "https://techshelps.github.io/BSC%20Parameter%20Reference/bsc/e-bsc-perf/cm330a.html",
      "image": "https://techshelps.github.io/BSC%20Parameter%20Reference/bsc/e-bsc-perf/e-image/call/intrabscdrop.png",
      "draw": "Draw the handset between the old and target BTSs and show their BSC. Label measurement report, target channel assignment, handover command, access, completion and release of the old channel."
    }
  ],
  "mobile-sms": [
    {
      "title": "GSM SMS MO/MT Call Flow Diagram",
      "publisher": "RF Wireless World",
      "source": "https://www.rfwireless-world.com/articles/sms-mo-mt-call-flow",
      "image": "https://www.rfwireless-world.com/.netlify/images?dpl=69952cba57f9a80007a35b22&h=484&url=_astro%2FSMS-MO-MT-call-flow.B0rW81IE.jpg&w=622",
      "draw": "Draw sender, serving network, SMSC, destination lookup and recipient. Label store-and-forward and a retry branch for an unavailable recipient."
    }
  ],
  "gprs-architecture": [
    {
      "title": "GPRS Core Network",
      "publisher": "Wikimedia Commons",
      "source": "https://commons.wikimedia.org/wiki/File:GPRS_core_structure.png",
      "image": "./assets/gallery/gprs.png",
      "draw": "Draw MS → BSS/PCU → SGSN → GGSN → packet data network. Attach HLR to SGSN and label Um, Gb, Gr, Gn and Gi.",
      "preview": "./assets/gallery/gprs.png",
      "credit": "Mozzerati · GPRS core structure",
      "license": {
        "name": "CC BY-SA 3.0",
        "url": "https://creativecommons.org/licenses/by-sa/3.0/"
      }
    }
  ],
  "gprs": [
    {
      "title": "PDP Context Activation Sequence",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/toby/gprs",
      "image": "https://image1.slideserve.com/1634140/pdp-context-activation1-l.jpg",
      "draw": "Start with MS, SGSN and GGSN lifelines. Mark PDP context request, tunnel creation and response before a separate arrow for user packet traffic."
    }
  ],
  "wap-sms": [
    {
      "title": "WAP 1.x Reference Model and Protocols",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/kaz/chapter-10-wireless-application-protocol-powerpoint-ppt-presentation",
      "image": "https://image2.slideserve.com/4009240/wap-1-x-reference-model-and-protocols-l.jpg",
      "draw": "Stack WAE, WSP, WTP, WTLS and WDP above the bearer. Place the gateway between the handset stack and the origin server’s HTTP stack."
    }
  ],
  "wlan-standards": [
    {
      "title": "CSMA/CA Back-off and RTS/CTS Procedure",
      "publisher": "BrainKart",
      "source": "https://www.brainkart.com/article/IEEE-802-11_13458/",
      "image": "https://img.brainkart.com/imagebk14/b5bDlTZ.jpg",
      "draw": "Draw a short CSMA/CA flowchart with channel sense, wait/backoff, transmit and ACK. Use a return loop for a busy channel or failed delivery."
    }
  ],
  "wlan": [
    {
      "title": "IEEE 802.11 Infrastructure Network Architecture",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/wendi/eee-464-wireless-communications-lecture-9-powerpoint-ppt-presentation",
      "image": "https://image2.slideserve.com/3789505/802-11-architecture-of-an-infrastructure-network-l.jpg",
      "draw": "Draw two BSS boundaries around their APs and associated stations. Connect both APs through a distribution system and label the combined ESS."
    }
  ],
  "wlan-mobility": [
    {
      "title": "802.11k AP-Assisted Roaming Topology",
      "publisher": "MrNCCIE wireless notes",
      "source": "https://mrncciew.com/2014/09/11/cwsp-802-11k-ap-assisted-roaming/",
      "image": "https://mrncciew.files.wordpress.com/2014/09/802-11k-06.png",
      "draw": "Draw a station moving from AP A’s BSS into AP B’s BSS. Keep the APs on the same distribution system and label scanning, reassociation, and data forwarding."
    }
  ],
  "wlan-deployment": [
    {
      "title": "Access-Point Placement on a Floor Plan",
      "publisher": "Orion wireless site survey",
      "source": "https://www.usorion.com/blog/ekahau-site-survey-predictive-survey-oklahoma-city-usa",
      "image": "https://www.usorion.com/hubfs/Imported%20sitepage%20images/rs%3Dw1280-Jun-16-2024-06-26-36-8513-PM.jpg",
      "draw": "Sketch a simple floor, AP positions, coverage areas, channels and backhaul. Label overlap for roaming and identify one likely dead spot or interference source."
    }
  ],
  "manet": [
    {
      "title": "AODV Route Discovery Diagram",
      "publisher": "Author’s publication",
      "source": "https://medium.com/%40surabhi.deshpande20/manet-routing-protocols-2249dbf5444",
      "image": "https://miro.medium.com/v2/resize%3Afit%3A1400/1%2AJWHfo1SOSNR_I7T3wj-Q3w.png",
      "draw": "Place source, intermediate nodes and destination in a mesh. Draw RREQ branching outward and RREP returning over a chosen route. Mark one failed link and the alternate path."
    }
  ],
  "wireless-sensor-networks": [
    {
      "title": "Wireless Sensor Network Architecture",
      "publisher": "PubMed Central",
      "source": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12119870/",
      "image": "https://cdn.ncbi.nlm.nih.gov/pmc/blobs/4d3b/12119870/fb5094a7a3a1/41598_2025_3498_Fig2_HTML.jpg",
      "draw": "Group sensor nodes under a collector or cluster head. Use arrows for readings, aggregation, the sink or gateway, and finally the monitoring application."
    }
  ],
  "wlan-security": [
    {
      "title": "802.1X EAP Authentication Flow",
      "publisher": "CBT Nuggets",
      "source": "https://www.cbtnuggets.com/blog/technology/networking/what-is-802-1x",
      "image": "https://images.ctfassets.net/aoyx73g9h2pg/7mU5Y6UXPvyVGUzkkoa4R0/f657b8d88bd73967e7bb2ee41431c5a1/What-is-802-1X-Diagram.jpg",
      "draw": "Draw station/supplicant, AP/authenticator and authentication server. Label the EAP exchanges, successful authorization and protected wireless data."
    }
  ],
  "wifi-vs-3g": [
    {
      "title": "UMTS 3G Network Architecture",
      "publisher": "SlideShare course slides",
      "source": "https://www.slideshare.net/slideshow/highlevel-architecture-of-mobile-cellular-networks-from-2g-to-5g/79862680",
      "image": "https://image.slidesharecdn.com/intermediate001architecture2gto5g-170917155341/75/High-level-architecture-of-Mobile-Cellular-Networks-from-2G-to-5G-4-2048.jpg",
      "draw": "Use two rows to reach the same internet service. In the first, draw client, Wi-Fi AP and router. In the second, draw UE, Node B/RNC and SGSN/GGSN."
    },
    {
      "title": "IEEE 802.11 Infrastructure Network Architecture",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/wendi/eee-464-wireless-communications-lecture-9-powerpoint-ppt-presentation",
      "image": "https://image2.slideserve.com/3789505/802-11-architecture-of-an-infrastructure-network-l.jpg",
      "draw": "Use two rows to reach the same internet service. In the first, draw client, Wi-Fi AP and router. In the second, draw UE, Node B/RNC and SGSN/GGSN."
    }
  ],
  "in-ss7": [
    {
      "title": "IN Conceptual Model Overview",
      "publisher": "SlideShare course slides",
      "source": "https://www.slideshare.net/slideshow/intelligent-networks-6154628/6154628",
      "image": "https://image.slidesharecdn.com/in-12923090716962-phpapp02/75/Intelligent-Networks-52-2048.jpg",
      "draw": "Draw the four conceptual planes as a stack. Label service, global functional, distributed functional and physical. Use the freephone example to map SSP and SCP onto physical entities."
    }
  ],
  "ss7": [
    {
      "title": "SS7 Signaling Network Elements",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/tamira/inwk6113",
      "image": "https://image2.slideserve.com/3740774/signaling-network-elements-l.jpg",
      "draw": "Draw two switches, STPs, and a service control point. Distinguish the voice bearer from signaling links, then label IAM, ACM, ANM, REL and RLC for a trunk call."
    }
  ],
  "softswitch-vpn": [
    {
      "title": "Softswitch System Architecture",
      "publisher": "Ribbon Communications",
      "source": "https://ribboncommunications.com/company/get-help/glossary/softswitch",
      "image": "https://ribboncommunications.com/sites/default/files/images/Softswitch-Diagram.jpg",
      "draw": "Place the media gateway controller above the media gateway. Draw the signaling route separately from the RTP-to-circuit bearer and label each boundary."
    }
  ],
  "programmable-networks": [
    {
      "title": "SDN Three-Layer Architecture",
      "publisher": "Tech Science Press",
      "source": "https://www.techscience.com/CMES/v138n2/54631/html",
      "image": "https://cdn.techscience.cn/files/CMES/2024/138-2/TSP_CMES_28077/TSP_CMES_28077/Images/CMES_28077-fig-1.png/mobile_webp",
      "draw": "Draw applications, controller and forwarding devices as three layers. Label northbound and southbound interfaces, and show a rule becoming a new packet path."
    }
  ],
  "vpn": [
    {
      "title": "IPsec VPN Tunnel Diagram",
      "publisher": "Palo Alto Networks",
      "source": "https://www.paloaltonetworks.in/cyberpedia/what-is-ipsec",
      "image": "https://www.paloaltonetworks.in/content/dam/pan/en_US/images/cyberpedia/what-is-ipsec/ipsec-vpn.png",
      "draw": "Draw two private LANs, their gateways and the public network. Put the IPsec tunnel between gateways and distinguish the inner packet from the outer tunnel addresses."
    }
  ],
  "cloud-quantum": [
    {
      "title": "IBM Multichannel Scheduler Architecture",
      "publisher": "IBM Research",
      "source": "https://www.ibm.com/quantum/blog/europe-quantum-datacenter-software",
      "image": "https://research-website-prod-cms-uploads.s3.us.cloud-object-storage.appdomain.cloud/Diagram_background_3d00724bc4.png",
      "draw": "Reduce the research architecture to mobile client, cloud API, queue or scheduler, runtime and QPU. Draw results returning through the API and keep classical processing separate from quantum execution."
    }
  ],
  "client-programming": [
    {
      "title": "Android Application Layers",
      "publisher": "Android Developers",
      "source": "https://developer.android.com/topic/architecture",
      "image": "https://developer.android.com/static/topic/libraries/architecture/images/mad-arch-overview.png",
      "draw": "Draw the UI layer, optional domain layer, and data layer. Label an incoming UI event, asynchronous work in the data layer, and the result returned to the screen.",
      "preview": "./assets/gallery/android-layers.png",
      "credit": "Android Developers · Guide to app architecture, Figure 1",
      "license": {
        "name": "CC BY 2.5",
        "url": "https://creativecommons.org/licenses/by/2.5/"
      }
    }
  ],
  "phone-hardware": [
    {
      "title": "Smartphone Block Diagram",
      "publisher": "Kyocera",
      "source": "https://ele.kyocera.com/ko/application/smartphone/",
      "image": "https://ele.kyocera.com/sites/default/files/assets/application/block_thumb_smartphone.png",
      "draw": "Use central application processor and modem blocks. Connect storage and memory, display/touch, RF and antenna, audio and power management. Distinguish application processing from radio processing."
    }
  ],
  "client-hardware": [
    {
      "title": "Palm III Connected Organizer Block Diagram",
      "publisher": "PalmDB hardware archive",
      "source": "https://palmdb.net/app/palm-os-developer-info",
      "image": "https://palmdb.net/content/files/tools-dev/palm-os-developer-suite/III-diagram.png",
      "draw": "Simplify the original handheld schematic to processor, memory, stylus/digitizer, display, serial connection and power. Draw input reaching the processor through the controller."
    }
  ],
  "recent-client-technologies": [
    {
      "title": "Service Worker Offline Flow",
      "publisher": "web.dev",
      "source": "https://web.dev/articles/offline-cookbook?hl=pt-br",
      "image": "https://web.dev/static/articles/offline-cookbook/image/hero.png?hl=pt-br",
      "draw": "Draw browser, service worker, cache and network. Trace one served offline from cache and one fetched online. Label the service worker as the request interception point.",
      "preview": "./assets/gallery/service-worker.png",
      "credit": "Jake Archibald · The Offline Cookbook, web.dev",
      "license": {
        "name": "CC BY 4.0",
        "url": "https://creativecommons.org/licenses/by/4.0/"
      }
    }
  ],
  "palm-os-architecture": [
    {
      "title": "Palm OS Architecture",
      "publisher": "NIST publication",
      "source": "https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-72.pdf#page=16",
      "draw": "Stack the application over the OS. Draw software APIs and hardware drivers beneath the OS and device hardware at the base. Label event, data, and memory managers as examples of OS services.",
      "preview": "./assets/gallery/palm-os-architecture.png",
      "credit": "Wayne Jansen and Rick Ayers · NIST SP 800-72, Figure 2"
    }
  ],
  "palm-os": [
    {
      "title": "Palm OS Main Event Loop Flowchart",
      "publisher": "Palm OS Programmer’s Companion",
      "source": "https://palm.wiki/development/docs/601/PalmOSCompanion/EventLoop.html",
      "image": "https://palm.wiki/development/docs/601/PalmOSCompanion/images/EventLoopc.gif",
      "draw": "Draw an event loop around EvtGetEvent. Branch through system, menu, app and form handlers, then loop back until the stop event."
    }
  ],
  "symbian-architecture": [
    {
      "title": "Symbian OS Layered Architecture",
      "publisher": "Symbian developer library archive",
      "source": "https://docs.huihoo.com/symbian/s60-5th-edition-cpp-developers-library-v2.1/GUID-35228542-8C95-4849-A73F-2B4F082F0C44/sdk/doc_source/NewStarter/1-basics.html",
      "image": "https://docs.huihoo.com/symbian/s60-5th-edition-cpp-developers-library-v2.1/GUID-35228542-8C95-4849-A73F-2B4F082F0C44/sdk/doc_source/NewStarter/architecture.png",
      "draw": "Draw applications and UI frameworks above application/OS services, base services, kernel and drivers. Put hardware at the bottom and label a shared system server between the application and kernel."
    }
  ],
  "symbian": [
    {
      "title": "Symbian OS Active Objects Workflow",
      "publisher": "SlideShare course slides",
      "source": "https://www.slideshare.net/slideshow/symbian-os-active-objects/2640275",
      "image": "https://image.slidesharecdn.com/activeobjectsd-091203065122-phpapp02/75/Symbian-OS-Active-Objects-15-2048.jpg",
      "draw": "Draw UI, active object, service server and active scheduler. Label asynchronous request, pending status, completion and RunL. Mark where errors or cancellation are handled."
    }
  ],
  "quantum-frameworks": [
    {
      "title": "Qiskit Transpiler Six-Pass Workflow",
      "publisher": "Author’s publication",
      "source": "https://medium.com/qiskit/how-does-the-qiskit-transpiler-work-6710863beaac",
      "image": "https://miro.medium.com/v2/resize%3Afit%3A1400/1%2ABefEKywjl_JWO_CjUPtWow.png",
      "draw": "Draw logical circuit, compiler or transpiler, backend or simulator, then measurement counts. Inside transpilation, group layout, routing, translation, optimization and scheduling."
    }
  ],
  "voip": [
    {
      "title": "WebRTC-Enabled VoIP Application Architecture",
      "publisher": "VOCAL Technologies",
      "source": "https://vocal.com/webrtc/webrtc-enabled-voip-endpoints/",
      "image": "https://vocal.com/wp-content/uploads/2015/06/webrtc-enabled-voip-application-1024x491.png",
      "draw": "Show microphone, codec, RTP packetization, IP network, jitter buffer and decoder. Place signaling on a separate control line above the media path."
    }
  ],
  "h323": [
    {
      "title": "H.323 Videoconferencing Architecture",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/flora/h-323",
      "image": "https://image.slideserve.com/74895/h-323-architecture-l.jpg",
      "draw": "Draw endpoints, a gatekeeper, gateway and MCU. Label H.225 RAS, H.225 call signaling and H.245 control separately from RTP/RTCP media."
    }
  ],
  "sip": [
    {
      "title": "SIP Call Flow Sequence",
      "publisher": "VideoSDK developer guide",
      "source": "https://www.videosdk.live/developer-hub/sip/sip-protocol-ports",
      "image": "https://strapi.videosdk.live/uploads/b88d2553f5bce27b29f5fbf09c4c0cfa_e6a8748e76.png",
      "draw": "Draw caller, proxy or proxies, and callee lifelines. Label INVITE, progress or ringing, 200 OK, ACK, media and BYE. Place media on a separate line from proxy signaling."
    }
  ],
  "rtp-rtcp": [
    {
      "title": "RTP Packet Header Structure",
      "publisher": "VOCAL Technologies",
      "source": "https://vocal.com/voip/rtp/",
      "image": "https://vocal.com/wp-content/uploads/2024/03/RTP-Packet-Diagram.png",
      "draw": "Draw the RTP header with sequence number, timestamp and SSRC, then payload. Alongside it draw RTP flowing to the receiver and RTCP feedback returning to the sender."
    },
    {
      "title": "RTCP Receiver Report Fields",
      "publisher": "RFC Editor",
      "source": "https://www.rfc-editor.org/rfc/rfc3550#section-6.4.2",
      "draw": "Sketch the receiver-report header and one reception report block. Label SSRC, fraction lost, cumulative loss, extended highest sequence number, interarrival jitter, LSR and DLSR."
    }
  ],
  "voice-applications": [
    {
      "title": "Asterisk PBX VoIP System Architecture",
      "publisher": "BekIoT",
      "source": "https://bekiot.com/encyclopedia/asterisk",
      "image": "https://bekiot.com/uploads/allimg/20260510/1-260510144230350.webp",
      "draw": "Draw an IP-PBX with softphones or IP handsets on the LAN side and a gateway to PSTN on the outside. Use separate labels for signaling, voice media and call-service features."
    }
  ],
  "ims-architecture": [
    {
      "title": "IMS Architecture Overview",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/sivan/overcoming-the-limitations-of-softswitch-architectures",
      "image": "https://image2.slideserve.com/4269826/ip-multimedia-subsystem-ims-architecture-l.jpg",
      "draw": "Draw user equipment and IP access, then P-CSCF, I-CSCF and S-CSCF. Attach HSS to the control plane and application servers above it."
    }
  ],
  "ims": [
    {
      "title": "IMS Authentication Sequence Diagram",
      "publisher": "Springer Nature",
      "source": "https://link.springer.com/article/10.1186/2192-1962-2-16",
      "image": "https://media.springernature.com/lw685/springer-static/image/art%3A10.1186%2F2192-1962-2-16/MediaObjects/13673_2012_Article_20_Fig1_HTML.jpg",
      "draw": "Draw UE, P-CSCF, I-CSCF, S-CSCF and HSS lifelines. Mark REGISTER, database or authentication exchanges, the 401 challenge, authenticated REGISTER and 200 OK.",
      "preview": "./assets/gallery/ims-registration.jpg",
      "credit": "Madhu J. Sharma and Victor C. M. Leung · EURASIP Journal on Information Security (2012), Figure 1",
      "license": {"name":"CC BY 2.0","url":"https://creativecommons.org/licenses/by/2.0/"}
    }
  ],
  "networked-multimedia": [
    {
      "title": "MPEG-DASH Data Model Diagram",
      "publisher": "DASH 101 course notes",
      "source": "https://aut-cic.github.io/dash101/",
      "image": "https://aut-cic.github.io/dash101/img/mpeg-dash-data-model.png",
      "draw": "Draw encoder, origin or CDN, MPD/manifest and media segments, then the client. Show the client choosing a representation, buffering segments and playing timed media."
    }
  ],
  "ngn": [
    {
      "title": "NGN Architecture per ITU‑T Y.2012",
      "publisher": "SlideServe course slides",
      "source": "https://www.slideserve.com/adamdaniel/ngn-migration",
      "image": "https://image.slideserve.com/174605/ngn-architecture-described-in-itu-t-y-2012-l.jpg",
      "draw": "Draw service stratum above transport stratum. Mark access, resource/admission control, packet transport and a gateway toward legacy networks. Keep control and bearer arrows visually distinct."
    }
  ]
}
