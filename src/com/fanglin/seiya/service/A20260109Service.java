package com.fanglin.seiya.service;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;

public interface A20260109Service {

	public JSONObject publishErpEvent(String eventType, String orderId) throws FLException;

	public JSONObject publishErpEvent(String eventType, String orderId, Long cnid, Integer userId) throws FLException;

}
