const crypto = require('crypto');

function customBase64Encode(data) {
    const encoded = data.toString('base64');
    const chunks = [];
    for (let i = 0; i < encoded.length; i += 60) {
        chunks.push(encoded.slice(i, i + 60));
    }
    return chunks.join(' ');
}

function generateSid(userId, udid = "aaKANB7MGlkDAGUYdwRRiaYB", umid = "2d6bed51365d48070db91741b651ae") {
    const key = Buffer.from('iscooler');
    const iv = Buffer.from([1, 113, 97, 122, 2, 119, 115, 120]);

    // TripleDES key needs to be 24 bytes (3 * 8 bytes)
    const backendKey = Buffer.concat([key, key, key]);

    const params = {
        umid,
        installQT: "0",
        user_id: String(userId),
        timezone: "480",
        channel: "isCool",
        udid,
        app_id: "600000001",
        device: "Xiaomi|MI 9|MI 9|9",
        version: "5.9.20",
        installLE: "0"
    };

    const plainText = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');

    const cipher = crypto.createCipheriv('des-ede3-cbc', backendKey, iv);
    let encryptedBytes = cipher.update(plainText, 'utf8');
    encryptedBytes = Buffer.concat([encryptedBytes, cipher.final()]);

    return customBase64Encode(encryptedBytes);
}

module.exports = { generateSid };
