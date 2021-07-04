/**
 * @File Name		: MaterialTransferBillServiceImpl.java
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
import com.fanglin.kingdee.ko.MaterialTransferBillItemKO;
import com.fanglin.kingdee.ko.MaterialTransferBillKO;
import com.fanglin.kingdee.service.MaterialTransferBillService;

@Service("MaterialTransferBillService")
@Transactional(readOnly = true)
public class MaterialTransferBillServiceImpl implements MaterialTransferBillService {

	private static final long serialVersionUID = 4950618777478050987L;
	
	@Autowired
	private Dao dao;

	@Override
	public void save(String collectTime, String grade, String orderId, String paymentType, List<MaterialTransferBillItemKO> item) throws Exception {

		MaterialTransferBillKO materialTransferBillKO = new MaterialTransferBillKO().ptk(collectTime, grade, orderId, paymentType, item);

		dao.save(materialTransferBillKO);
	}
}
