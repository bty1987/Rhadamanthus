package com.fanglin.swiftpass.service;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;

public interface SwiftpassService {

	public void callbackSwiftpass(JSONObject params) throws FLException;

}
