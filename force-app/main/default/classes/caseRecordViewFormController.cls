public with sharing class caseRecordViewFormController {
  
    @auraEnabled(cacheable=true)
    public static List<Id> retrieveOpenCases() {
        Map<Id, Case> caseMap = new Map<Id, Case>([SELECT Id FROM Case WHERE Status != 'Closed']);
        List<Id> caseIds = new List<Id>();
 
        for(Id caseId : caseMap.keySet()) {
            caseIds.add(caseId);
        }
        return caseIds;
     }
 }