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
import com.fanglin.kingdee.ko.SalesReturnBillItemKO;
import com.fanglin.kingdee.ko.SalesReturnBillKO;
import com.fanglin.kingdee.service.SalesReturnKingdeeService;
import com.fanglin.utils.SystemConfig;

@Service("salesReturnKingdeeService")
@Transactional(readOnly = true)
public class SalesReturnKingdeeServiceImpl implements SalesReturnKingdeeService {
	
	@Autowired
	private Dao dao;

	@Override
	public void returned(AccessoriesPO accessoriesPO, List<AccessoriesItemVO> accessoriesItemVOs) throws FLException {
		
		if (SystemConfig.getString("KINGDEEENABLE") == null || SystemConfig.getString("KINGDEEENABLE").equals("false")) return;
		
		List<SalesReturnBillItemKO> items = new ArrayList<SalesReturnBillItemKO>();
		
		for (AccessoriesItemVO accessoriesItemVO : accessoriesItemVOs) {
			items.add(new SalesReturnBillItemKO().ptk(".0009", accessoriesItemVO.getNum(), "CK003"));
		}
		
		//TODO
		dao.save(new SalesReturnBillKO().ptk(accessoriesPO.getApproverTime().toString(), "XSTHD01_SYS", "100.01", "100.01", accessoriesPO.getNo(), items));
		
	}
}
