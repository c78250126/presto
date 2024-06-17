import axios from 'axios';

export const getUserData = async (token, setStore) => {
  const response = await axios.get('http://localhost:5005/store', {
    headers: {
      Authorization: token,
    }
  })
  setStore(response.data.store);
}

export const sendUserData = async (token, data, setFunc = null) => {
  const response = await axios.put('http://localhost:5005/store', { store: data }, {
    headers: {
      Authorization: token,
    }
  })
  if (setFunc) {
    setFunc(JSON.parse(response.config.data).store);
  }
}
