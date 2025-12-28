package com.fanglin.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.protocol.HttpClientContext;
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
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

public class HttpUtil {

	private static final int SOCKET_TIMEOUT_INT = 2000;

	private static final int CONNECT_TIMEOUT_INT = 2000;

	private static final List<Integer> RESPONSE_CODE_SUCCESS_LIST = Arrays.asList(200, 201, 202, 203, 204, 25, 206);

	private static final int RESPONSE_ERRCODE_SUCCESS_INT = 0;

	private static final String RESPONSE_PRINT_ISSUES_STR = "request url failed, http code=%d, url=%s";

	private static final String RESPONSE_PRINT_EXCEPTION_STR = "request url=%s, exception, msg=%s";

	public static final Logger logger = LoggerFactory.getLogger(HttpUtil.class);

	public static JSONObject httpGet(String url) {

		HttpGet httpGet = new HttpGet(url);

		CloseableHttpResponse response = null;
		CloseableHttpClient httpClient = HttpClients.createDefault();

		RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(SOCKET_TIMEOUT_INT).setConnectTimeout(CONNECT_TIMEOUT_INT).build();

		httpGet.setConfig(requestConfig);

		try {
			response = httpClient.execute(httpGet, new BasicHttpContext());

			if (!RESPONSE_CODE_SUCCESS_LIST.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format(RESPONSE_PRINT_ISSUES_STR, response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();

			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");

				JSONObject result = JSON.parseObject(resultStr);

				return result;
			}
		} catch (IOException e) {
			logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
				}
			}
		}

		return null;
	}

	public static JSONObject httpPost(String url, Object data) {

		HttpPost httpPost = new HttpPost(url);

		CloseableHttpResponse response = null;
		CloseableHttpClient httpClient = HttpClients.createDefault();

		RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(SOCKET_TIMEOUT_INT).setConnectTimeout(CONNECT_TIMEOUT_INT).build();

		httpPost.setConfig(requestConfig);
		httpPost.addHeader("Content-Type", "application/json");

		try {
			StringEntity stringEntity = new StringEntity(JSON.toJSONString(data), "utf-8");

			httpPost.setEntity(stringEntity);

			response = httpClient.execute(httpPost, new BasicHttpContext());

			if (!RESPONSE_CODE_SUCCESS_LIST.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format(RESPONSE_PRINT_ISSUES_STR, response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();

			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");

				JSONObject result = JSON.parseObject(resultStr);

				return result;
			}
		} catch (IOException e) {
			logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
				}
			}
		}

		return null;
	}

	public static JSONObject httpPost(String url, List<BasicNameValuePair> param) {

		HttpPost httpPost = new HttpPost(url);
		CloseableHttpClient client = HttpClients.createDefault();

		HttpResponse response = null;

		try {
			httpPost.setEntity(new UrlEncodedFormEntity(param, "utf-8"));

			response = client.execute(httpPost);

			if (!RESPONSE_CODE_SUCCESS_LIST.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format(RESPONSE_PRINT_ISSUES_STR, response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();

			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");

				JSONObject result = JSON.parseObject(resultStr);

				return result;
			}
		} catch (IOException e) {
			logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
		}

		return null;
	}

	public static JSONObject httpPut(String url, Object data) {

		HttpPut httpPut = new HttpPut(url);

		CloseableHttpResponse response = null;

		CloseableHttpClient httpClient = HttpClients.createDefault();
		RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(SOCKET_TIMEOUT_INT).setConnectTimeout(CONNECT_TIMEOUT_INT).build();

		httpPut.setConfig(requestConfig);
		httpPut.addHeader("Content-Type", "application/json");

		try {
			StringEntity requestEntity = new StringEntity(JSON.toJSONString(data), "utf-8");
			httpPut.setEntity(requestEntity);

			response = httpClient.execute(httpPut, new BasicHttpContext());

			if (!RESPONSE_CODE_SUCCESS_LIST.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format(RESPONSE_PRINT_ISSUES_STR, response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();

			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");

				JSONObject result = JSON.parseObject(resultStr);

				return result;
			}
		} catch (IOException e) {
			logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
				}
			}
		}

		return null;
	}

	public static JSONObject uploadMedia(String url, File file) {

		HttpPost httpPost = new HttpPost(url);

		CloseableHttpResponse response = null;
		CloseableHttpClient httpClient = HttpClients.createDefault();

		RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(SOCKET_TIMEOUT_INT).setConnectTimeout(CONNECT_TIMEOUT_INT).build();

		httpPost.setConfig(requestConfig);

		HttpEntity requestEntity = MultipartEntityBuilder.create().addPart("media", new FileBody(file, ContentType.APPLICATION_OCTET_STREAM, file.getName())).build();
		httpPost.setEntity(requestEntity);

		try {
			response = httpClient.execute(httpPost, new BasicHttpContext());

			if (!RESPONSE_CODE_SUCCESS_LIST.contains(response.getStatusLine().getStatusCode())) {
				logger.error(String.format(RESPONSE_PRINT_ISSUES_STR, response.getStatusLine().getStatusCode(), url));
				return null;
			}
			HttpEntity entity = response.getEntity();
			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");

				JSONObject result = JSON.parseObject(resultStr);
				if (result.getInteger("errcode") == RESPONSE_ERRCODE_SUCCESS_INT) {
					return result;
				} else {
					logger.error(String.format(RESPONSE_PRINT_ISSUES_STR, response.getStatusLine().getStatusCode(), url));
				}
			}
		} catch (IOException e) {
			logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
				}
			}
		}

		return null;
	}

	public static JSONObject downloadMedia(String url, String fileDir) {

		HttpGet httpGet = new HttpGet(url);

		CloseableHttpResponse response = null;

		CloseableHttpClient httpClient = HttpClients.createDefault();
		RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(SOCKET_TIMEOUT_INT).setConnectTimeout(CONNECT_TIMEOUT_INT).build();

		httpGet.setConfig(requestConfig);

		try {
			HttpContext localContext = new BasicHttpContext();

			response = httpClient.execute(httpGet, localContext);

			RedirectLocations locations = (RedirectLocations) localContext.getAttribute(HttpClientContext.REDIRECT_LOCATIONS);

			if (locations != null) {

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
				if (!RESPONSE_CODE_SUCCESS_LIST.contains(response.getStatusLine().getStatusCode())) {
					logger.error(String.format(RESPONSE_PRINT_ISSUES_STR, response.getStatusLine().getStatusCode(), url));
					return null;
				}
				HttpEntity entity = response.getEntity();
				if (entity != null) {
					String resultStr = EntityUtils.toString(entity, "utf-8");

					JSONObject result = JSON.parseObject(resultStr);
					if (result.getInteger("errcode") == RESPONSE_ERRCODE_SUCCESS_INT) {
						return result;
					} else {
						logger.error(String.format(RESPONSE_PRINT_ISSUES_STR, response.getStatusLine().getStatusCode(), url));
					}
				}
			}
		} catch (IOException e) {
			logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
				}
			}
		}

		return null;
	}

	public static void download(String urlString, String filename, String savePath) {

		URL url = null;
		URLConnection urlConnection = null;

		InputStream inputStream = null;
		OutputStream outputStream = null;

		try {
			url = new URL(urlString);

			urlConnection = url.openConnection();
			urlConnection.setConnectTimeout(5 * 1000); // 设置请求超时为5s

			inputStream = urlConnection.getInputStream(); // 输入流

			int len; // 读取到的数据长度
			byte[] bs = new byte[1024]; // 1K的数据缓冲
			File sf = new File(savePath); // 输出的文件流

			if (!sf.exists()) {
				sf.mkdirs();
			}

			outputStream = new FileOutputStream(sf.getPath() + "\\" + filename);

			while ((len = inputStream.read(bs)) != -1) { // 开始读取
				outputStream.write(bs, 0, len);
			}
		} catch (Exception e) {
			logger.error("文件下载失败", e);
		} finally {
			try {
				outputStream.close();
				inputStream.close();
			} catch (Exception e) {
				logger.error(String.format("%s - %s - %s", "HH", "E", e.getMessage()));
			}
		}
	}

	public static void main(String[] args) {
		// HttpUtil.download("http://static.dingtalk.com/media/lADOHx5W480FAM0C0A_720_1280.jpg","test.jpg", "d:\\");

		httpGet("http://114.215.183.148/queryVode.do?phone=15683798379");
	}
}
