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
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserRoleDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserRolePO;
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
@Transactional(readOnly = true)
public class ModuleServiceImpl implements ModuleService {

	@Autowired
	private ModuleDao moduleDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private RoleModuleDao roleModuleDao;

	@Autowired
	private UserRoleDao userRoleDao;

	@Override
	public void pageModule(Paging paging, List<Filter> filters) {

		List<ModulePO> modulePOs = moduleDao.pageModule(paging, filters);
		List<ModuleVO> moduleVOs = new ArrayList<ModuleVO>();

		for (ModulePO modulePO : modulePOs) {

			ModuleVO moduleVO = new ModuleVO();

			convertModule(modulePO, moduleVO);

			moduleVOs.add(moduleVO);
		}

		paging.setData(moduleVOs);
	}

	@Override
	public List<ModuleVO> queryModule(ModuleVO moduleVO) {

		List<ModulePO> modulePOs = moduleDao.queryModule(moduleVO.getSystem(), moduleVO.getLevel());
		List<ModuleVO> moduleVOs = new ArrayList<ModuleVO>();

		for (ModulePO modulePO : modulePOs) {

			moduleVO = new ModuleVO();

			convertModule(modulePO, moduleVO);

			moduleVOs.add(moduleVO);
		}

		return moduleVOs;
	}

	@Override
	public List<ModuleVO> queryModuleByRid(ModuleVO moduleVO, RoleVO roleVO, Integer company) throws FLException {

		RolePO rolePO = roleDao.get(roleVO.getRid());

		if (rolePO == null) {
			throw new FLException(230010, "角色不存在");
		}

		if (RolePO.SUPER_NO_STR.equals(rolePO.getNo())) {

			List<ModulePO> modulePOs = moduleDao.queryModuleBySystem(moduleVO.getSystem());
			List<ModuleVO> moduleVOs = new ArrayList<ModuleVO>();

			for (ModulePO modulePO : modulePOs) {
				ModuleVO _moduleVO = new ModuleVO();

				convertModule(modulePO, _moduleVO);

				moduleVOs.add(_moduleVO);
			}

			return moduleVOs;
		} else {

			List<RoleModulePO> roleModulePOs = roleModuleDao.queryRoleModule(rolePO.getRid(), moduleVO.getSystem(), company);

			Map<Integer, ModuleVO> modules = new HashMap<Integer, ModuleVO>();

			for (RoleModulePO roleModulePO : roleModulePOs) {
				convertModule(modules, roleModulePO.getModule(), roleModulePO.getLink(), roleModulePO.getAccess());
			}

			return new ArrayList<ModuleVO>(modules.values());
		}
	}

	@Override
	public List<ModuleVO> queryModuleForLinkByRid(ModuleVO moduleVO, RoleVO roleVO, Integer company) throws FLException {

		RolePO rolePO = roleDao.get(roleVO.getRid());

		if (rolePO == null) {
			throw new FLException(230010, "角色不存在");
		}

		List<RoleModulePO> roleModulePOs = roleModuleDao.queryRoleModuleForLink(rolePO.getRid(), moduleVO.getSystem(), company);

		Map<Integer, ModuleVO> modules = new HashMap<Integer, ModuleVO>();

		for (RoleModulePO roleModulePO : roleModulePOs) {
			convertModule(modules, roleModulePO.getModule(), roleModulePO.getLink(), roleModulePO.getAccess());
		}

		return new ArrayList<ModuleVO>(modules.values());
	}

	@Override
	public List<ModuleVO> queryModuleByUserId(ModuleVO moduleVO, UserVO userVO, Integer company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		if (UserPO.SUPER_USERID_STR.equals(userPO.getUserId())) {

			List<ModulePO> modulePOs = moduleDao.queryModuleBySystem(moduleVO.getSystem());
			List<ModuleVO> moduleVOs = new ArrayList<ModuleVO>();

			for (ModulePO modulePO : modulePOs) {
				ModuleVO _moduleVO = new ModuleVO();

				convertModule(modulePO, _moduleVO);

				moduleVOs.add(_moduleVO);
			}

			return moduleVOs;
		} else {

			List<UserRolePO> userRolePOs = userRoleDao.queryUserRole(userPO.getUid());

			List<Integer> rids = new ArrayList<Integer>(Arrays.asList(userPO.getRole().getRid()));

			for (UserRolePO userRolePO : userRolePOs) {
				rids.add(userRolePO.getRole().getRid());
			}

			List<RoleModulePO> roleModulePOs = roleModuleDao.queryRoleModule(rids, moduleVO.getSystem(), company);

			Map<Integer, ModuleVO> modules = new HashMap<Integer, ModuleVO>();

			for (RoleModulePO roleModulePO : roleModulePOs) {
				convertModule(modules, roleModulePO.getModule(), roleModulePO.getLink(), roleModulePO.getAccess());
			}

			return new ArrayList<ModuleVO>(modules.values());
		}
	}

	@Override
	public List<ModuleVO> queryModuleByFatherModule(ModuleVO moduleVO) throws FLException {

		List<ModulePO> modulePOs = moduleDao.queryModuleByFatherModule(moduleVO.getSystem(), moduleVO.getFatherModule().getMid());

		List<ModuleVO> moduleVOs = new ArrayList<ModuleVO>();

		for (ModulePO modulePO : modulePOs) {

			moduleVO = new ModuleVO();

			convertModule(modulePO, moduleVO);

			moduleVOs.add(moduleVO);
		}

		return moduleVOs;
	}

	@Override
	public ModuleVO checkModule(ModuleVO moduleVO, String userId, Integer company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		ModulePO modulePO = moduleDao.get(moduleVO.getMid());

		if (modulePO == null) {
			throw new FLException(-1, "无操作权限");
		}

		RolePO rolePO = userPO.getRole();

		if (rolePO == null) {
			throw new FLException(230010, "角色不存在");
		}

		if (RolePO.SUPER_NO_STR.equals(userPO.getRole().getNo())) {

			convertModule(modulePO, moduleVO);
		} else {

			List<UserRolePO> userRolePOs = userRoleDao.queryUserRole(userPO.getUid());

			List<Integer> rids = new ArrayList<Integer>(Arrays.asList(userPO.getRole().getRid()));

			for (UserRolePO userRolePO : userRolePOs) {
				rids.add(userRolePO.getRole().getRid());
			}

			RoleModulePO roleModulePO = roleModuleDao.queryRoleModule(rids, modulePO.getMid(), company);

			if (roleModulePO == null) {
				throw new FLException(-1, "无操作权限");
			}

			if (roleModulePO.getAccess() == ModulePO.ACCESS_DISABLE_INT) {
				throw new FLException(-1, "无操作权限");
			}

			convertModule(modulePO, moduleVO);
		}

		return moduleVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addModule(ModuleVO moduleVO) throws FLException {

		ModulePO modulePO = new ModulePO();

		if (moduleVO.getFatherModule() != null) {

			ModulePO fatherModulePO = moduleDao.get(moduleVO.getFatherModule().getMid());

			if (fatherModulePO == null) {
				throw new FLException(230011, "模块不存在");
			}

			modulePO.setFatherModule(fatherModulePO);
		}

		BeanUtil.copyProperties(moduleVO, modulePO, Arrays.asList("fatherModule"));

		moduleDao.save(modulePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRoleModuleByRid(ModuleVO moduleVO, RoleVO roleVO, List<ModuleVO> modules, int rid, String userId, Integer company) throws FLException {

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
	public int synceRoleModule(ModuleVO moduleVO, RoleVO roleVO, List<ModuleVO> moduleVOs, int rid, String userId, Integer company) throws FLException {

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteModule(ModuleVO moduleVO, Integer company) throws FLException {

		int mid = moduleVO.getMid();

		if (roleModuleDao.countRoleModuleByMid(mid, company) > 0) {
			throw new FLException(230012, "模块已经被引用,不能被删除");
		}

		moduleDao.deleteModule(mid);
		moduleDao.deleteById(mid);

		return 0;
	}

	private int convertModule(ModulePO modulePO, ModuleVO moduleVO) {

		BeanUtil.copyProperties(modulePO, moduleVO, Arrays.asList("fatherModule", "operations"));

		if (modulePO.getFatherModule() != null) {
			ModuleVO fatherModuleVO = new ModuleVO();

			convertModule(modulePO.getFatherModule(), fatherModuleVO);

			moduleVO.setFatherModule(fatherModuleVO);
		}

		return 0;
	}

	private int convertModule(Map<Integer, ModuleVO> modules, ModulePO modulePO, Short link, Short access) {

		ModuleVO moduleVO = new ModuleVO();

		BeanUtil.copyProperties(modulePO, moduleVO, Arrays.asList("fatherModule", "operations"));

		moduleVO.setLink(link);
		moduleVO.setAccess(access);

		ModulePO fatherModulePO = modulePO.getFatherModule();

		if (fatherModulePO != null) {

			convertModule(modules, fatherModulePO, link, access);

			ModuleVO fatherModuleVO = new ModuleVO();

			BeanUtil.copyProperties(modulePO.getFatherModule(), fatherModuleVO, Arrays.asList("fatherModule", "operations"));

			moduleVO.setFatherModule(fatherModuleVO);
		}

		if (modules.get(moduleVO.getMid()) == null) {
			modules.put(moduleVO.getMid(), moduleVO);
		}

		return 0;
	}

}
