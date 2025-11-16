export type Role = 'super'|'content'|'ops'|'dealer_manager'|'compliance'|'analyst';
export const PERMS:Record<Role,string[]> = {
  super:['*'],
  content:['cms.read','cms.write','seo.write','i18n.write'],
  ops:['lead.read','lead.write','proto.read','proto.write'],
  dealer_manager:['dealer.read','dealer.write','training.write','cert.write'],
  compliance:['nda.write','audit.read'],
  analyst:['reports.read']
};
export const can = (role:Role, perm:string)=> PERMS[role]?.includes(perm) || PERMS[role]?.includes('*');
