package com.fanglin.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.io.FileUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.client.RedirectLocations;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;
import org.apache.http.ssl.SSLContexts;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.security.KeyStore;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 统一 HTTP 请求工具类
 *
 * <p>整合了原 utils.HttpUtil、wechat.utils.HttpHelper、yspay.utils.HttpUtil 的所有功能</p>
 *
 * <p>主要功能：</p>
 * <ul>
 *   <li>GET/POST/PUT 请求（支持 JSON/Form 格式）</li>
 *   <li>文件上传/下载</li>
 *   <li>HTTPS 证书请求（微信支付专用）</li>
 *   <li>XML 请求/响应</li>
 *   <li>自定义 Headers</li>
 *   <li>灵活的超时配置</li>
 * </ul>
 *
 * <p>使用示例：</p>
 * <pre>{@code
 * // GET 请求
 * JSONObject result = HttpHelper.httpGet("http://api.example.com/get");
 *
 * // POST JSON 请求
 * JSONObject data = new JSONObject();
 * data.put("name", "张三");
 * JSONObject result = HttpHelper.httpPost("http://api.example.com/post", data);
 *
 * // POST 表单请求
 * Map<String, String> params = new HashMap<>();
 * params.put("username", "admin");
 * params.put("password", "123456");
 * JSONObject result = HttpHelper.httpPostForm("http://api.example.com/login", params);
 *
 * // 文件上传
 * File file = new File("test.jpg");
 * JSONObject result = HttpHelper.uploadMedia("http://api.example.com/upload", file);
 *
 * // 自定义超时时间
 * HttpHelper.setTimeout(5000, 5000);  // 5秒
 * }</pre>
 *
 * @author Rhadamanthus
 * @version 1.0
 * @since 2025-12-29
 */
public class HttpHelper {

	/**
	 * 日志记录器
	 */
	public static final Logger logger = LoggerFactory.getLogger(HttpHelper.class);

	// ==================== 配置参数 ====================

	/**
	 * Socket 超时时间（毫秒），默认 2000ms（2秒）
	 */
	private static int SOCKET_TIMEOUT = 2000;

	/**
	 * 连接超时时间（毫秒），默认 2000ms（2秒）
	 */
	private static int CONNECT_TIMEOUT = 2000;

	/**
	 * 成功响应状态码列表，默认 200-206
	 */
	private static final List<Integer> SUCCESS_CODES = new ArrayList<Integer>(
		Arrays.asList(200, 201, 202, 203, 204, 205, 206)
	);

	/**
	 * 业务成功错误码，默认 0
	 */
	private static final int BUSINESS_SUCCESS_CODE = 0;

	// ==================== GET 请求 ====================

	/**
	 * 发送 GET 请求
	 *
	 * @param url 请求地址
	 * @return 响应结果（JSONObject），失败返回 null
	 */
	public static JSONObject httpGet(String url) {
		HttpGet httpGet = new HttpGet(url);
		CloseableHttpResponse response = null;
		CloseableHttpClient httpClient = HttpClients.createDefault();

		RequestConfig requestConfig = RequestConfig.custom()
			.setSocketTimeout(SOCKET_TIMEOUT)
			.setConnectTimeout(CONNECT_TIMEOUT)
			.build();
		httpGet.setConfig(requestConfig);

		try {
			response = httpClient.execute(httpGet, new BasicHttpContext());

			if (!SUCCESS_CODES.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format("request url failed, http code=%d, url=%s", response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();
			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");
				JSONObject result = JSON.parseObject(resultStr);
				return result;
			}
		} catch (IOException e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
				}
			}
		}

		return null;
	}

	/**
	 * 发送 GET 请求，返回字符串
	 *
	 * @param url 请求地址
	 * @return 响应结果（String），失败返回 null
	 */
	public static String httpGetString(String url) {
		HttpGet httpGet = new HttpGet(url);
		CloseableHttpResponse response = null;
		CloseableHttpClient httpClient = HttpClients.createDefault();

		RequestConfig requestConfig = RequestConfig.custom()
			.setSocketTimeout(SOCKET_TIMEOUT)
			.setConnectTimeout(CONNECT_TIMEOUT)
			.build();
		httpGet.setConfig(requestConfig);

		try {
			response = httpClient.execute(httpGet, new BasicHttpContext());

			if (!SUCCESS_CODES.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format("request url failed, http code=%d, url=%s", response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();
			if (entity != null) {
				return EntityUtils.toString(entity, "utf-8");
			}
		} catch (IOException e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
				}
			}
		}

		return null;
	}

	// ==================== POST 请求 ====================

	/**
	 * 发送 POST 请求（JSON 格式）
	 *
	 * @param url 请求地址
	 * @param data 请求数据（自动转换为 JSON）
	 * @return 响应结果（JSONObject），失败返回 null
	 */
	public static JSONObject httpPost(String url, Object data) {
		HttpPost httpPost = new HttpPost(url);
		CloseableHttpResponse response = null;
		CloseableHttpClient httpClient = HttpClients.createDefault();

		RequestConfig requestConfig = RequestConfig.custom()
			.setSocketTimeout(SOCKET_TIMEOUT)
			.setConnectTimeout(CONNECT_TIMEOUT)
			.build();
		httpPost.setConfig(requestConfig);
		httpPost.addHeader("Content-Type", "application/json");

		try {
			StringEntity stringEntity = new StringEntity(JSON.toJSONString(data), "utf-8");
			httpPost.setEntity(stringEntity);

			response = httpClient.execute(httpPost, new BasicHttpContext());

			if (!SUCCESS_CODES.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format("request url failed, http code=%d, url=%s", response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();
			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");
				JSONObject result = JSON.parseObject(resultStr);
				return result;
			}
		} catch (IOException e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
				}
			}
		}

		return null;
	}

	/**
	 * 发送 POST 请求（JSON 格式，自定义 Headers）
	 *
	 * @param url 请求地址
	 * @param headers 请求头
	 * @param data 请求数据（自动转换为 JSON）
	 * @return 响应结果（JSONObject），失败返回 null
	 */
	@SuppressWarnings("unchecked")
	public static JSONObject httpPost(String url, Map<String, String> headers, Object data) {
		HttpPost httpPost = new HttpPost(url);
		CloseableHttpResponse response = null;
		CloseableHttpClient httpClient = HttpClients.createDefault();

		RequestConfig requestConfig = RequestConfig.custom()
			.setSocketTimeout(SOCKET_TIMEOUT)
			.setConnectTimeout(CONNECT_TIMEOUT)
			.build();
		httpPost.setConfig(requestConfig);

		if (headers != null) {
			for (String key : headers.keySet()) {
				httpPost.addHeader(key, headers.get(key));
			}
		}

		try {
			if (String.class.isInstance(data)) {
				httpPost.setEntity(new StringEntity(String.valueOf(data), "utf-8"));
			} else if (List.class.isInstance(data)) {
				httpPost.setEntity(new UrlEncodedFormEntity((List<? extends NameValuePair>) data, "UTF-8"));
			} else {
				httpPost.setEntity(new StringEntity(JSON.toJSONString(data), "utf-8"));
			}

			response = httpClient.execute(httpPost, new BasicHttpContext());

			if (!SUCCESS_CODES.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format("request url failed, http code=%d, url=%s", response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();
			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");
				JSONObject result = JSON.parseObject(resultStr);
				return result;
			}
		} catch (IOException e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
				}
			}
		}

		return null;
	}

	/**
	 * 发送 POST 请求（表单格式 - Map）
	 *
	 * @param url 请求地址
	 * @param params 表单参数
	 * @return 响应结果（JSONObject），失败返回 null
	 */
	public static JSONObject httpPostForm(String url, Map<String, String> params) {
		List<BasicNameValuePair> formParams = new ArrayList<BasicNameValuePair>();
		for (String key : params.keySet()) {
			formParams.add(new BasicNameValuePair(key, params.get(key)));
		}
		return httpPostForm(url, formParams);
	}

	/**
	 * 发送 POST 请求（表单格式 - List<NameValuePair>）
	 *
	 * @param url 请求地址
	 * @param params 表单参数
	 * @return 响应结果（JSONObject），失败返回 null
	 */
	public static JSONObject httpPostForm(String url, List<BasicNameValuePair> params) {
		HttpPost httpPost = new HttpPost(url);
		CloseableHttpClient client = HttpClients.createDefault();
		HttpResponse response = null;

		try {
			httpPost.setEntity(new UrlEncodedFormEntity(params, "utf-8"));
			response = client.execute(httpPost);

			if (!SUCCESS_CODES.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format("request url failed, http code=%d, url=%s", response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();
			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");
				JSONObject result = JSON.parseObject(resultStr);
				return result;
			}
		} catch (IOException e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		}

		return null;
	}

	/**
	 * 发送 POST 请求（返回 String）
	 *
	 * @param url 请求地址
	 * @param params 表单参数
	 * @return 响应结果（String），失败返回 null
	 */
	public static String httpPostString(String url, Map<String, String> params) {
		List<BasicNameValuePair> formParams = new ArrayList<BasicNameValuePair>();
		for (String key : params.keySet()) {
			formParams.add(new BasicNameValuePair(key, params.get(key)));
		}

		HttpPost httpPost = new HttpPost(url);
		CloseableHttpClient client = HttpClients.createDefault();
		CloseableHttpResponse response = null;

		try {
			httpPost.setEntity(new UrlEncodedFormEntity(formParams, "utf-8"));
			response = client.execute(httpPost);

			if (!SUCCESS_CODES.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format("request url failed, http code=%d, url=%s", response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();
			if (entity != null) {
				return EntityUtils.toString(entity, "utf-8");
			}
		} catch (IOException e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
				}
			}
		}

		return null;
	}

	// ==================== PUT 请求 ====================

	/**
	 * 发送 PUT 请求（JSON 格式）
	 *
	 * @param url 请求地址
	 * @param data 请求数据（自动转换为 JSON）
	 * @return 响应结果（JSONObject），失败返回 null
	 */
	public static JSONObject httpPut(String url, Object data) {
		HttpPut httpPut = new HttpPut(url);
		CloseableHttpResponse response = null;
		CloseableHttpClient httpClient = HttpClients.createDefault();

		RequestConfig requestConfig = RequestConfig.custom()
			.setSocketTimeout(SOCKET_TIMEOUT)
			.setConnectTimeout(CONNECT_TIMEOUT)
			.build();
		httpPut.setConfig(requestConfig);
		httpPut.addHeader("Content-Type", "application/json");

		try {
			StringEntity requestEntity = new StringEntity(JSON.toJSONString(data), "utf-8");
			httpPut.setEntity(requestEntity);

			response = httpClient.execute(httpPut, new BasicHttpContext());

			if (!SUCCESS_CODES.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format("request url failed, http code=%d, url=%s", response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();
			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");
				JSONObject result = JSON.parseObject(resultStr);
				return result;
			}
		} catch (IOException e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
				}
			}
		}

		return null;
	}

	// ==================== 文件上传 ====================

	/**
	 * 上传文件（multipart/form-data）
	 *
	 * @param url 上传地址
	 * @param file 要上传的文件
	 * @return 响应结果（JSONObject），失败返回 null
	 */
	public static JSONObject uploadMedia(String url, File file) {
		HttpPost httpPost = new HttpPost(url);
		CloseableHttpResponse response = null;
		CloseableHttpClient httpClient = HttpClients.createDefault();

		RequestConfig requestConfig = RequestConfig.custom()
			.setSocketTimeout(SOCKET_TIMEOUT)
			.setConnectTimeout(CONNECT_TIMEOUT)
			.build();
		httpPost.setConfig(requestConfig);

		HttpEntity requestEntity = MultipartEntityBuilder.create()
			.addPart("media", new FileBody(file, ContentType.APPLICATION_OCTET_STREAM, file.getName()))
			.build();
		httpPost.setEntity(requestEntity);

		try {
			response = httpClient.execute(httpPost, new BasicHttpContext());

			if (!SUCCESS_CODES.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format("request url failed, http code=%d, url=%s", response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();
			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");
				JSONObject result = JSON.parseObject(resultStr);

				if (result.getInteger("errcode") == null || result.getInteger("errcode") == BUSINESS_SUCCESS_CODE) {
					return result;
				} else {
					logger.error(String.format("upload failed, url=%s, response=%s", url, resultStr));
				}
			}
		} catch (IOException e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
				}
			}
		}

		return null;
	}

	// ==================== 文件下载 ====================

	/**
	 * 下载文件（支持重定向）
	 *
	 * @param url 下载地址
	 * @param fileDir 保存目录
	 * @return 响应结果（JSONObject），包含 downloadFilePath 和 httpcode，失败返回 null
	 */
	public static JSONObject downloadMedia(String url, String fileDir) {
		HttpGet httpGet = new HttpGet(url);
		CloseableHttpResponse response = null;
		CloseableHttpClient httpClient = HttpClients.createDefault();

		RequestConfig requestConfig = RequestConfig.custom()
			.setSocketTimeout(SOCKET_TIMEOUT)
			.setConnectTimeout(CONNECT_TIMEOUT)
			.build();
		httpGet.setConfig(requestConfig);

		try {
			HttpContext localContext = new BasicHttpContext();
			response = httpClient.execute(httpGet, localContext);

			RedirectLocations locations = (RedirectLocations) localContext.getAttribute(HttpClientContext.REDIRECT_LOCATIONS);

			if (locations != null && !locations.getAll().isEmpty()) {
				URI downloadUrl = locations.getAll().get(0);
				String filename = downloadUrl.toURL().getFile();

				logger.info("downloadUrl=" + downloadUrl);

				File downloadFile = new File(fileDir + File.separator + filename);
				FileUtils.writeByteArrayToFile(downloadFile, EntityUtils.toByteArray(response.getEntity()));

				JSONObject obj = new JSONObject();
				obj.put("downloadFilePath", downloadFile.getAbsolutePath());
				obj.put("httpcode", response.getStatusLine().getStatusCode());

				return obj;
			} else {
				if (!SUCCESS_CODES.contains(response.getStatusLine().getStatusCode())) {
					logger.error(String.format("request url failed, http code=%d, url=%s", response.getStatusLine().getStatusCode(), url));
					return null;
				}

				HttpEntity entity = response.getEntity();
				if (entity != null) {
					String resultStr = EntityUtils.toString(entity, "utf-8");
					JSONObject result = JSON.parseObject(resultStr);

					if (result.getInteger("errcode") == null || result.getInteger("errcode") == BUSINESS_SUCCESS_CODE) {
						return result;
					} else {
						logger.error(String.format("download failed, url=%s, response=%s", url, resultStr));
					}
				}
			}
		} catch (IOException e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
				}
			}
		}

		return null;
	}

	/**
	 * 简单文件下载（使用 URLConnection）
	 *
	 * @param urlString 下载地址
	 * @param filename 文件名
	 * @param savePath 保存目录
	 */
	public static void download(String urlString, String filename, String savePath) {
		URL url = null;
		URLConnection urlConnection = null;
		InputStream inputStream = null;
		OutputStream outputStream = null;

		try {
			url = new URL(urlString);
			urlConnection = url.openConnection();
			urlConnection.setConnectTimeout(5 * 1000); // 设置请求超时为5s

			inputStream = urlConnection.getInputStream();
			int len;
			byte[] bs = new byte[1024]; // 1K的数据缓冲
			File sf = new File(savePath);

			if (!sf.exists()) {
				sf.mkdirs();
			}

			outputStream = new FileOutputStream(sf.getPath() + File.separator + filename);

			while ((len = inputStream.read(bs)) != -1) {
				outputStream.write(bs, 0, len);
			}
		} catch (Exception e) {
			logger.error("文件下载失败", e);
		} finally {
			try {
				if (outputStream != null) outputStream.close();
				if (inputStream != null) inputStream.close();
			} catch (Exception e) {
				logger.error(String.format("关闭流失败: %s", e.getMessage()));
			}
		}
	}

	// ==================== XML 请求 ====================

	/**
	 * 发送 HTTPS XML 请求（支持双向证书认证，用于微信支付）
	 *
	 * @param url 请求地址
	 * @param xml XML 数据
	 * @param certPath 证书路径（PKCS12 格式）
	 * @param certPass 证书密码
	 * @return 响应结果（String）
	 */
	@SuppressWarnings("deprecation")
	public static String httpsXml(String url, String xml, String certPath, String certPass) {
		CloseableHttpClient httpclient = null;
		CloseableHttpResponse response = null;
		InputStreamReader reader = null;
		StringBuffer stringBuffer = null;

		try {
			KeyStore keyStore = KeyStore.getInstance("PKCS12");
			FileInputStream instream = new FileInputStream(new File(certPath));
			try {
				keyStore.load(instream, certPass.toCharArray());
			} finally {
				instream.close();
			}

			SSLContext sslcontext = SSLContexts.custom()
				.loadKeyMaterial(keyStore, certPass.toCharArray())
				.build();
			SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(
				sslcontext,
				new String[] { "TLSv1" },
				null,
				SSLConnectionSocketFactory.BROWSER_COMPATIBLE_HOSTNAME_VERIFIER
			);
			httpclient = HttpClients.custom().setSSLSocketFactory(sslsf).build();

			HttpPost httppost = new HttpPost(url);
			StringEntity myEntity = new StringEntity(xml, "UTF-8");
			httppost.setEntity(myEntity);

			response = httpclient.execute(httppost);

			HttpEntity resEntity = response.getEntity();

			char[] buff = new char[1024];
			int length = 0;

			reader = new InputStreamReader(resEntity.getContent(), "UTF-8");
			stringBuffer = new StringBuffer();

			while ((length = reader.read(buff)) != -1) {
				stringBuffer.append(new String(buff, 0, length));
			}

		} catch (Exception e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		} finally {
			try {
				if (httpclient != null) httpclient.close();
				if (response != null) response.close();
				if (reader != null) reader.close();
			} catch (IOException e) {
				logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
			}
		}

		return stringBuffer != null ? stringBuffer.toString() : null;
	}

	/**
	 * 发送 HTTP/HTTPS XML 请求
	 *
	 * @param url 请求地址
	 * @param method 请求方法（GET/POST）
	 * @param xml XML 数据
	 * @return 响应结果（StringBuffer）
	 */
	public static StringBuffer httpXml(String url, String method, String xml) {
		StringBuffer stringBuffer = new StringBuffer();
		URL urlObj = null;
		HttpsURLConnection connection = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		BufferedReader bufferedReader = null;

		try {
			urlObj = new URL(url);
			connection = (HttpsURLConnection) urlObj.openConnection();

			connection.setDoOutput(true);
			connection.setDoInput(true);
			connection.setUseCaches(false);
			connection.setRequestMethod(method);

			if (null != xml) {
				OutputStream outputStream = connection.getOutputStream();
				outputStream.write(xml.getBytes("UTF-8"));
				outputStream.close();
			}

			inputStream = connection.getInputStream();
			inputStreamReader = new InputStreamReader(inputStream, "utf-8");
			bufferedReader = new BufferedReader(inputStreamReader);

			String str = null;
			while ((str = bufferedReader.readLine()) != null) {
				stringBuffer.append(str);
			}
		} catch (MalformedURLException e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		} catch (IOException e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		} finally {
			try {
				if (bufferedReader != null) bufferedReader.close();
				if (inputStreamReader != null) inputStreamReader.close();
				if (inputStream != null) inputStream.close();
				if (connection != null) connection.disconnect();
			} catch (IOException e) {
				logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
			}
		}

		return stringBuffer;
	}

	// ==================== 配置方法 ====================

	/**
	 * 设置超时时间
	 *
	 * @param socketTimeout Socket 超时时间（毫秒）
	 * @param connectTimeout 连接超时时间（毫秒）
	 */
	public static void setTimeout(int socketTimeout, int connectTimeout) {
		SOCKET_TIMEOUT = socketTimeout;
		CONNECT_TIMEOUT = connectTimeout;
		logger.info(String.format("HttpHelper timeout updated: socket=%dms, connect=%dms", socketTimeout, connectTimeout));
	}

	/**
	 * 获取当前 Socket 超时时间
	 *
	 * @return Socket 超时时间（毫秒）
	 */
	public static int getSocketTimeout() {
		return SOCKET_TIMEOUT;
	}

	/**
	 * 获取当前连接超时时间
	 *
	 * @return 连接超时时间（毫秒）
	 */
	public static int getConnectTimeout() {
		return CONNECT_TIMEOUT;
	}

	// ==================== 测试方法 ====================

	/**
	 * 测试主方法
	 */
	public static void main(String[] args) throws UnsupportedEncodingException {
		// 测试超时设置
		HttpHelper.setTimeout(5000, 5000);
		logger.info("Socket Timeout: " + HttpHelper.getSocketTimeout());
		logger.info("Connect Timeout: " + HttpHelper.getConnectTimeout());

		// 测试 GET 请求
		// JSONObject result = HttpHelper.httpGet("http://www.baidu.com");

		// 测试 POST 表单请求（兼容旧版）
		/*
		Map<String, String> map = new HashMap<String, String>();
		map.put("userId", "manager9961");
		map.put("workDateFrom", "2016-09-18 00:00:00");
		map.put("workDateTo", "2016-09-18 23:59:59");

		Object params = JSONObject.toJSON(map);
		System.out.println(params);

		HttpHelper.httpPost("https://oapi.dingtalk.com/attendance/list?access_token=5d7cb039a5633c9eb0e72c89883d526f", params);
		*/
	}

	// ==================== 兼容旧版方法 ====================
	// 以下方法从 com.fanglin.wechat.utils.HttpHelper 迁移，保持向后兼容

	/**
	 * 发送 POST 请求（字符串参数，自动添加表单 Content-Type）
	 *
	 * @param url 请求地址
	 * @param params 请求参数字符串
	 * @return 响应结果（JSONObject），失败返回 null
	 * @deprecated 建议使用 {@link #httpPost(String, Map)} 或 {@link #httpPostForm(String, Map)}
	 */
	@Deprecated
	public static JSONObject httpPost(String url, String params) {
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		return httpPost(url, headers, params);
	}

	/**
	 * 发送 POST 请求（Map 参数，自动添加表单 Content-Type）
	 *
	 * @param url 请求地址
	 * @param params 请求参数
	 * @return 响应结果（JSONObject），失败返回 null
	 * @deprecated 建议使用 {@link #httpPostForm(String, Map)}
	 */
	@Deprecated
	public static JSONObject httpPost(String url, Map<String, String> params) {
		String data = JSONObject.toJSONString(params);
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		return httpPost(url, headers, data.toString());
	}

	/**
	 * 发送 POST 请求（JSONObject 参数，自动添加 JSON Content-Type）
	 *
	 * @param url 请求地址
	 * @param params 请求参数
	 * @return 响应结果（JSONObject），失败返回 null
	 */
	public static JSONObject httpPost(String url, JSONObject params) {
		String data = JSONObject.toJSONString(params);
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "application/json; charset=UTF-8");
		return httpPost(url, headers, data);
	}

	/**
	 * 发送 POST 请求（JSONObject 参数 + 自定义 Headers）
	 *
	 * @param url 请求地址
	 * @param headers 请求头
	 * @param params 请求参数
	 * @return 响应结果（JSONObject），失败返回 null
	 */
	public static JSONObject httpPost(String url, Map<String, String> headers, JSONObject params) {
		String data = JSONObject.toJSONString(params);
		headers.put("Content-Type", "application/json; charset=UTF-8");
		return httpPost(url, headers, data);
	}

	/**
	 * 发送 POST 请求（List<NameValuePair> 参数，自动添加表单 Content-Type）
	 *
	 * @param url 请求地址
	 * @param params 请求参数
	 * @return 响应结果（JSONObject），失败返回 null
	 */
	public static JSONObject httpPost(String url, List<NameValuePair> params) {
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		return httpPost(url, headers, params);
	}

	/**
	 * 发送 HTTPS XML 请求（支持双向证书认证，完整版参数）
	 *
	 * <p>用于微信支付等需要双向证书认证的场景</p>
	 *
	 * @param url 请求地址
	 * @param method 请求方法（POST）
	 * @param xml XML 数据
	 * @param type 证书类型（如 PKCS12）
	 * @param file 证书文件路径
	 * @param passwd 证书密码
	 * @return 响应结果（StringBuffer）
	 * @deprecated 建议使用简化版 {@link #httpsXml(String, String, String, String)}
	 */
	@SuppressWarnings("deprecation")
	@Deprecated
	public static StringBuffer httpsXml(String url, String method, String xml, String type, String file, String passwd) {
		CloseableHttpClient httpclient = null;
		CloseableHttpResponse response = null;
		InputStreamReader reader = null;
		StringBuffer stringBuffer = null;

		try {
			KeyStore keyStore = KeyStore.getInstance(type); // PKCS12
			FileInputStream instream = new FileInputStream(new File(file));
			try {
				keyStore.load(instream, passwd.toCharArray());
			} finally {
				instream.close();
			}

			// Trust own CA and all self-signed certs
			SSLContext sslcontext = SSLContexts.custom().loadKeyMaterial(keyStore, passwd.toCharArray()).build();
			// Allow TLSv1 protocol only
			SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(
				sslcontext,
				new String[] { "TLSv1" },
				null,
				SSLConnectionSocketFactory.BROWSER_COMPATIBLE_HOSTNAME_VERIFIER
			);
			httpclient = HttpClients.custom().setSSLSocketFactory(sslsf).build();

			HttpPost httppost = new HttpPost(url);
			StringEntity myEntity = new StringEntity(xml, "UTF-8");
			httppost.setEntity(myEntity);

			response = httpclient.execute(httppost);

			HttpEntity resEntity = response.getEntity();

			char[] buff = new char[1024];
			int length = 0;

			reader = new InputStreamReader(resEntity.getContent(), "UTF-8");
			stringBuffer = new StringBuffer();

			while ((length = reader.read(buff)) != -1) {
				stringBuffer.append(new String(buff, 0, length));
			}

		} catch (Exception e) {
			logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
		} finally {
			try {
				if (httpclient != null) httpclient.close();
				if (response != null) response.close();
				if (reader != null) reader.close();
			} catch (IOException e) {
				logger.error(String.format("request url=%s, exception, msg=%s", url, e.getMessage()));
			}
		}

		return stringBuffer;
	}
}
