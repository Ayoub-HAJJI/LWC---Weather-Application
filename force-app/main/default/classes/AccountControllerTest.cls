@isTest
private with sharing class AccountControllerTest {
    public AccountControllerTest() {

    }

    //La méthode de test de getDistinctAccountVille()
    @isTest
    public static void getDistinctAccountVilleTest() {

        List<String> actualCities = AccountController.getDistinctAccountVille();

        System.assertEquals('Austin', actualCities.get(0));
        System.assertEquals(11, actualCities.size());
    }

}