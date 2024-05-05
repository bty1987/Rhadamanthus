package com.fanglin.dingding.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.bean.User;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.FormatUtil;

@Service("approvalDDService")
@Transactional(readOnly = true)
public class ApprovalService {

	@Autowired
	private UserService userDDService;

	@Autowired
	private AuthService authDDService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	public JSONObject getApproval(String no) throws FLException {

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");
		String accessToken = authDDService.getAccessToken(FormatUtil.encodeCompany(CompanyPO.TYPE_HEADQUARTER_INT));

		String url = String.format(DDApi.DDAPI_GET_PROCESS_INSTANCE_STR, oapiHost.getValue(), accessToken);

		JSONObject params = new JSONObject();

		params.put("process_instance_id", no);

		JSONObject response = HttpHelper.httpPost(url, params);

		if (response != null && response.getInteger("errcode") == 0) {
			return response.getJSONObject("process_instance");
		} else {
			System.out.println(url);
			System.out.println(params.toJSONString());
			System.out.println(response.toJSONString());
			System.out.println(String.format("%d-%s", response.getInteger("errcode"), response.getString("errmsg")));

			throw new FLException(270014, String.format("%d-%s", response.getInteger("errcode"), response.getString("errmsg")));
		}
	}

	public String getApproval(String no, String field) throws FLException {

		JSONObject infos = getApproval(no);

		JSONArray values = infos.getJSONArray("form_component_values");

		for (Object value : values) {

			JSONObject info = (JSONObject) value;

			if (field.equals(info.getString("id"))) {
				return info.getString("value");
			}
		}

		return "";
	}

	public String initiateApproval(String processCode, String senderId, String approver, String copy, String copyPosition, JSONArray formComponentValues, int company) throws FLException {

		User sender = userDDService.getUser(senderId, company);

		if (sender == null) {
			throw new FLException(270003, "获取人员信息失败");
		}

		if (sender.getDepartment() == null) {
			throw new FLException(270003, "获取人员信息失败");
		}

		JSONObject params = new JSONObject();

		if (copy != null && !"".equals(copy)) {
			params.put("cc_list", copy);
		}

		if (copyPosition != null && !"".equals(copyPosition)) {
			params.put("cc_position", copyPosition);
		}

		if (approver != null && !"".equals(approver)) {
			params.put("approvers", approver);
		}

		params.put("process_code", processCode);
		params.put("originator_user_id", senderId);
		params.put("dept_id", sender.getDepartment().get(0));
		params.put("form_component_values", formComponentValues);

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");
		String accessToken = authDDService.getAccessToken(FormatUtil.encodeCompany(company));

		String url = String.format(DDApi.DDAPI_CREATE_PROCESS_INSTANCE_STR, oapiHost.getValue(), accessToken);

		JSONObject response = HttpHelper.httpPost(url, params);

		if (response != null && response.getInteger("errcode") == 0) {
			return response.getString("process_instance_id");
		} else {
			System.out.println(senderId);
			System.out.println(url);
			System.out.println(params.toJSONString());
			System.out.println(String.format("%d-%s", response.getInteger("errcode"), response.getString("errmsg")));

			throw new FLException(270014, String.format("%d-%s", response.getInteger("errcode"), response.getString("errmsg")));
		}
	}

	public JSONArray getForms(String name, String value) {

		JSONArray forms = new JSONArray();

		JSONObject jsonObject = new JSONObject();

		jsonObject.put("name", name);
		jsonObject.put("value", value);

		forms.add(jsonObject);

		return forms;
	}

	public List<JSONObject> getForms(Map<String, Object> values) {

		List<JSONObject> forms = new ArrayList<JSONObject>();

		for (Map.Entry<String, Object> map : values.entrySet()) {

			JSONObject jsonObject = new JSONObject();
			jsonObject.put("name", map.getKey());
			jsonObject.put("value", map.getValue());

			forms.add(jsonObject);
		}

		return forms;
	}

}
