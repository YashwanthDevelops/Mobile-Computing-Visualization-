import type { DiagramNode, Link, Visual } from '../types'
import { nodes, scenario, step } from './authoring'

export const gsmNodes:DiagramNode[]=nodes([
  ['ms','Mobile station','phone',54,111,'The handset and its SIM act together as the mobile station. The SIM identifies the subscription while the handset has its own equipment identity.'],
  ['bts','BTS A','tower',151,103,'The base transceiver station terminates the GSM radio link in cell A. It transmits paging and carries radio traffic.'],
  ['bts-b','BTS B','tower',151,232,'A second cell controlled by the same BSC. It receives a new radio channel assignment during the intra-BSC handover.'],
  ['bsc','BSC','router',242,164,'The base station controller manages radio resources and coordinates the BTSs. A handover between its own cells can keep the MSC call leg in place.'],
  ['msc','Serving MSC','server',359,174,'The serving mobile switching centre controls the circuit-switched call and connects the radio access network to the switching network.'],
  ['vlr','VLR','db',344,82,'The visitor location register holds temporary subscriber information and the registered location area, usually alongside the serving MSC.'],
  ['hlr','HLR','db',477,82,'The home location register holds the permanent subscription profile and records the serving MSC/VLR for routing.'],
  ['auc','AuC','lock',365,250,'The authentication centre uses the subscriber secret to generate GSM authentication material. The permanent secret stays with the SIM and AuC.'],
  ['eir','EIR','db',481,250,'The equipment identity register can check an IMEI against operator equipment lists. An equipment identity check is separate from SIM authentication.'],
  ['gmsc','GMSC','gate',498,164,'The gateway mobile switching centre receives a call to a GSM subscriber and queries the HLR for routing information.'],
  ['pstn','External caller','phone',615,164,'The public telephone network or another operator brings the incoming call to the gateway or accepts an outgoing call.']
])

export const gsmVisual:Visual={
  regions:[
    {name:'MOBILE & RADIO ACCESS',x:8,y:21,width:287,height:298},
    {name:'SWITCHING & SUBSCRIBER DATA',x:301,y:21,width:252,height:298},
    {name:'EXTERNAL',x:559,y:21,width:113,height:298}
  ],
  connections:[
    ['ms','bts','Um'],['ms','bts-b','Um'],['bts','bsc','Abis'],['bts-b','bsc','Abis'],
    ['bsc','msc','A'],['msc','vlr','Serving context'],['vlr','hlr','Subscriber updates'],
    ['hlr','auc','Authentication data'],['msc','eir','Equipment identity'],
    ['gmsc','hlr','Routing query'],['msc','gmsc','Trunk'],['gmsc','pstn','External call']
  ]
}

const lowerCell={ms:[54,232] as [number,number]}
export const gsmWalkthroughs=[
  scenario('Architecture','Read the complete GSM system from the mobile station to the external network.',[
    step('Radio access','Read the radio access network','The mobile station communicates over Um with its serving BTS. Abis connects each BTS to the BSC, which allocates radio resources and connects to the serving MSC over the A interface. BTS A and BTS B are separate cells, both under this BSC.','Um, Abis and A are distinct interfaces.',[['ms','bts','Um · radio'],['bts','bsc','Abis'],['bsc','msc','A interface']]),
    step('Registers','Locate subscription and visited-network state','The HLR is the home record for the subscription. A VLR keeps a temporary record for the serving area. When the subscriber roams to a new serving VLR, the home record is updated, so later calls can reach the new MSC.','The HLR locates a serving network. Paging locates the handset within its area.',[['vlr','hlr','Location update'],['hlr','vlr','Subscriber profile']]),
    step('Identity','Separate the subscriber from the handset','The AuC provides authentication data for the SIM subscription. Where equipment checking is enabled, the network can ask the EIR about the handset’s IMEI. Replacing a handset changes its equipment identity without changing the subscription on the SIM.','AuC handles subscriber authentication material. EIR records equipment status.',[['hlr','auc','Authentication data'],['msc','eir','IMEI status']]),
    step('Interconnect','Connect to the external network','For a terminating call, the external network reaches the GMSC. The GMSC queries the home register, which obtains the route to the visited MSC. The established speech circuit goes through switching and radio equipment.','HLR and VLR exchange control information. They do not carry speech.',[['pstn','gmsc','Incoming call'],['gmsc','hlr','Routing query'],['gmsc','msc','Routed call leg']])
  ]),
  scenario('Location update','Move the handset between location areas and follow the state that makes it reachable.',[
    step('Read area','Detect a different location area','The handset reads the location-area identity broadcast by the new cell. When it differs from the registered area, the handset requests a location update through the BTS and BSC. In this example the new area is served by a different VLR.','A location area may include many cells.',[['bts','ms','Broadcast LAI'],['ms','bts','Location Updating Request'],['bts','bsc','Relay'],['bsc','msc','Location update']]),
    step('Authenticate','Challenge the subscription','The serving network obtains authentication material if needed. It sends a random challenge to the mobile station, and the SIM computes a response using its secret. The network compares that response with the expected value.','Authentication verifies the subscription before the network accepts the update.',[['hlr','auc','Obtain GSM triplets'],['hlr','vlr','Authentication data'],['msc','ms','RAND challenge'],['ms','msc','SRES response']]),
    step('Update home','Record the new serving VLR','The VLR updates the HLR. The HLR records the new VLR, makes the subscriber profile available to it and can cancel old VLR registration. The serving VLR records the new location area locally.','Future calls can be directed to the new serving MSC/VLR.',[['vlr','hlr','Update Location'],['hlr','vlr','Subscriber profile'],['msc','vlr','Store location area']]),
    step('Accept','Confirm that the handset is reachable','The network sends Location Updating Accept and may allocate a temporary identity. The handset stores its accepted location context and continues listening for paging.','A temporary identity can reduce routine use of the permanent subscriber identity over the air.',[['msc','bsc','Location Updating Accept'],['bsc','bts','Relay'],['bts','ms','Accept / optional TMSI']])
  ]),
  scenario('Outgoing call','Trace a mobile-originated call through service request, routing, alerting and release.',[
    step('Request','Request circuit-switched service','The handset gains signaling access through its serving cell and requests call service. The serving MSC/VLR verifies the subscriber context and can authenticate the subscriber and enable radio ciphering.','The handset needs signaling access before the voice channel exists.',[['ms','bts','Channel / service request'],['bts','bsc','Relay'],['bsc','msc','CM Service Request'],['msc','vlr','Subscriber context']]),
    step('Set up','Send the called number and reserve resources','The mobile sends SETUP with the destination number. The serving MSC checks permissions and routes an outgoing call leg toward the destination. The network assigns the radio traffic resources as call setup progresses.','The serving MSC routes using the called number.',[['ms','msc','SETUP · called number'],['msc','bsc','Traffic assignment'],['msc','gmsc','Outgoing trunk'],['gmsc','pstn','External setup']]),
    step('Answer','Connect the two call legs','Alerting reports progress while the destination rings. When it answers, the MSC connects the radio and outgoing circuit legs. Speech follows the bearer path through the radio and switching network.','Call-control messages describe state changes, and the bearer carries audio.',[['pstn','msc','Answer'],['msc','ms','CONNECT'],['ms','bts','Speech'],['bts','bsc','Speech'],['bsc','msc','Speech'],['msc','pstn','Speech']]),
    step('Release','Free the resources after hang-up','Either side can clear the call. The network releases the switched circuit and radio traffic channel, and the handset returns to idle service. The subscriber’s registration stays available for future calls.','Clearing a call releases active resources while keeping location registration.',[['ms','msc','DISCONNECT'],['msc','pstn','Release trunk'],['msc','bsc','Clear radio resources']])
  ]),
  scenario('Handover','Keep an active call while the handset moves between two cells under one BSC.',[
    step('Measure','Report the serving and neighboring cells','During the call the handset reports radio measurements. The BSC uses these reports and the network’s thresholds to decide whether the target cell should take over.','A radio measurement informs the handover decision.',[['ms','bts','Measurement Report'],['bts','bsc','Relay measurements']]),
    step('Reserve','Prepare the target cell first','The BSC requests a channel in BTS B. Once the target resource is ready, the network sends a handover command over the existing BTS A link. The mobile now has the target parameters needed to retune.','The target radio channel is prepared while the old connection is still active.',[['bsc','bts-b','Allocate channel'],['bts-b','bsc','Channel ready'],['bsc','bts','Handover Command'],['bts','ms','Target channel details']]),
    {...step('Switch','Access BTS B on the new channel','The handset retunes to BTS B and performs handover access on the assigned channel. The target acknowledges successful access, and completion confirms that the new radio path can carry the call.','The handset changes radio link while the core call leg stays established.',[['ms','bts-b','Handover Access'],['bts-b','bsc','Handover Complete']]),positions:lowerCell},
    {...step('Clear','Release the old cell and continue speech','The BSC redirects the bearer to BTS B and releases BTS A resources. The same serving MSC can continue the call because both cells belong to the same BSC in this example.','Intra-BSC handover changes the radio path without changing the serving MSC.',[['bsc','bts','Release old channel'],['ms','bts-b','Speech'],['bts-b','bsc','Speech'],['bsc','msc','Speech']]),positions:lowerCell}
  ])
]

export const gsmIncoming:Link[]=[['pstn','gmsc','Incoming call']]
