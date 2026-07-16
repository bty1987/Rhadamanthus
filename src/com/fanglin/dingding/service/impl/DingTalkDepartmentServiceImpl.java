/**
 * @File Name		: DepartmentServiceImpl.java
 * @Package   	: com.fanglin.dingding.service.impl
 * @Version		: 1.0
 * @Date			: 2016-12-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.dingding.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.bean.Department;
import com.fanglin.dingding.service.DingTalkAuthService;
import com.fanglin.dingding.service.DingTalkDepartmentService;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.FormatUtil;

@Service("dingTalkDepartmentService")
@Transactional(readOnly = true)
public class DingTalkDepartmentServiceImpl implements DingTalkDepartmentService {

	@Autowired
	private DingTalkAuthService dingTalkAuthService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public List<Department> queryDepartment(Integer company) throws FLException {

		String accessToken = dingTalkAuthService.getAccessToken(FormatUtil.encodeCompany(company));

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		String url = String.format(DDApi.DDAPI_LIST_DEPARTMENT_STR, oapiHost.getValue(), accessToken, companyPO.getNo());

		JSONObject json = HttpHelper.httpGet(url);

		if (json == null) {
			throw new FLException(270022, "获取部门信息失败");
		} else if (json.getInteger("errcode") != 0) {
			System.out.println(url);
			System.out.println(String.format("%d-%s", json.getInteger("errcode"), json.getString("errmsg")));

			throw new FLException(240015, String.format("%d-%s", json.getInteger("errcode"), json.getString("errmsg")));
		}

		return JSON.parseArray(json.getJSONArray("department").toJSONString(), Department.class);
	}

}
