public with sharing class foodRecordSearch {
    
    @AuraEnabled(cacheable=true)
    public static List<Food__c> retrieveRecords() {
        try {
            List<sObject> foodList = new List<Food__c>();
            foodList = [SELECT Id, Name, Price__c, Description__c FROM Food__c];

            return foodList;
        } catch (Exception ex) {
            System.debug(ex);
            return null;
        }
    }
}
