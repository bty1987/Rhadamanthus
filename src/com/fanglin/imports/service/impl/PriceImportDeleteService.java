package com.fanglin.imports.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.inventory.dao.PriceDao;
import com.fanglin.inventory.po.PricePO;


@Service("priceImportDeleteService")
@Transactional(readOnly = true)
public class PriceImportDeleteService implements com.fanglin.imports.service.PriceImportDeleteService{

	@Autowired
	private PriceDao priceDao;
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void importDeletePrice(List<List<String>> excels) {
		
		int index = 1;
		
		for (int i = 0; i < excels.size(); i++) {
			
			List<String> _salary = excels.get(i);
			
			Long gid = (long) Math.floor(Double.parseDouble(_salary.get(0)));
			
			List<PricePO> pricePOs = priceDao.queryPriceByGid(gid);
			
			for (PricePO pricePO : pricePOs) {
				
				priceDao.delete(pricePO);
				
			}
			
			index++;
			
			if(index % 100 == 0) {
				
				priceDao.flush();
				
			}
			
		}
		
	}

}
