/**
 * @File Name		: ReceivableBillServiceImpl.java
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
import com.fanglin.kingdee.ko.ReceivableBillItemKO;
import com.fanglin.kingdee.ko.ReceivableBillKO;
import com.fanglin.kingdee.service.ReceivableBillService;

@Service("receivableBillService")
@Transactional(readOnly = true)
public class ReceivableBillServiceImpl implements ReceivableBillService {
	
	private static final long serialVersionUID = 1793390625476116602L;
	@Autowired
	private Dao dao;

	@Override
	public void save(String collectTime, String orderId, String settleOrgid, String payOrgid, String grade, String paymentType, List<ReceivableBillItemKO> items) throws Exception {

		ReceivableBillKO receivableBillKO = new ReceivableBillKO().ptk(collectTime, orderId, settleOrgid, payOrgid, grade, paymentType, items);

		dao.save(receivableBillKO);
	}
}
