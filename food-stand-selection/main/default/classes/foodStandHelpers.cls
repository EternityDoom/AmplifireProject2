/* A static class that holds helper logic to support triggers for the Food Stand custom object.
 * Can help clear the item list of a Food Stand whenever its Type is altered.
 */
public with sharing class foodStandHelpers {

    /* Takes in the previous version of the Food Stand record (or null, if this is an insert)
     * and the new version, and performs any adjustments needed.
     * Right now, that means checking to see if the Type has been changed (or never existed)
     * and, if so, resetting the Item List to an empty String.
     */
    public static void beforeUpdate(Food_Stand__c oldFoodStand, Food_Stand__c newFoodStand){
        if (oldFoodStand == null || oldFoodStand.Type__c != newFoodStand.Type__c){
            newFoodStand.Item_List__c = '';
        }
    }

}
