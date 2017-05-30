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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.secret.service.SecretService;

@Service("secretService")
@Transactional(readOnly=true)
public class SecretServiceImpl implements SecretService {
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Override
	public String CVLIBHQMVWFSPQWU(String orderId) {
		
		String OTCVCJSC = "";
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(decorationOrderPO != null){
			OTCVCJSC = decorationOrderPO.getCustomerPO().getPhone();
		}
		
		return OTCVCJSC;
	}

}
