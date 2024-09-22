package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
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
import com.fanglin.utils.BeanUtil;

@Service("paymentScaleService")
@Transactional(readOnly = true)
public class PaymentScaleServiceImpl implements PaymentScaleService {

	@Autowired
	private PaymentScaleDao paymentScaleDao;

	@Override
	public List<PaymentScaleVO> queryPaymentScale(PaymentScaleVO paymentScale, int company) throws FLException {

		List<PaymentScalePO> paymentScalePOS = paymentScaleDao.queryPaymentScaleByCid(company, paymentScale.getTypeness(), paymentScale.getAtttype());
		List<PaymentScaleVO> paymentScaleVOS = new ArrayList<PaymentScaleVO>();

		for (PaymentScalePO paymentScalePO : paymentScalePOS) {

			PaymentScaleVO paymentScaleVO = new PaymentScaleVO();

			BeanUtil.copyPropertie(paymentScalePO, paymentScaleVO, Arrays.asList("cid"));

			paymentScaleVO.setCid(CompanyServiceImpl.encode(paymentScalePO.getCid()));

			paymentScaleVOS.add(paymentScaleVO);
		}

		return paymentScaleVOS;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addPaymentScale(PaymentScaleVO paymentScale, int company) throws FLException {

		PaymentScalePO paymentScalePO = new PaymentScalePO();

		BeanUtil.copyPropertie(paymentScale, paymentScalePO, Arrays.asList("cid"));

		paymentScalePO.setCid(company);

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
