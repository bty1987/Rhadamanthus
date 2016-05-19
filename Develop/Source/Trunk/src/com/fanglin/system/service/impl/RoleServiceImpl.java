package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.system.dao.RoleActionDao;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.dao.RoleSubfunctionDao;
import com.fanglin.system.po.RoleActionPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.po.RoleSubfunctionPO;
import com.fanglin.system.service.RoleService;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Constant;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("roleService")
@Transactional(readOnly = true)
public class RoleServiceImpl implements RoleService {

	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private RoleDao roleDao;

	@Autowired
	private RoleActionDao roleActionDao;
	
	@Autowired
	private RoleSubfunctionDao roleSubfunctionDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private CountingService countingService;
	
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

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addRole(RoleVO roleVO) throws FLException{
		RolePO rolePO = roleDao.queryRoleByRoleName(roleVO.getRoleName());
		
		if(rolePO == null){
			rolePO = new RolePO();
		}else{
			throw new FLException(230005, "角色名称已经存在");
		}
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_ROLE_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		
		StringBuffer roleId = new StringBuffer();
		roleId.append(SystemConfig.getString("companyIdent", ""));
		roleId.append(SystemConfig.getString("roleIdent", "R_"));
		roleId.append(FormatUtil.fillZero(count, "00"));
		
		rolePO.setRoleId(roleId.toString());
		
		BeanUtil.copyProperties(roleVO, rolePO, Arrays.asList("roleId"));
		
		roleDao.saveOrUpdate(rolePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateRole(RoleVO roleVO){
		RolePO rolePO = roleDao.get(roleVO.getRoleId());
		
		if(rolePO != null){
			BeanUtil.copyProperties(roleVO, rolePO, Arrays.asList("roleId"));
			roleDao.saveOrUpdate(rolePO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteRole(RoleVO roleVO){
		roleDao.deleteById(roleVO.getRoleId());
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public String deleteRoleByIds(List<String> roleIds){

		StringBuffer quotedRole = new StringBuffer();
		
		for(String roleId: roleIds){
			List<RoleActionPO> roleActionPOs = roleActionDao.queryRoleActionByRoleId(roleId);
			List<RoleSubfunctionPO> roleSubfunctionPOs = roleSubfunctionDao.findRoleSubFunctionByRoleId(roleId);
			
			int count = userDao.countUserByRoleId(roleId);

			if(!roleActionPOs.isEmpty() || !roleSubfunctionPOs.isEmpty() || count != 0){
				quotedRole.append(roleId + Constant.COMMA);
			}
		}

		if(quotedRole.toString().equals("")){
			for(String id: roleIds){
				deleteRole(new RoleVO(id));
			}
		}

		return quotedRole.toString();
	}

}
