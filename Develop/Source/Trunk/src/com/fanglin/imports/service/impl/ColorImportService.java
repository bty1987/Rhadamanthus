package com.fanglin.imports.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.inventory.dao.ColorDao;
import com.fanglin.inventory.po.ColorPO;

@Service("colorImportService")
@Transactional(readOnly = true)
public class ColorImportService implements com.fanglin.imports.service.ColorImportService{
	
	private static final short COLUMN_STATUS_INT = 0;
	
	@Autowired
	private ColorDao colorDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void importColor(List<List<String>> excels) {
		
		int index = 1;
		
		for(int i = 0; i < excels.size(); i++){
			
			List<String> _salary = excels.get(i);
				
			Long gid = (long) Math.floor(Double.parseDouble(_salary.get(0)));
			
			String name = _salary.get(2);
			
			ColorPO colorPO = colorDao.queryColorByName(gid,name);
			
			if(colorPO!=null){
				
				index++;
				
				continue;
				
			}else{
				
				colorPO = new ColorPO();
				
				colorPO.setGid(gid);
				
				colorPO.setName(name);
				
				colorPO.setStatus(COLUMN_STATUS_INT);
				
				colorDao.save(colorPO);
				
				index++;
				
			}
			
			if(index % 100 == 0){
				
				colorDao.flush();
				
			}
		}
		
	}

}
