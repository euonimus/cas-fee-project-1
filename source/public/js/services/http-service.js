class HttpService {
    ajax(method, url, data, headers) {
        const fetchHeaders = new Headers({ "content-type": "application/json", ...(headers || {}) });

        return fetch(url, {
            // eslint-disable-next-line object-shorthand
            method: method,
            headers: fetchHeaders,
            body: JSON.stringify(data),
        // eslint-disable-next-line arrow-body-style
        }).then((x) => {
            return x.json();
        });
    }
}
// eslint-disable-next-line import/prefer-default-export
export const httpService = new HttpService();
