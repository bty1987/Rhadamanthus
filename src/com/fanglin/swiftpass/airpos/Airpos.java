package com.fanglin.swiftpass.airpos;

/**
 * @File Name	: Airpos.java
 * @Package   	: 
 * @Version		: 1.0
 * @Date		: 2023/04/14
 * @Copyright	: Copyright Creators 2014
 * @Author		: ly
 * @Describing	: 
 */

import java.nio.charset.Charset;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.TreeMap;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cn.hutool.crypto.SmUtil;
import cn.hutool.crypto.asymmetric.KeyType;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.data.po.CustypePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.bean.Wxpay;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.swiftpass.enums.ReqMethodEnum;
import com.fanglin.swiftpass.utils.Base64;
import com.fanglin.swiftpass.utils.OpenSdk;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.EncryptConfigLoader;
import com.fanglin.utils.SystemConfig;

public class Airpos {

	private static final Logger logger = LoggerFactory.getLogger(Airpos.class);

	// private static String respPubKey; // 公钥

	// private static String bsPrivateKey; // 更新支付通道密钥-兴E付商户私钥

	// private static String bsCheckoutPublickey; // 更新支付通道密钥-收银台商户公钥&支付通知验签公钥

	private static String xingEpayPublickey; // 更新支付通道密钥-兴E付平台公钥

	private static String swiftpass_query_url;

	private static String swiftpass_wxpay_url;

	private static String swiftpass_updateKey_url;

	private static String kingdee_callBack_publicKey; // 金蝶支付回调公钥

	private static Properties prop;

	private static String configFilePathName = "/swiftpass.properties";

	static {
		try {
			try {
				prop = EncryptConfigLoader.load(configFilePathName);
			} catch (Throwable e) {
				logger.info("EncryptConfigLoader加载失败，回退到原始方式: {}", e.getMessage());
				prop = new Properties();
				prop.load(SystemConfig.class.getResourceAsStream(configFilePathName));
			}

			if (prop != null) {
				xingEpayPublickey = prop.getProperty("XINGEPAYPUBLICKEY");

				swiftpass_query_url = "/api/openbill/queryBillInfo";
				swiftpass_wxpay_url = "/api/h5/token/genToken";
				swiftpass_updateKey_url = "/api/openbill/updateMerchantChannelKey";

				kingdee_callBack_publicKey = prop.getProperty("KINGDEECALLBACKPUBLICKEY");
			}

		} catch (Throwable e) {
			logger.warn("swiftpass.properties 配置文件未找到或加载失败，swiftpass支付功能将不可用: {}", e.getMessage());
		}
	}

	public static void wxpay(Wxpay wxpay, CustypePO custypePO, CompanyPO companyPO) throws FLException {

		if (custypePO == null) {
			throw new FLException(130105, "商户不存在");
		}

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		TreeMap<String, String> params = new TreeMap<String, String>();

		List<String> paymentTypes = Arrays.asList("预付款", "装修款", "主材款", "销售款", "服务费", "活动款", "转换款", "代付款");
		double money = Arith.div(wxpay.getPaymentMoney(), 100.0);

		String orderTitle = paymentTypes.get(wxpay.getPaymentType());
		String paymentDetail = String.format("[{\"amount\": \"%s\",\"typeCn\": \"%s\"}]", money, orderTitle);

		params.put("mchNo", custypePO.getNo()); // 商户编号
		params.put("appOrderNo", wxpay.getThreeOrderNo()); // 应用系统订单编号
		params.put("subOpenId", wxpay.getOpenid()); // openid
		params.put("subAppId", custypePO.getWxapp()); // appid
		params.put("payType", Wxpay.PAYTYPE_WXCHAT_MINIPROGRAM); // 支付类型
		params.put("userId", wxpay.getUnionId()); // 用户唯一标识
		params.put("clientName", wxpay.getPaymentOrderId()); // 客户姓名
		params.put("totalAmount", String.valueOf(money)); // 总金额
		params.put("orderTitle", orderTitle); // 订单主题
		params.put("goodDesp", orderTitle); // 商品描述
		params.put("timestamp", String.valueOf(System.currentTimeMillis())); // 申请下单时间
		params.put("paymentDetail", paymentDetail); // 支付明细列表

		String paramJson = JSONObject.toJSONString(params);

		TreeMap<String, String> paramsData = new TreeMap<String, String>();

		paramsData.put("bizId", "ecoBill-wechat");
		paramsData.put("isShort", "true");
		paramsData.put("param", paramJson);

		String response = OpenSdk.gateway(swiftpass_wxpay_url, ReqMethodEnum.POST, null, null, paramsData);

		if (response == null) {

			logger.error("支付平台无响应: url={}, params={}", swiftpass_wxpay_url, paramsData);

			throw new FLException(150053, "支付平台异常");
		}

		JSONObject result = JSON.parseObject(response);
		String code = result.getString("code");

		if (!code.equals("0000")) {

			logger.error("支付平台返回错误: url={}, params={}, response={}", swiftpass_wxpay_url, paramsData, response);

			throw new FLException(150053, String.format("支付平台异常,%s:%s", result.getString("code"), result.getString("msg")));
		}

		wxpay.setMchNo(custypePO.getNo());
		wxpay.setUrl(result.getString("url"));
		wxpay.setBizId(result.getString("bizId"));

	}

	public static void alipay(Wxpay wxpay, CustypePO custypePO, CompanyPO companyPO) throws FLException {

		if (custypePO == null) {
			throw new FLException(130105, "商户不存在");
		}

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		TreeMap<String, String> params = new TreeMap<String, String>();

		List<String> paymentTypes = Arrays.asList("预付款", "装修款", "主材款", "销售款", "服务费", "活动款", "转换款", "代付款");
		double money = Arith.div(wxpay.getPaymentMoney(), 1000.0);

		String orderTitle = paymentTypes.get(wxpay.getPaymentType());
		String paymentDetail = String.format("[{\"amount\": \"%s\",\"typeCn\": \"%s\"}]", money, orderTitle);

		params.put("mchNo", custypePO.getNo()); // 商户编号
		params.put("appOrderNo", wxpay.getThreeOrderNo()); // 应用系统订单编号
		params.put("userId", wxpay.getUnionId()); // 用户唯一标识
		params.put("clientName", wxpay.getPaymentOrderId()); // 客户姓名
		params.put("totalAmount", String.valueOf(money)); // 总金额
		params.put("orderTitle", orderTitle); // 订单主题
		params.put("goodDesp", orderTitle); // 商品描述
		params.put("timestamp", String.valueOf(System.currentTimeMillis())); // 申请下单时间
		params.put("paymentDetail", paymentDetail); // 支付明细列表

		String paramJson = JSONObject.toJSONString(params);

		TreeMap<String, String> paramsData = new TreeMap<String, String>();

		paramsData.put("bizId", "ecoBill-scanCode");
		paramsData.put("isShort", "true");
		paramsData.put("param", paramJson);

		String response = OpenSdk.gateway(swiftpass_wxpay_url, ReqMethodEnum.POST, null, null, paramsData);

		if (response == null) {

			logger.error("支付平台无响应: url={}, params={}", swiftpass_wxpay_url, paramsData);

			throw new FLException(150053, "支付平台异常");
		}

		JSONObject result = JSON.parseObject(response);
		String code = result.getString("code");

		if (!code.equals("0000")) {

			logger.error("支付平台返回错误: url={}, params={}, response={}", swiftpass_wxpay_url, paramsData, response);

			throw new FLException(150053, String.format("支付平台异常,%s:%s", result.getString("code"), result.getString("msg")));
		}

		wxpay.setMchNo(custypePO.getNo());
		wxpay.setUrl(result.getString("url"));
		wxpay.setBizId(result.getString("bizId"));

	}

	public static void check(PaytranPO paytranPO, CustypePO custypePO) throws FLException {

		if (custypePO == null) {
			throw new FLException(130105, "商户不存在");
		}

		TreeMap<String, String> params = new TreeMap<String, String>();

		params.put("mchNo", custypePO.getNo());
		params.put("appOrderNo", paytranPO.getOutOrderNo());
		params.put("orderNo", paytranPO.getMsgId());

		String response = OpenSdk.gateway(swiftpass_query_url, ReqMethodEnum.POST, null, null, params);

		if (response == null) {

			logger.error("支付平台无响应: url={}, params={}", swiftpass_query_url, JSONObject.toJSONString(params));

			throw new FLException(150053, "支付平台异常");
		}

		JSONObject result = JSON.parseObject(response);

		String status = result.getString("result");
		String code = result.getString("code");
		String msg = result.getString("msg");
		JSONObject data = JSON.parseObject(result.getString("orderVo"));

		if (status.equals("SUCCESS")) {
			if (data.isEmpty()) {

				logger.error("支付查询返回空数据: url={}, params={}, response={}", swiftpass_query_url, JSONObject.toJSONString(params), response);

				paytranPO.setStatus(PaytranPO.STATUS_FAIL_INT);
				paytranPO.setRstcode(code);
				paytranPO.setRstmsg(msg);
			} else {
				paytranPO.setStatus(PaytranPO.STATUS_SUCCESS_INT);
				paytranPO.setMsgId(data.getString("orderNo"));
			}
		} else {

			logger.error("支付查询失败: url={}, params={}, response={}", swiftpass_query_url, JSONObject.toJSONString(params), response);

			paytranPO.setStatus(PaytranPO.STATUS_FAIL_INT);
			paytranPO.setRstcode(code);
			paytranPO.setRstmsg(msg);
		}

	}

	public static void updateKey(String mchNo, String bsCheckoutPublickey, String bsPrivateKey) throws Exception {

		TreeMap<String, String> params = new TreeMap<String, String>();

		params.put("mchNo", mchNo); // 商户号
		params.put("channelType", "SWIFT_PASS"); // 渠道类型
		params.put("signType", "RSA_1_256"); // 签名类型
		String prikey = SmUtil.sm2(null, bsCheckoutPublickey).encryptHex(bsPrivateKey, KeyType.PublicKey); // 收银台公钥+商户私钥
		params.put("privateKey", prikey); // 签名私钥
		params.put("publicKey", xingEpayPublickey); // 平台公钥

		String response = OpenSdk.gateway(swiftpass_updateKey_url, ReqMethodEnum.POST, null, null, params);

		if (response == null) {

			logger.error("更新密钥失败: url={}, params={}", swiftpass_updateKey_url, params);

			throw new FLException(150053, "支付平台异常");
		}

	}

	public static boolean decryptSign(TreeMap<String, Object> params, String sign, String payPublickey) {

		StringBuilder sb = new StringBuilder();

		for (String key : params.keySet()) {
			sb.append(key).append("=").append(params.get(key)).append("&");
		}

		String res = sb.substring(0, sb.lastIndexOf("&"));

		PublicKey publicKey = getPublicKey(payPublickey);

		try {
			Signature signature = Signature.getInstance("SM3withSm2", new BouncyCastleProvider());
			signature.initVerify(publicKey);
			signature.update(res.getBytes(Charset.forName("UTF-8")));

			return signature.verify(Base64.decode(sign));
		} catch (Exception e) {
			logger.error("解密签名失败", e);
			return false;
		}

	}

	private static PublicKey getPublicKey(String publicKeyStr) {

		PublicKey publicKey = null;

		BouncyCastleProvider bouncyCastleProvider = new BouncyCastleProvider();

		try {
			KeyFactory keyFactory = KeyFactory.getInstance("EC", bouncyCastleProvider);
			publicKey = keyFactory.generatePublic(new X509EncodedKeySpec(Base64.decode(publicKeyStr)));
		} catch (Exception e) {
			logger.error("生成公钥失败: publicKeyStr={}", publicKeyStr, e);
		}

		return publicKey;
	}

	public static boolean verifySignature(String params, String sign) {

		try {

			byte[] keyBytes = Base64.decode(kingdee_callBack_publicKey);
			X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);

			KeyFactory keyFactory = KeyFactory.getInstance("RSA");
			PublicKey publicKey = keyFactory.generatePublic(keySpec);

			Signature signature = Signature.getInstance("SHA256withRSA");
			signature.initVerify(publicKey);
			signature.update(params.getBytes("UTF-8"));

			boolean flag = signature.verify(Base64.decode(sign));

			return flag;

		} catch (Exception e) {
			logger.error("解密签名失败", e);
			return false;
		}

	}
}