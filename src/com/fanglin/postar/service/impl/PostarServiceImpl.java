package com.fanglin.postar.service.impl;

import java.util.Date;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.bean.Wxpay;
import com.fanglin.payment.dao.PaytranDao;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.payment.service.impl.PaytranServiceImpl;
import com.fanglin.postar.airpos.Airpos;
import com.fanglin.postar.service.PostarService;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;

@Service("postarService")
@Transactional(readOnly = true)
public class PostarServiceImpl implements PostarService {

	@Autowired
	private PaytranServiceImpl paytranService;

	@Autowired
	private PaytranDao paytranDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void callbackPostar(JSONObject args) throws FLException {

		String sign = "";

		TreeMap<String, Object> params = new TreeMap<String, Object>();

		for (String key : args.keySet()) {
			if ("sign".equals(key)) {
				sign = args.getString(key);
				continue;
			}

			if (Character.getType(key.charAt(0)) == Character.LOWERCASE_LETTER) continue;

			params.put(key, args.get(key));
		}

		if (!Airpos.decryptSign(params, sign)) {
			System.out.println(args);
			throw new FLException(110008, "验证信息错误");
		}

		Wxpay wxpay = new Wxpay();

		String threeOrderNo = args.getString("THREE_ORDER_NO");

		String regex = ".*[a-zA-Z]+.*";
		Matcher matcher = Pattern.compile(regex).matcher(threeOrderNo);

		if (!matcher.matches()) {

			String ptidStr = threeOrderNo.substring(8);

			Long ptid = Long.valueOf(ptidStr.substring(0, Arith.sub(ptidStr.length(), 4)));

			PaytranPO paytranPO = paytranDao.get(ptid);

			if (paytranPO.getStatus() != PaytranPO.STATUS_INIT_INT) {
				throw new FLException(150047, "转换款支付不可操作");
			}

			paytranPO.setStatus(PaytranPO.STATUS_SUCCESS_INT);
			paytranPO.setMsgId(args.getString("ORDER_NO"));
			paytranPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

			paytranDao.update(paytranPO);
			paytranDao.flush();

			wxpay.setPaymentptid(ptid);
			wxpay.setPaymentMoney(Arith.mul(Long.parseLong(args.getString("TXAMT")), 10000));

			if (paytranPO.getPid() == 0) return;

			paytranService.makePayment(wxpay, "wechat");
		}

	}
}
