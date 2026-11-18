import type {Lesson, Scenario, Step, Study} from '../types'
import one from './unit1'
import two from './unit2'
import three from './unit3'
import four from './unit4'
import five from './unit5'
import {architectureViews} from './architecture'
import {expandVisuals} from './expanded-visuals'
import {independentScenes} from './independent-scenes'
import {newLessons} from './additions'
import {step, study} from './authoring'
import {studyNotes} from './study-notes'
import {bluetoothClassic,wimaxEntry,wapStack} from './extra-scenarios'

const originals=new Map([one,two,three,four,five].flat().map(lesson=>{
  const architecture=architectureViews[lesson.slug]
  const full=expandVisuals({...lesson,study:studyNotes[lesson.slug],scenarios:[...lesson.scenarios??[],...architecture?[architecture]:[]]})
  return [lesson.slug,full]
}))
function original(slug:string){
  const lesson=originals.get(slug)
  if(!lesson) throw new Error('Unknown lesson '+slug)
  return lesson
}
function views(lesson:Lesson,...names:string[]){
  return names.map(name=>{
    const match=lesson.scenarios?.find(item=>item.label===name)
    if(!match)throw new Error('Unknown scenario '+name+' for '+lesson.slug)
    return match
  })
}
function read(overview:string, source:string, indexes:number[], recall:string[]):Study {
  const notes=studyNotes[source]
  return {...notes,overview,sections:indexes.map(index=>notes.sections[index]),recall}
}
function page(slug:string,title:string,question:string,scene:Scenario,notes:Study,backing?:Lesson):Lesson{
  const sceneNodes=scene.nodes||backing?.nodes
  if(!sceneNodes)throw new Error('Missing diagram nodes for '+slug)
  return {slug,title,short:title,question,mode:scene.mode||backing?.mode||'map',nodes:sceneNodes,
    visual:scene.visual||backing?.visual,steps:scene.steps,walkthrough:scene.label,study:notes}
}
function authored(slug:string,title:string,question:string,notes:Study){
  return page(slug,title,question,independentScenes[slug],notes)
}
function scenarioPage(source:string,label:string,slug:string,title:string,question:string,notes:Study){
  const existing=original(source)
  return page(slug,title,question,views(existing,label)[0],notes,existing)
}
function keepSteps(lesson:Lesson, indexes:number[]):Step[]{
  return indexes.map(index=>lesson.steps[index])
}
function subset(lesson:Lesson, steps:Step[]){
  const ids=new Set(steps.flatMap(item=>[...item.active,...(item.links||[]).flatMap(([from,to])=>[from,to])]))
  return lesson.nodes.filter(node=>ids.has(node.id))
}

const mobile=original('mobile-architecture')
const middleware=authored('middleware','Middleware Services','How does a reusable service layer handle messages and synchronization?',
  read('Middleware sits between application logic and underlying system or network services. Follow one reusable messaging service under changing connectivity.','mobile-architecture',[2],['Explain abstraction, queuing, synchronization, security and session services.']))
const gateways=authored('gateways','Gateways and Protocol Translation','What changes when a request crosses a gateway?',
  read('A gateway interconnects systems. In this example it terminates two different protocol exchanges and translates between them.','mobile-architecture',[2],['Label the two protocol legs and where translation occurs.','Compare a forwarding router with an application gateway.']))
const dialogue=authored('session-dialogue','Dialogue Control','When does a dialogue need state across multiple exchanges?',
  read('Dialogue control organizes how interacting parties start, continue and end communication. It can be studied independently of the wireless generation carrying the traffic.','mobile-architecture',[3],['Compare an independent transaction with a maintained session.','Use the duplex scenario to distinguish direction of transmission.']))
dialogue.scenarios=views(original('mobile-generations'),'Dialogue modes')

const gsm=original('gsm')
const gsmArchitecture=scenarioPage('gsm','Architecture','gsm-architecture','GSM Architecture','Which blocks make up GSM and what are Um, Abis and A?',
  read('Read the complete GSM architecture before studying each procedure. The mobile station, radio subsystem, switching functions and subscriber records have distinct roles.','gsm',[0,1],['Draw the mobile station, two BTSs, BSC, MSC, GMSC and the four database functions.','Label Um, Abis and A.']))
const gsmMobility=scenarioPage('gsm','Location update','gsm-mobility','GSM Location Update and Handover','How does GSM keep an idle phone reachable and an active call connected?',
  read('An idle phone updates its registered location when required. An active connection can hand over between cells. Explore both mobility procedures here.','gsm',[1,3],['Distinguish registration, location area, paging and active handover.']))
gsmMobility.scenarios=views(gsm,'Handover')
const gprs=original('gprs')
const gprsArchitecture=scenarioPage('gprs','Packet core architecture','gprs-architecture','GPRS Network Architecture','What are the roles of BSS, PCU, SGSN, GGSN and HLR?',
  read('The GPRS network joins a shared packet radio system to a packet core. Interfaces connect each part to the next and subscriber signaling supports packet mobility.','gprs',[0,1],['Label the Um, Gb, Gr, Gn and Gi links.','Distinguish the mobility state from the activated PDP context.']))
const wap=original('wap-sms')
const sms=scenarioPage('wap-sms','SMS query','mobile-sms','Mobile Computing over SMS','How does SMS deliver a short message when the recipient is offline?',
  read('SMS is a store-and-forward message service. A service can use a short message as a request, a notification or a confirmation even when either side is intermittently connected.','wap-sms',[2],['Draw the originating phone, SMSC, destination routing and receiver.','Explain retries and the validity window.']))
const ipv6=authored('ipv6','IPv6 Addressing and Connectivity','How does a mobile device configure an IPv6 address on a new link?',study(
  'IPv6 expands address space and provides neighbor and router discovery for local links. Mobility extensions use this connectivity separately to preserve reachability across networks.',[
    ['Addresses and scope','IPv6 uses 128-bit addresses. Link-local addresses operate on one local link. Globally scoped addresses can be routed beyond it when appropriate routing is configured. A host can have several addresses with different scope or lifetimes.'],
    ['Neighbor discovery and configuration','Router Advertisements can advertise prefixes, lifetimes and default router information. SLAAC uses suitable advertised prefixes for autonomous configuration. DHCPv6 or other mechanisms can provide configuration according to policy. Duplicate Address Detection checks tentative address use.'],
    ['Mobile distinction','Changing the assigned address can disrupt an existing flow. Mobile IPv6 adds home and care-of addresses plus a binding update mechanism to handle reachability when moving.']
  ],['Explain link-local discovery and SLAAC in order.','Compare IPv4 and IPv6 address space and their neighbor discovery mechanisms.']))
const bluetooth=original('bluetooth-wimax')
const bluetoothSteps=keepSteps(bluetooth,[0,1])
const wimaxSteps=keepSteps(bluetooth,[2,3])
const wirelessReview=['Compare intended scale, access method, application and energy use.']

const wlan=original('wlan')
const wlanArchitectureSteps=keepSteps(wlan,[0,1,3])
const wlanMobilitySteps=keepSteps(wlan,[0,1,3,4])
const wlanStandards=authored('wlan-standards','WLAN Fundamentals and IEEE 802.11','Why do WLAN stations contend for shared airtime?',
  read('A wireless LAN joins devices locally using radio. Learn its advantages, what IEEE 802.11 defines and how stations share a channel.','wlan',[1,3],['Explain WLAN benefits and limitations.','Connect contention, backoff and acknowledgement to successful access.']))
const wlanSecurity=authored('wlan-security','Wireless LAN Security','How does a WLAN establish trust and protect frames?',
  read('Wireless access security starts before application traffic is forwarded. This example traces a protected enterprise WLAN from association through authentication and link keys.','wlan',[2,3],['Identify supplicant, authenticator and authentication server.','Distinguish link protection from end-to-end application encryption.']))
const inNetwork=original('in-ss7')
const ss7=scenarioPage('in-ss7','SS7 trunk signaling','ss7','SS7 Signaling','How does signaling establish an external circuit without carrying the speech?',
  read('Signaling System No. 7 carries call and service signaling between telephone network nodes. Trace a circuit call through setup, answer and release.','in-ss7',[1,2],['Label SSP and STP and the separate bearer.','Recall IAM, ACM, ANM, REL and RLC.']))
const programmed=authored('programmable-networks','Programmable Networks','How do forwarding rules change after a link goes down?',
  read('Programmable networks expose interfaces for software to observe topology and configure forwarding behavior. The lab tracks a controller changing a data path.','softswitch-vpn',[1],['Explain the control plane and data plane with the same packet example.']))
const vpn=scenarioPage('softswitch-vpn','VPN tunnel','vpn','Virtual Private Networks','How do endpoints carry a protected inner packet across another network?',
  read('A VPN can connect remote clients or networks through an encrypted tunnel. Follow encapsulation, transport and decapsulation.','softswitch-vpn',[2],['Identify inner and outer addresses, tunnel endpoints and where protection starts and ends.']))

const hardware=original('client-hardware')
const client=authored('client-programming','Client Programming','How does a responsive client handle events and asynchronous work?',
  read('Client programming coordinates the user interface, operating system events, local state and requests to services.','client-hardware',[1,2],['Trace the handler and worker from user input to result.']))
const phone=authored('phone-hardware','Mobile Phone Hardware','What do the application processor, modem and peripheral subsystems each do?',
  read('Use a phone call to locate the hardware blocks in a typical mobile handset.','client-hardware',[0],['Label application processor, baseband, RF, display, audio and power.']))
phone.scenarios=views(hardware,'Incoming call').map(item=>({...item,nodes:item.nodes||hardware.nodes}))
const palmArchitecture=scenarioPage('palm-os','OS architecture','palm-os-architecture','Palm OS Architecture','Which system managers connect applications to database and hardware services?',
  read('The Palm OS architecture supplies event, user-interface and data services for classic handheld applications.','palm-os',[0],['Label the application layer, system managers and device services.']))
const symbianArchitecture=authored('symbian-architecture','Symbian OS Architecture','How do apps, system servers and kernel services fit together?',
  read('Symbian uses shared services and asynchronous client/server communication to support smartphone applications.','symbian',[0,1],['Label UI, middleware, servers, kernel, drivers and hardware.']))

const sip=original('sip')
const mediaSteps=views(sip,'Voice packet path')[0]
const media=page('rtp-rtcp','RTP and RTCP','How do timed audio packets and reception reports work together?',mediaSteps,
  read('RTP carries real-time media and RTCP provides associated reception and timing information. This scene starts once a call has already negotiated its media parameters.','sip',[2],['Identify sequence number, timestamp and payload.','Distinguish an RTP packet from an RTCP reception report.']))
const voip=page('voip','VoIP Architecture','Which parts capture, encode, transmit and play an IP voice call?',mediaSteps,
  read('Voice over IP turns speech into packet media. Signaling establishes the call, and the media chain makes the speech audible at the far end.','sip',[0,3],['Draw the source audio chain, packet network, jitter buffer, decoder and output.']))
const voice=authored('voice-applications','Voice over IP Applications','Where do softphones, enterprise telephony and voice gateways fit?',
  read('Voice applications apply the common VoIP media and signaling architecture to different calling contexts.','sip',[3],['Compare a softphone call with an interworked telephone call.']))
const ims=original('ims')
const imsArchitecture=scenarioPage('ims','System layers','ims-architecture','IMS Architecture','What are the roles of access, session control and application services?',
  read('IMS is a managed IP multimedia architecture. Inspect the service, control and transport layers before tracing registration.','ims',[0,2],['Identify P-CSCF, I-CSCF, S-CSCF, HSS, application servers and access.']))
imsArchitecture.scenarios=views(ims,'Session setup')
const ngn=authored('ngn','Next Generation Networks','What separates service control from the packet transport network?',
  read('Next-generation packet networks can offer several services over shared packet transport. The diagram separates access, transport, service control and resource policy.','networked-multimedia',[0,3],['Draw access, transport and service functions.','Explain how media can take a different path from signaling.']))

export const unitsContent:Lesson[][]=[
  [
    {...mobile,title:'Mobile Computing Fundamentals and Architecture',study:read('Understand mobility, wireless beginnings, devices and layered network architecture through a request from a phone.','mobile-architecture',[0,1],['Draw the architecture and describe each layer.'])},
    {...original('mobile-generations'),title:'Wireless Evolution from 1G to 5G',scenarios:[],study:read('Trace the transition from analog cellular voice to digital systems, mobile internet and flexible 5G services.','mobile-generations',[0,1,2],['Compare services and access across all five generations.'])},
    dialogue,middleware,gateways,...newLessons[0],
    original('mobile-security'),original('quantum-optimization'),original('quantum-devices')
  ],
  [
    {...bluetooth,title:'Bluetooth',short:'Bluetooth',question:'How do Bluetooth devices form local connections?',walkthrough:'Low Energy',steps:bluetoothSteps,nodes:subset(bluetooth,bluetoothSteps).map((n,i)=>({...n,x:i===0?175:505})),scenarios:[bluetoothClassic],study:read('Bluetooth connects nearby devices and peripherals. Compare discovery and a connected read in BLE with a piconet in Bluetooth Classic.','bluetooth-wimax',[0,2],wirelessReview)},
    ...newLessons[1],
    {...page('wimax','WiMAX','How does a subscriber station obtain broadband service?',wimaxEntry,read('WiMAX provides broadband wireless access using IEEE 802.16 technology. Explore the relationship between a base station and subscriber station.','bluetooth-wimax',[1,2],wirelessReview)),
      scenarios:[{label:'Scheduled service',description:'Compare subscriber traffic with the base station’s resource allocations.',mode:'map',steps:wimaxSteps,nodes:subset(bluetooth,wimaxSteps).map((n,i)=>({...n,x:i===0?184:490}))}]},
    {...original('mobile-ip'),title:'Mobile IP: Registration and Tunneling',short:'Mobile IP'},ipv6,gsmArchitecture,
    {...gsm,title:'GSM Call Routing',scenarios:views(gsm,'Outgoing call'),study:read('Study how incoming and outgoing GSM calls establish a route, alert the far end and connect the speech bearer.','gsm',[1,2],['Trace routing, paging, connection and release for each direction.'])},
    gsmMobility,sms,gprsArchitecture,
    {...gprs,title:'GPRS Packet Data and Applications',scenarios:views(gprs,'Download'),study:read('Follow the GPRS packet-service lifecycle and application traffic in both directions.','gprs',[1,2],['Explain attach, activation, tunneling and delivery.'])},
    {...wap,title:'Wireless Application Protocol (WAP)',short:'WAP gateway',question:'How does a legacy WAP handset load a service through a gateway?',walkthrough:'Page request',scenarios:[wapStack],nodes:subset(wap,wap.steps),study:read('WAP supported browsing and applications on early mobile devices with constrained displays and networks.','wap-sms',[0,1],['Trace the microbrowser, gateway and web origin.','Relate WAE, WSP, WTP, WTLS and WDP to the bearer.'])}
  ],
  [
    wlanStandards,
    {...wlan,title:'WLAN Architecture',short:'WLAN architecture',question:'How are individual cells connected into one extended network?',steps:wlanArchitectureSteps,study:read('Learn Wi-Fi network structure by tracing one frame from a station through an AP and the distribution system.','wlan',[0],['Draw AP, stations, BSS, a distribution system and ESS.'])},
    page('wlan-mobility','WLAN Mobility and Roaming','How does a mobile station change APs during an active connection?',{label:'Roaming',description:'Follow the serving BSS as the station moves.',steps:wlanMobilitySteps.map((s,i)=>({...s,positions:{sta:i===3?[92,230]:[92,106]}}))},read('Roaming changes the serving access point and can preserve IP connectivity in the same network.','wlan',[0,2],['Identify when association and key state changes.']),wlan),
    ...newLessons[2].slice(0,3),wlanSecurity,...newLessons[2].slice(3),
    {...inNetwork,title:'Intelligent Networks and IN Conceptual Model',short:'Intelligent Networks',scenarios:views(inNetwork,'IN conceptual planes'),study:read('An intelligent network keeps service logic separate from parts of ordinary call switching. Follow freephone service across its four conceptual planes.','in-ss7',[0,1,3],['Map four planes and distinguish SSP, SCP and STP responsibilities.'])},
    ss7,
    {...original('softswitch-vpn'),title:'Softswitches and Media Gateways',short:'Softswitches',scenarios:[],study:read('Packet telephony separates call decisions from media conversion and forwarding.','softswitch-vpn',[0],['Identify call control and the media gateway in the diagram.'])},
    programmed,vpn,original('cloud-quantum')
  ],
  [
    client,phone,{...hardware,title:'PDA Hardware',short:'PDA hardware',scenarios:[],study:read('A classic PDA brings portable input, local storage and synchronization together. This scene traces its stylus input path.','client-hardware',[0,1],['Trace digitizer, driver, operating system and client.'])},
    ...newLessons[3],palmArchitecture,
    {...original('palm-os'),title:'Palm OS Application Development',short:'Palm app development',scenarios:[],study:read('Follow an event-driven Palm OS application from stylus input to saving a database record.','palm-os',[1,2],['Draw the event loop and explain dispatch and storage.'])},
    symbianArchitecture,
    {...original('symbian'),title:'Symbian Application Development',short:'Symbian app development',study:read('Follow a Symbian client from a UI event through an asynchronous system request and completion.','symbian',[1,2],['Explain the active object, server and scheduler.'])},
    original('quantum-frameworks')
  ],
  [
    voip,original('h323'),
    {...sip,title:'Session Initiation Protocol (SIP)',short:'SIP call setup',steps:keepSteps(sip,[0,1,2,3,6]),scenarios:[],study:read('SIP establishes and controls multimedia sessions. This sequence focuses on invitation, response, acknowledgement and release.','sip',[0,1],['Read INVITE through BYE and explain the role of SDP.'])},
    media,voice,imsArchitecture,
    {...ims,title:'IMS Registration and Session Setup',scenarios:views(ims,'Session setup'),study:read('Follow how an IMS user agent becomes reachable, then how it sets up a session.','ims',[1,2],['Distinguish REGISTER and INVITE, authentication and media negotiation.'])},
    {...original('networked-multimedia'),title:'Networked Multimedia Applications',study:read('Study voice, video and streaming behavior under delay, jitter and buffering.','networked-multimedia',[1,2],['Compare delay, late loss and playout buffering.'])},
    ngn
  ]
]
