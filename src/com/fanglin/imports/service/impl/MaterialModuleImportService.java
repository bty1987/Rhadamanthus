/**
 * @File Name		: MaterialModuleImportService.java
 * @Package   	: com.fanglin.imports.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.imports.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.material.dao.MaterialModelDao;
import com.fanglin.data.po.MaterialModelPO;

@Service("materialModuleImportService")
@Transactional(readOnly=true)
public class MaterialModuleImportService implements com.fanglin.imports.service.MaterialModuleImportService {
	
	private static final int COLUMN_ELEMENT_NUM_INT = 4;
	
	@Autowired
	private MaterialModelDao materialModelDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialModelForAdvance(List<List<String>> excels) {
		
		int index = 1;
		
		MaterialModelPO materialModelPO;
		
		for(List<String> info: excels){
			
			if(info.size() < COLUMN_ELEMENT_NUM_INT) continue;
			
			int mmId = Integer.parseInt(info.get(0));
			int type = Integer.parseInt(info.get(1));
			float value = Float.parseFloat(info.get(2));
			short status = Short.parseShort(info.get(3));
			
			materialModelPO = materialModelDao.get(mmId) ;
			
			if(materialModelPO != null){
				
				if(type == MaterialModelPO.CALC_TYPE_BASE_INT){
					materialModelPO.setBase(value);
				}else if(type == MaterialModelPO.CALC_TYPE_POINT_INT){
					materialModelPO.setPoint(value);
				}
				
				materialModelPO.setCalcType(type);
				materialModelPO.setStatus(status);
				
				materialModelDao.update(materialModelPO);
				
				index++;
			}
			
			if(index % 100 == 0){
				materialModelDao.flush();
			}
			
		}

	}

}
