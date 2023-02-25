const exec = (promise, success, error) => {
    return promise
        .then(async res => {
            let responseBody = await res.json();
            if (res.status !== 200) {
                return error(JSON.stringify(responseBody));
            } else {
                return success(responseBody.Items ? responseBody.Items : responseBody);
            }
        })
        .catch(async err => {
            return error(JSON.stringify(err));
        });
}

const labelize = (camelCase) => {
    const result = camelCase.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

const mapToArrayBased = (propBasedItems, propName) => {
    const items = [];
    if (propBasedItems) {
      const keys = Object.keys(propBasedItems);
      items.push(...keys.map(k => {
        const ret = {
          ...propBasedItems[k]
        }
        ret[propName] = k;
        return ret;
      }));
    }
    return items;
  }

  const mapToPropertyBased = (arrayBasedAddresses, propName) => {
    const mappedAddresses = {};
    arrayBasedAddresses.forEach(a => {
      let clone = structuredClone(a);
      const name = clone[propName];
      delete clone[propName];
      mappedAddresses[name] = clone;
    });
    return mappedAddresses;
  }

export { exec, labelize, mapToArrayBased, mapToPropertyBased };