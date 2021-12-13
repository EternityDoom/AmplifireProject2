public with sharing class CaseController {
    @AuraEnabled 
    public static List<Case> getCaseList(){
        try {
            return [SELECT Id, Subject, Status, Type, Priority, Description FROM Case ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
