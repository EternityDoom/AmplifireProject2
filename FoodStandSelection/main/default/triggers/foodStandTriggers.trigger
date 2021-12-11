/* Triggers for the Food Stand custom object.
 * This object doesn't need much validation, but it's supposed to clear the Item List field
 * whenever the Type field changes.
 */
trigger foodStandTriggers on Food_Stand__c (before insert, before update) {
    if (Trigger.isInsert){
        for (Food_Stand__c newFoodStand : Trigger.new){
            // The beforeUpdate method is written to handle inserts as well, by passing in null for the old Food Stand.
            foodStandHelpers.beforeUpdate(null, newFoodStand);
        }
    } else {
        // This loop is done by Id, to make sure the matching old and new Food Stands are passed in.
        for(Id standId : Trigger.newMap.keySet()){
            foodStandHelpers.beforeUpdate(Trigger.oldMap.get(standId), Trigger.newMap.get(standId));
        }
    }
}