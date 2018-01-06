package com.fanglin.payment.service.impl;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.dao.ServiceReceiptDao;
import com.fanglin.payment.po.ServiceReceiptPO;
import com.fanglin.payment.service.ServiceReceiptService;
import com.fanglin.payment.vo.ServiceReceiptVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("serviceReceiptService")
@Transactional(readOnly=true)
public class ServiceReceiptServiceImpl implements ServiceReceiptService{
	
	@Autowired
	private ServiceReceiptDao serviceReceiptDao;
	
	@Override
	public ServiceReceiptVO queryServiceReceiptBySrId(ServiceReceiptVO serviceReceiptVO) throws FLException {
		
		ServiceReceiptPO serviceReceiptPO = serviceReceiptDao.get(serviceReceiptVO.getSrId());
		
		if(serviceReceiptPO == null){
			throw new FLException(150026, "收据不存在");
		}
		serviceReceiptVO = new ServiceReceiptVO(new UserBaseVO(),new UserBaseVO());
		BeanUtil.copyProperties(serviceReceiptPO, serviceReceiptVO, Arrays.asList("collecter","confirmer"));
		
		if(serviceReceiptPO.getCollecter() != null){
			serviceReceiptVO.setCollecter(new UserBaseVO());
			BeanUtil.copyProperties(serviceReceiptPO.getCollecter(), serviceReceiptVO.getCollecter(), Arrays.asList("dept","duty"));
		}
		
		if(serviceReceiptPO.getConfirmer() != null){
			serviceReceiptVO.setConfirmer(new UserBaseVO());
			BeanUtil.copyProperties(serviceReceiptPO.getConfirmer(), serviceReceiptVO.getConfirmer(), Arrays.asList("dept","duty"));
		}
		
		return serviceReceiptVO;
	}
	
}
