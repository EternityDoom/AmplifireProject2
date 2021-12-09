import { wire, api, LightningElement } from 'lwc';

import { retrieveFoodNames, retrieveFoodStand, updateFoodStandType, updateFoodStandList } from '@salesforce/apex/foodStandUpdates.retrieveFoodStand';

import FOOD_IMAGES from '@salesforce/resourceUrl/food_images';
import STAND_IMAGES from '@salesforce/resourceUrl/stand_images';

export default class FoodStandSelector extends LightningElement {
    typeList = [{'label': 'Open Rack', 'value': 'openRack', 'slots': [5, 5, 5]},
                {'label': 'Platter Tower', 'value': 'platterTower', 'slots': [5, 5, 5]},
                {'label': 'Refridgerated Drink Rack', 'value': 'drinkFridge', 'slots': [5, 5, 5]},
                {'label': 'Refridgerated Rack', 'value': 'fridge', 'slots': [5, 5, 5]},
                {'label': 'Freezer', 'value': 'freezer', 'slots': [5, 5, 5]},
                {'label': 'Cold Drink Dispenser', 'value': 'sodaMachine', 'slots': [5, 5, 5]},
                {'label': 'Hot Drink Dispenser', 'value': 'coffeeMachine', 'slots': [5, 5, 5]},];
    @wire(retrieveFoodNames)
    foodList;
    foodStandId;
    type = 'openRack';
    typeLabel = 'Open Rack';
    editable = false;
    standDisplay;
    standDisplayContext;
    mouseDragFlag = false;
    mouseDragFood;
    mouseCoordinates;
    pileSlots = [];
    standSlots = [];
    slotSize = 50;
    foodImages = [];
    standImages = [];
    errorMsg;

    constructor() {
        super();
        this.template.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.template.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.template.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.template.addEventListener('mouseout', this.handleMouseOut.bind(this));
    }

    //handler for mouse move operation
    handleMouseMove(event){
        this.searchCoordinatesForEvent('move', event);      
    }
    
    //handler for mouse down operation
    handleMouseDown(event){
        this.searchCoordinatesForEvent('down', event);         
    }
    
    //handler for mouse up operation
    handleMouseUp(event){
        this.searchCoordinatesForEvent('up', event);       
    }

    //handler for mouse out operation
    handleMouseOut(event){
        this.searchCoordinatesForEvent('out', event);         
    }

    searchCoordinatesForEvent(requestedEvent, event){
        event.preventDefault();
        if (!this.editable) return;
        if (requestedEvent === 'down') {
            this.mouseCoordinates = this.convertCoordinates(event);
            this.checkDragStart();
            this.redrawStandDisplay();
        }
        let updateFoodFlag = false;
        if (requestedEvent === 'up' || requestedEvent === "out") {
            if (mouseDragFlag) {
                standSlots.forEach(slot => {
                    if(this.isMouseInSlot(slot)){
                        slot.food = this.mouseDragFood;
                        updateFoodFlag = true;
                    }
                });
                mouseDragFlag = false;
                this.redrawStandDisplay();
            }
        }
        if (requestedEvent === 'move') {
            if (mouseDragFlag) {
                this.mouseCoordinates = this.convertCoordinates(event);
                this.redrawStandDisplay();
            }
        }
        if (updateFoodFlag){
            this.updateFood();
        }
    }

    checkDragStart(){
        this.mouseDragFood = null;
        pileSlots.forEach(slot => {
            if (!this.mouseDragFlag && this.isMouseInSlot(slot)){
                this.mouseDragFlag = true;
                this.mouseDragFood = slot.food;
            }
        });
        standSlots.forEach(slot => {
            if (!this.mouseDragFlag && this.isMouseInSlot(slot) && slot.food !== ''){
                this.mouseDragFlag = true;
                this.mouseDragFood = slot.food;
                slot.food = '';
            }
        });
    }

    isMouseInSlot(slot){
        return this.mouseCoordinates.x >= slot.x && this.mouseCoordinates.x <= slot.x + this.slotSize
        && this.mouseCoordinates.y >= slot.y && this.mouseCoordinates.y <= slot.y + this.slotSize
    }

    //This method is primarily called from mouse down & move to setup coordinates.
    convertCoordinates(eventParam){
        //get size of an element and its position relative to the viewport 
        //using getBoundingClientRect which returns left, top, right, bottom, x, y, width, height.
        const clientRect = standDisplay.getBoundingClientRect();
        return {x: eventParam.clientX -  clientRect.left, y: eventParam.clientY - clientRect.top};
    }

    renderedCallback(){
        standDisplay = this.template.querySelector('canvas');
        standDisplayContext = standDisplay.getContext("2d");
        if (foodList){
            this.pileSlots = [];
            for (let y = 0; y < foodList.length; y++){
                this.pileSlots.push({x: 25, y: 25 + (y * 75), food: foodList[y]});
            }
        }
        this.redrawStandDisplay();
    }

    get foodStand(){
        return this.foodStandId;
    }

    @api
    set foodStand(value){
        this.foodStandId = value;
        this.lookupFoodStand();
    }
    
    handleTypeChange(event) {
        let newType = event.detail.value;
        if (type !== newType){
            typeList.forEach(element => {
                if (element.value == newType){
                    this.updateType(element);
                }
            });
        }
    }

    getFoodImage(foodName){
        if (foodImages[foodName]){
            return foodImages[foodName];
        } else {
            let newImage = new Image();
            newImage.src = FOOD_IMAGES + '/' + foodName + '.png';
            newImage.onload = this.redrawStandDisplay();
            foodImages[foodName] = newImage;
            return newImage;
        }
    }

    getStandImage(standName){
        if (standImages[standName]){
            return foodImages[standName];
        } else {
            let newImage = new Image();
            newImage.src = STAND_IMAGES + '/' + standName + '.png';
            newImage.onload = this.redrawStandDisplay();
            standImages[standName] = newImage;
            return newImage;
        }
    }

    redrawStandDisplay(){
        if (this.errorMsg){
            this.standDisplayContext.fillText(this.errorMsg, 10, 10);
        } else {
            this.standDisplayContext.drawImage(this.getStandImage(this.typeLabel), 100, 0);
            pileSlots.forEach(slot => {
                this.standDisplayContext.drawImage(this.getFoodImage(slot.food), slot.x, slot.y);
            });
            standSlots.forEach(slot => {
                if(this.mouseDragFlag && this.isMouseInSlot(slot)){
                    this.standDisplayContext.globalAlpha = 0.5;
                    if (slot.food !== ''){
                        this.standDisplayContext.drawImage(this.getFoodImage(slot.food), slot.x, slot.y);
                    }
                    this.standDisplayContext.drawImage(this.getFoodImage(this.mouseDragFood), slot.x, slot.y);
                    this.standDisplayContext.globalAlpha = 1;
                } else {
                    if (slot.food !== ''){
                        this.standDisplayContext.drawImage(this.getFoodImage(slot.food), slot.x, slot.y);
                    }
                }
            });
            if(this.mouseDragFlag){
                this.standDisplayContext.drawImage(this.getFoodImage(this.mouseDragFood), 
                    this.mouseCoordinates.x + (this.slotSize / 2), this.mouseCoordinates.y + (this.slotSize / 2));
            }
        }
    }

    async updateType(newType){
        let updateResult = await updateFoodStandType({id: this.foodStandId, type: newType.label});
        if (updateResult){
            this.setType(newType);
        }
    }

    setType(newType){
        this.type = newType.value;
        this.typeLabel = newType.label;
        this.standSlots = [];
        for (let y = 0; y < newType.slots.length; y++){
            for(let x = 0; x < newType.slots[y]; x++){
                let slotX = (400 / newType.slots[y]) * (x + 0.5) + 100;
                let slotY = (600 / newType.slots.length) * (y + 0.5);
                this.standSlots.push({x: slotX, y: slotY, food: ''});
            }
        }
    }

    async updateFood(){
        let foodList = this.standSlots[0];
        for (let i = 1; i < this.standSlots.length; i++){
            foodList += ',' + this.standSlots[i].food;
        }
        let updateResult = await updateFoodStandList({id: this.foodStandId, type: foodStandList});
    }

    async lookupFoodStand(){
        let lookupResult = await retrieveFoodStand({id: this.foodStandId});
        if (lookupResult){
            this.editable = false;
            this.errorMsg = null;
            switch (lookupResult[0]){
                case 'Editable':
                    this.editable = true;
                case 'Not Editable':
                    this.setType(lookupResult[1]);
                    let foods = lookupResult[2].split(',');
                    for (let i = 0; i < this.standSlots.length; i++){
                        if (foods[i]){
                            this.standSlots[i].food = foods[i];
                        } else {
                            this.standSlots[i].food = '';
                        }
                    }
                    break;
                case 'Not Found':
                    this.setType({'label': 'Placeholder', 'value': 'error', 'slots': []});
                    this.errorMsg = 'No Food Stand found with id "' + this.foodStandId + '".';
                    break;
                case 'Inaccessible':
                    this.setType({'label': 'Placeholder', 'value': 'error', 'slots': []});
                    this.errorMsg = 'Access denied. You do not have permission to query Food Stands.';
                    break;
                default:
                    this.setType({'label': 'Placeholder', 'value': 'error', 'slots': []});
                    this.errorMsg = 'Unknown error occurred. The results of the lookup are missing or invalid.';
            }
        } else {

        }
    }
}