/**
 * @File Name		: ModuleServiceImpl.java
 * @Package   	: com.fanglin.system.service.impl
 * @Version		: 1.0
 * @Date			: 2015-12-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.ModuleDao;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.dao.RoleModuleDao;
import com.fanglin.system.po.ModulePO;
import com.fanglin.system.po.RoleModulePO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.service.ModuleService;
import com.fanglin.system.vo.ModuleVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("moduleService")
@Transactional(readOnly=true)
public class ModuleServiceImpl implements ModuleService {
	
	@Autowired
	private ModuleDao moduleDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private RoleDao roleDao;
	
	@Autowired
	private RoleModuleDao roleModuleDao;

	@Override
	public void pageModule(Paging paging, List<FilterVO> filters) {
		
		List<ModulePO> modulePOs = moduleDao.pageModule(paging, filters);
		List<ModuleVO> moduleVOs = new ArrayList<ModuleVO>();
		
		for(ModulePO modulePO: modulePOs){
			
			ModuleVO moduleVO = new ModuleVO();
			
			convertModule(modulePO, moduleVO);
			
			moduleVOs.add(moduleVO);
		}
		
		paging.setData(moduleVOs);
	}

	@Override
	public List<ModuleVO> queryModule() {
		
		List<ModulePO> modulePOs = moduleDao.queryModule();
		List<ModuleVO> moduleVOs = new ArrayList<ModuleVO>();
		
		for(ModulePO modulePO: modulePOs){
			
			ModuleVO moduleVO = new ModuleVO();
			
			convertModule(modulePO, moduleVO);
			
			moduleVOs.add(moduleVO);
		}
		
		return moduleVOs;
	}

	@Override
	public List<ModuleVO> queryModuleBySystem(ModuleVO moduleVO) {
		
		List<ModulePO> modulePOs = moduleDao.queryModuleBySystem(moduleVO.getSystem());
		List<ModuleVO> moduleVOs = new ArrayList<ModuleVO>();
		
		for(ModulePO modulePO: modulePOs){
			
			ModuleVO _moduleVO = new ModuleVO();
			
			convertModule(modulePO, _moduleVO);
			
			moduleVOs.add(_moduleVO);
		}
		
		return moduleVOs;
	}

	@Override
	public List<ModuleVO> queryModuleByRoleId(ModuleVO moduleVO, RoleVO roleVO) throws FLException {
		
		RolePO rolePO = roleDao.get(roleVO.getRoleId());
		
		if(rolePO == null){
			throw new FLException(230010, "角色不存在");
		}
		
		if("1".equals(roleVO.getRoleId())){
			List<ModulePO> modulePOs = moduleDao.queryModuleBySystem(moduleVO.getSystem());
			List<ModuleVO> moduleVOs = new ArrayList<ModuleVO>();
			
			for(ModulePO modulePO: modulePOs){
				ModuleVO _moduleVO = new ModuleVO();

				convertModule(modulePO, _moduleVO);
				
				moduleVOs.add(_moduleVO);
			}
			
			return moduleVOs;
		}else{
			
			List<RoleModulePO> roleModulePOs = roleModuleDao.queryRoleModuleByRId(rolePO.getrId(), moduleVO.getSystem());
			
			Map<Integer, ModuleVO> modules = new HashMap<Integer, ModuleVO>();
			
			for(RoleModulePO roleModulePO: roleModulePOs){
				convertModule(modules, roleModulePO.getModule());
			}
			
			return new ArrayList<ModuleVO>(modules.values());
		}
	}

	@Override
	public List<ModuleVO> queryModuleByUserId(ModuleVO moduleVO, UserVO userVO) throws FLException {
		
		UserPO userPO = userDao.get(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		if("1".equals(userPO.getUserId())){
			List<ModulePO> modulePOs = moduleDao.queryModuleBySystem(moduleVO.getSystem());
			List<ModuleVO> moduleVOs = new ArrayList<ModuleVO>();
			
			for(ModulePO modulePO: modulePOs){
				ModuleVO _moduleVO = new ModuleVO();
				
				convertModule(modulePO, _moduleVO);
				
				moduleVOs.add(moduleVO);
			}
			
			return moduleVOs;
		}else{
			List<RoleModulePO> roleModulePOs = roleModuleDao.queryRoleModuleByRId(userPO.getRole().getrId(), moduleVO.getSystem());
			
			Map<Integer, ModuleVO> modules = new HashMap<Integer, ModuleVO>();
			
			for(RoleModulePO roleModulePO: roleModulePOs){
				
				convertModule(modules, roleModulePO.getModule());
			}
			
			return new ArrayList<ModuleVO>(modules.values());
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateRoleModuleByRoleId(List<Integer> mIds, ModuleVO moduleVO, RoleVO roleVO) throws FLException {
		
		RolePO rolePO = roleDao.get(roleVO.getRoleId());
		
		if(rolePO == null){
			throw new FLException(230010, "角色不存在");
		}
		
		roleModuleDao.deleteRoleModuleByRId(rolePO.getrId(), moduleVO.getSystem());
		
		if(mIds != null && mIds.size() > 0){
			for(Integer mId: mIds){
				RoleModulePO userModulePO = new RoleModulePO(rolePO, new ModulePO(mId));
				
				roleModuleDao.save(userModulePO);
			}
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateUserModuleByUserId(List<Integer> mIds, ModuleVO moduleVO, UserVO userVO) throws FLException {
		
		UserPO userPO = userDao.get(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		roleModuleDao.deleteRoleModuleByRId(userPO.getRole().getrId(), moduleVO.getSystem());
		
		if(mIds != null && mIds.size() > 0){
			for(Integer mId: mIds){
				RoleModulePO roleModulePO = new RoleModulePO(userPO.getRole(), new ModulePO(mId));
				
				roleModuleDao.save(roleModulePO);
			}
		}
		
		return 0;
	}
	
	private int convertModule(ModulePO modulePO, ModuleVO moduleVO){
		
		BeanUtil.copyProperties(modulePO, moduleVO, Arrays.asList("fatherModule", "operations"));
		
		if(modulePO.getFatherModule() != null){
			ModuleVO fatherModuleVO = new ModuleVO();
			
			convertModule(modulePO.getFatherModule(), fatherModuleVO);
			
			moduleVO.setFatherModule(fatherModuleVO);
		}

		return 0;
	}
	
	private int convertModule(Map<Integer, ModuleVO> modules, ModulePO modulePO){
		
		ModuleVO moduleVO = new ModuleVO();
		
		BeanUtil.copyProperties(modulePO, moduleVO, Arrays.asList("fatherModule", "operations"));
		
		ModulePO fatherModulePO = modulePO.getFatherModule();
		
		if(fatherModulePO != null){
			
			convertModule(modules, fatherModulePO);
			
			ModuleVO fatherModuleVO = new ModuleVO();
			
			BeanUtil.copyProperties(modulePO.getFatherModule(), fatherModuleVO, Arrays.asList("fatherModule", "operations"));
			
			moduleVO.setFatherModule(fatherModuleVO);
		}
		
		if(modules.get(moduleVO.getMid()) == null){
			modules.put(moduleVO.getMid(), moduleVO);
		}
		
		return 0;
	}

}
