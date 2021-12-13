public with sharing class caseHandlerController {
  
    public class caseHandlerController {
        public static void updateInsertCase(List<Case> caseObjList){
        Set<String> setStr = new Set<String>();
        
        List<Case> caseObj = new List<Case>();
        List<Case> caseList=[Select Case.Id, Case.Origin, Case.ContactId, Case.AccountId, Case.ContactPhone, Case.Status,
                           Case.Priority, Case.Subject, Case.LastModifiedById, Case.OwnerId,
                           Case.CreatedById, Case.CreatedDate, Case.Description From Case Where Case.Subject != null];
        for(Case d1:caseList){
            setStr.add(d1.AccountId);
        }
        
          for(Case e1:caseObjList){
                if(setStr.contains(e1.AccountId)){
                    e1.Subject.addError('Does not allow duplicate accounts for Cases!!!');
                }
            }
        
        }

    }
}