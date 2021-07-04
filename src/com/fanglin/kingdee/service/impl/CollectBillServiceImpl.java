/**
 * @File Name		: CollectBillServiceImpl.java
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
import com.fanglin.kingdee.ko.CollectBillItemKO;
import com.fanglin.kingdee.ko.CollectBillKO;
import com.fanglin.kingdee.service.CollectBillService;

@Service("collectBillService")
@Transactional(readOnly = true)
public class CollectBillServiceImpl implements CollectBillService {

	private static final long serialVersionUID = -7064493418943047247L;
	
	@Autowired
	private Dao dao;

	@Override
	public void save(String paymentName, String collectTime, String orderId, String payOrgid, String settleOrgid, String grade, String paymentType, String collectType, List<CollectBillItemKO> items) throws Exception {

		CollectBillKO payBillKO = new CollectBillKO().ptk(paymentName, collectTime, orderId, payOrgid, settleOrgid, grade, paymentType, collectType, items);

		dao.save(payBillKO);
	}
}
