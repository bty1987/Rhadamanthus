package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.PaymentTypeDao;
import com.fanglin.communion.po.PaymentTypePO;
import com.fanglin.data.common.dao.PaymentScaleItemDao;
import com.fanglin.data.common.service.PaymentScaleItemService;
import com.fanglin.data.common.vo.PaymentScaleItemVO;
import com.fanglin.data.po.PaymentScaleItemPO;
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
			
			BeanUtil.copyProperties(paymentScaleItemPO, paymentScaleItemVO);
			
			paymentScaleItemVOs.add(paymentScaleItemVO);
			
		}
		return paymentScaleItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addPaymentScaleItem(PaymentScaleItemVO paymentScaleitem) {
		
		PaymentScaleItemPO paymentScaleItemPO = new  PaymentScaleItemPO();
		
		PaymentTypePO paymentTypePO = paymentTypeDao.get(paymentScaleitem.getPtid());
		
		BeanUtil.copyProperties(paymentScaleitem, paymentScaleItemPO);
		paymentScaleItemPO.setName(paymentTypePO.getName());
		
		paymentScaleItemDao.save(paymentScaleItemPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deletePaymentScaleItem(PaymentScaleItemVO paymentScaleitem) {
		
		PaymentScaleItemPO paymentScaleItemPO = paymentScaleItemDao.get(paymentScaleitem.getPsiid());
		
		paymentScaleItemDao.delete(paymentScaleItemPO);
		
	}

}
