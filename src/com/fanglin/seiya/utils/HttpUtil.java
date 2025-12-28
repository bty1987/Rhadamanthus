package com.fanglin.seiya.utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.http.Consts;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("deprecation")
public class HttpUtil {

	private static final Logger logger = LoggerFactory.getLogger(HttpUtil.class);

	private static final CloseableHttpClient HTTPCLIENT = HttpClients.createDefault();
	private static final String USERAGENT = "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.87 Safari/537.36";

	/**
	 * 发送HttpPost请求，参数为map
	 * 
	 * @param url 请求地址
	 * @param map 请求参数
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

	public static String sendPost(String url, Map<String, String> map, File file) {

		CloseableHttpClient client = null;
		CloseableHttpResponse response = null;

		String result = null;

		try {

			HttpClientBuilder builder = HttpClients.custom();
			// 对照UA字串的标准格式理解一下每部分的意思
			builder.setUserAgent("Mozilla/5.0(Windows;U;Windows NT 5.1;en-US;rv:0.9.4)");

			// 创建POST请求
			HttpPost post = new HttpPost(url);
			MultipartEntity entity = new MultipartEntity();

			// 请求参数
			for (Map.Entry<String, String> entry : map.entrySet()) {
				entity.addPart(entry.getKey(), new StringBody(entry.getValue(), Charset.forName("UTF-8")));
			}
			entity.addPart("file", new FileBody(file));
			post.setEntity(entity);

			// 发送请求
			client = builder.build();
			response = client.execute(post);
			if (response.getStatusLine().getStatusCode() != 200) {
				throw new Exception("请求失败");
			}
			HttpEntity resEntity = response.getEntity();
			result = null == resEntity ? "" : EntityUtils.toString(resEntity, "UTF-8");
		} catch (Exception e) {

		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
				}
			}
			if (client != null) {
				try {
					client.close();
				} catch (IOException e) {
				}
			}
		}
		return result;
	}

	public static String sendGet(String url) {
		CloseableHttpClient client = HttpClients.createDefault();
		HttpGet httpGet = new HttpGet(url);
		httpGet.setHeader("User-Agent", USERAGENT);

		CloseableHttpResponse response = null;
		String result = null;
		try {
			response = client.execute(httpGet);
			HttpEntity entity = response.getEntity();
			result = EntityUtils.toString(entity);
		} catch (IOException e) {
			logger.error("HTTP POST请求失败", e);
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error("关闭流失败", e);
				}
			}
			if (client != null) {
				try {
					client.close();
				} catch (IOException e) {
					logger.error("关闭流失败", e);
				}
			}
		}
		return result;
	}

	public static File getFile(String fileurl) {

		HttpURLConnection conn = null;
		InputStream is = null;
		ByteArrayOutputStream bos = null;
		FileOutputStream fos = null;

		File file = null;

		try {
			URL url = new URL(fileurl);
			byte by[] = new byte[1024];

			conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setConnectTimeout(5000);

			is = conn.getInputStream();

			bos = new ByteArrayOutputStream();

			for (int len = -1; (len = is.read(by)) != -1;) {
				bos.write(by, 0, len);
			}

			file = new File(String.format("/tmp/%s", String.valueOf(new Date().getTime())));
			fos = new FileOutputStream(file);

			fos.write(bos.toByteArray());

		} catch (IOException e) {
			logger.error("关闭响应失败", e);
		} finally {
			if (conn != null) {
				conn.disconnect();
			}

			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					logger.error("关闭流失败", e);
				}
			}

			if (bos != null) {
				try {
					bos.close();
				} catch (IOException e) {
					logger.error("关闭流失败", e);
				}
			}

			if (fos != null) {
				try {
					fos.close();
				} catch (IOException e) {
					logger.error("关闭流失败", e);
				}
			}
		}

		return null;
	}

	public static void main(String[] args) throws URISyntaxException {
		HttpUtil.getFile("http://192.168.5.21/zoo/group2/M00/04/B0/wKgFbl1H9UOAQDV-AAAxRhW827M472_150_150.png");
	}
}