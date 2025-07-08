type Params = Record<string, any> | [string, any][];

const urlBase = "http://172.16.1.43/api/appundav/";

export async function apiRequest(method:string, route:string, parameters:Params = {}, token:string): Promise<any> {
  
  const isGetLike = method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE';
  // Convert parameters from Map to plain object if needed
  const paramObject =
    parameters instanceof Map ? Object.fromEntries(parameters) : parameters;

  let url = urlBase + route;
  let body: string | undefined;

  if (isGetLike && paramObject) {
    const queryString = new URLSearchParams(paramObject).toString();
    url += queryString ? `?${queryString}` : '';
  } else {
    body = JSON.stringify(paramObject);
  }

  const response = await fetch(url, {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...(body && { body }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} ${error}`);
  }

  return await response.json();
}