/**
 * @File Name		: Callback.java
 * @Package   	: com.fanglin.dingding.service
 * @Version		: 1.0
 * @Date			: 2018-12-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.dingding.service;

import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.dingtalk.oapi.lib.aes.DingTalkEncryptException;
import com.dingtalk.oapi.lib.aes.DingTalkEncryptor;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;

@Service("ddCallbackService")
@Transactional(readOnly = true)
public class CallbackService {

	@Autowired
	private SystemConfigDao systemConfigDao;

	public Map<String, String> callback(String signature, String nonce, String timestamp, String encrypt) throws FLException {

		String suiteKey = systemConfigDao.querySystemConfig("suiteKey").value("");
		// String suiteSecret = systemConfigDao.querySystemConfig("suiteSecret").value("");
		String encodingAesKey = systemConfigDao.querySystemConfig("encodingAesKey").value("");
		String token = systemConfigDao.querySystemConfig("token").value("fanglinserver");

		DingTalkEncryptor dingTalkEncryptor;
		String plainText;

		try {
			dingTalkEncryptor = new DingTalkEncryptor(token, encodingAesKey, suiteKey);
			plainText = dingTalkEncryptor.getDecryptMsg(signature, timestamp, nonce, encrypt);
		} catch (DingTalkEncryptException e) {
			System.out.println(e.getMessage());
			throw new FLException(270009, "回调解密失败");
		}

		JSONObject response = JSON.parseObject(plainText);

		if (response == null || !response.containsKey("EventType")) {
			System.out.println(plainText);
			throw new FLException(270009, "回调解密失败");
		}

		String eventType = response.getString("EventType");
		System.out.println(String.format("钉钉回调,类型:%s", eventType));

		System.out.println(response.toJSONString());

		if ("check_url".equals(eventType)) {

		}

		if ("bpms_instance_change".equals(eventType)) {
			
		}

		try {
			return dingTalkEncryptor.getEncryptedMap("success", new Date().getTime(), nonce);
		} catch (DingTalkEncryptException e) {
			System.out.println(e.getMessage());
			throw new FLException(270010, "回调加密失败");
		}
	}

	public static void main(String[] args) throws DingTalkEncryptException {

		String url = "https://oapi.dingtalk.com/call_back/register_call_back?access_token=28d6292dae323d48aa4b5562febed204";

		JSONObject params = new JSONObject();

		JSONArray array = new JSONArray();

		array.add("bpms_instance_change");

		params.put("call_back_tag", array);
		params.put("token", "fanglinserver");
		params.put("aes_key", "1234567890123456789012345678901234567890123");
		params.put("url", "http://223.100.27.233:30080/dtalkCallback.do");

		 JSONObject response = HttpHelper.httpPost(url, params);
		 System.out.println(response);

//		 DingTalkEncryptor dingTalkEncryptor = new DingTalkEncryptor("fanglinserver", "1234567890123456789012345678901234567890123", suiteKey);
//		 plainText = dingTalkEncryptor.getDecryptMsg(signature, timestamp,	 nonce, encrypt);

//		 DingTalkEncryptor dingTalkEncryptor = new DingTalkEncryptor("fanglinserver", "1234567890123456789012345678901234567890123", "ding3749e8fc3efe4a82");
//		 System.out.println(dingTalkEncryptor.getEncryptedMap("test", new Date().getTime(), "fanglinserver"));

		 url = "http://223.100.27.233:30080/dtalkCallback.do?signature=f265261f57281e2e5bf9fdbaea6be0e1f3414660&timestamp=1550996709595&nonce=mEBhVJN1";
//		url = "http://223.100.27.233:30080/dtalkCallback.do";

		params = new JSONObject();
		
		params.put("encrypt", "vGRmkC7+A/yIxK3DrUnET596r7sjNYB5UTybm6j+eQ1w2BIFOzGGNQXpECeKYB6MGDSUXu9D7yvXQ9Ymvezv3IE4Y/KvyBTIq8eSYXE3cXNij8JCeiiNz+d8eLmvgu4e");
//		
//		JSONObject response = HttpHelper.httpPost(url, params);
//		System.out.println(response);

	}

}
