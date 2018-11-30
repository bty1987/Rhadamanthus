package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.data.common.dao.PaymentScaleDao;
import com.fanglin.data.common.service.PaymentScaleService;
import com.fanglin.data.common.vo.PaymentScaleVO;
import com.fanglin.data.po.PaymentScalePO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.SystemConfig;

@Service("paymentScaleService")
@Transactional(readOnly = true)
public class PaymentScaleServiceImpl implements PaymentScaleService {

	@Autowired PaymentScaleDao PaymentScaledao;
	
	@Autowired CompanyDao Companydao;

	@Override
	public List<PaymentScaleVO> queryPaymentScaleByCid(PaymentScaleVO paymentScale) throws FLException {
		
		String company;
		int companys;
		
		try {
			companys = FormatUtil.decodeCompany(AESHelper.decryptString(paymentScale.getCid(), SystemConfig.getString("encryptKey")));
		} catch (Exception e) {
			throw new FLException(230015 , "公司不存在");
		}
		
		List<PaymentScalePO>  paymentScalePOS =	PaymentScaledao.queryPaymentScaleByCid(companys);
		List<PaymentScaleVO> paymentScaleVOS = new ArrayList<PaymentScaleVO>();
		
		for (PaymentScalePO paymentScalePO : paymentScalePOS) {
			
		  	try {
		  		company = AESHelper.encryptToString(FormatUtil.encodeCompany(paymentScalePO.getCid()),SystemConfig.getString("encryptKey"));
		    } catch (Exception e) {
		    	throw new FLException(230015 , "公司不存在");
		    }
			 PaymentScaleVO paymentScaleVO = new  PaymentScaleVO();
			 paymentScaleVO.setCid(company);
			 paymentScaleVO.setName(paymentScalePO.getName());
			 paymentScaleVO.setPsid(paymentScalePO.getPsid());
			 paymentScaleVO.setComment(paymentScalePO.getComment());
			 
			 paymentScaleVOS.add(paymentScaleVO);
			
		}
		return paymentScaleVOS;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addPaymentScale(PaymentScaleVO paymentScale) throws FLException {
			int company;
		
			PaymentScalePO paymentScalePO = new  PaymentScalePO();
		
			 try { 
				 	company = FormatUtil.decodeCompany(AESHelper.decryptString(paymentScale.getCid(), SystemConfig.getString("encryptKey")));
			 } catch (Exception e) {
				 throw new FLException(230015 , "公司不存在");
			 }
			 
			 paymentScalePO.setCid(company);
			 paymentScalePO.setName(paymentScale.getName());
			 paymentScalePO.setComment(paymentScale.getComment());
		
			 PaymentScaledao.save(paymentScalePO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void  deletePaymentScale(PaymentScaleVO paymentScale) {
		
		PaymentScalePO paymentScalePO = PaymentScaledao.get(paymentScale.getPsid());
		
		PaymentScaledao.delete(paymentScalePO);
	}

}
