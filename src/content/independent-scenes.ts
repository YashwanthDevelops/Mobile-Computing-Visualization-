import type {Scenario} from '../types'
import {nodes, scenario, step} from './authoring'

export const independentScenes:Record<string,Scenario>={
  middleware:scenario('Middleware','Follow an offline message from a device to a reusable service layer.',[
    step('Accept','Give the client one stable interface','The application asks the messaging middleware to enqueue a message. The client deals with a stable API even if the implementation uses different transports under different conditions.','Middleware abstracts recurring application services.',[['app','mw','Send through message API']]),
    step('Queue','Persist the message while offline','The middleware records the message and identifier locally. It can retry when connectivity returns and tell the UI whether a message is queued or delivered.','Reliable delivery needs a durable queue and an observable result.',[['mw','store','Store message ID + payload']]),
    step('Synchronize','Send, acknowledge and mark delivery','The transport carries the queued message to the server. The middleware processes its acknowledgement and updates the local queue. Duplicate-safe delivery depends on server support as well as the client implementation.','Middleware provides reusable delivery behavior across screens or apps.',[['store','mw','Load queue'],['mw','server','Transmit pending message'],['server','mw','Return acknowledgement'],['mw','store','Mark delivered']])
  ],{mode:'map',nodes:nodes([
    ['app','Application','phone',84,137,'The app calls the messaging API and presents delivery state.'],
    ['mw','Middleware','router',297,104,'A reusable layer for common services such as messaging, synchronization, sessions and security.'],
    ['store','Durable queue','db',296,249,'Holds outgoing work until the delivery policy can finish or report failure.'],
    ['server','Remote service','server',576,137,'Accepts the request and sends an acknowledgement.']
  ])}),
  gateways:scenario('Gateway translation','Observe a gateway that translates a legacy request into a protocol understood by a server.',[
    step('Receive','Terminate the client-facing protocol','The gateway receives a request at a protocol boundary. It interprets the client-facing message, checks addressing and applies the configured access policy.','A gateway can operate on a message, rather than just forwarding the same packet.',[['client','gw','Client-facing request']]),
    step('Translate','Construct a new server-facing request','The gateway maps the destination, format and session information into a request understood by the origin. A gateway that terminates encryption can inspect the content at this boundary.','Translation changes the protocol or representation.',[['gw','server','Translated server request']]),
    step('Return','Adapt the result for the client','The origin replies to the gateway. The gateway maps the response back to the client protocol and may adapt it for the device. Failure on either leg must be translated into a useful client-side result.','Each leg has its own addressing, state and protection.',[['server','gw','Origin response'],['gw','client','Client-formatted result']])
  ],{mode:'map',nodes:nodes([
    ['client','Mobile client','phone',105,157,'Sends a device-oriented request, such as a legacy WAP request.'],
    ['gw','Gateway','gate',340,153,'Terminates or proxies one side and translates or forwards toward the other.'],
    ['server','Origin server','server',582,157,'Services the server-facing protocol, such as HTTP.']
  ])}),
  'session-dialogue':scenario('Dialogue patterns','Compare a short independent request with a managed application session.',[
    step('Transaction','Complete one request and response','A client asks for the current timetable and the service responds. Each request includes the context it needs. This pattern suits short operations where a previous user interaction need not remain open.','A transaction may finish after one exchange.',[['client','server','Request current timetable'],['server','client','Return timetable']]),
    step('Open session','Establish shared context for several exchanges','The client starts a managed service session, and the service returns an identifier or other state. Subsequent interactions use that context, such as keeping track of a multi-stage booking.','A session relates several exchanges to the same activity.',[['client','server','Open session'],['server','client','Session accepted'],['server','state','Record context']]),
    step('Continue','Use the active context and close it deliberately','Subsequent requests identify the session. The service updates its state and later closes it on user completion or according to policy. A reconnect must follow the service’s mechanism for resuming or starting over.','Dialogue state defines the permitted order and meaning of messages.',[['client','server','Continue using session ID'],['server','state','Update shared state'],['client','server','Close session']])
  ],{mode:'map',nodes:nodes([
    ['client','Mobile client','phone',115,144,'Starts or continues an interaction with a service.'],
    ['server','Application service','server',358,146,'Processes individual requests and manages any application dialogue.'],
    ['state','Session state','db',555,213,'Stores context only for a managed session.']
  ])}),
  ipv6:scenario('IPv6 address configuration','Follow a device onto an IPv6 link and understand address configuration and reachability.',[
    step('Discover','Find the default router and learn the prefix','The device starts with a link-local address. Router Solicitation can prompt a Router Advertisement. The advertisement supplies router information and can advertise a prefix with an autonomous configuration flag.','IPv6 neighbor discovery uses ICMPv6 on the local link.',[['phone','router','Router Solicitation'],['router','phone','Router Advertisement']]),
    step('Configure','Form an address and check for duplication','For stateless address autoconfiguration, the device derives an address using the advertised prefix and its interface identifier. Duplicate Address Detection checks that the tentative address is not already in use on the link. DNS provisioning is a separate configuration concern.','An IPv6 address describes a network attachment and interface identity.',[['phone','peer','Neighbor Solicitation · DAD']],['phone','peer']),
    step('Forward','Resolve the next hop and send a packet','When the destination is off-link, the mobile sends the packet to a default router. Neighbor Discovery can obtain the link-layer address of that next hop. The router forwards the IPv6 packet toward the remote destination.','The next-hop address on the local link differs from the ultimate IP destination.',[['phone','router','Neighbor discovery / IPv6'],['router','remote','Forward IPv6 packet']])
  ],{mode:'map',nodes:nodes([
    ['phone','Mobile host','phone',80,130,'Uses a link-local address and can form additional addresses on a visited link.'],
    ['router','IPv6 router','router',312,107,'Advertises network parameters and forwards traffic off-link.'],
    ['peer','On-link neighbor','phone',307,236,'Shares the local link and can report conflicting address ownership.'],
    ['remote','Remote host','server',590,133,'Receives routed IPv6 packets using the destination address.']
  ])}),
  'wlan-standards':scenario('802.11 standards and access','Compare how PHY choices and a shared MAC affect a WLAN.',[
    step('Discover','Match the station and AP capabilities','The station reads the AP’s advertisements and learns supported rates and capabilities. IEEE 802.11 amendments describe MAC and physical behavior, including different bands, modulation, channel widths or scheduling features. The negotiated link depends on what both ends support.','A standards label alone does not determine a user’s actual throughput.',[['ap','a','Beacon and capabilities']]),
    step('Contend','Wait for shared airtime','In a basic contention example, stations sense the medium and wait when it is busy. A random backoff reduces the chance that both transmit at once. The winner sends a frame and normally expects an acknowledgement for unicast data.','Stations share airtime, so contention changes effective capacity.',[['b','ap','Channel busy with data'],['ap','b','ACK'],['a','ap','Frame after backoff'],['ap','a','ACK']]),
    step('Compare','Choose band, width and capabilities for the site','Earlier a/b/g variants are associated with legacy PHY options. 802.11n adds improvements such as MIMO, 802.11ac raises capacity in 5 GHz deployments, and 802.11ax adds efficiency mechanisms for busy networks. Select an option based on client support, interference, available spectrum and density.','A wider channel can improve peak throughput while reducing channel reuse.',[],['ap','a','b'])
  ],{mode:'map',nodes:nodes([
    ['a','Station A','phone',109,114,'Senses the medium and contends for access in the illustrated exchange.'],
    ['b','Station B','phone',109,234,'Also shares the same channel and may transmit while A waits.'],
    ['ap','Access point','radio',438,168,'Advertises WLAN capabilities and acknowledges successfully received unicast frames.']
  ])}),
  'wlan-security':scenario('Secure WLAN access','Trace a representative enterprise WLAN connection before any application traffic is allowed.',[
    step('Associate','Choose a known network and associate','The station selects the intended network and establishes association. Enterprise policy should verify the authentication service’s identity as appropriate to the EAP method, reducing the chance of joining an impersonating network.','Association establishes the link context. Access control can still be pending.',[['ap','sta','Advertise security settings'],['sta','ap','Associate']]),
    step('Authenticate','Validate the user or device','In a representative enterprise deployment the AP passes EAP messages toward an authentication server. The station and authenticator complete the configured authentication method and establish the material needed for link protection.','Enterprise authentication typically separates client, authenticator and authentication server.',[['sta','ap','EAP exchange'],['ap','auth','Relay authentication'],['auth','ap','Access result']]),
    step('Install keys','Turn on protected link traffic','The station and AP establish transient link keys through the appropriate key exchange. Once access and keys are ready, the AP can forward protected wireless data to the permitted local network. Applications may add protection to their own endpoints using TLS.','Wireless link encryption ends at the AP in this model.',[['ap','sta','Key exchange'],['sta','ap','Protected wireless frame'],['ap','lan','Forward into authorized network']])
  ],{mode:'map',nodes:nodes([
    ['sta','Station','phone',80,161,'Authenticates with the configured WLAN method and uses link keys to protect frames.'],
    ['ap','AP / authenticator','radio',278,157,'Controls joining and forwards authentication exchanges.'],
    ['auth','Authentication server','server',522,84,'Validates credentials under the chosen enterprise policy.'],
    ['lan','Authorized LAN','cloud',522,236,'Provides the permitted network services after successful access control.']
  ])}),
  'programmable-networks':scenario('Programmable forwarding','Use a controller to redirect traffic after a link failure.',[
    step('Observe','Report that the data path changed','A forwarding device reports a port state change. The controller combines the update with its known topology and policy. The physical link is already down, so forwarding state must converge to an available path.','Control-plane decisions depend on observed network state.',[['old','ctrl','Port status: down']]),
    step('Program','Install a replacement forwarding rule','The controller determines a viable route and programs the relevant forwarding device. A production design chooses an update order or consistency strategy to avoid transient loops or black holes.','The controller changes rules through an interface.',[['ctrl','sw','Install fallback rule'],['ctrl','alt','Prepare alternate path']]),
    step('Forward','Move user packets through the alternate path','The switch matches data packets and forwards according to the installed action. The alternate path carries traffic to the destination. Monitoring confirms that the change satisfied the policy.','User packets are processed by the data plane.',[['sw','alt','User data'],['alt','dest','Deliver'],['sw','ctrl','Counters / telemetry']])
  ],{mode:'map',nodes:nodes([
    ['ctrl','Controller','server',323,65,'Maintains a view of state and sends forwarding policy to devices.'],
    ['sw','Ingress switch','router',92,191,'Applies packet match and action rules in the data plane.'],
    ['old','Failed path','router',338,151,'Represents the former path whose link is unavailable.'],
    ['alt','Alternate path','router',338,254,'Available forwarding path selected under the controller’s policy.'],
    ['dest','Destination','server',594,191,'Receives traffic through the path selected by the forwarding rules.']
  ])}),
  'client-programming':scenario('Client execution','Trace a user tap through UI logic, local state and asynchronous service work.',[
    step('Dispatch','Send an input event to a handler','The OS receives a tap and dispatches it to the application through the UI framework. The handler validates input, changes visible state to pending and schedules a data operation instead of occupying the input thread.','Event-driven clients should keep input responsive.',[['os','ui','Deliver tap'],['ui','worker','Schedule data request']]),
    step('Load','Read data in background and return a result','The worker reads local data or uses a service API. It surfaces success, timeout or an offline result. If the view was closed while waiting, the task can be cancelled or its result stored for later use.','A request can finish after the original view disappears.',[['worker','store','Local data / network operation'],['store','worker','Return result'],['worker','ui','Post result']]),
    step('Render','Apply a result to the current screen','The UI checks lifecycle state and renders the valid result or an actionable error. The local state can survive suspension or restart when persisted by the client design.','UI refresh and persistence are separate responsibilities.',[['ui','os','Render current view'],['ui','store','Persist relevant state']])
  ],{mode:'map',nodes:nodes([
    ['os','OS / UI framework','phone',78,140,'Dispatches input and updates the screen.'],
    ['ui','Client handler','chip',247,118,'Responds to app events and maintains visible state.'],
    ['worker','Async worker','router',409,224,'Runs work that should not block input.'],
    ['store','Data source','db',603,141,'Represents cached data or a remote service.']
  ])}),
  'phone-hardware':scenario('Smartphone hardware','Trace what the hardware does while a phone receives and plays a call.',[
    step('Receive','Capture and process the radio signal','The antenna and RF front end receive a radio signal and convert it for baseband processing. The modem handles radio timing and other access-protocol processing. It reports relevant call state through platform interfaces.','The baseband deals with the radio link.',[['rf','modem','Receive and process RF'],['modem','ap','Call state']]),
    step('Interact','Render the call UI and accept the answer','The application processor runs the OS and user interface. RAM holds working state, while persistent storage retains application data. The display and touch controller present the call and report the answer input.','The application processor and modem have distinct responsibilities.',[['ap','screen','Display incoming call'],['screen','ap','Touch input'],['ap','modem','Answer request']]),
    step('Play','Route media to the audio subsystem','Call audio is decoded or delivered through the voice pipeline appropriate to the platform, then played through the audio subsystem. Power management supplies and schedules components according to ongoing activity.','A mobile design coordinates radio, compute, input/output and power.',[['modem','ap','Receive media'],['ap','audio','Voice samples'],['power','modem','Power budget']],['modem','ap','audio','power'])
  ],{mode:'map',nodes:nodes([
    ['rf','Antenna / RF','radio',74,100,'Transmits and receives radio-frequency energy.'],
    ['modem','Baseband modem','chip',211,115,'Processes radio signals and implements cellular communication functions.'],
    ['ap','Application SoC','chip',359,138,'Runs the OS and applications, using memory and storage interfaces.'],
    ['screen','Display / touch','phone',562,91,'Presents output and reports input to the OS.'],
    ['audio','Audio subsystem','app',563,236,'Handles recording and playback for voice and media.'],
    ['power','Power system','lock',209,243,'Manages battery energy and supplies the other components.']
  ])}),
  'symbian-architecture':scenario('Symbian architecture','Follow a service request down through the application platform and System servers.',[
    step('UI','Start in the platform UI framework','An application responds to an input event through its platform UI framework. It asks a shared service such as contacts or messaging to perform work through an API.','Applications rely on platform APIs and resources.',[['ui','service','Asynchronous service request']]),
    step('IPC','Use kernel-mediated communication','System servers run shared services. Symbian uses client/server IPC to pass requests, and kernel security can enforce platform capability checks. Kernel and driver services handle lower-level work such as hardware access.','The system provides services across process boundaries.',[['service','kernel','IPC and system services'],['kernel','device','Request device I/O']]),
    step('Complete','Return completion to the active scheduler','The service completes the request. The active scheduler can dispatch the completion to an active object, which handles the result or error. The application kept its event loop available while it waited.','An active object handles asynchronous completion.',[['device','kernel','I/O completion'],['kernel','service','Service result'],['service','ui','Complete active request']])
  ],{mode:'map',nodes:nodes([
    ['ui','App and UI framework','phone',91,128,'Receives events and invokes OS APIs.'],
    ['service','System servers','server',270,97,'Provide services such as contacts and communications.'],
    ['kernel','Kernel and IPC','chip',421,220,'Schedules execution, passes IPC and controls drivers.'],
    ['device','Hardware and drivers','gate',596,130,'Represents device-level I/O underneath system services.']
  ])}),
  'voice-applications':scenario('Voice applications','Compare a softphone call with an enterprise call that needs a gateway.',[
    step('Internet','Connect two software endpoints','Both softphones use IP. A session controller or service can help arrange a call, while negotiated media can travel along a different IP path. Devices choose compatible codecs and handle packet timing at playback.','Voice applications share a signaling and media architecture.',[['ip','control','Start session'],['control','peer','Locate endpoint'],['ip','peer','IP voice stream']]),
    step('Gateway','Reach a telephone through an interworking gateway','In a mixed network, a gateway bridges an IP audio leg to the phone network. Signaling interworking creates and clears calls on each side. Media conversion may be needed when the networks use different representations.','A gateway connects services with different signaling or media.',[['ip','control','Set up call'],['control','gateway','Select and set up gateway leg'],['ip','gateway','Packet voice'],['gateway','telephone','Circuit or carrier voice']]),
    step('Quality','Plan for real-time quality and call handling','A conferencing system may mix or forward media for many participants. A managed enterprise service may route by extension or queue. All rely on acceptable media delay, jitter, packet loss and audio quality. The best solution depends on call pattern and network limits.','Application features and media quality require separate evaluation.',[['peer','ip','Voice / reception feedback']],['peer','ip','control'])
  ],{mode:'map',nodes:nodes([
    ['ip','Softphone','phone',77,135,'An application endpoint that places or receives an IP voice call.'],
    ['control','Call service','server',291,65,'Handles addressing, sessions and policy for calls.'],
    ['peer','IP endpoint','phone',555,112,'Receives negotiated media over an IP path.'],
    ['gateway','Voice gateway','gate',303,233,'Interworks with another voice network where required.'],
    ['telephone','Telephone network','cloud',567,233,'Represents telephones reached through a carrier or circuit-switched leg.']
  ])}),
  ngn:scenario('NGN service and transport','Follow two endpoints through a packet network with separate service and transport responsibilities.',[
    step('Attach','Use different access networks to reach common transport','One endpoint enters via wireless access, and another via a fixed or alternate access. The underlying IP transport supports connectivity between networks. The application service coordinates what the endpoints do with that connectivity.','NGN architecture supports multiple accesses over packet transport.',[['a','access','Connect from access A'],['b','access','Connect from access B']]),
    step('Control','Establish a session and apply service policy','A session request reaches service control, which applies the relevant identity and service logic. Resource or policy functions can authorize resources as supported by the deployment. The session controller separates service decisions from packet forwarding.','Service control and transport control coordinate through defined interfaces.',[['a','service','Session setup'],['service','policy','Resource and policy check'],['policy','access','Apply transport policy']]),
    step('Carry','Forward media or data through the transport stratum','Once the endpoints know where and how to send media, the network forwards packets over the established transport path. Gateways can interwork with older networks while the service uses the shared packet infrastructure.','The packet bearer carries traffic while service logic controls the communication.',[['a','access','Media packets'],['access','b','Forward media']])
  ],{mode:'map',nodes:nodes([
    ['a','Wireless user','phone',80,180,'Uses a wireless access network for connectivity.'],
    ['b','Fixed user','phone',603,180,'May use a different access network while the same service controls the session.'],
    ['service','Service control','server',278,73,'Applies application and session logic.'],
    ['policy','Resource control','router',460,73,'Makes resource and policy decisions where the deployment supports them.'],
    ['access','Access + IP transport','cloud',340,228,'Carries user and signaling traffic through the packet transport foundation.']
  ])})
}
