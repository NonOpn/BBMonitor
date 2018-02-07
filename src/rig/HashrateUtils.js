class HashrateUtils {

  sanitizeHashrate(hashrate: any) {
    hashrate = parseInt(hashrate);

    if (hashrate > 500) {
        hashrate = Math.floor(hashrate * 1. / 10) / 100;
        return hashrate + " MH/s";
    } else {
        return hashrate + " H/s";
    }
  }
}


export default new HashrateUtils();
