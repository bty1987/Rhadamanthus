/**
 * @File Name		: SalesOutStockKingdeeService.java
 * @Package   	: com.fanglin.kingdee.service
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.inventory.vo.AccessoriesItemVO;

public interface SalesOutStockKingdeeService {

	public void outStock(AccessoriesPO accessoriesPO, List<AccessoriesItemVO> accessoriesItemVOs) throws FLException;

}
