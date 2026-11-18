import type {Lesson} from '../types'
import {nodes,scenario,step,study} from './authoring'

const application:Lesson={
  slug:'mobile-app-development', title:'Developing Mobile Applications and Services', short:'Mobile app development',
  question:'How does a mobile app keep working when its internet connection drops?', mode:'map',
  nodes:nodes([
    ['app','Mobile UI','phone',88,136,'The client presents state and accepts input. It should remain responsive while network operations run asynchronously.'],
    ['local','Local store','db',217,237,'A local database or queue keeps cached data and pending changes across app restarts.'],
    ['network','Access network','tower',340,125,'The phone reaches the internet over a cellular or WLAN radio access network. Signal quality and connection changes affect latency.'],
    ['api','Service API','server',502,125,'The API authenticates the client, validates requests and coordinates application logic.'],
    ['db','Server store','db',605,222,'The server persists shared data and may use revision numbers to detect concurrent edits.']
  ]),
  steps:[
    step('Read','Load local data first','The app opens and reads the latest saved data from local storage. It renders that snapshot while asking the service for a fresher revision. A user can see which data is cached while a request is pending.','The first useful screen can appear without waiting for a round trip.',[['app','local','Read cached records'],['local','app','Render saved snapshot']]),
    step('Request','Reach the service over the internet','The client selects an available network, resolves the API name and makes an authenticated HTTPS request. The service validates it, reads the server store and returns the latest revision. The app saves the response before updating the screen.','The same API can be reached through cellular access or Wi-Fi.',[['app','network','HTTPS request'],['network','api','Route IP packets'],['api','db','Read current revision'],['api','app','Response + version']]),
    step('Disconnect','Keep a local edit while offline','The user adds an item after radio coverage is lost. The client writes the item and a pending operation to the local store in the same transaction. The UI shows that the change is queued and can survive an app restart.','Local persistence makes a pending edit durable.',[['app','local','Save change + queue entry']]),
    step('Sync','Retry after the network returns','The client transmits the queued operation with a stable operation ID. If a previous attempt reached the server but its reply was lost, the ID lets the service recognize the duplicate. The client clears the pending entry when the server acknowledges the result.','A timeout can leave the server outcome unknown. Safe retries account for duplicates.',[['local','app','Read pending change'],['app','api','Send operation ID'],['api','db','Apply once'],['api','app','Acknowledge revision'],['app','local','Mark synchronized']]),
    step('Conflict','Resolve edits from two devices','The service can detect a conflict when the client submits a change based on an older revision. An app may merge compatible changes, follow a domain-specific rule or ask the user to choose. The chosen resolution is synchronized and cached.','Conflict handling is part of the application’s data model.',[['app','api','Submit expected revision'],['api','app','Return conflict and current data'],['app','local','Store resolution']])
  ],
  study:study('A mobile computing service typically combines an on-device client, a wireless access network, internet transport and a remote application. Design for changing links and limited battery from the beginning.',[
    ['Applications and services','Maps, mobile commerce, field-data collection and messaging use different interaction patterns. A service provides reusable capabilities such as identity, data storage, synchronization or notifications. The client controls how these capabilities are exposed to the user.'],
    ['Mobile computing through the internet','A phone on cellular or Wi-Fi gets network connectivity, resolves a service name and exchanges IP traffic. HTTPS protects the client-to-service connection. A change of network can interrupt existing connections, so clients detect failure and reestablish communication.'],
    ['Development lifecycle','Identify users, use cases and connectivity assumptions. Choose client, data model, APIs and permission boundaries, then implement local storage, asynchronous requests and synchronization. Test slow links, roaming, offline edits, retries, low power and small screens before release.'],
    ['Design constraints','Batch supported background work, avoid excessive polling and keep payloads small. Request only required device permissions. Separate user-visible pending, synchronized and failed states so interrupted work can be understood and recovered.']
  ],['Draw client → wireless access → service → database, with a local store beside the client.','Explain asynchronous work, queued writes, duplicate-safe retry and one conflict policy.'])
}

const rfid:Lesson={
  slug:'rfid', title:'RFID and Automatic Identification', short:'RFID',
  question:'How does a reader identify a tag without making electrical contact?',mode:'map',
  nodes:nodes([
    ['tag','RFID tag','chip',96,154,'The tag contains an antenna and an identifier in a chip. In this passive UHF example it harvests energy from the reader field.'],
    ['antenna','Reader antenna','radio',248,150,'The antenna transmits the interrogation and receives the weak backscattered response.'],
    ['reader','RFID reader','router',393,151,'The reader controls the radio exchange, resolves inventory responses and passes tag data to an application.'],
    ['service','Inventory system','server',571,147,'Backend software maps a tag ID to an item record, filters duplicate reads and updates inventory or access state.']
  ]),
  steps:[
    step('Energize','Power a passive tag from the reader field','The reader transmits through its antenna. A nearby passive tag harvests enough RF energy to turn on its chip. Its physical orientation and the surrounding materials affect the usable reading distance.','A passive tag gets operating power from the reader field.',[['reader','antenna','RF interrogation'],['antenna','tag','Reader field']]),
    step('Inventory','Let tags take turns responding','When several tags share one field, an inventory protocol separates their replies. In a slotted example, tags pick response slots and the reader repeats inventory rounds to resolve overlaps. The reader confirms a selected tag before requesting its identifier.','Anti-collision handles several identifiable objects in the same read zone.',[['antenna','tag','Inventory query'],['tag','antenna','Slotted reply'],['reader','tag','Acknowledge selected tag']]),
    step('Read ID','Decode the tag’s backscatter','The energized tag varies how it reflects the incident radio wave. The reader antenna receives the modulated reflection and the reader decodes the identifier, such as an EPC in a UHF inventory system.','The identifier is a compact key for looking up an object record.',[['tag','antenna','Modulated backscatter'],['antenna','reader','Received response']]),
    step('Update','Turn repeated readings into an inventory event','The reader reports the tag ID, timestamp and reader location. The inventory service matches the ID to an item and deduplicates repeat reads so a carton held near the antenna does not look like many cartons.','The application turns radio observations into business events.',[['reader','service','Tag ID + reader + time'],['service','reader','Inventory event recorded']])
  ],
  scenarios:[scenario('Battery-powered tags','Compare a passive tag with active and battery-assisted designs.',[
    step('Active','Use a battery to transmit','An active tag powers its own radio using a battery. It can periodically announce its identity or transmit on demand. This supports tracking across a wider area in suitable deployments, with a battery and maintenance cost.','An active tag can produce its own RF transmission.',[['tag','antenna','Active beacon'],['antenna','reader','Decode beacon']]),
    step('Assisted','Power the chip and still backscatter','A battery-assisted passive tag uses a battery for circuitry or sensing, while the return link still modulates the reader’s field. The battery can improve sensitivity without making the return path an active transmitter.','The power source and the way a reply is transmitted are separate design choices.',[['antenna','tag','Reader query'],['tag','antenna','Battery-assisted backscatter']])
  ])],
  study:study('Radio-frequency identification uses a radio link between a tag and reader to detect an item or retrieve data. Readers, antennas, tags and the backend form the complete system.',[
    ['Passive, active and battery-assisted','Passive tags harvest reader energy and are often cheap and small. Active tags include a battery and transmitter. Battery-assisted passive tags power some circuitry from a battery but usually reply by backscatter in the UHF example.'],
    ['Read zone and deployment','Choose the frequency band, tag and antenna for the object and environment. Metal and liquids can change the read zone. Confirm orientation, prevent unintended reads and test multiple tags moving through the zone at once.'],
    ['Applications and safeguards','RFID supports stock counts, logistics and asset tracking. A deployment should account for duplicate observations, reader access and privacy. An ordinary identifier alone does not establish that a tag is genuine.']
  ],['Draw tag ↔ antenna ↔ reader → application.','Compare tag power source, reply method and typical deployment trade-offs.'])
}

const deployment:Lesson={
  slug:'wlan-deployment',title:'Planning and Deploying a Wireless LAN',short:'WLAN deployment',
  question:'How should two access points cover a building while sharing airtime?',mode:'map',
  nodes:nodes([
    ['a','Access point A','radio',165,118,'The first AP serves the west area. Its channel and power affect coverage and contention.'],
    ['b','Access point B','radio',500,118,'The second AP provides service on the east side. Its coverage should meet roaming needs without excessive overlap.'],
    ['wall','Interior wall','gate',332,120,'Walls and other obstacles attenuate radio signals. Material and frequency affect how much energy is lost.'],
    ['client','Survey handset','phone',275,225,'A test client measures coverage, throughput and roaming from several candidate locations.'],
    ['ds','Wired backhaul','router',522,238,'The distribution network connects the APs to local services, authentication and the internet.']
  ]),
  visual:{regions:[{name:'WEST FLOOR',x:18,y:24,width:310,height:294},{name:'EAST FLOOR',x:338,y:24,width:320,height:294}],connections:[['a','ds','Wired distribution'],['b','ds','Wired distribution']]},
  steps:[
    step('Survey','Find weak spots and interfering networks','Mark the user areas, wall materials and existing radios on a floor plan. Record signal strength, interference and demand in rooms and corridors. A coverage map built only from the AP’s advertised range misses effects such as walls and crowded channels.','A site survey establishes coverage and capacity requirements.',[['a','client','Measure signal / throughput']],['a','wall','client']),
    step('Channels','Separate neighboring channel use','AP A and AP B need enough capacity for their expected clients. Plan reusable channels and suitable widths for the local band and regulatory region. Nearby APs with the same channel compete for airtime where they can hear each other.','Channel reuse depends on overlap, traffic and interference.',[['a','client','Test channel A'],['b','client','Test channel B']]),
    step('Connect','Set up the backhaul and security','Connect the APs to the distribution network, configure SSIDs and approved authentication, and align VLAN and address policies. A client connected to an AP still needs successful IP connectivity and access to the services intended for that network.','Association, security and service access each need verification.',[['a','ds','Backhaul A'],['b','ds','Backhaul B'],['client','a','Associate and authenticate']]),
    {...step('Roam','Walk across the coverage boundary','Carry a client across the test floor during an active session. Track when its BSSID changes, how long data is interrupted and whether it stays on the expected network. Adjust AP placement or power if transitions occur too late or leave a dead spot.','Successful deployment is verified with real user movement.',[['client','a','Current association'],['client','b','Reassociation'],['b','ds','Forward on new AP']]),positions:{client:[410,226]}}
  ],
  study:study('WLAN deployment balances coverage, capacity, roaming, security and manageability. Survey the area before installation and verify under realistic load.',[
    [' WLAN advantages and limits','Wireless access reduces dependence on cabling to every client, supports mobility and can be extended with more APs. The shared radio medium brings contention, interference and coverage variation. The backhaul and physical placement still matter.'],
    ['Plan the service area','Survey intended spaces and interference sources. Document AP location, channels, widths, transmit power, expected client density and the wired backhaul. Reuse channels where separation is sufficient.'],
    ['Configure and validate','Apply the approved authentication and encryption policy, isolate guest traffic as required, then verify throughput, connectivity and roaming throughout the floor. Monitor channel utilization and coverage after deployment.']
  ],['Compare coverage planning with capacity planning.','Explain why raising AP power can increase interference or produce asymmetric coverage.'])
}

const manet:Lesson={
  slug:'manet',title:'Mobile Ad Hoc Networks and Route Repair',short:'MANET routing',
  question:'How can mobile devices forward data without an access point?',mode:'map',
  nodes:nodes([
    ['a','Source A','phone',88,152,'A has data for D and discovers a multi-hop route when it needs one.'],
    ['b','Relay B','phone',250,87,'B initially forwards packets along the upper path. Mobility can break its link to D.'],
    ['c','Relay C','phone',287,225,'C offers an alternate route when the upper link fails.'],
    ['d','Destination D','phone',557,150,'D replies to discovery requests. An intermediate node may also reply when it has a sufficiently fresh route.']
  ]),
  steps:[
    step('Discover','Broadcast a route request','A does not have a route to D. It broadcasts an AODV Route Request. Neighbors forward eligible requests once and remember reverse-path information. Sequence numbers help compare route freshness.','An on-demand protocol discovers a path when traffic needs one.',[['a','b','RREQ'],['a','c','RREQ'],['b','d','RREQ']]),
    step('Reply','Install the forward route','D returns a Route Reply along the reverse path through B. As the reply propagates, intermediate nodes record the next hop toward D. A now knows where to send the first packet.','The route is a chain of next-hop entries.',[['d','b','RREP'],['b','a','RREP']]),
    step('Forward','Relay packets across two radio hops','A sends a packet to B. B forwards it to D using its next-hop entry. A and D can exchange data even if they are outside each other’s direct radio range.','Each participating relay acts as a router.',[['a','b','Data packet'],['b','d','Forward packet']]),
    {...step('Break','Invalidate a route when a link fails','B moves away from D and can no longer forward on that link. With no local repair in this example, B invalidates the route and informs affected upstream nodes using a Route Error. A stops sending on the old route.','Node movement can change the network topology while a flow is active.',[['b','a','RERR · route invalid']],['a','b']),positions:{b:[172,80]}},
    {...step('Repair','Discover and use the alternate path','A issues a fresh request. The reply returns via C, which becomes the new next hop. Data continues on the lower path once the route has been installed.','Route repair trades extra control traffic and delay for continued connectivity.',[['a','c','New RREQ'],['c','d','RREQ'],['d','c','RREP'],['c','a','RREP'],['a','c','Data'],['c','d','Forward']],['a','c','d']),positions:{b:[172,80]}}
  ],
  study:study('A MANET is a changing, infrastructure-free network in which devices can also forward one another’s packets. AODV is an example of reactive routing.',[
    ['Topology and routing','Links vary with movement and radio conditions. Proactive routing updates routes before traffic arrives, whereas reactive routing discovers them as needed. Each approach makes different trade-offs between control overhead and first-packet delay.'],
    ['AODV control messages','RREQ solicits a route and establishes reverse information. RREP returns a fresh route and installs forward entries. RERR reports unreachable destinations after failures. Duplicate suppression and destination sequence numbers help keep route discovery usable under change.'],
    ['Use cases and constraints','Temporary teams and emergency response can benefit from self-organizing networks. Mobility, battery drain, shared airtime and lack of a stable trust infrastructure complicate deployment.']
  ],['Trace RREQ forward, RREP back and then the first packet.','Explain what changes in the routing table after a relay link breaks.'])
}

const sensors:Lesson={
  slug:'wireless-sensor-networks',title:'Wireless Sensor Networks',short:'Sensor networks',
  question:'How can many small sensors report an event without exhausting their batteries?',mode:'map',
  nodes:nodes([
    ['s1','Sensor A','chip',86,88,'A battery-powered node samples its surroundings and sends a compact reading when scheduled or triggered.'],
    ['s2','Sensor B','chip',86,238,'A second sensor measures a nearby area and can report whether an event was local or widespread.'],
    ['relay','Collector','router',278,158,'A cluster head or relay can aggregate related readings and forward them toward the sink.'],
    ['sink','Sink','tower',459,126,'The sink is the collection point and often bridges the wireless sensor network to another network.'],
    ['app','Monitoring app','server',600,221,'The application analyzes readings and raises alerts when conditions meet its rules.']
  ]),
  steps:[
    step('Sense','Wake and sample the environment','Sensor nodes sleep between scheduled samples to conserve energy. At a sample time, each node wakes, reads its transducer and attaches a timestamp or sequence number to the measurement.','A low duty cycle trades faster observation for longer battery life.',[],['s1','s2']),
    step('Report','Send small reports toward the collector','When the radio schedule allows, the nodes send short packets to the collector directly or by relay. The collector associates each reading with its source and timestamp.','Packets carry observations rather than serving as a persistent connection.',[['s1','relay','Reading A'],['s2','relay','Reading B']]),
    step('Aggregate','Summarize measurements before forwarding','The collector can combine duplicate alerts or compute a summary for a region. It forwards the summary to the sink, which passes it to the monitoring application. The design retains raw records when the application requires them.','Aggregation reduces transmitted bytes at the cost of some detail.',[['relay','sink','Aggregate / event report'],['sink','app','Forward to monitor']]),
    step('Adjust','Change the schedule as demand changes','If events are missed between samples, the service can request a shorter reporting interval where supported. That improves responsiveness but increases radio use and battery drain. Change policy according to the sensing objective.','Sensing frequency, reliability and lifetime are linked.',[['app','sink','Sampling policy'],['sink','relay','Distribute configuration'],['relay','s1','New interval'],['relay','s2','New interval']])
  ],
  study:study('A wireless sensor network uses many small sensing nodes, a wireless forwarding structure and one or more sinks. The goal is to get observations to a monitoring application using limited energy.',[
    ['Node architecture','A node comprises a sensor, processing and storage, a radio, and an energy source. A sink or gateway connects local observations to remote processing.'],
    ['Data collection styles','Nodes can report periodically, after a query, or when an event crosses a threshold. Routing can use direct or multi-hop communication. Collected data can be summarized before forwarding if the application allows it.'],
    ['MANET comparison','Both designs can use multi-hop links. MANET examples often emphasize peer communication and moving routes. Sensor-network designs often emphasize low-power collection toward a sink, duty cycling and local aggregation.']
  ],['Label sensing node, collector, sink and monitoring application.','Explain the trade-off between reporting frequency, missing events and battery life.'])
}

const wifiCellular:Lesson={
  slug:'wifi-vs-3g',title:'Wi-Fi versus 3G',short:'Wi-Fi versus 3G',
  question:'What changes when an app takes the Wi-Fi path instead of a 3G cellular path?',mode:'compare',
  nodes:nodes([
    ['wphone','Wi-Fi client','phone',73,112,'The device joins an available WLAN and exchanges frames with an AP.'],
    ['ap','Wi-Fi AP','radio',222,112,'An infrastructure AP offers local 802.11 access and forwards traffic toward its local distribution network.'],
    ['router','Local router','router',393,112,'A local network routes WLAN traffic toward an internet connection or an internal service.'],
    ['mphone','3G handset','phone',73,242,'A UMTS handset registers with the operator and establishes service over cellular radio access.'],
    ['utran','UTRAN','tower',222,242,'This UMTS radio-access block represents Node B and its radio network controller.'],
    ['core','3G packet core','server',393,242,'In classic UMTS packet data, SGSN and GGSN provide mobility and external packet connectivity.'],
    ['service','Internet service','cloud',593,175,'The same application service can be reached over either access network.']
  ]),
  visual:{regions:[{name:'WI-FI PATH',x:15,y:26,width:479,height:136},{name:'3G UMTS PATH',x:15,y:174,width:479,height:140}]},
  steps:[
    step('Wi-Fi','Connect through a local WLAN','The Wi-Fi client joins the AP, obtains IP configuration and sends traffic through the local router. Wireless airtime is shared, and distance, obstacles and nearby networks can change effective performance.','Wi-Fi is typically local access administered by a household or organization.',[['wphone','ap','802.11 frame'],['ap','router','Local distribution'],['router','service','Internet packet']]),
    step('3G','Connect through operator radio and core','The 3G handset uses the operator’s UMTS radio access and packet core. The core keeps subscriber and mobility context as the handset moves through network coverage. After packet service is established, the user reaches the same internet service.','Cellular access is integrated with subscriber authentication and wider mobility management.',[['mphone','utran','UMTS radio'],['utran','core','Packet access'],['core','service','External IP traffic']]),
    step('Compare','Choose based on the application and location','On a local campus WLAN, an internal service may be a short path away. On the move, operator coverage can be more useful. Throughput, latency, security and price depend on the deployed network and conditions, so compare measurements for the actual use case.','Coverage, mobility and management are often more useful comparisons than peak speed.',[['wphone','ap','Local link'],['mphone','utran','Wide-area access']],['wphone','ap','mphone','utran','service'])
  ],
  study:study('Wi-Fi and 3G can both give a mobile client internet access, but the first hop and the networks behind it differ. This comparison uses infrastructure Wi-Fi and classic UMTS packet data.',[
    ['Architecture and access','Wi-Fi uses a local AP and distribution system. 3G uses operator radio access and a subscriber-aware core. WLAN association and cellular attachment establish different network contexts.'],
    ['Coverage, capacity and mobility','Wi-Fi normally covers local spaces with one or more APs. 3G coordinates service over operator cells. Both share radio resources and can degrade with congestion, but their spectrum, access control and handover approaches differ.'],
    ['Security and deployment','Compare link security, service authentication and application encryption independently. Consider administrator control, roaming coverage, backhaul and data costs when selecting an access network.']
  ],['Draw both paths from the phone to the same server.','Compare coverage, ownership, mobility support, contention and cost.'])
}

const clientTech:Lesson={
  slug:'recent-client-technologies',title:'Recent Developments in Client Technologies',short:'Modern client technologies',
  question:'How do client platform choices affect performance, offline support and device access?',mode:'map',
  nodes:nodes([
    ['input','User action','phone',70,136,'The user interacts with a touch interface or a device capability such as a camera.'],
    ['ui','App runtime','chip',206,113,'A native, web or cross-platform runtime handles UI work and invokes platform services.'],
    ['device','Platform APIs','router',363,93,'Operating system APIs enforce permissions and provide device services for sensors, notifications and secure storage.'],
    ['local','Local cache','db',356,235,'A database or cache can supply local data first and persist work while the network is unavailable.'],
    ['edge','Edge or cloud','cloud',580,154,'Remote services can handle shared data or costly computation. Network, privacy and cost determine placement.']
  ]),
  steps:[
    step('Choose','Match the runtime to the product','A client can use the platform’s native APIs directly, share UI or logic across platforms, or run through a browser. Choose according to required device capabilities, target platforms, maintainability and performance.','The best platform choice depends on what the app needs to do.',[['input','ui','User input']]),
    step('Use device','Invoke a platform capability','When the user starts a scan, the app requests access through the operating system. The platform enforces permission, delivers sensor data and manages resources. The UI can show a useful fallback if access is unavailable.','Hardware access is mediated through OS APIs and permissions.',[['ui','device','Request camera access'],['device','ui','Permission and frames']]),
    step('Cache','Serve repeated reads locally','A local cache avoids re-fetching data immediately every time the user opens a screen. The app can show cached state and refresh it in the background, with a policy for invalidation and stale data.','Caching can improve launch time and reduce data use.',[['ui','local','Read cached result'],['local','ui','Render first result']]),
    step('Process','Place work on the device or remote service','A device can perform suitable processing locally for immediate response and to avoid uploading private data. A remote endpoint may help for heavier work or shared models, but adds a network round trip and may require transmitting input.','Measure end-to-end latency, energy use and privacy before choosing offload.',[['device','ui','Local input / result'],['ui','edge','Optional offload'],['edge','ui','Remote result']])
  ],
  study:study('Modern mobile clients combine platform APIs, reusable runtimes, local data and network services. Their impact should be explained through user experience and resource limits.',[
    ['Native, web and cross-platform clients','Native clients use platform frameworks directly. Web clients use browser capabilities and may support installation or offline caching where available. Cross-platform tools share some code while retaining platform differences in permissions, UI and performance.'],
    ['Responsiveness and offline behavior','Keep expensive work away from input handling, cache useful data, synchronize after disconnection and budget scheduled background tasks. Measure cold start, UI responsiveness, bytes transferred and battery impact.'],
    ['On-device capabilities and edge services','Modern clients can use richer device sensors, secure credentials and accelerators. Remote computation is useful for sharing or heavier tasks when network access and data handling requirements allow it.']
  ],['Compare platform access, portability and offline support.','Describe how asynchronous work, caching and work placement affect performance.'])
}

export const newLessons:Lesson[][]=[
  [application],[rfid],[deployment,manet,sensors,wifiCellular],[clientTech],[]
]
