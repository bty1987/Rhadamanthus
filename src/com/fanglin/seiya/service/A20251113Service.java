package com.fanglin.seiya.service;

import com.fanglin.core.interceptor.FLException;

public interface A20251113Service {

	public String registAuthCode(String osstoken) throws FLException;

	public String exchangeAuthCode(String osstoken) throws FLException;

	public String exchangeAuthCodeForToken(String accessToken) throws FLException;

	public String socialAuthCode(String domain) throws FLException;

	public String stateAuthCode(String socialCode, String socialState) throws FLException;

	public int logoutAuthCode(String userId, String osstoken, String domain) throws FLException;

}
