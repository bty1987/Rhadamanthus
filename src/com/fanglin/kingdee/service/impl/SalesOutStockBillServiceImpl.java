/**
 * @File Name		: SalesOutStockBillServiceImpl.java
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
import com.fanglin.kingdee.ko.SalesOutStockBillItemKO;
import com.fanglin.kingdee.ko.SalesOutStockBillKO;
import com.fanglin.kingdee.service.SalesOutStockBillService;

@Service("salesOutStockBillService")
@Transactional(readOnly = true)
public class SalesOutStockBillServiceImpl implements SalesOutStockBillService {

	private static final long serialVersionUID = -7576352583535955883L;
	
	@Autowired
	private Dao dao;

	@Override
	public void save(String collectTime, String salesCompany, String salesNo, List<SalesOutStockBillItemKO> item) throws Exception {

		SalesOutStockBillKO salesOutStockBillKO = new SalesOutStockBillKO().ptk(collectTime, salesCompany, salesNo, item);

		dao.save(salesOutStockBillKO);
	}
}
