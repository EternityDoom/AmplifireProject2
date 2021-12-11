import { LightningElement, track, wire, api } from 'lwc';
import retrieveRecords from '@salesforce/apex/foodRecordSearch.retrieveRecords'

export default class DisplayFoodInformation extends LightningElement {
    @track listRecords;
    @track foodOptions;
    @track recId;

    @wire(retrieveRecords, {})
    WiredretrieveRecords({error, data}) {
        if (data) {
            try {
                this.listRecords = data;
                let options = [];

                for (var key in data) {
                    options.push({label: data[key].Name, value: data[key].Id });
                }
                this.foodOptions = options;
            } catch (error) {
                console.error(error);
            }
        } else if (error) {
            console.error(error);
        }
    }
    handleChange(event) {
        this.recId = event.detail.value;
    }
}