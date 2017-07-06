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

import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.po.User;
import com.fanglin.dingding.utils.AuthHelper;
import com.fanglin.dingding.utils.Constant;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.SystemConfig;

public class UserService {

	public static  User getUserInfo(String code){
		
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
	
	public static int addUser(UserPO userPO){
		
		User user = new User();
		
		user.setUserid(userPO.getUserId());
		
		return 0;
	}

      public static int addDDUser(String userid,String currentName,String duty,String phone,List<Long> dids) throws FLException {
		
    	  String accessToken = AuthHelper.getAccessToken();	
			User user = new User() ;
			user.setMobile(phone);
			user.setName(currentName);
			user.setUserid(userid);
			user.setPosition(duty);
			user.setDepartment(dids);
						
		 String url = String.format(DDApi.DDAPI_ADD_USER_STR, SystemConfig.getString(Constant.OAPI_HOST_STR),accessToken,  user);
						
		JSONObject json = HttpHelper.httpPost(url, user);
						 
		int errcode=json.getInteger("errcode");
			
		return errcode; 
		
      }
		
      public static int  updateDDUser(String userid,String currentName,String duty,String phone,List<Long> dids) throws FLException {
  		
    	  String accessToken = AuthHelper.getAccessToken();	
            User user = getUser(userid);
	            user.setUserid(userid);
				user.setMobile(phone);
				user.setName(currentName);
				user.setPosition(duty);
				user.setDepartment(dids);
			
		String url = String.format(DDApi.DDAPI_UPDATE_USER_STR, SystemConfig.getString(Constant.OAPI_HOST_STR),accessToken,  user);
			
		JSONObject json = HttpHelper.httpPost(url, user);
			
		int errcode=json.getInteger("errcode");
			
		return errcode; 
		
	 }
     
      public static int  deleteDDUser(String userid)throws FLException {
  		
  		String accessToken = AuthHelper.getAccessToken();
  		
  		String url = String.format(DDApi.DDAPI_DELETE_USER_STR, SystemConfig.getString(Constant.OAPI_HOST_STR), accessToken, userid);
  		
  		JSONObject json = HttpHelper.httpGet(url);
  		
  		int errcode=json.getInteger("errcode");
  		
  		return errcode;
  	}

	
}
