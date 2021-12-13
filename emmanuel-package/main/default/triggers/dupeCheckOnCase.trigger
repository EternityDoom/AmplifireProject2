trigger dupeCheckOnCase on Case (before insert) {
    if(trigger.isBefore){
        if(trigger.isInsert){  
            caseHandlerController.updateInsertCase(trigger.new);
        }
        if(trigger.isUpdate){
            
            caseHandlerController.updateInsertCase(trigger.new);
        }
        
    }
    else if(trigger.isAfter){
         system.debug('This is inside an after trigger!');
    }
    
}