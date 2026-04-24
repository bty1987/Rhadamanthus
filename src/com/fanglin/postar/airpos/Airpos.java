package com.fanglin.postar.airpos;

/**
 * @File Name		: Airpos.java
 * @Package   	: 
 * @Version		: 1.0
 * @Date			: 2019-9-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

import java.util.Date;
import java.util.Properties;
import java.util.TreeMap;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.CustypePO;
import com.fanglin.payment.bean.Wxpay;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.postar.utils.HttpUtil;
import com.fanglin.postar.utils.RsaUtil;
import com.fanglin.postar.utils.SM4Utils;
import com.fanglin.postar.utils.ShaUtil;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.EncryptConfigLoader;

public class Airpos {

	private static String publicKey;

	private static String version;

	private static String ip;

	private static String codepay_secret_key;

	private static String codepay_iv;

	private static String postar_pay_url;

	private static String postar_pos_pay_url;

	private static String postar_query_url;

	private static Properties prop;

	private static String configFilePathName = "/postar.properties";

	static {
		try {
			prop = EncryptConfigLoader.load(configFilePathName);

			publicKey = prop.getProperty("PUBLICKEY");
			version = prop.getProperty("VERSION");
			ip = prop.getProperty("IP");

			codepay_secret_key = prop.getProperty("SECRETKEY");
			codepay_iv = prop.getProperty("IV");

			String host = prop.getProperty("HOST");
			postar_pay_url = String.format("%s%s", host, "/yyfsevr/order/pay");
			postar_pos_pay_url = String.format("%s%s", host, "/yyfsevr/order/cashierPay");
			postar_query_url = String.format("%s%s", host, "/yyfsevr/order/tradeQuery");

		} catch (Throwable e) {
			throw new RuntimeException("config-file cannot be load: " + configFilePathName);
		}
	}

	public static void pospay(PaytranPO paytranPO, CustypePO custypePO) throws FLException {

		if (custypePO == null) {
			throw new FLException(130105, "商户不存在");
		}

		TreeMap<String, Object> params = new TreeMap<String, Object>();

		String payway = "00";

		if (paytranPO.getWay() == PaytranPO.WAY_ACQUIRE_SHORT) {
			payway = "01";
		}

		params.put("agetId", custypePO.getAgent());
		params.put("custId", custypePO.getNo());
		params.put("sn", paytranPO.getSn());
		params.put("threeOrderNo", paytranPO.getOutOrderNo());
		params.put("txamt", Arith.div(paytranPO.getMoney(), 10000l));
		params.put("orderType", payway); // 00扫码 01刷卡
		params.put("version", version);
		params.put("timeStamp", System.currentTimeMillis());

		params.put("sign", getSign(params));

		String paramJson = JSONObject.toJSONString(params);

		String response = HttpUtil.postData(postar_pos_pay_url, paramJson);

		if (response == null) {

			System.out.println(postar_pos_pay_url);
			System.out.println(paramJson);

			throw new FLException(150053, "支付平台异常");
		}

		JSONObject result = JSON.parseObject(response);

		String code = result.getString("code");

		if (!code.equals("000000")) {

			System.out.println(postar_pos_pay_url);
			System.out.println(paramJson);
			System.out.println(response);

			paytranPO.setStatus(PaytranPO.STATUS_FAIL_INT);
			paytranPO.setRstcode(code);
			paytranPO.setRstmsg(result.getString("msg"));
		}

	}

	public static String codepay(PaytranPO paytranPO, CustypePO custypePO) throws FLException {

		if (custypePO == null) {
			throw new FLException(130105, "商户不存在");
		}

		String plainText = String.format("custId=%s&orderNo=%s&txamt=%s&code=%s", custypePO.getNo(), paytranPO.getOutOrderNo(), Arith.div(paytranPO.getMoney(), 1000.0), PaytranPO.CODESTATUS_PAY_SHORT);

		try {
			return new SM4Utils(codepay_secret_key, codepay_iv, true).encrypt(plainText);
		} catch (Exception e) {
			System.out.println(e.getMessage());
			System.out.println(plainText);
			throw new FLException(110008, "验证信息错误");
		}
	}

	public static void wxpay(Wxpay wxpay, CustypePO custypePO, CompanyPO companyPO) throws FLException {

		if (custypePO == null) {
			throw new FLException(130105, "商户不存在");
		}

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		TreeMap<String, Object> params = new TreeMap<String, Object>();

		params.put("agetId", custypePO.getAgent());
		params.put("custId", custypePO.getNo());
		params.put("orderNo", wxpay.getThreeOrderNo());
		params.put("driveNo", companyPO.getNo());
		params.put("txamt", wxpay.getPaymentMoney());
		params.put("txamtOrder", wxpay.getPaymentMoney());
		params.put("access", "3");
		params.put("payWay", "1");

		params.put("traType", "8");
		params.put("wxAppid", custypePO.getWxapp());
		params.put("openid", wxpay.getOpenid());

		params.put("ip", ip);

		params.put("version", version);
		params.put("timeStamp", System.currentTimeMillis());

		params.put("sign", getSign(params));

		String paramJson = JSONObject.toJSONString(params);

		String response = HttpUtil.postData(postar_pay_url, paramJson);

		if (response == null) {

			System.out.println(postar_pay_url);
			System.out.println(paramJson);

			throw new FLException(150053, "支付平台异常");
		}

		JSONObject result = JSON.parseObject(response);

		String code = result.getString("code");

		if (!code.equals("000000")) {

			System.out.println(postar_pay_url);
			System.out.println(paramJson);
			System.out.println(response);

			throw new FLException(150053, String.format("支付平台异常,%s", result.getString("msg")));
		}

		JSONObject data = JSON.parseObject(result.getString("data"));

		wxpay.setJsapiAppid(data.getString("jsapiAppid"));
		wxpay.setJsapiNoncestr(data.getString("jsapiNoncestr"));
		wxpay.setJsapiPackage(data.getString("jsapiPackage"));
		wxpay.setJsapiPaySign(data.getString("jsapiPaySign"));
		wxpay.setJsapiSignType(data.getString("jsapiSignType"));
		wxpay.setJsapiTimestamp(data.getString("jsapiTimestamp"));
		wxpay.setOrderNo(data.getString("orderNo"));
		wxpay.setOrderTime(data.getString("orderTime"));

	}

	public static void check(PaytranPO paytranPO, CustypePO custypePO) throws FLException {

		if (custypePO == null) {
			throw new FLException(130105, "商户不存在");
		}

		TreeMap<String, Object> params = new TreeMap<String, Object>();

		params.put("orderNo", paytranPO.getOutOrderNo());
		params.put("agetId", custypePO.getAgent());
		params.put("custId", custypePO.getNo());
		params.put("custLogin", custypePO.getPhone());

		if (paytranPO.getSn() != null && paytranPO.getSn() != "") {
			params.put("orderType", "01");
		}

		params.put("timeStamp", System.currentTimeMillis());
		params.put("version", version);
		params.put("sign", getSign(params));

		String paramJson = JSONObject.toJSONString(params);

		String response = HttpUtil.postData(postar_query_url, paramJson);

		if (response == null) {

			System.out.println(postar_query_url);
			System.out.println(paramJson);

			throw new FLException(150053, "支付平台异常");
		}

		JSONObject result = JSON.parseObject(response);

		String code = result.getString("code");
		String msg = result.getString("msg");
		JSONObject data = JSON.parseObject(result.getString("data"));

		if (code.equals("000000")) {
			if (data.isEmpty()) {

				System.out.println(postar_query_url);
				System.out.println(paramJson);
				System.out.println(response);

				paytranPO.setStatus(PaytranPO.STATUS_FAIL_INT);
				paytranPO.setRstcode(code);
				paytranPO.setRstmsg(msg);
			} else {
				paytranPO.setStatus(PaytranPO.STATUS_SUCCESS_INT);
				paytranPO.setMsgId(data.getString("orderNo"));
			}
		} else if (code.equals("222222")) {

			long pushTime = paytranPO.getPushTime().getTime();
			long currentTime = DateUtil.getDateToTimestamp(new Date()).getTime();

			if (Arith.sub(currentTime, pushTime) < PaytranPO.CHECK_INVALIDTIME_LONG) throw new FLException(150045, "转换款支付正在处理");

			paytranPO.setStatus(PaytranPO.STATUS_INVALID_INT);
			paytranPO.setRstcode(code);
			paytranPO.setRstmsg(msg);
		} else {

			System.out.println(postar_query_url);
			System.out.println(paramJson);
			System.out.println(response);

			paytranPO.setStatus(PaytranPO.STATUS_FAIL_INT);
			paytranPO.setRstcode(code);
			paytranPO.setRstmsg(msg);
		}

	}

	public static String getSign(TreeMap<String, Object> params) {

		StringBuilder sb = new StringBuilder();

		for (String key : params.keySet()) {
			sb.append(key).append("=").append(params.get(key)).append("&");
		}

		String res = sb.substring(0, sb.lastIndexOf("&"));
		String sha256 = ShaUtil.getSHA256(res);
		String sign = RsaUtil.encrypt(publicKey, sha256);

		return sign;
	}

	public static boolean decryptSign(TreeMap<String, Object> params, String sign) {

		StringBuilder sb = new StringBuilder();

		for (String key : params.keySet()) {
			sb.append(key).append("=").append(params.get(key)).append("&");
		}

		String res = sb.substring(0, sb.lastIndexOf("&"));
		String sha256 = ShaUtil.getSHA256(res);

		try {
			String decodeSha256 = RsaUtil.decrypt(publicKey, sign);
			return sha256.equals(decodeSha256);
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return false;
		}

	}
}
