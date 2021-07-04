/**
 * @File Name		: BankTransitionBillServiceImpl.java
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
import com.fanglin.kingdee.ko.BankTransitionBillItemKO;
import com.fanglin.kingdee.ko.BankTransitionBillKO;
import com.fanglin.kingdee.service.BankTransitionBillService;

@Service("bankTransitionBillService")
@Transactional(readOnly = true)
public class BankTransitionBillServiceImpl implements BankTransitionBillService {
	
	private static final long serialVersionUID = 264707737372090511L;
	
	@Autowired
	private Dao dao;

	@Override
	public void save(String collectTime, String grade, String orderId, String paymentType, String brand, long realMoney, List<BankTransitionBillItemKO> item) throws Exception {

		BankTransitionBillKO bankTransitionBillKO = new BankTransitionBillKO().ptk(collectTime, grade, orderId, paymentType, brand, realMoney, item);

		dao.save(bankTransitionBillKO);
	}
}
