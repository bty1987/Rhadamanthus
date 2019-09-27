/**
 * @File Name		: StorehouseStockService.java
 * @Package   	: com.fanglin.inventory.service
 * @Version		: 1.0
 * @Date			: 2016-10-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.inventory.vo.StorehouseStockVO;

public interface StorehouseStockService {
	
	public List<StorehouseStockVO> queryStorehouseStock();
	
	public int updateStorehouseStock(long shId, String month, int num);

}
