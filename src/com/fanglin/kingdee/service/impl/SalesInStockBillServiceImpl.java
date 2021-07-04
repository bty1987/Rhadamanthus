/**
 * @File Name		: SalesInStockBillServiceImpl.java
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
import com.fanglin.kingdee.ko.SalesInStockBillItemKO;
import com.fanglin.kingdee.ko.SalesInStockBillKO;
import com.fanglin.kingdee.service.SalesInStockBillService;

@Service("salesInStockBillService")
@Transactional(readOnly = true)
public class SalesInStockBillServiceImpl implements SalesInStockBillService {

	private static final long serialVersionUID = -5299343313295562457L;
	
	@Autowired
	private Dao dao;

	@Override
	public void save(String inCompany, String collectTime, String purchaseCompany, String supplier, List<SalesInStockBillItemKO> item) throws Exception {

		SalesInStockBillKO salesInStockBillKO = new SalesInStockBillKO().ptk(inCompany, collectTime, purchaseCompany, supplier, item);

		dao.save(salesInStockBillKO);
	}
}
