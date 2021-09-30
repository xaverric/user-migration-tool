import fs from "fs";
import fetch from "node-fetch";

const args = process.argv.slice(2);

// arguments definition
const userAcc1 = args[0]; 
const userAcc2 = args[1]; 
const oidcAcc1 = args[2]; 
const oidcAcc2 = args[3]; 
const host = args[4]; 
const application = args[5];
const awid = args[6] 
const dtoInPath = args[7]; 

const login = async(username, password, host) => {
    const credentials = {
        "accessCode1": username,
        "accessCode2": password,
        "grant_type": "password"
    };
    const response = await fetch(`${host}/uu-oidc-maing02/11111111111111111111111111111111/oidc/grantToken`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(credentials)
    });
    return await response.json()
};

const callCommand = async(uri, token, method, dtoIn) => {
    const commandDtoIn = prepareDtoIn(dtoIn, token, method);
    const response = await fetch(uri, commandDtoIn);
    return await response.json();
};

const prepareDtoIn = (data, token, method) => {
    return {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: method === "POST" ? JSON.stringify(data) : null
    };
};

const loadDtoInData = dtoInPath => {
    let data;
    try {
        data = JSON.parse(fs.readFileSync(dtoInPath));
    } catch (err) {
        data = null;
    }
    return data;
};

const generateAccessCode = () => {
    return Math.random().toString(36).slice(-8);
};

const getAccessCodesDtoIn = (uuIdentity, accessCode1, accessCode2) => {
    let dtoIn = {};
    dtoIn.identityAccountCode = uuIdentity;
    dtoIn.newAccessCode1 = accessCode1 ? accessCode1 : generateAccessCode();
    dtoIn.newAccessCode2 = accessCode2 ? accessCode2 : generateAccessCode();
    dtoIn.realmCode = "uuIdentityAccessCodesAuthNRealm";
    return dtoIn;
}

const main = async() => {
    console.log("START");

    const userCreateUri = `${host}/${application}/${awid}/user/create`;
    const accessCodesUri = `${host}/uu-oidc-maing02/11111111111111111111111111111111/authAccessCodes/setAccessCodes`;

    const dtoInData = loadDtoInData(dtoInPath);

    const tokenUserAdmin = await login(userAcc1, userAcc2, host);
    const tokenOidcAdmin = await login(oidcAcc1, oidcAcc2, host);

    for (const dtoIn of dtoInData.itemList) {
        const createdUser = await callCommand(userCreateUri, tokenUserAdmin["id_token"], "POST", dtoIn);
        console.log(`User ${createdUser.firstName} ${createdUser.lastname}, ${createdUser.email} created with uuIdentity: ${createdUser.uuIdentity}`);

        const credentialsDtoIn = getAccessCodesDtoIn(createdUser.uuIdentity, dtoIn.accessCode1, dtoIn.accessCode2);
        await callCommand(accessCodesUri, tokenOidcAdmin["id_token"], "POST", credentialsDtoIn);
        console.log(`Credentials created for user with uuIdentity: ${createdUser.uuIdentity}, accessCode1: ${credentialsDtoIn.newAccessCode1}, accessCode2: ${credentialsDtoIn.newAccessCode2}`);
    }

    console.log("END");
};

await main();