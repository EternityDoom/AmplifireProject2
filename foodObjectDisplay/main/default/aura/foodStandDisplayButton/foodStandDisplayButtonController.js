({
    init : function(component, event, helper) {
        helper.getFoodStandRecords(component);
    },

    handleChange: function(component, event) {
        var selectedValue = event.getParam("value");
        component.find('childLWC').foodStand(selectedValue);
    }
})
