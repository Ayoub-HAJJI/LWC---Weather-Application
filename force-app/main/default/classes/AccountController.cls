public with sharing class AccountController {

    //Les variables constantes qui servent pour compléter les informations de l'URI vers la resource
    private static final String ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';
    private static final String API_KEY = '23f041502801555550c7934952e9e02a';

    //Le constructeur par défaut
    public AccountController() {

    }

    //La méthode pour retourner la liste des villes distinctes de l'objet standard "Account"
    @AuraEnabled(cacheable=true)
    public static List<String> getDistinctAccountVille() {

        List<String> villes = new List<String>();
        
        //La requête pour récupérer toutes les villes distinctes de l'objet standard "Account"
        List<AggregateResult> results = [SELECT BillingCity FROM Account GROUP BY BillingCity];
        
        //Ajouter chque ville à la liste finale
        for (AggregateResult ar : results) {
            String ville = (String)ar.get('BillingCity');
            villes.add(ville);
        }
        
        return villes;
    }

    //La méthode pour retourner les informations sous forme de Map de météo concernant une ville précise
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getWeather(String city) {

        Map<String, Object> result = new Map<String, Object>();
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(ENDPOINT + '?q=' + EncodingUtil.urlEncode(city, 'UTF-8') + '&appid=' + API_KEY);
        request.setMethod('GET');
        try {
            HttpResponse response = http.send(request);
            if (response.getStatusCode() == 200) {
                Map<String, Object> jsonResponse = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
                result.put('city', (String)jsonResponse.get('name'));
                result.put('country', (String)((Map<String, Object>)jsonResponse.get('sys')).get('country'));
                List<Object> weatherList = (List<Object>)jsonResponse.get('weather');
                result.put('description', ((Map<String, Object>)weatherList[0]).get('description'));
                result.put('temperature', ((Map<String, Object>)jsonResponse.get('main')).get('temp'));
                result.put('humidity', ((Map<String, Object>)jsonResponse.get('main')).get('humidity'));
            }
        } catch (Exception e) {
            result.put('error', e.getMessage());
        }
        
        return result;
    }


}