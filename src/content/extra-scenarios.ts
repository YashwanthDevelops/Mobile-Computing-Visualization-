import {nodes, scenario, step} from './authoring'

export const bluetoothClassic=scenario('Classic piconet','See how several nearby peripherals share one Classic Bluetooth group.',[
  step('Discover','Discover a nearby device and start a connection','A Classic Bluetooth device can use inquiry to discover available devices and paging to establish a connection. A device may already know the address and skip discovery. Pairing and authentication depend on policy and existing trust.','Inquiry, connection and pairing are separate actions.',[['central','audio','Inquiry / page'],['audio','central','Connection response']]),
  step('Coordinate','Use the central device’s piconet timing','The central device coordinates the piconet timing. The participants use the appropriate hopping and time-slot behavior for their links. In this example one peripheral supplies input, and another receives audio.','A piconet organizes several Classic Bluetooth devices around one central.',[['central','keys','Coordinate link'],['keys','central','Input data'],['central','audio','Profile audio']]),
  step('Bridge','Distinguish a piconet from a scatternet','A device participating in more than one Bluetooth Classic piconet can link the groups in a scatternet arrangement. The same radio must schedule participation across the groups. Many practical profiles and devices use a simpler topology.','A scatternet links piconets through a shared participating device.',[['central','bridge','Piconet A'],['bridge','other','Piconet B']])
],{mode:'map',nodes:nodes([
  ['central','Piconet central','phone',287,112,'Coordinates timing and transmissions in the Classic Bluetooth piconet.'],
  ['keys','Keyboard','app',92,96,'A peripheral that provides user input to the central.'],
  ['audio','Headset','radio',99,234,'A peripheral that receives voice or audio according to the active profile.'],
  ['bridge','Shared device','phone',374,234,'A device that illustrates participation across more than one piconet.'],
  ['other','Second piconet','cloud',596,201,'Represents a neighbor piconet with its own timing.']
])})

export const wimaxEntry=scenario('Network entry','Follow a subscriber from initial ranging to a provisioned connection.',[
  step('Scan','Synchronize with a serving base station','A subscriber scans candidate channels, acquires downlink synchronization and obtains broadcast channel information. It then identifies suitable uplink opportunities for starting network entry.','A subscriber learns the channel structure before sending ordinary data.',[['bs','ss','Downlink synchronization'],['bs','ss','Channel descriptors']]),
  step('Range','Adjust power and timing for access','The subscriber performs initial ranging. The base station can request timing or power adjustments so later uplink bursts reach it with suitable characteristics. Network entry also completes applicable capability and authentication exchanges.','Ranging makes shared uplink bursts usable at the receiver.',[['ss','bs','Initial ranging'],['bs','ss','Timing / power adjustment'],['bs','auth','Authorization / service context']]),
  step('Schedule','Admit a service flow and allocate data resources','The base station provisions a service flow and schedules access to shared resources. User traffic passes through the broadband access network to external services. Each subscriber’s effective rate depends on scheduling, modulation, interference and network load.','A managed service flow can have QoS parameters.',[['bs','ss','Uplink allocation'],['ss','bs','Scheduled data'],['bs','backhaul','Forward to broadband network']])
],{mode:'map',nodes:nodes([
  ['ss','Subscriber station','phone',105,153,'Synchronizes and establishes a broadband access connection.'],
  ['bs','Base station','tower',293,139,'Coordinates ranging, access, scheduling and radio transmission.'],
  ['auth','Access service','server',547,70,'Represents subscriber authorization and network service functions.'],
  ['backhaul','Broadband network','cloud',560,233,'Connects the access network to external services.']
])})

export const wapStack=scenario('WAP protocol stack','Inspect the classic WAP 1.x stack from an application to its bearer.',[
  step('WAE','Render a mobile service in the application environment','The Wireless Application Environment defines how supported content is presented on a constrained device. A microbrowser can render WML and work with its card-oriented interaction model.','WAE provides the application environment.',[],['wae']),
  step('Session','Manage a session and compact transactions','WSP provides session services appropriate to the wireless environment. WTP supplies lightweight transaction behavior and supports different reliability classes. In the legacy example the handset and gateway use these exchanges across the access link.','The session and transaction layers support client–gateway interaction.',[],['wsp','wtp']),
  step('Protect','Apply transport security where configured','WTLS provides security services for the wireless-side connection when used. Its peer can be the WAP gateway, where traffic may be reencoded and protected separately on the origin leg.','The gateway is a distinct security boundary.',[],['wtls']),
  step('Bearer','Carry datagrams over a supported wireless bearer','WDP offers a datagram service across different underlying bearers. A specific bearer supplies the actual delivery path, for example packet data. The WAP gateway translates or proxies toward the web side of the service.','The bearer and application content can evolve independently.',[],['wdp'])
],{mode:'layers',nodes:nodes([
  ['wae','WAE · application environment','app',0,0,'Provides the environment for WML and other supported mobile content.'],
  ['wsp','WSP · session protocol','app',0,0,'Provides services for establishing and managing WAP sessions.'],
  ['wtp','WTP · transaction protocol','app',0,0,'Provides lightweight transaction and reliability options.'],
  ['wtls','WTLS · transport security','app',0,0,'Provides optional security services on the wireless connection.'],
  ['wdp','WDP · datagrams and bearer','app',0,0,'Adapts a datagram service to the underlying bearer.']
])})
