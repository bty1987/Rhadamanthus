package com.fanglin.swiftpass.service.impl;

import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.communion.dao.CustypeDao;
import com.fanglin.communion.po.CustypePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.bean.Wxpay;
import com.fanglin.payment.dao.PaytranDao;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.payment.service.impl.PaytranServiceImpl;
import com.fanglin.swiftpass.airpos.Airpos;
import com.fanglin.swiftpass.service.SwiftpassService;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;

@Service("swiftpassService")
@Transactional(readOnly = true)
public class SwiftpassServiceImpl implements SwiftpassService {

	@Autowired
	private PaytranServiceImpl paytranService;

	@Autowired
	private PaytranDao paytranDao;

	@Autowired
	private CustypeDao custypeDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void callbackSwiftpass(JSONObject args) throws FLException {

		String sign = "";

		TreeMap<String, Object> params = new TreeMap<String, Object>();

		for (String key : args.keySet()) {
			if ("sign".equals(key)) {
				sign = args.getString(key);
				continue;
			}

			params.put(key, args.get(key));
		}

		String threeOrderNo = args.getString("appOrderNo");

		String regex = ".*[a-zA-Z]+.*";
		Matcher matcher = Pattern.compile(regex).matcher(threeOrderNo);

		PaytranPO paytranPO = null;

		if (!matcher.matches()) {

			String ptidStr = threeOrderNo.substring(8);

			Long ptid = Long.valueOf(ptidStr.substring(0, Arith.sub(ptidStr.length(), 4)));

			paytranPO = paytranDao.get(ptid);

			if (paytranPO.getStatus() != PaytranPO.STATUS_INIT_INT) {
				throw new FLException(150047, "转换款支付不可操作");
			}

		}

		if (paytranPO == null) {
			throw new FLException(150043, "转换款不存在");
		}

		CustypePO custypePO = custypeDao.get(paytranPO.getCtid());

		if (custypePO == null) {
			throw new FLException(130105, "商户不存在");
		}

		SystemConfigPO config = systemConfigDao.querySystemConfig(custypePO.getNo());

		if (config == null || "".equals(config.getValue())) {
			throw new FLException(150053, "支付平台异常");
		}

		if (!Airpos.decryptSign(params, sign, config.getValue())) {
			System.out.println(args);
			throw new FLException(110008, "验证信息错误");
		}

		Wxpay wxpay = new Wxpay();

		paytranPO.setStatus(PaytranPO.STATUS_SUCCESS_INT);
		paytranPO.setMsgId(args.getString("orderNo"));

		paytranDao.update(paytranPO);
		paytranDao.flush();

		wxpay.setPaymentptid(paytranPO.getPtid());
		wxpay.setPaymentMoney((long) Arith.mul(Float.parseFloat(args.getString("totalAmount")), 1000));

		if (paytranPO.getPid() == 0) return;

		paytranService.makePayment(wxpay, "wechat");

	}
}
