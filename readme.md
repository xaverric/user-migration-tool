# User migration tool

Create multiple users at once and generate them the passwords. 

### Installation

```
npm install
```

### Usage 

```
node index.js "UserAdministrator AC1" "UserAdministrator AC1" "OidcAuthorities AC1" "OidcAuthorities AC2" "http://10.50.10.22:30080" "usy-fbcore-configurationg01" 00011111111111111111111111111010 "C:\...\dtoInData.json"
```
### Parameters

Parameters need to be defined in the following order.

* *User Administrator AC1*
    * accessCode1 for account with *UserAdministrator* privileges to login against OIDC
* *User Administrator AC2*
    * accessCode2 for account with *UserAdministrator* privileges to login against OIDC
* *Oidc Authorities AC1*
    * accessCode1 for account with *OidcAuthorities* privileges to login against OIDC
* *Oidc Authorities AC2*
    * accessCode2 for account with *OidcAuthorities* privileges to login against OIDC
* *host* 
    * host IP address/domain name
* *application* 
    * application name, e.g. *uu-oidc-maing02*
* *awid* 
    * application workspace ID
* *dtoInPath*
    * path to the file with dtoIn list

### DtoIn Data 

Data in the file located under *dtoInPath* need to be written according the following convention. Each *dtoIn* inside the *itemList* must meet the criteria of the *dtoIn* for the user/create command.

You can define access codes right in each dtoIn in format ```dtoIn.accessCode1``` and ```dtoIn.accessCode2```. If not defined, the tool will generate random sequence of 8 characters for every missing access code value in the dtoIn
```json
{
  "itemList": [
    { dtoIn1 },
    { dtoIn2 },
    ...
  ]
}
```
