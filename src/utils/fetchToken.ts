export const fetchToken = async () => {
  const response = await fetch('https://api.plcplatform.net/graphql', {
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
    referrer: 'https://plcplatform.net/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: '{"query":"\\n    mutation login($input: LoginInputDto!) {\\n  signIn(input: $input) {\\n    token\\n    refreshToken\\n    expiresAt\\n    refreshTokenExpiresAt\\n    payload {\\n      _id\\n    }\\n  }\\n}\\n    ","variables":{"input":{"email":"admin@test.com","password":"Testermefi@123"}},"operationName":"login"}',
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
  })
  const result = await response.json()
  const token = result.data.signIn.token
  localStorage.setItem('mf-token', token)
}
