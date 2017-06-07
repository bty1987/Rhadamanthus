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
import com.fanglin.personel.po.UserPO;
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
		BeanUtil.copyProperties(serviceReceiptPO, serviceReceiptVO, Arrays.asList("collecter","confirmer"));
		
		if(serviceReceiptPO.getCollecter() != null){
			UserPO collectUserPO = serviceReceiptPO.getCollecter();
			
			serviceReceiptVO.setCollecterId(collectUserPO.getUserId());
			serviceReceiptVO.setCollecterName(collectUserPO.getUserName());
		}
		
		if(serviceReceiptPO.getConfirmer() != null){
			UserPO confirmUserPO = serviceReceiptPO.getConfirmer();
			
			serviceReceiptVO.setConfirmerId(confirmUserPO.getUserId());
			serviceReceiptVO.setConfirmerName(confirmUserPO.getUserName());
		}
		
		return serviceReceiptVO;
	}
	
}
