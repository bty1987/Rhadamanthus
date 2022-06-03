package com.fanglin.postar.service;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;

public interface PostarService {

	public void callbackPostar(JSONObject params) throws FLException;

}
