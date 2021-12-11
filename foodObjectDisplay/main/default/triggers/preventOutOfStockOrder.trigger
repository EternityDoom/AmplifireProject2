trigger preventOutOfStockOrder on Opportunity (before insert) {
    switch on Trigger.operationtype {
        when BEFORE_INSERT {
            // Checks if created opportunity sale object is currently out of stock.
            preventOutOfStockOrderHelper.checkOutOfStock(Trigger.New);
        }
    }
}