import Transport from "@ledgerhq/hw-transport";
import { splitPath } from "./utils";


export default class Rai {
    constructor (transport) {
        this.transport = transport
    }

    getWalletPublicKey (path) {
        const paths = splitPath(path);
        const buffer = Buffer.alloc(1 + paths.length * 4);
        let buffer[0] = paths.length;
        paths.map( (path,index) => {
            buffer.writeUInt32BE(path, 1 + 4*index)
        })

        return this.transport
            .send(0xe0, 0x40, 0x00, 0x00, buffer)
            .then( response => {
                const publicKeyLength = response[0];
                const addressLength = response[1 + publicKeyLength];
                const publicKey = response
                    .slice(1, 1 + publicKeyLength)
                    .toString("hex");
                const base58Address = response
                    .slice(
                        1 + publicKeyLength + 1,
                        1 + publicKeyLength + 1 + addressLength
                    )
                    .toString("ascii");
                return { publicKey, base58Address };
            })
    }
}