/**
 * @File Name		: CostMatchKingdeeServiceImpl.java
 * @Package   	: com.fanglin.kingdee.service.impl
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.kingdee.handle.Dao;
import com.fanglin.kingdee.ko.CostMatchBillItemKO;
import com.fanglin.kingdee.ko.CostMatchBillKO;
import com.fanglin.kingdee.service.CostMatchKingdeeService;
import com.fanglin.salary.po.SalaryPO;

@Service("costMatchKingdeeService")
@Transactional(readOnly = true)
public class CostMatchKingdeeServiceImpl implements CostMatchKingdeeService {

	@Autowired
	private Dao dao;

	@Override
	public void payWages(SalaryPO salaryPO) throws FLException {
		
		List<CostMatchBillItemKO> costMatchBillItems = new ArrayList<CostMatchBillItemKO>();
		costMatchBillItems.add(new CostMatchBillItemKO(salaryPO.getMoney()));
		
		dao.save(new CostMatchBillKO().ptk(salaryPO.getOperateTime().toString(), "1", "100.01", "FYHXD", costMatchBillItems));

	}
	
}
