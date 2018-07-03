const { client } = rootRequire('db').redis;

// 60 seconds by default
const KEY_EXPIRE_TIME = 60;
const COUNTER_EXPIRE_TIME = 604800; // a week

function getCounter() {
  return new Promise((resolve, reject) => {
    client.incr('counter', (err, data) => {
      if (err) return reject(err);
      // Set expiry
      if (data === 1 || data % 1000000 === 0) {
        client.expire('counter', COUNTER_EXPIRE_TIME, (err) => {
          if (err) return reject(err);
          logger.error(`counter expire time error ${err.message}`);
        });
      }

      resolve(data);
    });
  });
}

function setKey(key, expires = KEY_EXPIRE_TIME) {
  return new Promise((resolve, reject) => {
    client.set(key, 1, 'EX', expires, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function getKeys(pattern) {
  return new Promise((resolve, reject) => {
    client.keys(pattern, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function delKey(key) {
  return new Promise((resolve, reject) => {
    client.del(key, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function isUnderProcess(keys, currentCounter) {
  const flag = keys.some((v) => {
    const val = parseInt(v.split(':')[2], 10);
    if (val < currentCounter) {
      return true;
    }
    return false;
  });
  return flag;
}

async function processObject({ processName, objectId, expiresInSeconds }) {
  try {
    const counter = await getCounter();
    const key = `${processName}:${objectId}:${counter}`;
    await setKey(key, expiresInSeconds);
    const keys = await getKeys(`${processName}:${objectId}:*`);
    if (keys.length > 1) {
      // multiple incoming request
      if (isUnderProcess(keys, counter)) {
        logger.info(`DUPLICATE:${key}`);
        await delKey(key);
        const error = new Error(`${objectId} already under Process by other user.`);
        error.name = 'UnderProcessError';
        throw error;
      }
    }
    return key;
  } catch (e) {
    logger.error(`RedisHelper key:${processName}:${objectId} Error: ${e.message}`);
  }
}

/* Generic counter helpers */

function getNewCounter(counter, expires) {
  return new Promise((resolve, reject) => {
    client.incr(counter, (err, data) => {
      if (err) return reject(err);
      if (expires) {
        client.expire('counter', expires, (err) => {
          if (err) return reject(err);
          logger.error(`counter expire time error ${err.message}`);
        });
      }
      resolve(data);
    });
  });
}

function setKeys(key, expires) {
  return new Promise((resolve, reject) => {
    if (expires) {
      client.set(key, 1, 'EX', expires, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    } else {
      client.set(key, 1, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    }
  });
}


module.exports = {
  processObject,
  delKey,
  getKeys,
  setKeys,
  getNewCounter,
};