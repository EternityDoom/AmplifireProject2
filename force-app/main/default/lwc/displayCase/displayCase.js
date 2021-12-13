import { LightningElement, api, wire, track } from 'lwc';
import getCaseList from '@salesforce/apex/CaseController.getCaseList';

export default class DisplayCase extends LightningElement {
    @track columns = [{
            label: 'Case Number',
            fieldName: 'CaseNumber',
            type: 'Auto Number',
            sortable: true
        },
        {
            label: 'Subject',
            fieldName: 'Subject',
            type: 'Text(255)'
        }, {
            label: 'Status',
            fieldName: 'Status',
            type: 'Picklist'
        }, {
            label: 'Case Type',
            fieldName: 'Type',
            type: 'Picklist'
        }
    ];
    @track error;
    @track data;
    @api recordId;
    @wire (getCaseList)
    wiredOpps({error,data}) {
        if (data) {
            this.data = data;
            console.log(data);
            console.log(JSON.stringify(data, null, '\t'));
        } else if (error) {
            this.error = error;
        }
    }
    
    
}