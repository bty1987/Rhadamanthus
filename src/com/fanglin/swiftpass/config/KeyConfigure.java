package com.fanglin.swiftpass.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.text.SimpleDateFormat;
import java.util.Enumeration;

import com.fanglin.swiftpass.enums.KeySignTypeEnum;
import com.fanglin.swiftpass.enums.RespSignAlgorithmEnum;
import com.fanglin.swiftpass.utils.Base64;

// 应用配置对象
public class KeyConfigure {

	private String keyId; // 应用ID，为KY字母开头的字符串，区分大小写

	private String priKey; // 请求报文签名私钥，需严格保密，建议使用配置文件或其他方式进行存储

	private String respPubKey; // 响应报文验签公钥

	private String reqParamEncryptKey; // 字段加密密钥

	private KeySignTypeEnum keySignType = KeySignTypeEnum.SM3WITHSM2; // 请求签名算法

	private boolean respSignSwitch = false; // 响应报文验签开关，true将进行验签，false不进行验签

	private RespSignAlgorithmEnum respSignAlgorithm = RespSignAlgorithmEnum.SM3WITHSM2; // 响应报文验签算法

	private String certProtectionPwd = null; // 双向认证证书私钥的保护密码，用于提取证书私钥。双向认证开启时必须设置该项

	private GrayConfigure grayConfigure = null; // 灰度发布标识参数

	private String xCfcaBasic = null; // CFCA证书基本信息头

	private String enterpriseBearer = null; // 企业客户授权信息

	public String getKeyId() {
		return keyId;
	}

	public void setKeyId(String keyId) {
		this.keyId = keyId;
	}

	public String getPriKey() {
		return priKey;
	}

	public void setPriKey(String priKey) {
		this.priKey = priKey;
	}

	public KeySignTypeEnum getKeySignType() {
		return keySignType;
	}

	public void setKeySignType(KeySignTypeEnum keySignType) {
		this.keySignType = keySignType;
	}

	public boolean isRespSignSwitch() {
		return respSignSwitch;
	}

	public void setRespSignSwitch(boolean respSignSwitch) {
		this.respSignSwitch = respSignSwitch;
	}

	public RespSignAlgorithmEnum getRespSignAlgorithm() {
		return respSignAlgorithm;
	}

	public void setRespSignAlgorithm(RespSignAlgorithmEnum respSignAlgorithm) {
		this.respSignAlgorithm = respSignAlgorithm;
	}

	public String getRespPubKey() {
		return respPubKey;
	}

	public void setRespPubKey(String respPubKey) {
		this.respPubKey = respPubKey;
	}

	public String getReqParamEncryptKey() {
		return reqParamEncryptKey;
	}

	public void setReqParamEncryptKey(String reqParamEncryptKey) {
		this.reqParamEncryptKey = reqParamEncryptKey;
	}

	public String getCertProtectionPwd() {
		return certProtectionPwd;
	}

	public void setCertProtectionPwd(String certProtectionPwd) {
		this.certProtectionPwd = certProtectionPwd;
	}

	public KeyConfigure() {
	}

	public KeyConfigure(String keyId, String priKey, KeySignTypeEnum keySignType, boolean respSignSwitch, RespSignAlgorithmEnum respSignAlgorithm, String respPubKey, String reqParamEncryptKey, String certProtectionPwd, GrayConfigure grayConfigure) {
		this.keyId = keyId;
		this.priKey = priKey;
		this.keySignType = keySignType;
		this.respSignSwitch = respSignSwitch;
		this.respSignAlgorithm = respSignAlgorithm;
		this.respPubKey = respPubKey;
		this.reqParamEncryptKey = reqParamEncryptKey;
		this.certProtectionPwd = certProtectionPwd;
		this.grayConfigure = grayConfigure;
	}

	public GrayConfigure getGrayConfigure() {
		return grayConfigure;
	}

	public void setGrayConfigure(GrayConfigure grayConfigure) {
		this.grayConfigure = grayConfigure;
	}

	/**
	 * @param cfcaCertFilename CFCA证书文件名（全路径）
	 * @param cfcaProtectionPwd CFCA证书私钥的保护密码，用于提取CFCA证书私钥
	 * @param keySignType 签名算法
	 * @return
	 */
	public void setCfcaProperties(String cfcaCertFilename, String cfcaProtectionPwd, KeySignTypeEnum keySignType) {
		KeyStore keyStore;
		FileInputStream fis = null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		try {
			keyStore = KeyStore.getInstance("PKCS12");
			fis = new FileInputStream(cfcaCertFilename);
			char[] password = cfcaProtectionPwd == null ? null : cfcaProtectionPwd.toCharArray();
			keyStore.load(fis, password);
			Enumeration<String> aliases = keyStore.aliases();
			while (aliases.hasMoreElements()) {
				String alias = aliases.nextElement();
				X509Certificate x509Certificate = (X509Certificate) keyStore.getCertificate(alias);
				StringBuilder sb = new StringBuilder();
				sb.append(x509Certificate.getSerialNumber()).append("|");
				sb.append(x509Certificate.getSigAlgName()).append("|");
				sb.append(x509Certificate.getIssuerDN()).append("|");
				sb.append(x509Certificate.getSubjectDN()).append("|");
				sb.append(sdf.format(x509Certificate.getNotBefore())).append("-").append(sdf.format(x509Certificate.getNotAfter()));
				this.xCfcaBasic = Base64.encode(sb.toString().getBytes(StandardCharsets.UTF_8));
				PrivateKey privateKey = (PrivateKey) keyStore.getKey(alias, password);
				this.priKey = Base64.encode(privateKey.getEncoded());
				this.keySignType = keySignType;
				break;
			}
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

	public String getXCfcaBasic() {
		return xCfcaBasic;
	}

	public String getEnterpriseBearer() {
		return enterpriseBearer;
	}

	/**
	 * @param enterpriseId 企业ID
	 * @param productId 产品ID
	 * @param acctNo 企业账户号
	 */
	public void setEnterpriseBearer(String enterpriseId, String productId, String acctNo) {
		StringBuilder sb = new StringBuilder();
		sb.append(enterpriseId).append("&");
		sb.append(productId).append("&");
		sb.append(acctNo);
		this.enterpriseBearer = "Bearer " + Base64.encode(sb.toString().getBytes(StandardCharsets.UTF_8));
	}
}
