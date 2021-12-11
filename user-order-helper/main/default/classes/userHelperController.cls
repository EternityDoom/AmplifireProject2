public with sharing class userHelperController {

    public static Id findUsersMostRecentOrder(Id userId) {
        // Orders aren't directly tied to Users, they're tied to Accounts.
        // As such, we need to look up the relevant Accounts first.
        Map<Id, Account> accs = new Map<Id, Account>([SELECT Id, OwnerId FROM Account WHERE OwnerId = :userId]);
        // We only need the Ids for filtering.
        Set<Id> accIds = accs.keySet();
        try {
            // This query gets the most recently ordered Order that was for one of the Accounts from earlier.
            Order result = [SELECT Id, AccountId, OrderedDate FROM Order WHERE AccountId IN :accIds ORDER BY OrderedDate DESC NULLS LAST LIMIT 1];
            return result.Id;
        } catch (QueryException e){
            // If there weren't any applicable Orders, return null;
            return null;
        }
    }
}
