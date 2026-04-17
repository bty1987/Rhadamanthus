package com.fanglin.yspay.airpos;

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

import com.alibaba.fastjson.JSONObject;
import com.fanglin.data.po.CustypePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.utils.Arith;
import com.newland.nlpush.sdk.java.NLApiFactory;
import com.newland.nlpush.sdk.java.NLTransApi;
import com.newland.nlpush.sdk.java.bean.BeanQuery;
import com.newland.nlpush.sdk.java.bean.BindingDevice;

public class Airpos {

	public static void regist() throws FLException {

		NLTransApi nlTransApi = NLApiFactory.createNLTransApi();

		BindingDevice bindingDevice;

		try {
			bindingDevice = nlTransApi.bindDevice();
		} catch (Exception e) {
			System.out.println(e.getMessage());
			throw new FLException(150044, "推送失败");
		}
		String authCode = bindingDevice.authCode;
		String targetSn = bindingDevice.targetSn;

		System.out.println(authCode);
		System.out.println(targetSn);
	}

	public static void pospay(String way, PaytranPO paytranPO, CustypePO custypePO) throws FLException {

		NLTransApi nlTransApi = NLApiFactory.createNLTransApi();

		try {

			String outOrderNo = String.valueOf(new Date().getTime());

			String msgId = nlTransApi.transCollection(way, outOrderNo, String.valueOf(Arith.div(paytranPO.getMoney(), 10000l))).execute(paytranPO.getSn());

			paytranPO.setMsgId(msgId);
			paytranPO.setOutOrderNo(outOrderNo);
		} catch (Exception e) {
			System.out.println(e.getMessage());
			paytranPO.setStatus(PaytranPO.STATUS_FAIL_INT);
			paytranPO.setRstcode("150044");
			paytranPO.setRstmsg("推送失败");
		}
	}

	public static void check(PaytranPO paytranPO, CustypePO custypePO) throws FLException {

		NLTransApi nlTransApi = NLApiFactory.createNLTransApi();

		try {
			BeanQuery query = nlTransApi.msgQuery(paytranPO.getSn(), paytranPO.getMsgId());

			System.out.println(query.state);
			System.out.println(query.handlemsg);

			if ("02".equals(query.state)) {
				JSONObject response = JSONObject.parseObject(query.handlemsg);

				System.out.println(response.getString("channelId"));
				System.out.println(response.getString("amount"));
				System.out.println(response.getString("message"));

				String code = response.getString("responseCode");

				if ("00".equals(code)) {
					paytranPO.setStatus(PaytranPO.STATUS_SUCCESS_INT);
				} else {
					paytranPO.setStatus(PaytranPO.STATUS_FAIL_INT);
					paytranPO.setRstcode(response.getString("responseCode"));
					paytranPO.setRstmsg(response.getString("message"));
				}

			} else if ("03".equals(query.state)) {
				paytranPO.setStatus(PaytranPO.STATUS_FAIL_INT);
				paytranPO.setRstcode("03");
				paytranPO.setRstmsg("转换款不存在");
			} else if ("01".equals(query.state)) {
				throw new FLException(150045, "转换款支付正在处理");
			} else if ("04".equals(query.state)) {
				throw new FLException(150045, "转换款支付正在处理");
			}
		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			System.out.println(e.getMessage());
			throw new FLException(150044, "推送失败");
		}
	}

	public static void main(String[] args) throws Exception {

		Airpos.regist();

		// NLTransApi nlTransApi = NLApiFactory.createNLTransApi();

		// nlTransApi.transCollection("wxpay", "1912230010", "1").execute("850160353328963693499026456");

		// BeanQuery query = nlTransApi.msgQuery("728066468340929763980619151", "32703320330197525367200393673911");

		// System.out.println(query.state);
		// System.out.println(query.handlemsg);

	}
}
