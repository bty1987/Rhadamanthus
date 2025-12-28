package com.fanglin.wechat.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.io.FileUtils;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.client.RedirectLocations;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;
import org.apache.http.ssl.SSLContexts;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fanglin.utils.DateUtil;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.security.KeyStore;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HttpHelper {

	private static final int SOCKET_TIMEOUT_INT = 2000;

	private static final int CONNECT_TIMEOUT_INT = 2000;

	private static final int RESPONSE_CODE_SUCCESS_INT = 200;

	private static final int RESPONSE_ERRCODE_SUCCESS_INT = 0;

	private static final String RESPONSE_PRINT_ISSUES_STR = "request url failed, http code=%d, url=%s";

	private static final String RESPONSE_PRINT_FAIL_STR = "request url=%s, return value=%s";

	private static final String RESPONSE_PRINT_EXCEPTION_STR = "request url=%s, exception, msg=%s";

	public static Logger logger = LoggerFactory.getLogger(HttpHelper.class);

	public static JSONObject httpGet(String url) {

		HttpGet httpGet = new HttpGet(url);

		CloseableHttpResponse response = null;
		CloseableHttpClient httpClient = HttpClients.createDefault();
		RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(SOCKET_TIMEOUT_INT).setConnectTimeout(CONNECT_TIMEOUT_INT).build();
		httpGet.setConfig(requestConfig);

		try {
			response = httpClient.execute(httpGet, new BasicHttpContext());

			if (response.getStatusLine().getStatusCode() != RESPONSE_CODE_SUCCESS_INT) {
				logger.error(String.format(RESPONSE_PRINT_ISSUES_STR, response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();

			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");

				JSONObject result = JSON.parseObject(resultStr);

				if (result.getInteger("errcode") == null || result.getInteger("errcode") == RESPONSE_ERRCODE_SUCCESS_INT) {
					return result;
				} else {
					System.out.println(resultStr);
					logger.error(String.format(RESPONSE_PRINT_FAIL_STR, url, resultStr));
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

	public static JSONObject httpPost(String url, String params) {

		Map<String, String> headers = new HashMap<String, String>();

		headers.put("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

		return httpPost(url, headers, params);
	}

	public static JSONObject httpPost(String url, Map<String, String> params) {

		String data = JSONObject.toJSONString(params);

		Map<String, String> headers = new HashMap<String, String>();

		headers.put("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

		return httpPost(url, headers, data.toString());
	}

	public static JSONObject httpPost(String url, JSONObject params) {

		String data = JSONObject.toJSONString(params);

		Map<String, String> headers = new HashMap<String, String>();

		headers.put("Content-Type", "application/json; charset=UTF-8");

		return httpPost(url, headers, data);
	}

	public static JSONObject httpPost(String url, Map<String, String> headers, JSONObject params) {

		String data = JSONObject.toJSONString(params);

		headers.put("Content-Type", "application/json; charset=UTF-8");

		return httpPost(url, headers, data);
	}

	public static JSONObject httpPost(String url, Object params) {

		Map<String, String> headers = new HashMap<String, String>();

		headers.put("Content-Type", "application/json; charset=UTF-8");

		return httpPost(url, headers, JSON.toJSONString(params));
	}

	public static JSONObject httpPost(String url, List<NameValuePair> params) {

		Map<String, String> headers = new HashMap<String, String>();

		headers.put("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

		return httpPost(url, headers, params);
	}

	@SuppressWarnings("unchecked")
	public static JSONObject httpPost(String url, Map<String, String> headers, Object data) {

		HttpPost httpPost = new HttpPost(url);

		CloseableHttpResponse response = null;

		CloseableHttpClient httpClient = HttpClients.createDefault();
		RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(SOCKET_TIMEOUT_INT).setConnectTimeout(CONNECT_TIMEOUT_INT).build();

		httpPost.setConfig(requestConfig);

		if (headers != null) {
			for (String key : headers.keySet()) {
				httpPost.addHeader(key, headers.get(key));
			}
		}

		try {
			if (String.class.isInstance(data)) httpPost.setEntity(new StringEntity(String.valueOf(data), "utf-8"));
			if (List.class.isInstance(data)) httpPost.setEntity(new UrlEncodedFormEntity((List<? extends NameValuePair>) data, "UTF-8"));

			response = httpClient.execute(httpPost, new BasicHttpContext());

			if (response.getStatusLine().getStatusCode() != RESPONSE_CODE_SUCCESS_INT) {
				logger.error(String.format(RESPONSE_PRINT_ISSUES_STR, response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();

			if (entity != null) {
				String resultStr = EntityUtils.toString(entity, "utf-8");

				JSONObject result = JSON.parseObject(resultStr);

				Integer errcode = result.getInteger("errcode");
				Integer errorCode = result.getInteger("errorCode");

				if ((errcode == null || errcode != RESPONSE_ERRCODE_SUCCESS_INT) && (errorCode == null || errorCode != RESPONSE_ERRCODE_SUCCESS_INT)) {
					logger.error(String.format(RESPONSE_PRINT_FAIL_STR, url, resultStr));
				}

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

	public static StringBuffer httpXml(String rurl, String method, String xml) {

		StringBuffer stringBuffer = new StringBuffer();

		URL url = null;
		HttpsURLConnection connection = null;

		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		BufferedReader bufferedReader = null;

		try {
			url = new URL(rurl);
			connection = (HttpsURLConnection) url.openConnection();

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
			logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, rurl, e.getMessage()));
		} catch (IOException e) {
			logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, rurl, e.getMessage()));
		} finally {
			try {
				if (bufferedReader != null) bufferedReader.close();
				if (inputStreamReader != null) inputStreamReader.close();
				if (inputStream != null) inputStream.close();
				if (connection != null) connection.disconnect();
			} catch (IOException e) {
				logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
			}
		}

		return stringBuffer;
	}

	@SuppressWarnings("deprecation")
	public static StringBuffer httpsXml(String url, String method, String xml, String type, String file, String passwd) {

		CloseableHttpClient httpclient = null;
		CloseableHttpResponse response = null;

		InputStreamReader reader = null;
		StringBuffer stringBuffer = null;

		try {
			KeyStore keyStore = KeyStore.getInstance(type); // PKCS12
			// 证书地址
			FileInputStream instream = new FileInputStream(new File(file));
			try {
				keyStore.load(instream, passwd.toCharArray());
			} finally {
				instream.close();
			}

			// Trust own CA and all self-signed certs
			SSLContext sslcontext = SSLContexts.custom().loadKeyMaterial(keyStore, passwd.toCharArray()).build();
			// Allow TLSv1 protocol only
			SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslcontext, new String[] { "TLSv1" }, null, SSLConnectionSocketFactory.BROWSER_COMPATIBLE_HOSTNAME_VERIFIER);
			httpclient = HttpClients.custom().setSSLSocketFactory(sslsf).build();

			HttpPost httppost = new HttpPost("https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers");
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
			logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
		} finally {
			try {
				if (httpclient != null) httpclient.close();
				if (response != null) response.close();
				if (reader != null) reader.close();
			} catch (IOException e) {
				logger.error(String.format(RESPONSE_PRINT_EXCEPTION_STR, url, e.getMessage()));
			}
		}

		return stringBuffer;
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

			if (response.getStatusLine().getStatusCode() != RESPONSE_CODE_SUCCESS_INT) {
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
				if (response.getStatusLine().getStatusCode() != RESPONSE_CODE_SUCCESS_INT) {
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

	public static void main(String[] args) throws UnsupportedEncodingException {

		// HttpHelper.httpGet("http://192.168.5.21/collectPayment.do?authentication=A9F8EC2B15D0C6F300E854E3BB412BC579528B0A50F47202539CF5DB394C49CB05F383450230903215B63B6E297C1142FDEAA7C5C2D646A5EB96F40974FD20FD33EBEAB2DAFE776F9E5F09E7031F381E893C792B97EE5FCC92164F7EED01DA2A&payment.cash=111&payment.cashInfo=157&payment.customer.id=53429&payment.des=&payment.orderId=1606290003&payment.paymentType=合同预付款&payment.type=收款");
		System.out.println("150101000100000000".substring(0, 10));
		System.out.println(DateUtil.current("yyyy-MM-dd%20HH:mm:ss"));

		// List<NameValuePair> params = new ArrayList<NameValuePair>();
		// params.add(new BasicNameValuePair("userId", "manager9961"));
		// params.add(new BasicNameValuePair("workDateFrom", "2016-09-18 00:00:00"));
		// params.add(new BasicNameValuePair("workDateTo", "2016-09-18 23:59:59"));

		Map<String, String> map = new HashMap<String, String>();
		map.put("userId", "manager9961");
		map.put("workDateFrom", "2016-09-18 00:00:00");
		map.put("workDateTo", "2016-09-18 23:59:59");

		Object params = JSONObject.toJSON(map);

		System.out.println(params);

		HttpHelper.httpPost("https://oapi.dingtalk.com/attendance/list?access_token=5d7cb039a5633c9eb0e72c89883d526f", params);

		// HttpHelper.httpGet("https://api.weixin.qq.com/sns/userinfo?access_token=k3taL-4UVYSga-LdeinqM0AjwpURjtaEbeffY8bEgO63AILz9xW0qx9ODOLsEdgP78dclqZtLKHTRGH9JrFtiJeu7hKPYr7WoY3CipdcgU0&openid=opMiKuMKZb-v0lkGY56MhkNzrePY&lang=zh_CN");

		// HttpHelper.httpGet("https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx4cdc668312450d10&secret=f30ebb63b38737f20e0659fa3aaee467&code=041nfsG71mwrRP1WgVC71dkgG71nfsGU&grant_type=authorization_code");

	}
}
