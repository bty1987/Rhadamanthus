package com.fanglin.swiftpass.service.impl;

import java.util.Date;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.hutool.crypto.SmUtil;
import cn.hutool.crypto.asymmetric.KeyType;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.data.common.dao.CustypeDao;
import com.fanglin.data.po.CustypePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.bean.Wxpay;
import com.fanglin.payment.dao.PaytranDao;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.payment.service.impl.PaytranServiceImpl;
import com.fanglin.swiftpass.airpos.Airpos;
import com.fanglin.swiftpass.enums.ReqMethodEnum;
import com.fanglin.swiftpass.service.SwiftpassService;
import com.fanglin.swiftpass.utils.OpenSdk;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service("swiftpassService")
@Transactional(readOnly = true)
public class SwiftpassServiceImpl implements SwiftpassService {

	private static final Logger logger = LoggerFactory.getLogger(SwiftpassServiceImpl.class);

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
			logger.error("签名验证失败: args={}", args);
			throw new FLException(110008, "验证信息错误");
		}

		Wxpay wxpay = new Wxpay();

		paytranPO.setStatus(PaytranPO.STATUS_SUCCESS_INT);
		paytranPO.setMsgId(args.getString("orderNo"));
		paytranPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		paytranDao.update(paytranPO);
		paytranDao.flush();

		wxpay.setPaymentptid(paytranPO.getPtid());
		wxpay.setPaymentMoney((long) Arith.mul(Float.parseFloat(args.getString("totalAmount")), 1000));

		if (paytranPO.getPid() == 0) return;

		String payWay = args.getString("outType").toLowerCase();

		paytranService.makePayment(wxpay, payWay);
	}

	@Override
	public void registSwiftpass(String company) throws FLException {

		System.setProperty("https.protocols", "TLSv1.2");

		TreeMap<String, String> params = new TreeMap<String, String>();

		params.put("mchNo", "syfh-fljjzsyxgs-2"); // 商户号
		params.put("channelType", "SWIFT_PASS"); // 渠道类型
		params.put("signType", "RSA_1_256"); // 签名类型
		String prikey = SmUtil
				.sm2(null, "MFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAEY1xLZ2aiNPhJc1dUNyulgZ8SGQ2ZlQhHRbtkG0V5KC5mtayJ3P/22nQcqD+TWjuNQOmaQA8XRwrBPgv7ZBHSsQ==")
				.encryptHex(
						"MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7OAJj6KL3JkETns7yO5TYsZrgKNHARj0UolfT4eRwGXp1w2nTxqr6kDX4x+DVoLgPrwnje5s0LrqZmhc79K7aaRnpU7ND3cnOcSNgsKZ0ccfYecHicK7DdKBx6aYV0OSQwJ8cBJb2s1jYAnFDc6Pvwxc1I12gjItQPrkSm43CIi18rpZUA5MHqE627GClfklZ1X9JeIBw4RDprqUbWkuJnT+M27LQhlhPJZIYCXL93HZ8IDPgzH41dyt4zJmpYQrxum7k3nbrmiHT78eu9R5qc91/H4lHy5YbBmfuGNCRBxFJkkeg0VFZPWgNy4u5Jo+Ew/klXUFI3iBOKBVb2ds/AgMBAAECggEAL1RhhlBxonmRShyDxMk7P+zmcnTfUfRvzJ+eBHq+/XfzdYIJZvh6kQ2UF2iwdlFDNvPRVCkTe4W0ttA1v3qEGcMoQcxfLXEMa5w+jVsbOaTqGNfvJAfIprD9Ps8KpclBfzazAqpGX+fHNhSn/Z1mfF6dp1lheg0NyyOQNhwNIl6CX/2fD55yBw8ZvncQKWcsmrLHD9dC0x6+2TmPDuMhxHSUsZZsKb7UGmZpXbi0O+HqglU7MgSlH5xIU2Omh5sBXDWP898sU/G5TZLzlvot4wN3XMBGimlFcmk+g8rwUk6jW+gro5Uj6Kyh4oRtWQKajOfTPZX9uhm/19vLTGPQAQKBgQDwxbxOkx2AmAZD8zh6k5Ea/ZH0xkCxYyjc3hXf2BHPx0XxSoV9IAmcndPUaiSXemXGnqS8Zn8uC94nSuWOrZmwd5EK2Vp3msIz1YJ7m4/mxNOCo6/kO7tsM7mB+dS/kWt1D2SOPMdViPWle8lpIzpvjljXb8jCmJLXZjax6y4APwKBgQDHDzSNBMzUa+g9uunwMvDrlMOTX0Xb/vxIcRNjmkWhV+/TK4tGII6RBxEoStlU1FWVeF8yozhP+R7D6AAbP/0cELzLnAgC+dnTjUGk7D6y7mmuiftGcU3ZIMzSeCMfQaHzVZDeK0oFvH57AyOiz4a1Sw5MBkeOohY5rUtz4K1lAQKBgQCExcXt3pqqSytJVVqT3cRrCeHvBVSvfWsPQTj204Qe/FjJkrrCIWSrhS1HObEsB0cQnHNjoXIIxmqfaGHmqDzUX1sQjIOi6SimxNrLpyFXtLqek/1u8rGMHYny7v4vFdYYG4DsHwAdXwV3WCfdXpve4LSFOROQm+p99dO7kWEwqQKBgDueBjMl+OK13rx+OopB933W9CwzII0e9RgNJa1zCt+joqQwKmo6Xfh5kV3r7ONHJMq7XmegEsGA7wHlfgKrS3cYXDLu7EdX5TFC4SIvzydv2B76HFOgo5wgArgWWw6FbaefPOANPwIwzgCxk/6zALlTXVjPmKbTTKzBhhOSetwBAoGAF0XFPf23NZb1zzzUY6gryF5rOW/4qecy021wB+Sr6nVsMb+j64lA69U2hEtE6QrBGXZUbtlcSU3SQmu1pTmWF8TzD7hwKWtWji0RT6iSyfJUoq766WXLCV/MvPuwPo97DBhjy9JV9DUumio3/dCoyyTLf5ef3eqDI7rr6VFWmQE=",
						KeyType.PublicKey); // 收银台公钥+商户私钥
		params.put("privateKey", prikey); // 签名私钥
		params.put("publicKey", "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnmpxXjTJVhVXr2rPs9uBfWhAH9cLhBT+KJ5UiLUd0uxrPVec8WCQyZPQnnL0JOgQSBr0rWLcGVxGAdQUt748DfDGn6G/fhdFGJaHwCRfqxM7ymJ/xPm3UQNJeCF1qjDffdRilYwP4FSyiI+T8eAIeSABUTBDx7kkwvkbVi14znZMmDpLx6QNZlAclAZdHemqB/sSSsgfB7yCBJ4K0Fv4uK4qU3EQeOxhXLkitkhPm3uL5O3jgf89B1ZFpiCpI5qyysmPzJuZbvIBfa9OkVeHqINTPCWYCdx3ZD+k9+H5hoXKFDXddvxHptXrPU3APiBcDkgViYbfnFxWjYwaDQDkYQIDAQAB"); // 平台公钥

		logger.info("注册威富通商户: params={}", params);

		String response = OpenSdk.gateway("/api/openbill/updateMerchantChannelKey", ReqMethodEnum.POST, null, null, params);

		logger.info("注册威富通商户响应: response={}", response);

	}
}
