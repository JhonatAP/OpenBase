const nearAPI = window.nearApi;
const { connect, WalletConnection, keyStores } = nearAPI;

const nearConfig = {
    networkId: "testnet", // Usa "mainnet" para producción
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
};

async function initNear() {
    // Conectar a Near y obtener la sesión
    const near = await connect(nearConfig);
    const wallet = new WalletConnection(near);

    // Verificar si el usuario está autenticado
    if (wallet.isSignedIn()) {
        // Obtener el accountId
        const accountId = wallet.getAccountId();
        const publicKey = await wallet.account().connection.signer.getPublicKey(accountId, nearConfig.networkId);

        // Mostrar la información en la página
        document.getElementById('account-id').textContent = accountId || 'No disponible';
        document.getElementById('public-key').textContent = publicKey.toString() || 'No disponible';
    } else {
        // Si no está autenticado, redirigir al login
        alert("No has iniciado sesión con Near Wallet.");
        window.location.href = 'index.html'; // Redirigir al login
    }
}

window.onload = initNear;