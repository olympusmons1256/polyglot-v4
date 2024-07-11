export const getUserInfo = async (accessToken) => {
  const response = await fetch(
    'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses',
    {
      headers: {
        Authorization: Bearer ,
      },
    }
  );
  return response.json();
};

export const getUserContacts = async (accessToken) => {
  const response = await fetch(
    'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses&pageSize=10',
    {
      headers: {
        Authorization: Bearer ,
      },
    }
  );
  return response.json();
};
