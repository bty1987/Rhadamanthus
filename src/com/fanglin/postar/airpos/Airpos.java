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

import java.util.Properties;
import java.util.TreeMap;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.bean.Wxpay;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.postar.utils.HttpUtil;
import com.fanglin.postar.utils.RsaUtil;
import com.fanglin.postar.utils.ShaUtil;
import com.fanglin.utils.Arith;
import com.fanglin.utils.SystemConfig;

public class Airpos {

	private static String publicKey;

	private static String agetId;

	private static String custId;

	private static String custLogin;

	private static String wxAppid;

	private static String access;

	private static String payWay;

	private static String traType;

	private static String version;

	private static String ip;

	private static String orderType;

	private static String postar_pay_url;

	private static String postar_pos_pay_url;

	private static String postar_query_url;

	// private static String postar_query_history_url;

	private static Properties prop;

	private static String configFilePathName = "/postar.properties";

	static {
		try {
			prop = new Properties();
			prop.load(SystemConfig.class.getResourceAsStream(configFilePathName));

			publicKey = prop.getProperty("PUBLICKEY");
			agetId = prop.getProperty("AGETID");
			custId = prop.getProperty("CUSTID");
			custLogin = prop.getProperty("CUSTLOGIN");
			wxAppid = prop.getProperty("WXAPPID");
			access = prop.getProperty("ACCESS");
			payWay = prop.getProperty("PAYWAY");
			traType = prop.getProperty("TRATYPE");
			version = prop.getProperty("VERSION");
			ip = prop.getProperty("IP");
			orderType = prop.getProperty("ORDERTYPE");
			postar_pay_url = prop.getProperty("POSTAR_PAY_URL");
			postar_pos_pay_url = prop.getProperty("POSTAR_POS_PAY_URL");
			postar_query_url = prop.getProperty("POSTAR_QUERY_URL");
			// postar_query_history_url = prop.getProperty("POSTAR_QUERY_HISTORY_URL");

		} catch (Throwable e) {
			throw new RuntimeException("config-file cannot be load: " + configFilePathName);
		}
	}

	public static void pospay(String way, PaytranPO paytranPO) throws FLException {

		TreeMap<String, Object> params = new TreeMap<String, Object>();

		String payway = "00";

		if (way.equals("acquire")) {
			payway = "01";
		}

		params.put("agetId", agetId);
		params.put("custId", custId);
		params.put("sn", paytranPO.getSn());
		params.put("threeOrderNo", paytranPO.getOutOrderNo());
		params.put("txamt", Arith.div(paytranPO.getMoney(), 10000l));
		params.put("orderType", payway); // 00扫码 01刷卡
		params.put("version", version);
		params.put("timeStamp", "");

		params.put("sign", getSign(params));

		String paramJson = JSONObject.toJSONString(params);

		System.out.println(paramJson);

		String response = HttpUtil.postData(postar_pos_pay_url, paramJson);

		System.out.println(response);

		JSONObject result = JSON.parseObject(response);

		System.out.println(result);

		String code = result.getString("code");

		if (!code.equals("000000")) {
			paytranPO.setStatus(PaytranPO.STATUS_FAIL_INT);
			paytranPO.setRstcode("150044");
			paytranPO.setRstmsg("推送失败");
		}

	}

	public static void wxpay(Wxpay wxpay) throws FLException {

		TreeMap<String, Object> params = new TreeMap<String, Object>();

		params.put("agetId", agetId);
		params.put("custId", custId);
		params.put("orderNo", wxpay.getThreeOrderNo());
		params.put("txamt", wxpay.getPaymentMoney());
		params.put("txamtOrder", wxpay.getPaymentMoney());
		params.put("access", access);
		params.put("payWay", payWay);

		params.put("traType", traType);
		params.put("wxAppid", wxAppid);
		params.put("openid", wxpay.getOpenid());

		params.put("ip", ip);

		params.put("version", version);

		params.put("sign", getSign(params));

		String paramJson = JSONObject.toJSONString(params);

		System.out.println(paramJson);

		String response = HttpUtil.postData(postar_pay_url, paramJson);

		JSONObject result = JSON.parseObject(response);

		System.out.println(result);

		String code = result.getString("code");

		if (!code.equals("000000")) {
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
		wxpay.setThreeOrderNo(data.getString("threeOrderNo"));

	}

	public static void check(PaytranPO paytranPO) throws FLException {

		TreeMap<String, Object> params = new TreeMap<String, Object>();

		params.put("orderNo", paytranPO.getOutOrderNo());
		params.put("agetId", agetId);
		params.put("custId", custId);
		params.put("custLogin", custLogin);

		if (paytranPO.getSn() != null && paytranPO.getSn() != "") {
			params.put("orderType", orderType);
		}

		params.put("timeStamp", "");
		params.put("version", version);
		params.put("sign", getSign(params));

		String paramJson = JSONObject.toJSONString(params);

		System.out.println(paramJson);

		String response = HttpUtil.postData(postar_query_url, paramJson);

		System.out.println(response);

		JSONObject result = JSON.parseObject(response);

		System.out.println(result);

		String code = result.getString("code");
		String msg = result.getString("msg");
		JSONObject data = JSON.parseObject(result.getString("data"));

		if (code.equals("000000")) {
			if (data.isEmpty()) {
				paytranPO.setStatus(PaytranPO.STATUS_FAIL_INT);
				paytranPO.setRstcode(code);
				paytranPO.setRstmsg(msg);
			} else {
				paytranPO.setStatus(PaytranPO.STATUS_SUCCESS_INT);
			}
		} else if (code.equals("222222")) {
			throw new FLException(150045, "转换款支付正在处理");
		} else {
			paytranPO.setStatus(PaytranPO.STATUS_FAIL_INT);
			paytranPO.setRstcode(code);
			paytranPO.setRstmsg(msg);
		}

	}

	public static String getSign(TreeMap<String, Object> params) {
		// 拼接参数，生成sign
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
			e.printStackTrace();
			return false;
		}

	}
}
