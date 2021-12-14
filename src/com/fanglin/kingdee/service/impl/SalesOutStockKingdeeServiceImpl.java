/**
 * @File Name		: salesOutStockKingdeeService.java
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
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.kingdee.handle.Dao;
import com.fanglin.kingdee.ko.SalesOutStockBillItemKO;
import com.fanglin.kingdee.ko.SalesOutStockBillKO;
import com.fanglin.kingdee.service.SalesOutStockKingdeeService;
import com.fanglin.utils.SystemConfig;

@Service("salesOutStockKingdeeService")
@Transactional(readOnly = true)
public class SalesOutStockKingdeeServiceImpl implements SalesOutStockKingdeeService {
	
	@Autowired
	private Dao dao;

	@Override
	public void outStock(AccessoriesPO accessoriesPO, List<AccessoriesItemVO> accessoriesItemVOs) throws FLException {
		
		if (SystemConfig.getString("KINGDEEENABLE") == null || SystemConfig.getString("KINGDEEENABLE").equals("false")) return;
		
		List<SalesOutStockBillItemKO> salesOutStockBillItemKOs = new ArrayList<SalesOutStockBillItemKO>();
		
		for (AccessoriesItemVO accessoriesItemVO : accessoriesItemVOs) {
			salesOutStockBillItemKOs.add(new SalesOutStockBillItemKO().ptk(".0009", accessoriesItemVO.getNum(), "CK003"));
		}
		
		//TODO 单据业务时间
		dao.save(new SalesOutStockBillKO().ptk(accessoriesPO.getApproverTime().toString(), "100.01", accessoriesPO.getNo(), salesOutStockBillItemKOs));
		
	}
}
