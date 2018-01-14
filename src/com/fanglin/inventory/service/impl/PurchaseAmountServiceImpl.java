/**
 * @File Name		: PurchaseAmountServiceImpl.java
 * @Package   	: com.fanglin.inventory.service.impl
 * @Version		: 1.0
 * @Date			: 2016-10-6
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.inventory.dao.PurchaseAmountDao;
import com.fanglin.inventory.po.PurchaseAmountPO;
import com.fanglin.inventory.service.PurchaseAmountService;
import com.fanglin.inventory.vo.PurchaseAmountVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("purchaseAmountService")
@Transactional(readOnly=true)
public class PurchaseAmountServiceImpl implements PurchaseAmountService {
	
	@Autowired
	private PurchaseAmountDao purchaseAmountDao;

	@Override
	public List<PurchaseAmountVO> queryPurchaseAmount() {
		
		List<PurchaseAmountPO> purchaseAmountPOs = purchaseAmountDao.queryPurchaseAmount();
		List<PurchaseAmountVO> purchaseAmountVOs = new ArrayList<PurchaseAmountVO>();
		
		PurchaseAmountVO purchaseAmountVO;
		
		for(PurchaseAmountPO purchaseAmountPO: purchaseAmountPOs){
			
			purchaseAmountVO = new PurchaseAmountVO();
			
			BeanUtil.copyProperties(purchaseAmountPO, purchaseAmountVO);
			
			purchaseAmountVOs.add(purchaseAmountVO);
		}
		
		return purchaseAmountVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updatePurchaseAmount(String month, float money) {
		
		PurchaseAmountPO purchaseAmountPO = purchaseAmountDao.queryPurchaseAmountByMonth(month);
		
		if(purchaseAmountPO == null){
			
			purchaseAmountPO = new PurchaseAmountPO();
			
			purchaseAmountPO.setMonth(month);
			purchaseAmountPO.setMoney(0f);
		}
		
		purchaseAmountPO.setMoney(Arith.add(purchaseAmountPO.getMoney(), money));
		
		purchaseAmountDao.saveOrUpdate(purchaseAmountPO);
		
		return 0;
	}

}
