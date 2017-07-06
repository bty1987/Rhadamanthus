package com.fanglin.information.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.information.dao.AssassinDao;
import com.fanglin.information.po.AssassinPO;
import com.fanglin.information.service.AssassinService;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.HttpUtil;
import com.fanglin.core.interceptor.FLException;

@Service("assassinService")
@Transactional(readOnly=true)
public class AssassinServiceImpl implements AssassinService {
	
	@Autowired
	private AssassinDao assassinDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int PayPayment(PaymentVO payment, String userId) throws FLException{

		SystemConfigPO AssassinFIP = systemConfigDao.querySystemConfigByKey("platform");
		String platform = AssassinFIP.getValue();
		                                                                         
		SystemConfigPO communionServer = systemConfigDao.querySystemConfigByKey("communion");
		String addressAuthentication = communionServer.getValue();

		String str = String.format("%s/requestAuthCode.do?userId=%s&code=baitianyu&secret=0C7134AAC334FBD88AAC850E51F2CE69", addressAuthentication, userId);
		JSONObject result  = HttpUtil.httpGet(str);

		String authentication;
		
		if(result != null && result.containsKey("authenticationEncode")){
			authentication = result.get("authenticationEncode").toString();
		}else{
			throw new FLException(110010, "请求失败");
		}

		String payPayment = "%s/payPayment.do?payment.orderId=%s&payment.paymentType=%s&payment.des=%s&payment.type=%s&payment.cash=%s&authentication=%s";

		payPayment =  String.format(payPayment,platform,payment.getOrderId(),payment.getPaymentType(),payment.getDes(),payment.getType(),payment.getCash(),authentication);

		JSONObject results = HttpUtil.httpGet(payPayment);
		
		JSONObject params = results.getJSONObject("payment");
		int errorCode = results.getInteger("errorCode");
		AssassinPO assassinPO = new AssassinPO();
		//插入一条操作纪律
		if(errorCode == 0){
			assassinPO.setApi("payPayment.do");
			assassinPO.setParams(params.toJSONString());
			assassinPO.setServer("platform");
			assassinPO.setErrorcode(errorCode);
			assassinPO.setErrormes("");
		}else{
			String errormes = results.getString("errorMessage");
			assassinPO.setApi("payPayment.do");
			assassinPO.setParams(params.toJSONString());
			assassinPO.setServer("platform");
			assassinPO.setErrorcode(errorCode);
			assassinPO.setErrormes(errormes);
		}
		
		assassinDao.save(assassinPO);

		return errorCode;
	}

}
