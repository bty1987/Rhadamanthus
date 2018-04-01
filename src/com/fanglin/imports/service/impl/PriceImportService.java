package com.fanglin.imports.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.inventory.dao.PriceDao;
import com.fanglin.inventory.po.PricePO;

@Service("priceImportService")
@Transactional(readOnly = true)
public class PriceImportService implements com.fanglin.imports.service.PriceImportService{

	@Autowired
	private PriceDao priceDao;
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void importPrice(List<List<String>> excels) {
		
		int index = 1;
		
		for (int i = 0; i < excels.size(); i++) {
			
			List<String> _salary = excels.get(i);
			
			Long gid = (long) Math.floor(Double.parseDouble(_salary.get(0)));
			
			String name = _salary.get(1);
			
			Float purchase = Float.valueOf(_salary.get(2));
			
			Float selling = Float.valueOf(_salary.get(3));
			
			short ctype = Short.parseShort(_salary.get(4));
			
			Float cvalue = Float.valueOf(_salary.get(5));
			
			PricePO pricePO = new PricePO();
					
			pricePO.setGid(gid);
			pricePO.setName(name);
			pricePO.setPurchase(purchase);
			pricePO.setSelling(selling);
			pricePO.setCtype(ctype);
			pricePO.setCvalue(cvalue);
					
			priceDao.save(pricePO);
			
			index++;				
					
			if(index % 100 == 0) {
				
				priceDao.flush();
				
			}
			
		}
		
	}
	
}
