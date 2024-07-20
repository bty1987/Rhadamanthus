package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.ActivityVO;
import com.fanglin.payment.dao.PaymentActivityDao;
import com.fanglin.payment.po.PaymentActivityPO;
import com.fanglin.payment.service.PaymentActivityService;
import com.fanglin.payment.vo.PaymentActivityVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Paging;

@Service("paymentActivityService")
@Transactional(readOnly = true)
public class PaymentActivityServiceImpl implements PaymentActivityService {

	@Autowired
	private PaymentActivityDao paymentActivityDao;

	@Override
	public void pagePaymentActivity(Paging paging, List<Filter> filters) {

		List<PaymentActivityPO> paymentActivityPOs = paymentActivityDao.pagePaymentActivity(paging, filters);
		List<PaymentActivityVO> paymentActivityVOs = new ArrayList<PaymentActivityVO>();

		for (PaymentActivityPO paymentActivityPO : paymentActivityPOs) {

			PaymentActivityVO paymentActivityVO = new PaymentActivityVO(new ActivityVO(new UserBaseVO()));

			paymentActivityVOs.add(paymentActivityPO.ptv(paymentActivityVO));

		}

		paging.setData(paymentActivityVOs);

	}

	@Override
	public int amountPaymentActivity(PaymentActivityVO paymentActivity) {

		int amount = paymentActivityDao.amountPaymentActivity(paymentActivity.getOrderId(), paymentActivity.getType());

		return amount;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updatePaymentActivity(PaymentActivityVO paymentActivity) {

		long aid = paymentActivity.getActivity().getAid();

		paymentActivityDao.updatePaymentActivity(aid, paymentActivity.getComment());

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deletePaymentActivity(PaymentActivityVO paymentActivity) throws FLException {

		PaymentActivityPO paymentActivityPO = paymentActivityDao.get(paymentActivity.getPaid());

		if (paymentActivityPO == null) {
			throw new FLException(00000, "款项活动不存在");
		}

		paymentActivityDao.delete(paymentActivityPO);

	}
}
