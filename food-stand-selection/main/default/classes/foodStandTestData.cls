@isTest
public class foodStandTestData {

    public static List<sObject> pregenFoodStands() {
        List<sObject> thingsToInsert = new List<sObject>();

        Food__c chipBag = new Food__c(Name='Potato Chips', Price__c=1, Units_Per_Case__c=10, In_Stock__c=true);
        thingsToInsert.add(chipBag);
        chipBag = new Food__c(Name='Barbecue Chips', Price__c=1, Units_Per_Case__c=10, In_Stock__c=true);
        thingsToInsert.add(chipBag);
        chipBag = new Food__c(Name='Cheese Chips', Price__c=1, Units_Per_Case__c=10, In_Stock__c=true);
        thingsToInsert.add(chipBag);

        Account acc = new Account(Name='TestAcc');
        thingsToInsert.add(acc);
        Order ord = new Order(AccountId=acc.Id);
        thingsToInsert.add(ord);
        Food_Stand__c fs = new Food_Stand__c(Order__c=ord.Id, Type__c='Open Rack');
        thingsToInsert.add(fs);

        insert thingsToInsert;
        return thingsToInsert;
    }
    
}
