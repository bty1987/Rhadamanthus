package com.fanglin.swiftpass.utils;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import com.fanglin.swiftpass.config.Configure;
import com.fanglin.swiftpass.config.GrayConfigure;
import com.fanglin.swiftpass.config.KeyConfigure;
import com.fanglin.swiftpass.enums.ReqMethodEnum;
import com.fanglin.swiftpass.exception.SdkExType;
import com.fanglin.swiftpass.exception.SdkException;
import com.fanglin.swiftpass.service.AbstractTransService;

/**
 * 使用URLConnection的通讯器
 * 
 */
public class HttpsPostRequest extends AbstractTransService {

	private static final int BUFFER_SIZE = 2048;

	private static final String HEADER_TIMESTAMP = "Timestamp";

	private static final String HEADER_SIGNATURE = "Signature";

	private static final String HEADER_NONCE = "Nonce";

	private static final String HTTPS = "https";

	/**
	 * request头和上传文件内容的分隔符
	 */
	private static final String BOUNDARY = "---------------------------543279124964751";

	private static final String APPLICATION_OCTET_STREAM = "application/octet-stream";

	private static TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
		@Override
		public java.security.cert.X509Certificate[] getAcceptedIssuers() {
			return null;
		}

		@Override
		public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {
		}

		@Override
		public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {
		}
	} };

	private static HostnameVerifier hv = new HostnameVerifier() {
		@Override
		public boolean verify(String hostname, SSLSession session) {
			return true;
		}
	};

	private static SSLContext sc;
	private static SSLSocketFactory sf;

	static {
		try {
			sc = SSLContext.getInstance("TLSv1.2"); // SSL TLSv1.2
			sc.init(null, trustAllCerts, new java.security.SecureRandom());
			sf = sc.getSocketFactory();
		} catch (NoSuchAlgorithmException e) {

		} catch (KeyManagementException e) {

		}
	}

	private static Map<String, SSLSocketFactory> SFS = new HashMap<String, SSLSocketFactory>();
	private static Object LOCK = new Object();
	private static boolean SSL_INIT_STATUS = false;

	private void initSSLContents() {
		if (!SSL_INIT_STATUS) {
			synchronized (LOCK) {
				if (!SSL_INIT_STATUS) {
					Map<String, KeyConfigure> keyConfigures = Configure.getKeyConfigures();
					for (Map.Entry<String, KeyConfigure> entry : keyConfigures.entrySet()) {
						String keyId = entry.getKey();
						FileInputStream fis = null;
						try {
							SSLContext sslContext = SSLContext.getInstance("TLSv1.2");
							KeyStore keyStore = KeyStore.getInstance("PKCS12");
							fis = new FileInputStream(new File(Configure.getCertPath(), keyId + ".p12"));
							char[] password = entry.getValue().getCertProtectionPwd() == null ? null : entry.getValue().getCertProtectionPwd().toCharArray();
							keyStore.load(fis, password);
							KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
							kmf.init(keyStore, password);
							sslContext.init(kmf.getKeyManagers(), null, new SecureRandom());
							SFS.put(keyId, sslContext.getSocketFactory());
						} catch (Exception e) {

						} finally {
							if (fis != null) {
								try {
									fis.close();
								} catch (IOException e) {

								}
							}
						}
					}
					SSL_INIT_STATUS = true;
				}
			}
		}
	}

	@Override
	public Object send(String url, ReqMethodEnum method, String authInfo, Map<String, String> headParams, String bodyParamString, String filePath, Map<String, String> bodyParamMap, KeyConfigure keyConfigure, String bodyJson) throws Exception {

		// 通讯公共部分
		URL connUrl = null;
		HttpURLConnection conn = null;
		Object retn = null;

		// 打开URL连接
		connUrl = new URL(url);
		conn = (HttpURLConnection) connUrl.openConnection();

		// 测试环境忽略SSL证书验证
		if (Configure.isDevEnv() && HTTPS.equals(connUrl.getProtocol())) {
			ignoreSSLVerify((HttpsURLConnection) conn);
		}
		if (Configure.getCertPath() != null) {
			initSSLContents();
			SSLSocketFactory sslSocketFactory = SFS.get(keyConfigure.getKeyId());
			if (sslSocketFactory != null) {
				((HttpsURLConnection) conn).setSSLSocketFactory(sslSocketFactory);
			}
		}

		// 设置HEAD信息
		if (keyConfigure.getEnterpriseBearer() != null) {
			authInfo = authInfo + "," + keyConfigure.getEnterpriseBearer();
		}
		conn.setRequestProperty(Const.POST_HEAD_KEY, authInfo);
		if (keyConfigure.getXCfcaBasic() != null) {
			conn.setRequestProperty("X-Cfca-Basic", keyConfigure.getXCfcaBasic());
		}
		if (headParams != null) {
			for (String key : headParams.keySet()) {
				conn.setRequestProperty(key, headParams.get(key));
			}
		}

		// 灰度发布配置添加到请求头中
		GrayConfigure grayConfigure = keyConfigure.getGrayConfigure();
		if (null != grayConfigure && grayConfigure.notNull()) {
			conn.setRequestProperty(grayConfigure.getKey(), grayConfigure.getValue());
		}

		// 响应验签相关数据
		String timestamp = "";
		String responseSignValue = "";
		String responseNonce = "";

		// 非文件上传
		if (null == filePath) {

			OutputStream outStream = null;
			InputStream inStream = null;

			if (SdkUtil.isJSONString(bodyJson)) {
				bodyParamString = bodyJson;
				conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
			}

			try {
				switch (method) {
					case POST:
						conn.setRequestMethod(ReqMethodEnum.POST.toString());
						conn.setDoOutput(true);
						outStream = conn.getOutputStream();
						outStream.write(bodyParamString.getBytes(Const.CHARSET));
						outStream.flush();
						break;
					case PUT:
						conn.setRequestMethod(ReqMethodEnum.PUT.toString());
						conn.setDoOutput(true);
						outStream = conn.getOutputStream();
						outStream.write(bodyParamString.getBytes(Const.CHARSET));
						outStream.flush();
						break;
					case DELETE:
						conn.setRequestMethod(ReqMethodEnum.DELETE.toString());
						conn.setDoOutput(true);
						outStream = conn.getOutputStream();
						outStream.write(bodyParamString.getBytes(Const.CHARSET));
						outStream.flush();
						break;
					default:
						break;
				}

				// 获取返回结果
				int code = conn.getResponseCode();
				if (code >= HttpURLConnection.HTTP_OK && code < HttpURLConnection.HTTP_MULT_CHOICE && code != 0) {
					inStream = conn.getInputStream();
				} else {
					inStream = conn.getErrorStream();
				}

				byte[] bin = readInputStream(inStream);
				if (APPLICATION_OCTET_STREAM.equals(conn.getContentType())) {
					retn = bin;
				} else {
					retn = new String(bin, Const.CHARSET);
				}

				timestamp = conn.getHeaderField(HEADER_TIMESTAMP);
				responseSignValue = conn.getHeaderField(HEADER_SIGNATURE);
				responseNonce = conn.getHeaderField(HEADER_NONCE);
			} finally {
				if (inStream != null) {
					inStream.close();
				}
				if (outStream != null) {
					outStream.close();
				}
				if (conn != null) {
					conn.disconnect();
				}
			}

		} else {
			// 文件上传
			try {
				conn.setRequestMethod(ReqMethodEnum.POST.toString());

				conn.setConnectTimeout(5000);
				conn.setReadTimeout(30000);
				conn.setDoOutput(true);
				conn.setDoInput(true);
				conn.setUseCaches(false);

				conn.setRequestProperty("Connection", "Keep-Alive");
				conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + BOUNDARY);

				OutputStream out = new DataOutputStream(conn.getOutputStream());

				// text
				if (null != bodyParamMap) {
					StringBuffer strBuf = new StringBuffer();
					Iterator<Map.Entry<String, String>> iter = bodyParamMap.entrySet().iterator();
					while (iter.hasNext()) {
						Map.Entry<String, String> entry = iter.next();
						String inputName = entry.getKey();
						String inputValue = entry.getValue();
						if (inputValue == null) {
							continue;
						}
						strBuf.append("\r\n").append("--").append(BOUNDARY).append("\r\n");
						strBuf.append("Content-Disposition: form-data; name=\"" + inputName + "\"\r\n\r\n");
						strBuf.append(inputValue);
					}
					out.write(strBuf.toString().getBytes());
				}

				// file
				File file = new File(filePath);
				String filename = file.getName();
				String inputName = "file";

				StringBuffer strBuf = new StringBuffer();
				strBuf.append("\r\n").append("--").append(BOUNDARY).append("\r\n");
				strBuf.append("Content-Disposition: form-data; name=\"" + inputName + "\"; filename=\"" + filename + "\"\r\n\r\n");

				out.write(strBuf.toString().getBytes());
				FileInputStream fileInputStream = new FileInputStream(file);
				DataInputStream in = new DataInputStream(fileInputStream);
				int bytes = 0;
				byte[] bufferOut = new byte[1024];
				while ((bytes = in.read(bufferOut)) != -1) {
					out.write(bufferOut, 0, bytes);
				}
				in.close();
				fileInputStream.close();

				byte[] endData = ("\r\n--" + BOUNDARY + "--\r\n").getBytes();
				out.write(endData);
				out.flush();
				out.close();

				// 获取返回结果
				InputStream inStream = null;
				int code = conn.getResponseCode();
				if (code >= HttpURLConnection.HTTP_OK && code < HttpURLConnection.HTTP_MULT_CHOICE && code != 0) {
					inStream = conn.getInputStream();
				} else {
					inStream = conn.getErrorStream();
				}

				// 读取返回数据
				strBuf = new StringBuffer();
				InputStreamReader inputStreamReader = new InputStreamReader(inStream);
				BufferedReader reader = new BufferedReader(inputStreamReader);
				String line = null;
				while ((line = reader.readLine()) != null) {
					strBuf.append(line);
				}
				retn = strBuf.toString();
				reader.close();
				reader = null;
				inputStreamReader.close();
				inputStreamReader = null;

				timestamp = conn.getHeaderField(HEADER_TIMESTAMP);
				responseSignValue = conn.getHeaderField(HEADER_SIGNATURE);
				responseNonce = conn.getHeaderField(HEADER_NONCE);
			} catch (FileNotFoundException e) {
				SdkException ex = new SdkException(SdkExType.FILE_ERROR_RESULT);
				return ex.toString();
			} catch (IOException e) {
				SdkException ex = new SdkException(SdkExType.CONN_ERR);
				return ex.toString();
			} finally {
				if (conn != null) {
					conn.disconnect();
				}
			}
		}

		// 响应报文验签开关非关闭，且响应报文不包含OPEN异常时，执行验签
		if (keyConfigure.isRespSignSwitch() && !retn.toString().contains(Const.RESP_EXCEPTION_CODE)) {
			VerifyRespSignature.verify(timestamp, responseNonce, responseSignValue, retn, keyConfigure);
		}

		return retn;
	}

	private static byte[] readInputStream(InputStream inStream) throws IOException {
		ByteArrayOutputStream outStream = new ByteArrayOutputStream();
		byte[] data = null;
		byte[] buffer = new byte[BUFFER_SIZE];
		int len = 0;
		try {
			while ((len = inStream.read(buffer)) != -1) {
				outStream.write(buffer, 0, len);
			}
			data = outStream.toByteArray();
		} finally {
			if (outStream != null) {
				outStream.close();
			}
		}
		return data;
	}

	private static void ignoreSSLVerify(HttpsURLConnection conn) {
		conn.setSSLSocketFactory(sf);
		conn.setHostnameVerifier(hv);
	}
}
