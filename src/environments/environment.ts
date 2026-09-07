declare const process: {
  env: {
    [key: string]: string;
  };
};

export const environment = {
  apiUrl: process.env['API_URL'] || ''
};
