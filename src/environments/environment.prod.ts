
declare const process: {
  env: {
    [key: string]: string;
  };
};

export const environment = {
  apiUrl: (typeof process !== 'undefined' && process.env['API_URL'])
    ? process.env['API_URL']
    : 'https://api-gestion-events-prod.onrender.com/api/v1'   // 👈 fallback para prod
};

