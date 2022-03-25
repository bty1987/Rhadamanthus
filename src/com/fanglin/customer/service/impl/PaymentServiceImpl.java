package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.PaymentDao;
import com.fanglin.customer.service.PaymentService;
import com.fanglin.customer.vo.PaymentVO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.utils.Paging;

@Service("paymentOrderService")
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {

	@Autowired
	private PaymentDao paymentDao;

	@Override
	public void queryCusPayment(Paging paging, List<Filter> filters, PaymentVO paymentVO) {

		List<PaymentPO> paymentPOs = paymentDao.queryCusPayment(paging, filters, paymentVO.getOrderId());
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();

		if (paymentPOs.size() != 0 && paymentPOs != null) {

			for (PaymentPO paymentPO : paymentPOs) {

				paymentVO = new PaymentVO();

				paymentVO.setOrderId(paymentPO.getOrderId());
				paymentVO.setPaymentType(paymentPO.getPaymentType());
				paymentVO.setMoney(paymentPO.getRecharge());
				paymentVO.setType(paymentPO.getType());
				paymentVO.setCollectTime(paymentPO.getCreateTime());

				paymentVOs.add(paymentVO);
			}
		}

		paging.setData(paymentVOs);
	}

}
