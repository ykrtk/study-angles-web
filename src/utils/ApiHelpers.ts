const CONTENT_TYPE_JSON = 'application/json';

export const fetcher = async (url: string, payload?: string) => {
    const options = {
        method: payload ? "POST" : "GET",
        ...(payload && { body: payload }),
        headers: {
          accept: CONTENT_TYPE_JSON,
          "Content-Type": CONTENT_TYPE_JSON,
        },
    };

    const res = await fetch(url, options);
    const data = await res.json();

    if (res.status !== 200) {
        throw new Error(data.message);
    }
    return data;
};