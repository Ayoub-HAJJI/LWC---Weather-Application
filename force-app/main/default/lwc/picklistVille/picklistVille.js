import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import getDistinctAccountVille from '@salesforce/apex/AccountController.getDistinctAccountVille';
import getWeather from '@salesforce/apex/AccountController.getWeather';
import VILLE_WEATHER from '@salesforce/messageChannel/VILLE_WEATHER__c';


export default class PicklistVille extends LightningElement {

    //Les variables
    villes = [];
    selectedVille = '';
    weatherDetails;
    temperature;
    country;
    humidity;
    description;
    weatherIconUrl;

    @wire(MessageContext)
    messageContext;

    @wire(getDistinctAccountVille)
    wiredVilles({ error, data }) {
        if (data) {
            this.villes = data.map(ville => {
                return { label: ville, value: ville };
            });
        } else if (error) {
            console.error(error);
        }
    }

    //La méthode pour gérer le choix de la ville à partir du combobox
    handleAccountVilleChange(event) {

        this.selectedVille = event.detail.value;
        console.log(this.selectedVille);
    }

    //La méthode pour gérer le button qui envoie le résutat de l'API sur un message channel vers l'autre component
    handleAccountVilleClick() {

        if(this.selectedVille) {

            getWeather({city: this.selectedVille})
            .then((result) => {

                console.log(result);
                this.weatherDetails = result;
                this.temperature = result.temperature;
                this.humidity = result.humidity;
                this.description = result.description;
                this.country = result.country;

                const message = {
                    city: this.selectedVille,
                    temperature: this.temperature,
                    humidity: this.humidity,
                    country : this.country,
                    description : this.description,
                    weatherIconUrl: this.weatherIconUrl
                };


                publish(this.messageContext, VILLE_WEATHER, message);
                console.log('Ville Séléctionnée:', this.selectedVille);
            })
        }else {

            console.error('No city selected');
        }

    }
}