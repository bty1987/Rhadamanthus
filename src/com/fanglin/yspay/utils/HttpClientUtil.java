package com.fanglin.yspay.utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.http.Consts;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

public class HttpClientUtil {

	private static final CloseableHttpClient HTTPCLIENT = HttpClients.createDefault();
	private static final String USERAGENT = "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.87 Safari/537.36";

	/**
	 * 发送HttpPost请求，参数为map
	 * 
	 * @param url
	 *            请求地址
	 * @param map
	 *            请求参数
	 * @return 返回字符串
	 */
	public static String sendPost(String url, Map<String, String> map) {
		// 设置参数
		List<NameValuePair> formparams = new ArrayList<NameValuePair>();
		for (String key : map.keySet()) {
			formparams.add(new BasicNameValuePair(key, map.get(key)));
		}
		System.out.println(formparams);
		// 取得HttpPost对象
		HttpPost httpPost = new HttpPost(url);
		// 防止被当成攻击添加的
		httpPost.setHeader("User-Agent", USERAGENT);
		// 参数放入Entity
		httpPost.setEntity(new UrlEncodedFormEntity(formparams, Consts.UTF_8));
		CloseableHttpResponse response = null;
		String result = null;
		try {
			// 执行post请求
			response = HTTPCLIENT.execute(httpPost);
			// 得到entity
			HttpEntity entity = response.getEntity();
			// 得到字符串
			result = EntityUtils.toString(entity);
		} catch (IOException e) {

		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {

				}
			}
		}
		return result;
	}

}