document.getElementById('login-button').addEventListener('click', async () => {
    const walletKey = 'clave_generada'; // Reemplaza con la clave que obtienes después del login
    const userData = { nombre: 'Usuario', email: 'usuario@example.com' }; // Cambia con datos reales del usuario

    const response = await fetch('/guardar-llave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletKey, userData })
    });

    const result = await response.text();
    document.getElementById('status').textContent = result;
});



// Importar la librería NearAPI
const nearAPI = window.nearApi;
const { connect, keyStores, WalletConnection } = nearAPI;

// Configuración de la conexión a la red de Near
const nearConfig = {
    networkId: "testnet", // Usa "mainnet" para producción
    keyStore: new keyStores.BrowserLocalStorageKeyStore(), // Almacena las claves en el navegador
    nodeUrl: "https://rpc.testnet.near.org", // Nodo RPC para conectarse
    walletUrl: "https://wallet.testnet.near.org", // URL del wallet en testnet
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};

async function initNear() {
    // Conectar a Near
    const near = await connect(nearConfig);
    // Crear conexión con el wallet
    const wallet = new WalletConnection(near);
    // Chequear si el usuario ya está autenticado
    if (wallet.isSignedIn()) {
        document.getElementById('status').textContent = `¡Hola, ${wallet.getAccountId()}!`;
    } else {
        document.getElementById('status').textContent = "No has iniciado sesión.";
    }
    // Agregar evento al botón de login
    document.getElementById('login-button').onclick = async () => {
        if (!wallet.isSignedIn()) {
            // Redirigir al usuario a Near Wallet para autenticarse
            wallet.requestSignIn();
        } else {
            wallet.signOut();
            document.getElementById('status').textContent = "Te has desconectado.";
            document.getElementById('login-button').textContent = "Iniciar sesión con Near Wallet";
        }
    };
}

// Inicializar la conexión cuando cargue la página
window.onload = initNear;

window.onload = function() {
    // Obtiene los parámetros de la URL (account_id y public_key)
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('account_id');
    const publicKey = urlParams.get('public_key');

    if (accountId && publicKey) {
        document.getElementById('status').innerText = `Conectado como: ${accountId}`;
        console.log('Clave pública:', publicKey);
    } else {
        document.getElementById('status').innerText = 'Inicia sesión para continuar';
    }
};