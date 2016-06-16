package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.system.dao.ModuleDao;
import com.fanglin.system.po.ModulePO;
import com.fanglin.system.service.ModuleService;
import com.fanglin.system.vo.ModuleVO;
import com.fanglin.utils.BeanUtil;

@Service("moduleService")
@Transactional(readOnly = true)
public class ModuleServiceImpl implements ModuleService {

	@Autowired
	private ModuleDao moduleDao;

	@Override
	public List<ModuleVO> queryModule(){
		List<ModulePO> modulePOs = moduleDao.queryModule();
		List<ModuleVO> moduleVOs = new ArrayList<ModuleVO>();
		
		for(ModulePO modulePO: modulePOs){
			ModuleVO moduleVO = new ModuleVO();
			BeanUtil.copyProperties(modulePO, moduleVO);
			
			moduleVOs.add(moduleVO);
		}
		
		return moduleVOs;
	}
}
