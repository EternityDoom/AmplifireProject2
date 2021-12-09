/* A static class dedicated to supporting the foodStandSelector LWC.
 * Can provide the data needed to display the selector, and can take
 * updates to that data.
 */
public with sharing class foodStandUpdates {

    @AuraEnabled(cacheable=true)
    public static List<String> retrieveFoodNames() {
        List<String> results = new List<String>();
        List<Food__c> foods = [SELECT Name FROM Food__c];
        for(Food__c food : foods){
            results.add(food.Name);
        }
        return results;
    }

    // Used to get the data from the Food Stand so that the selector can be displayed.
    @AuraEnabled(cacheable=true)
    public static List<String> retrieveFoodStand(String id) {
        // Since we need to return the type of stand, as well as its contents, and whether or not they can be updated, we need a List.
        List<String> results = new List<String>();
        // Make sure the user can see food stands.
        if (Schema.SObjectType.Food_Stand__c.isAccessible()){
            // This needs to be in a try/catch in case someone tries to look up an Id that doesn't exist
            try{
                Food_Stand__c stand = [SELECT Type__c, Item_List__c FROM Food_Stand__c WHERE Id = :id LIMIT 1];
                // If no exception occurred, fill in the results normally. Of note, field-level security is ignored on purpose.

                /* The first result is special, in that it tells the state of the results. 
                 *
                 * There are four possible options:
                 * 
                 * Editable - Found the Food Stand, and you can edit its contents.
                 * Not Editable - Found the Food Stand, but you can't edit its contents.
                 * Not Found - Tried to find the Food Stand, but there was no matching Id.
                 * Inaccessible - You don't have permission to look up Food Stands.
                 */
                if (Schema.SObjectType.Food_Stand__c.isUpdateable()){
                    results.add('Editable');
                } else {
                    results.add('Not Editable');
                }
                // The second and third results only come back if the Food Stand was found. They are the Type and Item List.
                results.add(stand.Type__c);
                results.add(stand.Item_List__c);
            } catch (QueryException e){
                results.add('Not Found');
            }
        } else {
            results.add('Inaccessible');
        }
        // Whatever the results were, return them here.
        return results;
    }

    // Used to change the Food Stand's type on the backend. Returns false if it didn't work for any reason.
    @AuraEnabled
    public static Boolean updateFoodStandType(String id, String type) {
        if (Schema.SObjectType.Food_Stand__c.isUpdateable()){
            String newType = null;
            for(Schema.PicklistEntry picklistEntry : Food_Stand__c.fields.Type__c.getDescribe().getPicklistValues()) {
                if (picklistEntry.getValue() == type){
                    newType = picklistEntry.getValue();
                }
            }
            if (newType == null) return false;
            try{

                Food_Stand__c stand = [SELECT Type__c FROM Food_Stand__c WHERE Id = :id LIMIT 1];
                stand.Type__c = newType;
                update stand;
                return true;
            } catch (QueryException e){
                return false;
            }
        } else return false;
    }

    // Used to change the Food Stand's item list on the backend. Returns false if it didn't work for any reason.
    @AuraEnabled
    public static Boolean updateFoodStandList(String id, String newList) {
        if (Schema.SObjectType.Food_Stand__c.isUpdateable()){
            try{
                Food_Stand__c stand = [SELECT Item_List__c FROM Food_Stand__c WHERE Id = :id LIMIT 1];
                stand.Item_List__c = newList;
                
                update stand;
                return true;
            } catch (QueryException e){
                return false;
            }
        } else return false;
    }
}
