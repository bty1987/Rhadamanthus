package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.service.RoleService;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("roleService")
@Transactional(readOnly = true)
public class RoleServiceImpl implements RoleService {

	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private RoleDao roleDao;

	@Override
	public void pageRole(Paging paging, List<FilterVO> filters){

		List<RolePO> rolePOs = roleDao.pageRole(paging, filters);
		List<RoleVO> roleVOs = new ArrayList<RoleVO>();
		
		for(RolePO rolePO: rolePOs){
			if(rolePO != null && !RolePO.SUPER_ROLEID_STR.equals(rolePO.getRoleId())){
				RoleVO roleVO = new RoleVO();
				BeanUtil.copyProperties(rolePO, roleVO);
				roleVOs.add(roleVO);
			}
		}
		
		paging.setData(roleVOs);
	}
	
	@Override
	public List<RoleVO> queryRole(){

		List<RolePO> rolePOs = roleDao.queryRole();
		List<RoleVO> roleVOs = new ArrayList<RoleVO>();
		
		for(RolePO rolePO: rolePOs){
			if(rolePO != null && !RolePO.SUPER_ROLEID_STR.equals(rolePO.getRoleId())){
				RoleVO roleVO = new RoleVO();
				BeanUtil.copyProperties(rolePO, roleVO);
				roleVOs.add(roleVO);
			}
		}
		
		return roleVOs;
	}
	
	@Override
	public RoleVO queryRoleById(RoleVO roleVO){

		RolePO rolePO = roleDao.get(roleVO.getRoleId());
		
		if(rolePO != null && !RolePO.SUPER_ROLEID_STR.equals(rolePO.getRoleId())){
			BeanUtil.copyProperties(rolePO, roleVO);
		}
		
		return roleVO;
	}
	
	@Override
	public RoleVO queryRoleByName(RoleVO roleVO){

		RolePO rolePO = roleDao.queryRoleByRoleName(roleVO.getRoleName());
		
		if(rolePO != null && !RolePO.SUPER_ROLEID_STR.equals(rolePO.getRoleId())){
			BeanUtil.copyProperties(rolePO, roleVO);
		}
		
		return roleVO;
	}

}
