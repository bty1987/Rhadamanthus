package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.PaymentTypeDao;
import com.fanglin.communion.po.PaymentTypePO;
import com.fanglin.communion.service.PaymentTypeService;
import com.fanglin.communion.vo.PaymentTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("paymentTypeService")
@Transactional(readOnly = true)
public class PaymentTypeServiceImpl implements PaymentTypeService {

	@Autowired
	private PaymentTypeDao paymentTypeDao;

	@Override
	public void pagePaymentType(Paging paging, List<Filter> filters) {

		List<PaymentTypePO> paymentTypePOs = paymentTypeDao.pagePaymentType(paging, filters);
		List<PaymentTypeVO> paymentTypeVOs = new ArrayList<PaymentTypeVO>();

		for (PaymentTypePO paymentTypePO : paymentTypePOs) {

			PaymentTypeVO paymentTypeVO = new PaymentTypeVO();

			BeanUtil.copyProperties(paymentTypePO, paymentTypeVO);

			paymentTypeVOs.add(paymentTypeVO);
		}

		paging.setData(paymentTypeVOs);

	}

	@Override
	public List<PaymentTypeVO> queryPaymentType(PaymentTypeVO paymentType) {

		List<PaymentTypePO> paymentTypePOs = paymentTypeDao.queryPaymentType(paymentType.getType(), paymentType.getPaytype(), paymentType.getBustype(), paymentType.getAtttype());
		List<PaymentTypeVO> paymentTypeVOs = new ArrayList<PaymentTypeVO>();

		for (PaymentTypePO paymentTypePO : paymentTypePOs) {

			PaymentTypeVO paymentTypeVO = new PaymentTypeVO();

			BeanUtil.copyProperties(paymentTypePO, paymentTypeVO);

			paymentTypeVOs.add(paymentTypeVO);
		}

		return paymentTypeVOs;
	}

	@Override
	public PaymentTypeVO queryPaymentTypeByPtid(PaymentTypeVO paymentType) throws FLException {

		PaymentTypePO paymentTypePO = paymentTypeDao.queryPaymentTypeByPtid(paymentType.getPtid());
		PaymentTypeVO paymentTypeVO = new PaymentTypeVO();

		if (paymentTypePO == null) {
			throw new FLException(130091, "款项类型不存在");
		}

		BeanUtil.copyProperties(paymentTypePO, paymentTypeVO);

		return paymentTypeVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addPaymentType(PaymentTypeVO paymentType) throws FLException {

		PaymentTypePO paymentTypePO = new PaymentTypePO();
		BeanUtil.copyProperties(paymentType, paymentTypePO);

		paymentTypeDao.save(paymentTypePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updatePaymentType(PaymentTypeVO paymentType) throws FLException {

		PaymentTypePO paymentTypePO = paymentTypeDao.get(paymentType.getPtid());

		if (paymentTypePO == null) {
			throw new FLException(130091, "款项类型不存在");
		}

		paymentTypePO.setTaxrate(paymentType.getTaxrate());
		paymentTypePO.setKino(paymentType.getKino());
		paymentTypePO.setKiname(paymentType.getKiname());
		paymentTypePO.setKibalance(paymentType.getKibalance());
		paymentTypePO.setBillType(paymentType.getBillType());

		paymentTypeDao.update(paymentTypePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updatePaymentTypeForStatus(PaymentTypeVO paymentType) throws FLException {

		PaymentTypePO paymentTypePO = paymentTypeDao.get(paymentType.getPtid());

		if (paymentTypePO == null) {
			throw new FLException(130091, "款项类型不存在");
		}

		paymentTypePO.setStatus(paymentType.getStatus());

		paymentTypeDao.update(paymentTypePO);

	}

}
