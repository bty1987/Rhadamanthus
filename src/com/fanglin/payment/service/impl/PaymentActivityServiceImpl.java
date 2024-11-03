package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.vo.ActivityVO;
import com.fanglin.payment.dao.PaymentActivityDao;
import com.fanglin.payment.po.PaymentActivityPO;
import com.fanglin.payment.service.PaymentActivityService;
import com.fanglin.payment.vo.PaymentActivityVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesActivityDao;
import com.fanglin.utils.Arith;
import com.fanglin.utils.Paging;

@Service("paymentActivityService")
@Transactional(readOnly = true)
public class PaymentActivityServiceImpl implements PaymentActivityService {

	@Autowired
	private PaymentActivityDao paymentActivityDao;

	@Autowired
	private ActivityDao activityDao;

	@Autowired
	private SalesActivityDao salesActivityDao;

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
	public int checkPaymentActivityForDecoration(PaymentActivityVO paymentActivityVO) throws FLException {

		String orderId = paymentActivityVO.getOrderId();

		long payment = paymentActivityDao.amountPaymentActivity(orderId, PaymentActivityPO.TYPE_DECORATION_INT);
		long salesActivity = salesActivityDao.amountSalesActivityForActivity(orderId);

		if (salesActivity > payment) {
			throw new FLException(160037, "积分不足");
		}

		return 0;

	}

	@Override
	public int checkPaymentActivityForSales(PaymentActivityVO paymentActivityVO) throws FLException {

		String orderId = paymentActivityVO.getOrderId();

		long payment = paymentActivityDao.amountPaymentActivity(orderId, PaymentActivityPO.TYPE_SALES_INT);

		long oldPayment = salesActivityDao.amountSalesActivityForPayment(orderId);

		long salesActivity = salesActivityDao.amountSalesActivityForActivity(orderId);

		long amount = Arith.add(payment, oldPayment);

		if (salesActivity > amount) {
			throw new FLException(160037, "积分不足");
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updatePaymentActivity(PaymentActivityVO paymentActivityVO) throws FLException {

		PaymentActivityPO paymentActivityPO = paymentActivityDao.get(paymentActivityVO.getPaid());

		if (paymentActivityPO == null) {
			throw new FLException(150081, "款项活动不存在");
		}

		ActivityPO activityPO = activityDao.get(paymentActivityVO.getActivity().getAid());

		if (activityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}

		// TODO check amount for decoration activity item
		// TODO check amount for sales activity item

		paymentActivityPO.setActivity(activityPO);
		paymentActivityPO.setMultiple(activityPO.getMultiple());

		paymentActivityPO.setComment(paymentActivityVO.getComment());

		paymentActivityDao.update(paymentActivityPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deletePaymentActivity(PaymentActivityVO paymentActivity) throws FLException {

		PaymentActivityPO paymentActivityPO = paymentActivityDao.get(paymentActivity.getPaid());

		if (paymentActivityPO == null) {
			throw new FLException(150081, "款项活动不存在");
		}

		paymentActivityDao.delete(paymentActivityPO);
	}
}
