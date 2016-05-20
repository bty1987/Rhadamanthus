/**
 * @File Name		: UserService.java
 * @Package   	: com.fanglin.dingding.service
 * @Version		: 1.0
 * @Date			: 2015-11-10
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.dingding.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.dingding.po.User;
import com.fanglin.dingding.utils.AuthHelper;
import com.fanglin.dingding.utils.Constant;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.utils.SystemConfig;

public class UserService {
	
	public static User getUserInfo(String code){
		
		String accessToken = AuthHelper.getAccessToken();
		
		String url = String.format(DDApi.DDAPI_GET_USER_INFO_STR, SystemConfig.getString(Constant.OAPI_HOST_STR), accessToken, code);
		
		JSONObject json = HttpHelper.httpGet(url);
		
		return JSON.parseObject(json.toJSONString(), User.class);
	}
	
	public static User getUser(String userid) {
		
		String accessToken = AuthHelper.getAccessToken();
		
		String url = String.format(DDApi.DDAPI_GET_USER_STR, SystemConfig.getString(Constant.OAPI_HOST_STR), accessToken, userid);
		
		JSONObject json = HttpHelper.httpGet(url);
		
		return JSON.parseObject(json.toJSONString(), User.class);
	}
	
	public static void main(String[] args) {
		
		String str = "{\"deviceId\":\"2c246e7546ee4a3f041c2b872b453f79\",\"errcode\":0,\"errmsg\":\"ok\",\"is_sys\":true,\"sys_level\":2,\"userid\":\"FL-00479\"}";
		
		JSONObject result = JSON.parseObject(str);
		
		User user = JSON.parseObject(result.toJSONString(), User.class);
		
		System.out.println(user.toString());
		
	}

}
