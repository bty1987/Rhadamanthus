/**
 * @File Name		: DepartmentService.java
 * @Package   	: com.fanglin.dingding.service
 * @Version		: 1.0
 * @Date			: 2016-12-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.dingding.service;

import java.util.List;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.dingding.po.Department;
import com.fanglin.dingding.utils.AuthHelper;
import com.fanglin.dingding.utils.Constant;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;

import com.fanglin.utils.SystemConfig;


public class DepartmentService {
	
	public static List<Department> queryDepartment(long did){
		
		String accessToken = AuthHelper.getAccessToken();
		
		String url = String.format(DDApi.DDAPI_LIST_DEPARTMENT_STR, SystemConfig.getString(Constant.OAPI_HOST_STR), accessToken, did);
		
		JSONObject json = HttpHelper.httpGet(url);
	
		return JSON.parseArray(json.getJSONArray("department").toJSONString(), Department.class);
	}
	
	
	
	
}
