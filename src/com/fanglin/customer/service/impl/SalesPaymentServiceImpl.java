package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.SalesPaymentDao;
import com.fanglin.customer.service.SalesPaymentService;
import com.fanglin.customer.vo.SalesPaymentVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Paging;

@Service("salesPaymentOrderService")
@Transactional(readOnly = true)
public class SalesPaymentServiceImpl implements SalesPaymentService {

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public void queryCusSalesPayment(Paging paging, List<Filter> filters, SalesPaymentVO salesPaymentVO) {

		String orderId = salesPaymentVO.getOrderId();
		String platform = "";

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		String grade = decorationPO.getGrade();
		int company = decorationPO.getCompany();

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig(String.format("PAYMENT_PLATFORM_WXPAY_PATH_%s_%s_STR", PaytranPO.ATTTYPE_MATERIAL_INT, grade), company);

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig(String.format("PAYMENT_PLATFORM_WXPAY_PATH_%s_STR", grade), company);
		}

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_WXPAY_PATH_STR", company);
		}

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", company);
		}

		if (systemConfigPO != null) platform = systemConfigPO.getValue();

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.queryCusSalesPayment(paging, filters, salesPaymentVO.getOrderId());
		List<SalesPaymentVO> salesPaymentVOs = new ArrayList<SalesPaymentVO>();

		if (salesPaymentPOs.size() != 0 && salesPaymentPOs != null) {

			for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {

				salesPaymentVO = new SalesPaymentVO();

				salesPaymentVO.setSpid(salesPaymentPO.getSpid());
				salesPaymentVO.setOrderId(salesPaymentPO.getSales().getOrderId());
				salesPaymentVO.setMoney(salesPaymentPO.getReferMoney());
				salesPaymentVO.setStatus(salesPaymentPO.getStatus());
				salesPaymentVO.setPaymentType(salesPaymentPO.getType());
				salesPaymentVO.setBrand(salesPaymentPO.getBrand());

				if (salesPaymentPO.getSalesReceipt() != null) {
					salesPaymentVO.setCollectTime(salesPaymentPO.getSalesReceipt().getCollectTime());
				}

				salesPaymentVO.setPlatform(platform);

				salesPaymentVOs.add(salesPaymentVO);
			}
		}

		paging.setData(salesPaymentVOs);
	}

	@Override
	public Long amountCusSalesPayment(SalesPaymentVO salesPaymentVO) {

		long total = salesPaymentDao.amountCusSalesPayment(salesPaymentVO.getOrderId());

		return total;
	}

}
