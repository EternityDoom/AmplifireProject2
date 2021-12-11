({
	init : function(component, event, helper) {
		let currentUserId = $A.get("$SObjectType.CurrentUser.Id");
        let method = component.get("c.findUsersMostRecentOrder");
        method.setParams({userId: currentUserId});
        method.setCallback(this, function(response) {
            if(response.getState() === "SUCCESS" && response.getReturnValue()) {
                component.set("v.orderId", response.getReturnValue());
            }
        });
        $A.enqueueAction(method);
	}
})