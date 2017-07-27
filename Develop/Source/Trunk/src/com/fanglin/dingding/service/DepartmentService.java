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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.dingding.po.Department;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

@Service("departmentDDService")
@Transactional(readOnly = true)
public class DepartmentService {
	
	@Autowired
	private   AuthService authDDService ;
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	public  List<Department> queryDepartment(long did){
		
		String accessToken = authDDService.getAccessToken();
		
		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");
		
		String url = String.format(DDApi.DDAPI_LIST_DEPARTMENT_STR, oapiHost.getValue(), accessToken, did);
	
		JSONObject json = HttpHelper.httpGet(url);
	
		return JSON.parseArray(json.getJSONArray("department").toJSONString(), Department.class);
	}
	
}
