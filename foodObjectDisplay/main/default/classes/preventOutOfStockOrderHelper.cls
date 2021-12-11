public class preventOutOfStockOrderHelper {
    public static void checkOutOfStock(List<Opportunity> sales) {
        // Queries for relevant fields in Opportunity Object.
        List<Opportunity>checkStock = [SELECT Id, Name, Email, (SELECT In_Stock__c FROM Food__c) FROM Opportunity];

        // Checks queried fields if lookup Food Object is out of stock.
        // Prevents Opportunity creation if Food object is currently out of stock.
        for ( Opportunity o : checkStock ) {
            if (!o.In_Stock__c) {
                o.addError('This Opportunity is currently out of stock');

            }
        }
    }
}
