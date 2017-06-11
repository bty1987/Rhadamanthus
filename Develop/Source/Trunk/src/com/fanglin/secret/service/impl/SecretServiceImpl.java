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

import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.secret.service.SecretService;

@Service("secretService")
@Transactional(readOnly=true)
public class SecretServiceImpl implements SecretService {
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private CustomerDao customerDao;
	
	@Override
	public String CVLIBHQMVWFSPQWU(String VZYKHFFK) {
		
		String OTCVCJSC = "";
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(VZYKHFFK);
		
		if(decorationOrderPO != null){
			OTCVCJSC = decorationOrderPO.getCustomerPO().getPhone();
		}
		
		return OTCVCJSC;
	}

	@Override
	public List<DecorationOrderVO> KGZPHFBAOKWVMWGW(String FAKKGDAZ) {
		
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		List<CustomerPO> customerPOs = customerDao.queryCustomerByPhone(FAKKGDAZ);
		
		if(customerPOs != null && customerPOs.size() > 0){

			DecorationOrderVO decorationOrderVO;
			CustomerPO customerPO = customerPOs.get(0);
			
			List<DecorationOrderPO> decorationOrderPOs = decorationOrderDao.queryDecorationOrderByCustomerId(customerPO.getId());
			
			for(DecorationOrderPO decorationOrderPO: decorationOrderPOs){
				
				decorationOrderVO = new DecorationOrderVO();
				decorationOrderVO.setVillage(new VillageVO());
				
				decorationOrderVO.setOrderId(decorationOrderPO.getOrderId());
				decorationOrderVO.setHouseNumber(decorationOrderPO.getHouseNumber());
				decorationOrderVO.getVillage().setVillageName(decorationOrderPO.getVillagePO().getVillageName());

				decorationOrderVOs.add(decorationOrderVO);
			}
		}
		
		return decorationOrderVOs;
	}

}
