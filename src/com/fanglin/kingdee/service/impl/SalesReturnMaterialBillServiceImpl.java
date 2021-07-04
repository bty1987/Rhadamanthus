/**
 * @File Name		: SalesReturnMaterialBillServiceImpl.java
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
import com.fanglin.kingdee.ko.SalesReturnMaterialBillItemKO;
import com.fanglin.kingdee.ko.SalesReturnMaterialBillKO;
import com.fanglin.kingdee.service.SalesReturnMaterialBillService;

@Service("salesReturnMaterialBillService")
@Transactional(readOnly = true)
public class SalesReturnMaterialBillServiceImpl implements SalesReturnMaterialBillService {
	
	private static final long serialVersionUID = 8477505793751978582L;
	
	@Autowired
	private Dao dao;

	@Override
	public void save(String returnCompany, String returnTime, String purchaseCompany, String requireCompany, String supplier, List<SalesReturnMaterialBillItemKO> item) throws Exception {

		SalesReturnMaterialBillKO salesReturnMaterialBillKO = new SalesReturnMaterialBillKO().ptk(returnCompany, returnTime, purchaseCompany, requireCompany, supplier, item);

		dao.save(salesReturnMaterialBillKO);
	}
}
