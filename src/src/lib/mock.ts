export type LeadRow = { id:string; name:string; type:string; company:string; status:'New'|'In Review'|'Qualified'|'Closed'; created:string; email?:string; phone?:string; country?:string; message?:string };

export async function fetchDashboardData(){
  // simulate latency + random errors
  await new Promise(resolveDelay => setTimeout(resolveDelay, 450));
  if (Math.random() < 0.05) throw new Error('Network error');
  const now = new Date();
  const leads: LeadRow[] = [
    { id:'l1', name:'John Doe', type:'New', company:'Prototype', status:'New', created: now.toISOString(), email:'john@example.com', country:'US', message:'Looking for proto' },
    { id:'l2', name:'Jane Smith', type:'Prototype', company:'Globex', status:'In Review', created: now.toISOString(), email:'jane@globex.com', country:'UK', message:'Quote request' },
    { id:'l3', name:'Michael Johnson', type:'Corporate', company:'Qualified', status:'Qualified', created: now.toISOString(), email:'mj@corp.com', country:'DE' },
    { id:'l4', name:'Mary Brown', type:'Beta LLC', company:'New', status:'New', created: now.toISOString() },
    { id:'l5', name:'David Wilson', type:'Prototype', company:'Closed', status:'Closed', created: now.toISOString() },
  ];
  const chart = Array.from({length:10}).map((ignored, index)=> ({ label:`W${index+1}`, value: Math.round(20 + Math.random()*60) }));
  return {
    kpis: { totalLeads: 1250, activeDealers: 50, proto30d: 65, downloads30d: 412 },
    leads,
    chart
  };
}
