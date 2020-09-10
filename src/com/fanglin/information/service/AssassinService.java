package com.fanglin.information.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.po.UserPO;

public interface AssassinService {

	public int proxy(String server, String api, String params, String content, UserPO userPO) throws FLException;

}
