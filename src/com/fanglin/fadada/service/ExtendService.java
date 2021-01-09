/**
 * @File Name		: ExptendService.java
 * @Package   	: com.fadada.service
 * @Version		: 1.0
 * @Date			: 2020-12-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.fadada.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import com.fadada.sdk.client.common.FddClient;
import com.fadada.sdk.util.crypt.FddEncryptTool;
import com.fadada.sdk.util.http.HttpsUtil;

public class ExtendService {

	public static String invokequerySignature(FddClient client, String customer_id) {

		List<NameValuePair> params = new ArrayList<NameValuePair>();

		try {

			String timeStamp = HttpsUtil.getTimeStamp();
			String sha1 = FddEncryptTool.sha1((new StringBuilder()).append(client.getAppId()).append(FddEncryptTool.md5Digest(timeStamp)).append(FddEncryptTool.sha1((new StringBuilder()).append(client.getSecret()).append(customer_id).toString())).toString());
			String msgDigest = new String(FddEncryptTool.Base64Encode(sha1.getBytes()));

			params.add(new BasicNameValuePair("customerId", customer_id));
			params.add(new BasicNameValuePair("app_id", client.getAppId()));
			params.add(new BasicNameValuePair("timestamp", timeStamp));
			params.add(new BasicNameValuePair("v", client.getVersion()));
			params.add(new BasicNameValuePair("msg_digest", msgDigest));
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

		System.out.println((new StringBuilder()).append(client.getUrl()).append("query_signature").append(".api").toString());
		System.out.println(params);

		return HttpsUtil.doPost((new StringBuilder()).append(client.getUrl()).append("query_signature").append(".api").toString(), params);
	}

	public static String invokedefaultSignature(FddClient client, String customer_id, String signature_id) {

		List<NameValuePair> params = new ArrayList<NameValuePair>();

		try {

			String timeStamp = HttpsUtil.getTimeStamp();
			String sha1 = FddEncryptTool.sha1((new StringBuilder()).append(client.getAppId()).append(FddEncryptTool.md5Digest(timeStamp)).append(FddEncryptTool.sha1((new StringBuilder()).append(client.getSecret()).append(customer_id).append(signature_id).toString())).toString());
			String msgDigest = new String(FddEncryptTool.Base64Encode(sha1.getBytes()));

			params.add(new BasicNameValuePair("customer_id", customer_id));
			params.add(new BasicNameValuePair("signature_id", signature_id));
			params.add(new BasicNameValuePair("app_id", client.getAppId()));
			params.add(new BasicNameValuePair("timestamp", timeStamp));
			params.add(new BasicNameValuePair("v", client.getVersion()));
			params.add(new BasicNameValuePair("msg_digest", msgDigest));
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

		System.out.println((new StringBuilder()).append(client.getUrl()).append("default_signature").append(".api").toString());
		System.out.println(params);

		return HttpsUtil.doPost((new StringBuilder()).append(client.getUrl()).append("default_signature").append(".api").toString(), params);
	}

	public static String invokereplaceSignature(FddClient client, String customer_id, String signature_id, String signature_img_base64) {

		List<NameValuePair> params = new ArrayList<NameValuePair>();

		try {

			String timeStamp = HttpsUtil.getTimeStamp();
			String sha1 = FddEncryptTool.sha1((new StringBuilder()).append(client.getAppId()).append(FddEncryptTool.md5Digest(timeStamp)).append(FddEncryptTool.sha1((new StringBuilder()).append(client.getSecret()).append(customer_id).append(signature_id).append(signature_img_base64).toString())).toString());
			String msgDigest = new String(FddEncryptTool.Base64Encode(sha1.getBytes()));

			params.add(new BasicNameValuePair("customer_id", customer_id));
			params.add(new BasicNameValuePair("signature_id", signature_id));
			params.add(new BasicNameValuePair("signature_img_base64", signature_img_base64));
			params.add(new BasicNameValuePair("app_id", client.getAppId()));
			params.add(new BasicNameValuePair("timestamp", timeStamp));
			params.add(new BasicNameValuePair("v", client.getVersion()));
			params.add(new BasicNameValuePair("msg_digest", msgDigest));
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

		System.out.println((new StringBuilder()).append(client.getUrl()).append("query_signature").append(".api").toString());
		System.out.println(params);

		return HttpsUtil.doPost((new StringBuilder()).append(client.getUrl()).append("replace_signature").append(".api").toString(), params);
	}

	public static String invokedeleteSignature(FddClient client, String customer_id, String signature_id) {

		List<NameValuePair> params = new ArrayList<NameValuePair>();

		try {

			String timeStamp = HttpsUtil.getTimeStamp();
			String sha1 = FddEncryptTool.sha1((new StringBuilder()).append(client.getAppId()).append(FddEncryptTool.md5Digest(timeStamp)).append(FddEncryptTool.sha1((new StringBuilder()).append(client.getSecret()).append(customer_id).append(signature_id).toString())).toString());
			String msgDigest = new String(FddEncryptTool.Base64Encode(sha1.getBytes()));

			params.add(new BasicNameValuePair("customer_id", customer_id));
			params.add(new BasicNameValuePair("signature_id", signature_id));
			params.add(new BasicNameValuePair("app_id", client.getAppId()));
			params.add(new BasicNameValuePair("timestamp", timeStamp));
			params.add(new BasicNameValuePair("v", client.getVersion()));
			params.add(new BasicNameValuePair("msg_digest", msgDigest));
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

		System.out.println((new StringBuilder()).append(client.getUrl()).append("query_signature").append(".api").toString());
		System.out.println(params);

		return HttpsUtil.doPost((new StringBuilder()).append(client.getUrl()).append("delete_signature").append(".api").toString(), params);
	}

}
