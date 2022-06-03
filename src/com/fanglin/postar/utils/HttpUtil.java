/**
 * @File Name		: HttpUtil.java
 * @Package   	: com.fanglin.postar.utils
 * @Version		: 1.0
 * @Date			: 2022-4-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.postar.utils;

import java.net.SocketTimeoutException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

public class HttpUtil {

	public static String postData(String url, String json) {
		return postData(url, json, StandardCharsets.UTF_8);
	}

	public static String postData(String url, String json, Charset responseCharset) {

		HttpPost httpPost = new HttpPost(url);

		setTimeOut(httpPost);

		StringEntity requestEntity = new StringEntity(json, "UTF-8");
		requestEntity.setContentEncoding("UTF-8");

		httpPost.setHeader("Content-Type", "application/json");
		httpPost.setEntity(requestEntity);

		return execute(httpPost, responseCharset);
	}

	private static void setTimeOut(HttpRequestBase httpRequest) {
		RequestConfig config = RequestConfig.custom().setConnectTimeout(30000).setConnectionRequestTimeout(30000).setSocketTimeout(30000).build();
		httpRequest.setConfig(config);
	}

	private static String execute(HttpRequestBase httpRequest, Charset responseCharset) {

		String result = "";

		try {

			CloseableHttpClient httpClient = HttpClientBuilder.create().build();
			CloseableHttpResponse response = httpClient.execute(httpRequest);

			if (response != null) {

				HttpEntity responseEntity = (HttpEntity) response.getEntity();

				if (responseEntity != null) {
					result = EntityUtils.toString(responseEntity, responseCharset);
				}
			}
		} catch (SocketTimeoutException s) {
			System.out.println("请求超时");
		} catch (Exception e) {
			System.out.println("请求处理异常");
		}
		return result;
	}
}
