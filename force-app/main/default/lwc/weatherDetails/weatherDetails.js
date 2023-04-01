import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import VILLE_WEATHER from '@salesforce/messageChannel/VILLE_WEATHER__c';

export default class WeatherDetails extends LightningElement {

    //Les variables
    cityName = '';
    temperature = '';
    humidity = '';
    weatherDescription = '';
    country = '';

    @wire(MessageContext) messageContext;

    connectedCallback() {

        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            VILLE_WEATHER,
            (message) => {
                this.handleMessage(message);
            }
        );
    }

    handleMessage(message) {

        this.cityName = message.city;
        this.temperature = (message.temperature)-273,15;
        this.humidity = message.humidity;
        this.weatherDescription = message.description;
        this.country = message.country;
    }

    disconnectedCallback() {

        unsubscribe(this.subscription);
        this.subscription = null;
    }
}