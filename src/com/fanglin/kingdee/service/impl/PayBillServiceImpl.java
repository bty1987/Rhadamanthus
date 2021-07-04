/**
 * @File Name		: PayBillServiceImpl.java
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
import com.fanglin.kingdee.ko.PayBillItemKO;
import com.fanglin.kingdee.ko.PayBillKO;
import com.fanglin.kingdee.service.PayBillService;

@Service("payBillService")
@Transactional(readOnly = true)
public class PayBillServiceImpl implements PayBillService {

	private static final long serialVersionUID = -2901415582472880135L;
	
	@Autowired
	private Dao dao;

	@Override
	public void save(String billType, String collectTime, String orderId, String grade, String brand, List<PayBillItemKO> item) throws Exception {

		PayBillKO payBillKO = new PayBillKO().ptk(billType, collectTime, orderId, grade, brand, item);

		dao.save(payBillKO);
	}
}
