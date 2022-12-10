const exec = (promise, success, error) => {
    return promise
        .then(async res => {
            let responseBody = await res.json();
            if (res.status !== 200) {
                error(JSON.stringify(responseBody));
            } else {
                success(responseBody.Items ? responseBody.Items : responseBody);
            }
        })
        .catch(async err => {
            error(JSON.stringify(err));
        });
}

const labelize = (camelCase) => {
    const result = camelCase.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export { exec, labelize };