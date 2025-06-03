import { md5 } from 'js-md5';

export class DigestClient {
  private nonceCount = 0;

  constructor(private username: string, private password: string) {}

  async fetchWithDigest(url: string, options: RequestInit = {}): Promise<Response> {
    const method = options.method || 'GET';

    // Step 1: Request to get the WWW-Authenticate challenge
    const res = await fetch(url, { method });

    const authHeader = res.headers.get('www-authenticate');
    if (!authHeader || !authHeader.startsWith('Digest ')) {
      throw new Error('Digest auth not supported or missing challenge');
    }

    const challenge = this.parseDigestHeader(authHeader);
    const uri = new URL(url).pathname;

    const cnonce = this.generateCnonce();
    const nc = this.generateNonceCount();

    const ha1 = md5(`${this.username}:${challenge.realm}:${this.password}`);
    const ha2 = md5(`${method}:${uri}`);
    const response = md5(
      `${ha1}:${challenge.nonce}:${nc}:${cnonce}:${challenge.qop}:${ha2}`
    );

    // Build Authorization header with optional opaque
    let auth = `Digest username="${this.username}", realm="${challenge.realm}", ` +
      `nonce="${challenge.nonce}", uri="${uri}", qop="${challenge.qop}", nc=${nc}, ` +
      `cnonce="${cnonce}", response="${response}"`;

    if (challenge.opaque) {
      auth += `, opaque="${challenge.opaque}"`;
    }

    // Step 3: Retry request with Authorization
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: auth,
      },
    });
  }

  private parseDigestHeader(header: string): Record<string, string> {
    const prefix = 'Digest ';
    const raw = header.substring(prefix.length);
    const parts = raw.match(/([a-z]+)="?([^",]+)"?/gi) || [];
    const challenge: Record<string, string> = {};

    for (const part of parts) {
      const [key, value] = part.split('=');
      challenge[key.trim()] = value.replace(/^"|"$/g, '');
    }

    return challenge;
  }

  private generateCnonce(): string {
    return Math.random().toString(36).substring(2, 14);
  }

  private generateNonceCount(): string {
    this.nonceCount += 1;
    return ('00000000' + this.nonceCount.toString(16)).slice(-8);
  }
}
