import parse from "url-parse";
import crypto from "crypto";
import axios from "axios";

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function generateRandomChallengePair() {
  const secret = base64URLEncode(crypto.randomBytes(32));
  const hashed = base64URLEncode(sha256(secret));
  return { secret, hashed };
}

const qs = parse.qs;

class PKCEClient {
  constructor(issuer, clientId, extraParams) {
    this.issuer = issuer;
    this.clientId = clientId;
    this.extraParams = extraParams;
  }

  getAuthResult(url, interactive) {
    return new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow({ url, interactive }, (callbackURL) => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        resolve(callbackURL);
      });
    });
  }

  getRedirectURL() {
    return chrome.identity.getRedirectURL("oauth2");
  }

  async exchangeCodeForToken(code, verifier) {
    const { issuer, clientId, extraParams } = this;
    const params = {
      redirect_uri: this.getRedirectURL(),
      grant_type: "authorization_code",
      code_verifier: verifier,
      client_id: clientId,
      code,
      ...extraParams,
    };

    const body = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const result = await axios.post(`${issuer}/oauth/token`, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return result.data;
  }

  extractCode(resultUrl) {
    const response = parse(resultUrl, true).query;

    if (response.error) {
      throw new Error(response.error_description || response.error);
    }

    return response.code;
  }

  async authenticate(options = {}, interactive = true) {
    const { issuer, clientId } = this;
    const { secret, hashed } = generateRandomChallengePair();

    Object.assign(options, {
      client_id: clientId,
      code_challenge: hashed,
      redirect_uri: this.getRedirectURL(),
      code_challenge_method: "S256",
      response_type: "code",
    });

    const url = `${issuer}/authorize?${qs.stringify(options)}`;
    console.log("authorizationUrl", url);
    const resultUrl = await this.getAuthResult(url, interactive);
    const code = this.extractCode(resultUrl);
    return this.exchangeCodeForToken(code, secret);
  }
}

export default PKCEClient;
