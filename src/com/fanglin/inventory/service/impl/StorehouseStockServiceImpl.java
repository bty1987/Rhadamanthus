/**
 * @File Name		: StorehouseStockServiceImpl.java
 * @Package   	: com.fanglin.inventory.service.impl
 * @Version		: 1.0
 * @Date			: 2016-10-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.inventory.dao.StorehouseStockDao;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.inventory.po.StorehouseStockPO;
import com.fanglin.inventory.service.StorehouseStockService;
import com.fanglin.inventory.vo.StorehouseStockVO;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("storehouseStockService")
@Transactional(readOnly=true)
public class StorehouseStockServiceImpl implements StorehouseStockService {
	
	@Autowired
	private StorehouseStockDao storehouseStockDao;

	@Override
	public List<StorehouseStockVO> queryStorehouseStock() {
		
		List<StorehouseStockPO> storehouseStockPOs = storehouseStockDao.queryStorehouseStock();
		List<StorehouseStockVO> storehouseStockVOs = new ArrayList<StorehouseStockVO>();
		
		StorehouseStockVO storehouseStockVO;
		
		for(StorehouseStockPO storehouseStockPO: storehouseStockPOs){
			
			storehouseStockVO = new StorehouseStockVO(new StorehouseVO());
			
			BeanUtil.copyProperties(storehouseStockPO, storehouseStockVO, Arrays.asList("storehouse"));
			BeanUtil.copyProperties(storehouseStockPO.getStorehouse(), storehouseStockVO.getStorehouse());
			
			storehouseStockVOs.add(storehouseStockVO);
		}
		
		return storehouseStockVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateStorehouseStock(long shId, String month, float num) {
		
		StorehouseStockPO storehouseStockPO = storehouseStockDao.queryStorehouseStockByShIdAMonth(shId, month);
		
		if(storehouseStockPO == null){
			storehouseStockPO = new StorehouseStockPO();
			
			storehouseStockPO.setMonth(month);
			storehouseStockPO.setStorehouse(new StorehousePO(shId));
			storehouseStockPO.setNum(0f);
		}
		
		storehouseStockPO.setNum(Arith.add(storehouseStockPO.getNum(), num));
		
		storehouseStockDao.saveOrUpdate(storehouseStockPO);
		
		return 0;
	}

}
