/**
 * @File Name		: OtherPayableBillServiceImpl.java
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
import com.fanglin.kingdee.ko.OtherPayableBillItemKO;
import com.fanglin.kingdee.ko.OtherPayableBillKO;
import com.fanglin.kingdee.service.OtherPayableBillService;

@Service("otherPayableBillService")
@Transactional(readOnly = true)
public class OtherPayableBillServiceImpl implements OtherPayableBillService {

	private static final long serialVersionUID = 3635847014156525677L;
	
	@Autowired
	private Dao dao;

	@Override
	public void save(String collectTime, String orderId, String grade, List<OtherPayableBillItemKO> items) throws Exception {

		OtherPayableBillKO otherPayableBillKO = new OtherPayableBillKO().ptk(collectTime, orderId, grade, items);

		dao.save(otherPayableBillKO);
	}
}
