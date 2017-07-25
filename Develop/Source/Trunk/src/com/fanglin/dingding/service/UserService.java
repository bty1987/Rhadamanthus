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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.po.User;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

@Service("userDDService")
@Transactional(readOnly = true)
public class UserService {
	
	@Autowired
	private  AuthService authDDService ;
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	public  User getUserInfo(String code){
		
		String accessToken = authDDService.getAccessToken();
		
		SystemConfigPO oapiHost = systemConfigDao.querySystemConfigByKey("oapiHost");
		
		String url = String.format(DDApi.DDAPI_GET_USER_INFO_STR, oapiHost.getValue(), accessToken, code);
		
		JSONObject json = HttpHelper.httpGet(url);
		
		return JSON.parseObject(json.toJSONString(), User.class);
	}
	
	public  User getUser(String userid) {
	
		String accessToken = authDDService.getAccessToken();
		
		SystemConfigPO oapiHost = systemConfigDao.querySystemConfigByKey("oapiHost");
		
		String url = String.format(DDApi.DDAPI_GET_USER_STR, oapiHost.getValue(), accessToken, userid);
		
		JSONObject json = HttpHelper.httpGet(url);
		
		return JSON.parseObject(json.toJSONString(), User.class);
	}
	
	public int addUser(UserPO userPO){
		
		User user = new User();
		
		user.setUserid(userPO.getUserId());
		
		return 0;
	}

      public  int addDDUser(String userid,String currentName,String duty,String phone,List<Long> dids) throws FLException {
		
    	  String accessToken = authDDService.getAccessToken();	
    	  User user = new User() ;
			user.setMobile(phone);
			user.setName(currentName);
			user.setUserid(userid);
			user.setPosition(duty);
			user.setDepartment(dids);
		
		 SystemConfigPO oapiHost = systemConfigDao.querySystemConfigByKey("oapiHost");
						
		 String url = String.format(DDApi.DDAPI_ADD_USER_STR, oapiHost.getValue(),accessToken,  user);
						
		 JSONObject json = HttpHelper.httpPost(url, user);
						 
		 int errcode=json.getInteger("errcode");
		 	
		 return errcode; 
		
      }
		
      public  int  updateDDUser(String userid,String currentName,String duty,String phone,List<Long> dids) throws FLException {
  		
    	String accessToken = authDDService.getAccessToken();	
        User user = getUser(userid);
	            user.setUserid(userid);
				user.setMobile(phone);
				user.setName(currentName);
				user.setPosition(duty);
				user.setDepartment(dids);
		
		SystemConfigPO oapiHost = systemConfigDao.querySystemConfigByKey("oapiHost");
			
		String url = String.format(DDApi.DDAPI_UPDATE_USER_STR, oapiHost.getValue(),accessToken,  user);
			
		JSONObject json = HttpHelper.httpPost(url, user);
			
		int errcode=json.getInteger("errcode");
			
		return errcode; 
		
	 }
     
      public  int  deleteDDUser(String userid)throws FLException {
  		
  		String accessToken =authDDService.getAccessToken();
  		
  		 SystemConfigPO oapiHost = systemConfigDao.querySystemConfigByKey("oapiHost");
  		
  		String url = String.format(DDApi.DDAPI_DELETE_USER_STR,oapiHost.getValue(), accessToken, userid);
  		
  		JSONObject json = HttpHelper.httpGet(url);
  		
  		int errcode=json.getInteger("errcode");
  		
  		return errcode;
  	}

	
}
