/**
 * @File Name		: SecretServiceImpl.java
 * @Package   	: com.fanglin.secret.service.impl
 * @Version		: 1.0
 * @Date			: 2017-5-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.secret.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.secret.service.SecretService;

@Service("secretService")
@Transactional(readOnly=true)
public class SecretServiceImpl implements SecretService {
	
	@Override
	public String DECRYPT(String encryptedContent) {
		return SensitiveDataHelper.decrypt(encryptedContent);
	}
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private CustomerDao customerDao;
	
	@Autowired
	private CustomerPhoneDao customerPhoneDao;
	
	@Override
	public List<String> CVLIBHQMVWFSPQWU(String VZYKHFFK) {
		
		List<String> OTCVCJSC = new ArrayList<String>();
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(VZYKHFFK);
		
		if(decorationPO != null){
			List<CustomerPhonePO> customerPhonePOs = customerPhoneDao.queryCustomerPhoneByCid(decorationPO.getCustomer().getCid(), CustomerPhonePO.STATUS_ENABLE_INT);
			
			for(CustomerPhonePO customerPhonePO: customerPhonePOs){
				OTCVCJSC.add(customerPhonePO.getPhone());
			}
		}
		
		return OTCVCJSC;
	}

	@Override
	public List<DecorationVO> KGZPHFBAOKWVMWGW(String FAKKGDAZ) {
		
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		List<CustomerPhonePO> customerPhonePOs = customerPhoneDao.queryCustomerPhoneByPhone(FAKKGDAZ, CustomerPhonePO.STATUS_ENABLE_INT, null);
		
		if(customerPhonePOs != null && customerPhonePOs.size() > 0){

			DecorationVO decorationVO;
			CustomerPO customerPO = customerDao.get(customerPhonePOs.get(0).getCid());
			
			if(customerPO != null){
			
				List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomerId(customerPO.getCid());
				
				for(DecorationPO decorationPO: decorationPOs){
					
					decorationVO = new DecorationVO();
					decorationVO.setHouse(new HouseVO(new VillageVO()));
					
					decorationVO.setOrderId(decorationPO.getOrderId());
					decorationVO.getHouse().getVillage().setName(decorationPO.getHouse().getVillage().getName());
					decorationVO.getHouse().setHouseNumber(SensitiveDataHelper.decrypt(decorationPO.getHouse().getHouseNumber()));
	
					decorationVOs.add(decorationVO);
				}
			}
		}
		
		return decorationVOs;
	}

}
