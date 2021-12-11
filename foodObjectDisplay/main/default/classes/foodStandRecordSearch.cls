public with sharing class foodStandRecordSearch {
    
    @auraEnabled(cacheable=true)
    public static List<Food_Stand__c> foodStandRecordSearch() {
        try {
            List<Food_Stand__c> foodStandList = new List<Food_Stand__c>();
            foodStandList = [SELECT Id, Name FROM Food_Stand__c];

            return foodStandList;
        } catch (Exception ex) {
            System.debug(ex);
            return null;
        }
    

    }
}
