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

import java.util.TreeMap;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.postar.utils.HttpUtil;
import com.fanglin.postar.utils.RsaUtil;
import com.fanglin.postar.utils.ShaUtil;

public class Wxpay {

	public static void wxpay(String way, PaytranPO paytran) throws FLException {

	}

	public static void main(String[] args) throws Exception {

		String publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkPtGuXViIw/cSwc7ZJrDsCT3+hapJ3HEpYkxuxK324WuZefFhggHBNSBFqeDp0sMNMJuaAwVV6FCBOU9dGorfz9u0ANfi9UPQ/yJ6L8F1DZeeAdrr8aJLpMYWwieoycXXMXdCEC/L8iHy5eyHzIaF5gIPIxEjXc8vduQFdlL268uUJJ6dg16lG572n/w8q0UT3EWdE+qqewnk+56DPpVtVKyenlw+WOX8oC4fGVwymWoFjX/HqiAwwZuq7Uus30vSPUsBbSh460EinraF8uvFGFzkFMff9dw0oVFTVCfz3ogNT/Wvy2lWsXiW9R2roNCdpST7EOE9ZCJhha0ZDoxIwIDAQAB";

		TreeMap<String, Object> params = new TreeMap<String, Object>();

		params.put("agetId", "61000000103499");
		params.put("custId", "60000000929355");
		params.put("orderNo", "202205161601010001");
		params.put("txamt", "1");
		params.put("txamtOrder", "1");
		params.put("access", "3");
		params.put("payWay", "1");

		params.put("traType", "8");
		params.put("wxAppid", "wxccaeace32770eac2");
		params.put("openid", "oVf_s0MaST-HHpwItWCFYour-RmE");

		params.put("ip", "223.100.27.233");

		params.put("version", "1.0.0");

		StringBuilder sb = new StringBuilder();

		for (String key : params.keySet()) {
			sb.append(key).append("=").append(params.get(key)).append("&");
		}

		String res = sb.substring(0, sb.lastIndexOf("&"));
		String sha256 = ShaUtil.getSHA256(res);
		String sign = RsaUtil.encrypt(publicKey, sha256);

		params.put("sign", sign);

		String paramJson = JSONObject.toJSONString(params);

		System.out.println(paramJson);

		String url = "http://testterpay.postar.cn/yyfsevr/order/pay";

		String response = HttpUtil.postData(url, paramJson);

		System.out.println(response);

	}
}
