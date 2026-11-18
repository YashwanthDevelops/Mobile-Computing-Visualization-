import type { Scenario } from '../types'

/** An alternate stack view connects a protocol trace to the architecture that supports it. */
function layers(label:string,description:string,entries:[string,string,string,string][]):Scenario {
  return {label,description,mode:'layers',
    nodes:entries.map(([id,name,detail],i)=>({id,label:name,kind:'app',x:340,y:36+i*44,detail})),
    steps:entries.map(([id,name,detail,idea])=>({label:name.split(' / ')[0],title:name,body:detail,idea,active:[id]}))}
}
export const architectureViews:Record<string,Scenario>={
  ims:layers('System layers','Follow a service request through application, session-control and access functions.',[
    ['as','Application services','An application server can provide services such as call forwarding. The serving CSCF invokes services according to the subscriber’s service profile.','A service can reuse the same IMS session-control infrastructure.'],
    ['ctrl','Session control','The P-CSCF is the first signaling contact. The I-CSCF locates the serving function, and the S-CSCF acts as registrar. The HSS supplies subscriber information.','The registration trace shows the messages exchanged within this architecture.'],
    ['ip','IP connectivity','The access and transport networks provide IP connectivity between the handset and the IMS signaling functions.','The handset needs an IP path to its proxy before sending REGISTER.'],
    ['ue','User equipment','The handset runs the SIP user agent and responds to the authentication challenge using its subscriber credentials.','Registration establishes a reachable contact for a public user identity.']
  ]),
  h323:layers('Protocol roles','Inspect the protocol families used by a classic H.323 endpoint.',[
    ['ras','H.225 RAS','Registration, admission and status messages connect an endpoint to its gatekeeper.','The terminal registers an alias and requests admission to the call.'],
    ['call','H.225 call signaling','Call signaling exchanges Setup, Alerting and Connect messages.','A gatekeeper may participate in signaling even when the media path is direct.'],
    ['mediactrl','H.245 control','The endpoints exchange capabilities and open logical channels for media.','Audio and video channels depend on compatible capabilities at both ends.'],
    ['media','RTP and RTCP','RTP transports encoded media. RTCP conveys reception and timing reports.','Signaling and media can follow different network paths.']
  ]),
  'in-ss7':layers('IN conceptual planes','View one freephone service at four levels of abstraction.',[
    ['svc','Service plane','A caller dials a freephone number. The service plane describes the feature as the user experiences it.','The dialled service number can remain fixed while the destination changes.'],
    ['global','Global functional plane','The service logic combines service-independent building blocks, including a translation lookup.','The description can be reused independently of the physical network layout.'],
    ['distributed','Distributed functional plane','The service switching and service control functions cooperate to obtain a routing instruction.','This plane describes which functions interact.'],
    ['physical','Physical plane','The switch and service control point host those functions. An STP routes the SS7 signaling between them.','The call trace shows the physical entities exchanging the query and instruction.']
  ]),
  'palm-os':layers('OS architecture','Locate an application event in the classic Palm OS software stack.',[
    ['application','Application and forms','The application event loop receives the event and its active form handler decides what the control selection means.','Application code supplies meaning for a Save button.'],
    ['managers','System managers','The Event, Form and Data Managers provide APIs for input, interface dispatch and record storage.','A form handler asks the Data Manager to store the new record.'],
    ['system','Kernel and drivers','System services and device drivers coordinate low-level work and process input from the digitizer.','The application can handle an event without reading hardware registers.'],
    ['hardware','Handheld hardware','The digitizer senses a pen contact and the memory holds application data.','The event loop links a physical action to a change in application state.']
  ])
}
