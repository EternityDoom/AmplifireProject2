({
    doInit : function(component) {
        let action = component.get("c.retrieveOpenCases");
        action.setCallback(this, function(res) {
            if(res.getState() === 'Success') {
                component.set("v.caseIds", res.getReturnValue());
            }
        })
        $A.enqueueAction(action);
    }
})
