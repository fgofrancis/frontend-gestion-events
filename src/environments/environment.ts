declare const process: {
  env: {
    [key: string]: string;
  };
};

export const environment = {
  apiUrl: (typeof process !== 'undefined' && process.env['API_URL'])
    ? process.env['API_URL']
    : 'http://localhost:8080/api/v1' 
};
