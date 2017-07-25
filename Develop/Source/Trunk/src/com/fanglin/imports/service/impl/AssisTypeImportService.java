package com.fanglin.imports.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.common.dao.WorkTypeDao;
import com.fanglin.data.po.WorkTypePO;
import com.fanglin.inventory.dao.AssisTypeDao;
import com.fanglin.inventory.po.AssisTypePO;

@Service("assisTypeImportService")
@Transactional(readOnly=true)
public class AssisTypeImportService implements com.fanglin.imports.service.AssisTypeImportService{
	
	private static final short COLUMN_STATUS_INT = 0;
	
	@Autowired
	private WorkTypeDao workTypeDao;
	
	@Autowired
	private AssisTypeDao assisTypeDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void importAssisType(List<List<String>> excels) {
		
		int index = 1;
		
		for(int i = 0; i < excels.size(); i++){
			
			List<String> _salary = excels.get(i);
				
			String name = _salary.get(0);
			
			Integer wtid = (int) Double.parseDouble(_salary.get(1));
			
			WorkTypePO workTypePO = workTypeDao.get(wtid);
			
			String comment = _salary.get(2);
			
			AssisTypePO assisTypePO = assisTypeDao.queryAssisTypeByName(name);
			
			if(assisTypePO!=null){
				
				index++;
				
				continue;
				
			}else{
				
				assisTypePO = new AssisTypePO();
				
				assisTypePO.setName(name);
				
				assisTypePO.setWorkType(workTypePO);
				
				assisTypePO.setStatus(COLUMN_STATUS_INT);
				
				assisTypePO.setComment(comment);
				
				assisTypeDao.save(assisTypePO);
				
				index++;
				
			}
			
			if(index % 100 == 0){
				workTypeDao.flush();
				assisTypeDao.flush();
			}
		}
		
	}

}
