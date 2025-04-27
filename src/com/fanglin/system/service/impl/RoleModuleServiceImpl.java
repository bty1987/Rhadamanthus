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
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.dao.RoleModuleDao;
import com.fanglin.system.po.ModulePO;
import com.fanglin.system.po.RoleModulePO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.service.RoleModuleService;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.system.vo.ModuleVO;
import com.fanglin.system.vo.RoleVO;

@Service("roleModuleService")
@Transactional(readOnly = true)
public class RoleModuleServiceImpl implements RoleModuleService {

	@Autowired
	private UserDao userDao;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private RoleModuleDao roleModuleDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRoleModule(ModuleVO moduleVO, RoleVO roleVO, List<ModuleVO> modules, int rid, String userId, Integer company) throws FLException {

		RolePO rolePO = roleDao.get(roleVO.getRid());

		if (rolePO == null) {
			throw new FLException(230010, "角色不存在");
		}

		RolePO roleCO = roleDao.get(rid);

		if (roleCO == null) {
			throw new FLException(230010, "角色不存在");
		}

		roleModuleDao.deleteRoleModuleByRid(rolePO.getRid(), moduleVO.getSystem(), company);

		if (roleCO.getRid() == rolePO.getRid()) throw new FLException(-1, "无操作权限");

		if (roleCO.getLevel() < rolePO.getLevel()) {
			throw new FLException(-1, "无操作权限");
		}

		UserPO operator = userDao.queryUserByUserId(userId);

		if (modules == null) return 0;
		if (modules.size() == 0) return 0;

		for (ModuleVO module : modules) {

			RoleModulePO userModulePO = new RoleModulePO(new ModulePO(module.getMid()), rolePO.getRid(), module.getLink(), module.getAccess(), operator, company);

			roleModuleDao.save(userModulePO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int syncRoleModule(RoleVO roleVO, List<CompanyVO> companyVOs, String userId, Integer company) throws FLException {

		List<Integer> cids = new ArrayList<Integer>();

		for (CompanyVO companyVO : companyVOs) {
			cids.add(CompanyServiceImpl.decode(companyVO.getCid()));
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		roleModuleDao.deleteRoleModule(roleVO.getRid(), company);
		roleModuleDao.syncRoleModule(roleVO.getRid(), operater.getUid(), cids);

		return 0;
	}
}
