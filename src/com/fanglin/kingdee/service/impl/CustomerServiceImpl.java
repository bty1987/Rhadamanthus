/**
 * @File Name		: CustomerServiceImpl.java
 * @Package   	: com.fanglin.kingdee.service.impl
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.kingdee.handle.Dao;
import com.fanglin.kingdee.ko.CustomerKO;
import com.fanglin.kingdee.service.CustomerService;

@Service("customerServiceKingdee")
@Transactional(readOnly = true)
public class CustomerServiceImpl implements CustomerService {

	private static final long serialVersionUID = 282688487012510732L;

	@Autowired
	private Dao dao;

	@Override
	public void save(DecorationPO decorationPO) throws FLException {

		CustomerKO customerKO = new CustomerKO().ptk(decorationPO);

		dao.save(customerKO);
	}

	@Override
	public void audit(DecorationPO decorationPO) throws FLException {
		
		CustomerKO customerKO = new CustomerKO().ptk(decorationPO);
		
		dao.audit(customerKO, decorationPO.getOrderId());
		
	}

	@Override
	public void audit(String no, String address) throws FLException {

		CustomerKO customerKO = new CustomerKO().ptk(no, address);

		dao.saveAudit(customerKO);
	}
}
