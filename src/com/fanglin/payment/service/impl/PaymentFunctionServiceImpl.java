package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.PaymentFunctionDao;
import com.fanglin.payment.po.PaymentFunctionPO;
import com.fanglin.payment.service.PaymentFunctionService;
import com.fanglin.payment.vo.PaymentFunctionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("paymentFunctionService")
@Transactional(readOnly = true)
public class PaymentFunctionServiceImpl implements PaymentFunctionService {

	@Autowired
	private PaymentFunctionDao paymentFunctionDao;

	@Override
	public List<PaymentFunctionVO> pagePaymentFunction(Paging paging, List<Filter> filters) {

		List<PaymentFunctionPO> paymentFunctionPOs = paymentFunctionDao.pagePaymentFunction(paging, filters);
		List<PaymentFunctionVO> paymentFunctionVOs = new ArrayList<PaymentFunctionVO>();

		for (PaymentFunctionPO paymentFunctionPO : paymentFunctionPOs) {

			PaymentFunctionVO paymentFunctionVO = new PaymentFunctionVO();
			BeanUtil.copyPropertie(paymentFunctionPO, paymentFunctionVO);

			paymentFunctionVOs.add(paymentFunctionVO);
		}

		return paymentFunctionVOs;
	}

	@Override
	public List<PaymentFunctionVO> queryPaymentFunction(PaymentFunctionVO paymentFunctionVO) {

		List<PaymentFunctionPO> paymentFunctionPOs = paymentFunctionDao.queryPaymentFunction(paymentFunctionVO.getType());
		List<PaymentFunctionVO> paymentFunctionVOs = new ArrayList<PaymentFunctionVO>();

		for(PaymentFunctionPO paymentFunctionPO : paymentFunctionPOs){

			paymentFunctionVO = new PaymentFunctionVO();
			BeanUtil.copyPropertie(paymentFunctionPO, paymentFunctionVO);

			paymentFunctionVOs.add(paymentFunctionVO);

		}

		return paymentFunctionVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addPaymentFunction(PaymentFunctionVO paymentFunctionVO) throws FLException {

		if (paymentFunctionDao.queryPaymentFunctionByName(paymentFunctionVO.getName()).size() > 0) {
			throw new FLException(150097, "款项功能已存在");
		}

		PaymentFunctionPO paymentFunctionPO = new PaymentFunctionPO();

		BeanUtil.copyPropertie(paymentFunctionVO, paymentFunctionPO);

		paymentFunctionDao.save(paymentFunctionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePaymentFunction(PaymentFunctionVO paymentFunctionVO) throws FLException {

		PaymentFunctionPO paymentFunctionPO = paymentFunctionDao.get(paymentFunctionVO.getPfid());

		if (paymentFunctionPO == null) {
			throw new FLException(150099, "款项功能不存在");
		}

		for (PaymentFunctionPO namePO : paymentFunctionDao.queryPaymentFunctionByName(paymentFunctionVO.getName())) {
			if (namePO.getPfid() != paymentFunctionVO.getPfid().longValue()) {
				throw new FLException(150097, "款项功能已存在");
			}
		}

		BeanUtil.copyPropertie(paymentFunctionVO, paymentFunctionPO, Arrays.asList("pfid"));

		paymentFunctionDao.update(paymentFunctionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deletePaymentFunction(PaymentFunctionVO paymentFunctionVO) throws FLException {

		if (paymentFunctionDao.countPaymentFunctionRightByPfid(paymentFunctionVO.getPfid()) > 0) {
			throw new FLException(150098, "款项功能已被引用,不可删除");
		}

		paymentFunctionDao.deleteById(paymentFunctionVO.getPfid());

		return 0;
	}

}
