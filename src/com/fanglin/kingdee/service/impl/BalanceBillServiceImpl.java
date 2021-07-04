/**
 * @File Name		: BalanceBillServiceImpl.java
 * @Package   	: com.fanglin.kingdee.service.impl
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.kingdee.handle.Dao;
import com.fanglin.kingdee.ko.BalanceBillItemKO;
import com.fanglin.kingdee.ko.BalanceBillKO;
import com.fanglin.kingdee.service.BalanceBillService;

@Service("balanceBillService")
@Transactional(readOnly = true)
public class BalanceBillServiceImpl implements BalanceBillService {

	private static final long serialVersionUID = -7675392833863088296L;
	
	@Autowired
	private Dao dao;

	@Override
	public void save(String collectTime, String grade, String brand, String supplier, String orderId, List<BalanceBillItemKO> item) throws Exception {

		BalanceBillKO balanceBillKO = new BalanceBillKO().ptk(collectTime, grade, brand, supplier, orderId, item);

		dao.save(balanceBillKO);
	}
}
