package com.fanglin.finance.utils;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.finance.bean.KTCBean;

public class KTCHandle {

	public static String POST_K3CloudURL = "http://192.168.5.28/k3cloud/";

	private String authentication;

	private boolean logflag = true;
	
	private JSONObject resultParams;

	private static Map<String, String> API = new HashMap<String, String>();

	static {
		API.put("Login", "Kingdee.BOS.WebApi.ServicesStub.AuthService.ValidateUser.common.kdsvc");
		API.put("Save", "Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Save.common.kdsvc");
		API.put("View", "Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.View.common.kdsvc");
		API.put("Submit", "Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Submit.common.kdsvc");
		API.put("Audit", "Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Audit.common.kdsvc");
		API.put("UnAudit", "Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.UnAudit.common.kdsvc");
	}

	public KTCHandle begin(String dbId, String user, String pwd, int lang) throws Exception {

		JSONArray params = new JSONArray();
		params.add(dbId);// 帐套Id
		params.add(user);// 用户名
		params.add(pwd);// 密码
		params.add(lang);// 语言

		logger(params.toJSONString());

		HttpURLConnection connection = handle(API.get("Login"), params);

		// 获取Cookie
		String key = null;
		for (int i = 1; (key = connection.getHeaderFieldKey(i)) != null; i++) {
			if (key.equalsIgnoreCase("Set-Cookie")) {
				String tempCookieVal = connection.getHeaderField(i);
				if (tempCookieVal.startsWith("kdservice-sessionid")) {
					authentication = tempCookieVal;
					break;
				}
			}
		}

		BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
		String line;
		logger(" ============================= ");
		logger(" Contents of post request ");
		logger(" ============================= ");

		while ((line = reader.readLine()) != null) {

			logger(new String(line.getBytes(), "utf-8"));

			if (!line.contains("\"LoginResultType\":1")) {
				authentication = null;
			}
		}

		logger(" ============================= ");
		logger(" Contents of post request ends ");
		logger(" ============================= ");

		reader.close();

		connection.disconnect();

		return this;
	}

	private HttpURLConnection handle(String url, JSONArray paras) throws Exception {

		URL postUrl = new URL(POST_K3CloudURL.concat(url));

		HttpURLConnection connection = (HttpURLConnection) postUrl.openConnection();

		logger(authentication);

		if (authentication != null) {
			connection.setRequestProperty("Cookie", authentication);
		}

		if (!connection.getDoOutput()) {
			connection.setDoOutput(true);
		}

		connection.setRequestMethod("POST");
		connection.setUseCaches(false);
		connection.setInstanceFollowRedirects(true);
		connection.setRequestProperty("Content-Type", "application/json");
		DataOutputStream out = new DataOutputStream(connection.getOutputStream());

		int hashCode = UUID.randomUUID().toString().hashCode();

		JSONObject jObj = new JSONObject();

		jObj.put("format", 1);
		jObj.put("useragent", "ApiClient");
		jObj.put("rid", hashCode);
		jObj.put("parameters", chinaToUnicode(paras.toString()));
		jObj.put("timestamp", new Date().toString());
		jObj.put("v", "1.0");

		out.writeBytes(jObj.toString());
		out.flush();
		out.close();

		return connection;
	}

	public KTCHandle invoke(String method, String formId, String content) throws Exception {

		// 二、返回结果：
		// {"Result":{"ResponseStatus":{"ErrorCode":"","IsSuccess":"false","Errors":[{"FieldName":"","Message":"","DIndex":0}],"SuccessEntitys":[{"Id":"","Number":"","DIndex":0}],"SuccessMessages":[{"FieldName":"","Message":"","DIndex":0}],"MsgCode":""},"Id":"","Number":"","NeedReturnData":[{}]}}
		// IsSuccess:操作是否成功，
		// Errors:如果失败，具体失败原因
		// DIndex:原始数据行号

		JSONArray params = new JSONArray();
		params.add(formId);
		params.add(content);

		logger(params.toJSONString());

		HttpURLConnection connection = handle(API.get(method), params);

		BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));

		logger(" ============================= ");
		logger(" Contents of post request ");
		logger(" ============================= ");

		// while ((line = reader.readLine()) != null) {
		// logger(new String(line.getBytes(), "utf-8")); // 返回结果值
		// }

		JSONObject response = JSONObject.parseObject(reader.readLine());

		if (response.getJSONObject("Result") == null) {
			System.out.println(response.toJSONString());
		}

		JSONObject result = response.getJSONObject("Result");
		JSONObject status = result.getJSONObject("ResponseStatus");

		if (!status.getBooleanValue("IsSuccess")) {
			System.out.println(status.getIntValue("ErrorCode"));
			System.out.println(status.getJSONArray("Errors"));
		}
		
		this.resultParams = result;

		logger(" ============================= ");
		logger(" Contents of post request ends ");
		logger(" ============================= ");

		reader.close();
		connection.disconnect();

		return this;
	}

	// View
	public KTCHandle view(KTCBean bean) throws Exception {
		return invoke("View", bean.formId(), bean.view());
	}

	// Save
	public KTCHandle save(KTCBean bean) throws Exception {
		return invoke("Save", bean.formId(), bean.save());
	}

	// Save
	public KTCHandle update(KTCBean bean) throws Exception {
		return invoke("Save", bean.formId(), bean.update());
	}

	// Submit
	public KTCHandle submit(KTCBean bean) throws Exception {
		return invoke("Submit", bean.formId(), bean.submit());
	}

	// Audit
	public KTCHandle audit(KTCBean bean) throws Exception {
		return invoke("Audit", bean.formId(), bean.audit());
	}

	// UnAudit
	public KTCHandle unAudit(KTCBean bean) throws Exception {
		return invoke("UnAudit", bean.formId(), bean.unaudit());
	}

	private String chinaToUnicode(String str) {
		String result = "";
		for (int i = 0; i < str.length(); i++) {
			int chr1 = (char) str.charAt(i);
			if (chr1 >= 19968 && chr1 <= 171941) {// 汉字范围 \u4e00-\u9fa5 (中文)
				result += "\\u" + Integer.toHexString(chr1);
			} else {
				result += str.charAt(i);
			}
		}
		return result;
	}

	private void logger(String content) {
		if (logflag)
			System.out.println(content);
	}

	public JSONObject getResultParams() {
		return resultParams;
	}

	public void setResultParams(JSONObject resultParams) {
		this.resultParams = resultParams;
	}

}
