const headers = {
  "Content-Type": "application/json",
};

type Get<T> = {
  endpoint: string;
};

export async function get<T>({ endpoint }: Get<T>) {
  const options = {
    method: "GET",
    headers,
  };
  return await fetch(endpoint, options);
  // Could stick error handling in here 🤷‍♂️
}

type Post<T> = {
  endpoint: string;
  data: T;
};

export async function post<T>({ endpoint, data }: Post<T>) {
  const body = JSON.stringify(data);
  const options = {
    method: "POST",
    headers,
    body,
  };
  return await fetch(endpoint, options);
  // Could stick error handling in here 🤷‍♂️
}
