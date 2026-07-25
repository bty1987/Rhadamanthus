package com.fanglin.market.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.CustomerChanceService;
import com.fanglin.customer.service.CustomerSourceService;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.market.service.MarketCustomerBridgeService;
import com.fanglin.market.vo.MarketInboundVO;

@Service("marketCustomerBridgeService")
public class MarketCustomerBridgeServiceImpl implements MarketCustomerBridgeService {

	@Autowired
	private CustomerSourceService customerSourceService;

	@Autowired
	private CustomerChanceService customerChanceService;

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = Exception.class)
	public BridgeResult acceptMarketInbound(MarketInboundVO marketInboundVO, String userId, int company) throws FLException {

		BridgeResult result = new BridgeResult();

		CustomerChanceVO customerChanceVO = marketInboundVO.getCustomerChance();

		if (customerChanceVO != null) {

			CustomerChanceVO accepted = customerChanceService.addCustomerChance(customerChanceVO, resolveUserId(customerChanceVO, userId), company);

			if (accepted != null) {
				customerChanceVO = accepted;
			}

			result.setAccepted(true);
			if (customerChanceVO.getSource() != null) result.setCsid(customerChanceVO.getSource().getCsid());
			result.setCcid(customerChanceVO.getCcid());
			result.setOrderId(customerChanceVO.getOrderId());

			return result;
		}

		CustomerSourceVO customerSourceVO = marketInboundVO.getCustomerSource();

		if (customerSourceVO != null) {

			customerSourceService.addCustomerSource(customerSourceVO, userId, company);

			result.setAccepted(true);
			result.setCsid(customerSourceVO.getCsid());

			return result;
		}

		result.setAccepted(false);
		result.setMessage("入站记录缺少Customer承接参数");

		return result;
	}

	private String resolveUserId(CustomerChanceVO customerChanceVO, String userId) {

		if (customerChanceVO.getSource() != null && customerChanceVO.getSource().getCreater() != null && customerChanceVO.getSource().getCreater().getUserId() != null) {
			return customerChanceVO.getSource().getCreater().getUserId();
		}

		return userId;
	}

}
