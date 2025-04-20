package org.cloven.rbac_sample.dtos;

public class RefreshTokenResponse {
    private String accessToken;
    private long expiresIn; // Optional: Include new expiry time if needed by frontend

    public String getAccessToken() {
        return accessToken;
    }

    public RefreshTokenResponse setAccessToken(String accessToken) {
        this.accessToken = accessToken;
        return this;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public RefreshTokenResponse setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
        return this;
    }
}