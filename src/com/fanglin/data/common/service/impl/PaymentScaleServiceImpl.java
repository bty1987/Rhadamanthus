package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.PaymentScaleDao;
import com.fanglin.data.common.service.PaymentScaleService;
import com.fanglin.data.common.vo.PaymentScaleVO;
import com.fanglin.data.po.PaymentScalePO;
import com.fanglin.system.service.impl.CompanyServiceImpl;

@Service("paymentScaleService")
@Transactional(readOnly = true)
public class PaymentScaleServiceImpl implements PaymentScaleService {

	@Autowired
	private PaymentScaleDao paymentScaleDao;

	@Override
	public List<PaymentScaleVO> queryPaymentScale(PaymentScaleVO paymentScale, int company) throws FLException {

		List<PaymentScalePO> paymentScalePOS = paymentScaleDao.queryPaymentScaleByCid(company);
		List<PaymentScaleVO> paymentScaleVOS = new ArrayList<PaymentScaleVO>();

		for (PaymentScalePO paymentScalePO : paymentScalePOS) {

			PaymentScaleVO paymentScaleVO = new PaymentScaleVO();
			paymentScaleVO.setCid(CompanyServiceImpl.encode(paymentScalePO.getCid()));
			paymentScaleVO.setName(paymentScalePO.getName());
			paymentScaleVO.setPsid(paymentScalePO.getPsid());
			paymentScaleVO.setComment(paymentScalePO.getComment());
			paymentScaleVO.setStatus(paymentScalePO.getStatus());

			paymentScaleVOS.add(paymentScaleVO);
		}

		return paymentScaleVOS;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addPaymentScale(PaymentScaleVO paymentScale, int company) throws FLException {

		PaymentScalePO paymentScalePO = new PaymentScalePO();

		paymentScalePO.setCid(company);
		paymentScalePO.setName(paymentScale.getName());
		paymentScalePO.setStatus(PaymentScalePO.STATUS_ENABLE_INT);
		paymentScalePO.setComment(paymentScale.getComment());

		paymentScaleDao.save(paymentScalePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updatePaymentScaleForStatus(PaymentScaleVO paymentScale) throws FLException {

		PaymentScalePO paymentScalePO = paymentScaleDao.get(paymentScale.getPsid());

		if (paymentScalePO == null) {
			new FLException(130114, "付款比例不存在");
		}

		paymentScalePO.setStatus(paymentScale.getStatus());

		paymentScaleDao.update(paymentScalePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deletePaymentScale(PaymentScaleVO paymentScale) {

		PaymentScalePO paymentScalePO = paymentScaleDao.get(paymentScale.getPsid());

		if (paymentScalePO == null) {
			new FLException(130114, "付款比例不存在");
		}

		paymentScaleDao.delete(paymentScalePO);
	}

}
