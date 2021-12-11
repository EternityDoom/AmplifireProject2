({
    getFoodStandRecords : function(component, event, helper) {
        var items = []
        foodStandList = component.get("c.foodStandRecordSearch");
        for (var key in foodStandList) {
            items.push({label: foodStandList[key].Name, value: foodStandList[key].Id});
        }
        items.setCallback(this, function(){
            component.set("v.options", items);
        })

    }
})
