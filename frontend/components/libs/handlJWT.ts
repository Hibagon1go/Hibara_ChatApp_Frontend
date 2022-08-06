/** JWTを、検証せずJSONに戻し、user_idを返す */
const getUserIdFromJWT = (jwt: string) => {
    const jwtData = jwt.split('.')[1];
    const userId = JSON.parse(Buffer.from(jwtData, 'base64').toString()).user_id;
    return userId;
}

export default getUserIdFromJWT;
