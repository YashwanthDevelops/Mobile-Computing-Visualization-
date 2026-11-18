import type {Lesson, Scenario, Step} from '../types'
import {nodes, scenario, step} from './authoring'
import {gsmIncoming,gsmNodes,gsmVisual,gsmWalkthroughs} from './gsm'

const imsSession=scenario('Session setup','Connect two already registered IMS endpoints and distinguish service signaling from media.',[
  step('Invite','Route INVITE from the caller to its serving function','The originating handset sends an INVITE with an SDP offer through its P-CSCF to the serving session-control function. The home network can already associate the subscriber with a service profile because registration completed earlier.','Registration establishes reachability. INVITE asks to start a specific session.',[['ue','p','INVITE + SDP offer'],['p','s','Forward INVITE']]),
  step('Apply service','Apply subscriber service logic before routing','The originating S-CSCF can invoke an application server when service criteria match. The application may change routing or provide a feature. In this example the INVITE proceeds to the terminating IMS network, which finds the registered destination.','Application services operate through signaling and need not carry the audio.',[['s','as','Invoke matched service'],['as','s','Continue routing'],['s','t','INVITE to terminating network'],['t','dest','Forward to registered contact']]),
  step('Answer','Return the session answer and acknowledge it','Progress responses can report ringing. The terminating handset accepts with a successful response containing the SDP answer in this simple scenario. The originating handset sends ACK. The offer and answer agree which media format and endpoints to use.','SDP negotiates media parameters while SIP controls the session.',[['dest','t','200 OK + SDP answer'],['t','s','Forward answer'],['s','p','Forward answer'],['p','ue','200 OK'],['ue','dest','ACK via signaling path']]),
  step('Media','Carry speech along the negotiated media path','The parties send RTP audio along the negotiated bearer. This simplified diagram shows a direct media path. Real deployments may insert media anchors or gateways. A BYE travels through session control when one side hangs up.','A signaling path through CSCFs and a media path are separate.',[['ue','dest','RTP audio'],['dest','ue','RTP audio'],['ue','s','BYE via proxy'],['s','t','Forward BYE']],['ue','dest','s','t'])
],{mode:'map',nodes:nodes([
  ['ue','Caller UE','phone',69,181,'The registered caller initiates a session and proposes media parameters.'],
  ['p','P-CSCF','gate',173,91,'The originating edge proxy forwards the handset’s SIP messages.'],
  ['s','Originating S-CSCF','server',308,153,'The serving function applies originating service policy and routes SIP toward the destination.'],
  ['as','Application server','server',311,53,'The application server applies a service when criteria in the subscriber profile are matched.'],
  ['t','Terminating IMS','router',473,94,'A simplified block for the terminating network’s serving and proxy functions.'],
  ['dest','Callee UE','phone',611,180,'The registered destination returns the answer and exchanges user media.']
])})

const voicePath=scenario('Voice packet path','Follow the actual audio separately from the SIP call signaling.',[
  step('Encode','Turn microphone samples into a compressed audio frame','Once the session has negotiated a codec, the microphone supplies audio samples to the encoder. The codec represents the samples in frames. A packetizer places the codec data into RTP and assigns the relevant sequence number and timestamp.','Signaling chooses the format. The codec and packetizer turn speech into media data.',[['mic','enc','Audio samples'],['enc','rtp','Encoded frame']]),
  step('Transport','Send timed payloads through the IP network','The sending endpoint commonly puts the RTP packet in UDP and IP for delivery. Network queues and different link conditions can change arrival times or lose packets. Sequence numbers let the receiver identify gaps or reordering.','RTP provides media timing and ordering information to the application.',[['rtp','net','RTP / UDP / IP'],['net','buf','Variable arrival times']]),
  step('Play','Buffer jitter and decode on schedule','The receiver reorders packets where possible and releases audio for playback based on its playout schedule. It skips a packet that arrives too late. The decoder and output device rebuild and play the audio.','A larger buffer can handle more jitter at the cost of added delay.',[['buf','speaker','Timed frames']]),
  step('Report','Send quality observations back to the source','The receiver can send RTCP reports with observations such as loss and interarrival jitter. The application can use those measurements to diagnose quality or adapt within the limits of the session.','RTCP reports on media delivery while RTP carries the timed payloads.',[['buf','rtp','RTCP report']])
],{mode:'map',nodes:nodes([
  ['mic','Microphone','phone',67,120,'Captures the speech signal and passes audio samples to the encoder.'],
  ['enc','Audio codec','chip',185,120,'Compresses the samples into codec frames that both endpoints understand.'],
  ['rtp','RTP sender','server',308,120,'Adds RTP sequence numbers, timestamps and other media metadata.'],
  ['net','IP network','cloud',456,120,'Carries media packets with variable delivery time and possible loss.'],
  ['buf','Jitter buffer','db',456,244,'Reschedules arrivals to produce regularly timed frames for playback.'],
  ['speaker','Decoder / speaker','phone',598,244,'Recovers audio from encoded frames and sends it to the output device.']
])})

const isup=scenario('SS7 trunk signaling','Watch an ISUP call set up and clear through an out-of-band SS7 network.',[
  step('Set up','Request a circuit using an initial address message','The originating switch selects a circuit and sends an Initial Address Message. The STP transfers signaling toward the destination switch, which processes the called address and verifies that the call can proceed.','The selected trunk circuit and the route of the control message are different things.',[['orig','stp','IAM'],['stp','dest','IAM']]),
  step('Alert','Send progress to the originating switch','The destination returns an Address Complete Message when it has enough address information and the relevant progress conditions are met. The originating side can present a ringing indication depending on the call and network.','Backward signaling tells the originating side that setup is progressing.',[['dest','stp','ACM'],['stp','orig','ACM']]),
  step('Connect','Answer and carry speech','The destination switch returns an Answer Message. The established bearer circuit now carries speech between the switches, while the STP continues to route control messages independently.','Speech uses the bearer path, bypassing the STP.',[['dest','stp','ANM'],['stp','orig','ANM'],['orig','dest','Speech bearer']]),
  step('Release','Clear and confirm the circuit can be reused','A switch sends REL with a cause when the call clears. The other end releases the circuit and returns RLC. Each switch removes active call state and makes the circuit available again.','Release and confirmation keep both ends consistent.',[['orig','stp','REL'],['stp','dest','REL'],['dest','stp','RLC'],['stp','orig','RLC']])
],{mode:'map',nodes:nodes([
  ['orig','Originating switch','server',137,208,'Initiates the outgoing trunk call and controls its end of the circuit.'],
  ['stp','STP','router',340,91,'Routes SS7 message signaling. It does not carry the call’s audio.'],
  ['dest','Destination switch','server',541,208,'Handles the terminating side, reports progress, and clears its end of the circuit.']
])})

const gprsArchitecture=scenario('Packet core architecture','Inspect the radio, subscriber data, serving node and gateway interfaces on one diagram.',[
  step('Radio','Move from Um to Gb','The handset sends packet radio bursts on Um. The radio subsystem schedules shared air resources. Its packet control unit connects packet traffic toward the serving GPRS node over Gb in this classic GPRS example.','The radio and core have separate resource and forwarding roles.',[['ms','radio','Um · radio'],['radio','sgsn','Gb interface']]),
  step('Subscribe','Read subscriber context for attach','The SGSN obtains subscriber and service context through the home database path. The attach establishes mobility state for packet service. The GGSN still needs a packet context before it can deliver the illustrated user traffic.','A subscriber record serves control-plane decisions.',[['sgsn','hlr','Gr · subscriber query'],['hlr','sgsn','Subscription information']]),
  step('Tunnel','Cross Gn and leave through Gi','Once the packet context exists, user traffic travels in a GTP tunnel from the SGSN to the GGSN over the core. The GGSN removes the tunnel wrapper and routes IP packets through the Gi-facing external network interface.','The GTP tunnel is inside the operator core. The external server sees routed IP traffic.',[['sgsn','ggsn','Gn · GTP'],['ggsn','app','Gi · IP']])
])

const alternate:Record<string,Scenario[]>={ims:[imsSession],sip:[voicePath],'in-ss7':[isup],gprs:[gprsArchitecture]}
export function expandVisuals(lesson:Lesson):Lesson{
  const scenarios=[...lesson.scenarios??[],...alternate[lesson.slug]??[]]
  if(lesson.slug==='gsm'){
    const steps=lesson.steps.map<Step>((item,index)=>index===0?{...item,links:gsmIncoming,active:['pstn','gmsc']}:index===5?{
      ...item,body:'A paged handset responds. The network assigns radio resources and completes call signaling, then alerts the user. On answer, the serving MSC connects the radio leg to the incoming circuit. The speech path runs from the external caller through GMSC and the serving MSC, BSC and BTS to the handset.',
      active:[...item.active,'pstn'],links:[...item.links??[],['gmsc','pstn','Voice trunk']]
    }:item)
    return {...lesson,nodes:gsmNodes,visual:gsmVisual,steps,walkthrough:'Incoming call',scenarios:[...scenarios,...gsmWalkthroughs]}
  }
  if(lesson.slug==='gprs'){
    const expandedNodes=[
      ...lesson.nodes,
      ...nodes([['hlr','HLR','db',365,65,'The HLR provides subscriber information and tracks packet-domain context. It supports signaling and does not carry user packets.']])
    ]
    const steps=lesson.steps.map((item,index)=>index===0?step('Attach','Register with the serving packet network',
      'The handset sends an Attach Request through the radio subsystem to the SGSN. The SGSN establishes subscriber and mobility context, obtaining home subscriber data where needed. It then confirms attach. The handset is known to the packet domain, but the application has yet to activate a data context.',
      'Attach establishes mobility state before a PDP context sets up data delivery.',[['ms','radio','Attach Request'],['radio','sgsn','Forward attach'],['sgsn','hlr','Subscriber context'],['hlr','sgsn','Subscription data'],['sgsn','ms','Attach Accept']]):item)
    return {...lesson,nodes:expandedNodes,steps,scenarios,visual:{connections:[
      ['ms','radio','Um'],['radio','sgsn','Gb'],['sgsn','hlr','Gr'],['sgsn','ggsn','Gn'],['ggsn','app','Gi']
    ]}}
  }
  return {...lesson,scenarios}
}
