package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.common.dao.PaymentScaleItemDao;
import com.fanglin.data.common.dao.PaymentTypeDao;
import com.fanglin.data.common.service.PaymentScaleItemService;
import com.fanglin.data.common.vo.PaymentScaleItemVO;
import com.fanglin.data.common.vo.PaymentScaleVO;
import com.fanglin.data.po.PaymentScaleItemPO;
import com.fanglin.data.po.PaymentScalePO;
import com.fanglin.data.po.PaymentTypePO;
import com.fanglin.utils.BeanUtil;

@Service("paymentScaleItemServic")
@Transactional(readOnly = true)
public class PaymentScaleItemServiceImpl implements PaymentScaleItemService {

	@Autowired
	private PaymentScaleItemDao paymentScaleItemDao;

	@Autowired
	private PaymentTypeDao paymentTypeDao;

	@Override
	public List<PaymentScaleItemVO> queryPaymentScaleItemByPsid(PaymentScaleItemVO paymentScaleitem) {

		List<PaymentScaleItemPO> paymentScaleitemPOs = paymentScaleItemDao.queryPaymentScaleItemByPsid(paymentScaleitem.getPsid());
		List<PaymentScaleItemVO> paymentScaleItemVOs = new ArrayList<PaymentScaleItemVO>();

		for (PaymentScaleItemPO paymentScaleItemPO : paymentScaleitemPOs) {

			PaymentScaleItemVO paymentScaleItemVO = new PaymentScaleItemVO();

			BeanUtil.copyProperties(paymentScaleItemPO, paymentScaleItemVO, Arrays.asList("paymentScale"));

			paymentScaleItemVO.setPsid(paymentScaleItemPO.getPaymentScale().getPsid());

			paymentScaleItemVOs.add(paymentScaleItemVO);

		}
		return paymentScaleItemVOs;
	}

	@Override
	public List<PaymentScaleItemVO> fetchPaymentScaleItem(PaymentScaleVO paymentScaleVO, PaymentScaleItemVO paymentScaleItemVO) {

		List<PaymentScaleItemPO> paymentScaleitemPOs = paymentScaleItemDao.fetchPaymentScaleItem(paymentScaleItemVO.getPtid(), paymentScaleVO.getTypeness(), paymentScaleVO.getAtttype(), paymentScaleVO.getDbid());
		List<PaymentScaleItemVO> paymentScaleItemVOs = new ArrayList<PaymentScaleItemVO>();

		for (PaymentScaleItemPO paymentScaleItemPO : paymentScaleitemPOs) {

			paymentScaleItemVO = new PaymentScaleItemVO(new PaymentScaleVO());

			BeanUtil.copyProperties(paymentScaleItemPO, paymentScaleItemVO, Arrays.asList("paymentScale"));
			BeanUtil.copyPropertie(paymentScaleItemPO.getPaymentScale(), paymentScaleItemVO.getPaymentScale(), Arrays.asList("cid"));

			paymentScaleItemVO.setPsid(paymentScaleItemPO.getPaymentScale().getPsid());

			paymentScaleItemVOs.add(paymentScaleItemVO);

		}
		return paymentScaleItemVOs;
	}

	@Override
	public PaymentScaleItemVO queryPaymentScaleItem(PaymentScaleVO paymentScaleVO, PaymentScaleItemVO paymentScaleItemVO) {

		PaymentScaleItemPO paymentScaleItemPO = paymentScaleItemDao.queryPaymentScaleItem(paymentScaleItemVO.getPtid(), paymentScaleVO.getTypeness(), paymentScaleVO.getAtttype(), paymentScaleVO.getDbid());

		if (paymentScaleItemPO == null) return paymentScaleItemVO;

		BeanUtil.copyProperties(paymentScaleItemPO, paymentScaleItemVO, Arrays.asList("paymentScale"));

		paymentScaleItemVO.setPsid(paymentScaleItemPO.getPaymentScale().getPsid());

		return paymentScaleItemVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addPaymentScaleItem(PaymentScaleItemVO paymentScaleItemVO) {

		PaymentScaleItemPO paymentScaleItemPO = new PaymentScaleItemPO();

		PaymentTypePO paymentTypePO = paymentTypeDao.get(paymentScaleItemVO.getPtid());

		BeanUtil.copyProperties(paymentScaleItemVO, paymentScaleItemPO, Arrays.asList("paymentScale"));

		paymentScaleItemPO.setName(paymentTypePO.getName());
		paymentScaleItemPO.setPaymentScale(new PaymentScalePO(paymentScaleItemVO.getPsid()));

		paymentScaleItemDao.save(paymentScaleItemPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deletePaymentScaleItem(PaymentScaleItemVO paymentScaleitem) {

		PaymentScaleItemPO paymentScaleItemPO = paymentScaleItemDao.get(paymentScaleitem.getPsiid());

		paymentScaleItemDao.delete(paymentScaleItemPO);

	}

}
