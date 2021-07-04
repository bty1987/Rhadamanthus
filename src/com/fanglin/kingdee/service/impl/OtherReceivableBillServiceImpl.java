/**
 * @File Name		: OtherReceivableBillServiceImpl.java
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
import com.fanglin.kingdee.ko.OtherReceivableBillItemKO;
import com.fanglin.kingdee.ko.OtherReceivableBillKO;
import com.fanglin.kingdee.service.OtherReceivableBillService;

@Service("otherReceivableBillService")
@Transactional(readOnly = true)
public class OtherReceivableBillServiceImpl implements OtherReceivableBillService {
	
	private static final long serialVersionUID = 5659621172149955922L;
	
	@Autowired
	private Dao dao;

	@Override
	public void save(String collectTime, String orderId, String settleOrgid, String grade, String decorationType, String salesType, List<OtherReceivableBillItemKO> items) throws Exception {
		
		OtherReceivableBillKO otherReceivableBillKO = new OtherReceivableBillKO().ptk(collectTime, orderId, settleOrgid, grade, decorationType, salesType, items);

		dao.save(otherReceivableBillKO);
	}
	
}
