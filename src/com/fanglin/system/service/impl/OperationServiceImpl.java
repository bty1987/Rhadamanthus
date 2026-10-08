/**
 * @File Name		: OperationServiceImpl.java
 * @Package   	: com.fanglin.system.service.impl
 * @Version		: 1.0
 * @Date			: 2016-4-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
import com.fanglin.system.dao.OperationDao;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.dao.RoleOperationDao;
import com.fanglin.system.po.ModulePO;
import com.fanglin.system.po.OperationPO;
import com.fanglin.system.po.RoleOperationPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.service.OperationService;
import com.fanglin.system.vo.ModuleVO;
import com.fanglin.system.vo.OperationVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("operationService")
@Transactional(readOnly = true)
public class OperationServiceImpl implements OperationService {

	@Autowired
	private OperationDao operationDao;

	@Autowired
	private RoleOperationDao roleOperationDao;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private ModuleDao moduleDao;

	@Autowired
	private UserRoleDao userRoleDao;

	@Override
	public void pageOperation(Paging paging, List<Filter> filters) {

		List<OperationPO> operationPOs = operationDao.pageOperation(paging, filters);
		List<OperationVO> operationVOs = new ArrayList<OperationVO>();

		for (OperationPO operationPO : operationPOs) {

			OperationVO operationVO = new OperationVO(new ModuleVO());

			BeanUtil.copyProperties(operationPO, operationVO, Arrays.asList("module"));
			BeanUtil.copyProperties(operationPO.getModule(), operationVO.getModule(), Arrays.asList("fatherModule", "operations"));

			operationVOs.add(operationVO);
		}

		paging.setData(operationVOs);
	}

	@Override
	public List<OperationVO> queryOperation(OperationVO operationVO) {

		List<OperationPO> operationPOs = operationDao.queryOperation();
		List<OperationVO> operationVOs = new ArrayList<OperationVO>();

		for (OperationPO operationPO : operationPOs) {

			OperationVO _operationVO = new OperationVO();

			BeanUtil.copyProperties(operationPO, _operationVO, Arrays.asList("module"));

			operationVOs.add(_operationVO);
		}

		return operationVOs;
	}

	@Override
	public List<OperationVO> queryOperationByUserId(OperationVO operationVO, UserVO userVO, Integer company) throws FLException {

		UserPO userPO = userDao.get(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		List<OperationVO> operationVOs = new ArrayList<OperationVO>();

		if (RolePO.SUPER_NO_STR.equals(userPO.getRole().getNo())) {

			List<OperationPO> operationPOs = operationDao.queryOperation();

			for (OperationPO operationPO : operationPOs) {

				operationVO = new OperationVO();

				BeanUtil.copyProperties(operationPO, operationVO, Arrays.asList("module"));

				operationVOs.add(operationVO);
			}
		} else {

			List<RoleOperationPO> roleOperationPOs = roleOperationDao.queryRoleOperationByRid(userPO.getRole().getRid(), company);

			for (RoleOperationPO roleOperationPO : roleOperationPOs) {
				OperationVO _operationVO = new OperationVO();

				BeanUtil.copyProperties(roleOperationPO.getOperation(), _operationVO, Arrays.asList("module"));

				operationVOs.add(_operationVO);
			}
		}

		return operationVOs;
	}

	@Override
	public List<OperationVO> queryOperationByRid(OperationVO operationVO, RoleVO roleVO, Integer company) throws FLException {

		RolePO rolePO = roleDao.get(roleVO.getRid());

		if (rolePO == null) {
			throw new FLException(230010, "角色不存在");
		}

		List<OperationVO> operationVOs = new ArrayList<OperationVO>();

		if (RolePO.SUPER_NO_STR.equals(rolePO.getNo())) {

			List<OperationPO> operationPOs = operationDao.queryOperation();

			for (OperationPO operationPO : operationPOs) {

				operationVO = new OperationVO();

				BeanUtil.copyProperties(operationPO, operationVO, Arrays.asList("module"));

				operationVOs.add(operationVO);
			}
		} else {

			List<RoleOperationPO> roleOperationPOs = roleOperationDao.queryRoleOperationByRid(rolePO.getRid(), company);

			for (RoleOperationPO roleOperationPO : roleOperationPOs) {
				OperationVO _operationVO = new OperationVO();

				BeanUtil.copyProperties(roleOperationPO.getOperation(), _operationVO, Arrays.asList("module"));

				operationVOs.add(_operationVO);
			}
		}

		return operationVOs;
	}

	@Override
	public List<OperationVO> queryOperationForSelf(String userId, Integer company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		List<OperationVO> operationVOs = new ArrayList<OperationVO>();

		if (RolePO.SUPER_NO_STR.equals(userPO.getRole().getNo())) {

			List<OperationPO> operationPOs = operationDao.queryOperation();

			for (OperationPO operationPO : operationPOs) {

				OperationVO operationVO = new OperationVO();

				BeanUtil.copyProperties(operationPO, operationVO, Arrays.asList("module"));

				if (operationPO.getModule() != null) {
					ModuleVO moduleVO = new ModuleVO();
					BeanUtil.copyProperties(operationPO.getModule(), moduleVO);
					operationVO.setModule(moduleVO);
				}

				operationVOs.add(operationVO);
			}
		} else {

			List<UserRolePO> userRolePOs = userRoleDao.queryUserRole(userPO.getUid());

			List<Integer> rids = new ArrayList<Integer>(Arrays.asList(userPO.getRole().getRid()));

			for (UserRolePO userRolePO : userRolePOs) {
				rids.add(userRolePO.getRole().getRid());
			}

			List<RoleOperationPO> roleOperationPOs = roleOperationDao.queryRoleOperation(rids, company);

			OperationVO operationVO;

			for (RoleOperationPO roleOperationPO : roleOperationPOs) {

				operationVO = new OperationVO();

				BeanUtil.copyProperties(roleOperationPO.getOperation(), operationVO, Arrays.asList("module"));

				if (roleOperationPO.getOperation().getModule() != null) {
					ModuleVO moduleVO = new ModuleVO();
					BeanUtil.copyProperties(roleOperationPO.getOperation().getModule(), moduleVO);
					operationVO.setModule(moduleVO);
				}

				operationVOs.add(operationVO);

			}
		}

		return operationVOs;
	}

	@Override
	public OperationVO checkOperation(OperationVO operationVO) throws FLException {

		OperationPO operationPO = operationDao.queryOperationByOperation(operationVO.getOperation());

		if (operationPO != null) {
			BeanUtil.copyPropertie(operationPO, operationVO);
		}

		return operationVO;
	}

	@Override
	public boolean checkOperation(String userId, String operation, short rollcall) throws FLException {

		boolean result = false;

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		OperationPO operationPO = operationDao.queryOperationByOperation(operation);

		if (operationPO == null) return true;
		// 修复: 历史代码误用 getType() 比对 THROUGH_* 常量,正确应为 getThrough()
		// type 字段现作为「接口分组标签」(如 type=1 标记 login/common→base 迁移组),
		// 不再承担鉴权档位语义,避免后续按 type 标签批量关闸 through=0 时被误短路放行
		if (operationPO.getThrough() == OperationPO.THROUGH_COMMON_INT) return true;
		if (operationPO.getThrough() == OperationPO.THROUGH_PASS_INT) return true;

		List<UserRolePO> userRolePOs = userRoleDao.queryUserRole(userPO.getUid());

		List<Integer> rids = new ArrayList<Integer>(Arrays.asList(userPO.getRole().getRid()));

		for (UserRolePO userRolePO : userRolePOs) {
			rids.add(userRolePO.getRole().getRid());
		}

		// 修复: 历史错配——此参数是company(8.3.004.010起SQL按company过滤),曾误传oid致角色校验错乱(oid>公司数恒拒绝)
		RoleOperationPO roleOperationPO = roleOperationDao.queryRoleOperation(rids, operationPO.getOid(), userPO.getCompany());

		result = roleOperationPO != null;

		return rollcall == 0 ? result : !result;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void fillOperation(String userId, Integer roleId, Integer company, String operation) throws FLException {

		// 四要素不齐,跳过(只对已登录、信息完整的请求收集)
		if (userId == null || roleId == null || company == null || operation == null) return;

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) throw new FLException(220005, "员工不存在");

		// 1. operation 不存在则创建(through=1 收集期放行, type=0 留给关闸后校验)
		OperationPO operationPO = operationDao.queryOperationByOperation(operation);

		if (operationPO == null) {
			operationDao.save(new OperationPO(operation, OperationPO.SYSTEM_PLATFORM_INT, OperationPO.STATUS_ENABLE_INT, OperationPO.THROUGH_PASS_INT, OperationPO.TYPE_CHECK_INT));
		}

		int oid = operationPO.getOid();

		// 2. 补 roleoperation:主角色 roleId + userrole 附加角色
		addRoleOperation(roleId, oid, company, userPO);

		List<UserRolePO> userRolePOs = userRoleDao.queryUserRole(userPO.getUid());

		for (UserRolePO userRolePO : userRolePOs) {
			addRoleOperation(userRolePO.getRole().getRid(), oid, company, userPO);
		}
	}

	private void addRoleOperation(int rid, int oid, int company, UserPO creater) {

		if (roleOperationDao.queryRoleOperation(rid, oid, company) == null) {
			roleOperationDao.save(new RoleOperationPO(new OperationPO(oid), rid, creater, company));
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addOperation(OperationVO operationVO) {

		OperationPO operationPO = new OperationPO(new ModulePO());

		BeanUtil.copyProperties(operationVO, operationPO, Arrays.asList("module"));

		ModulePO modulePO = moduleDao.get(operationVO.getModule().getMid());

		operationPO.setModule(modulePO);

		operationDao.save(operationPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOpperation(OperationVO operationVO) throws FLException {

		OperationPO operationPO = operationDao.get(operationVO.getOid());

		BeanUtil.copyPropertie(operationVO, operationPO, Arrays.asList("module"));

		ModulePO modulePO = moduleDao.get(operationVO.getModule().getMid());
		operationPO.setModule(modulePO);

		operationDao.update(operationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRoleOperation(RoleVO roleVO, OperationVO operationVO, String userId, Integer company) throws FLException {

		RolePO rolePO = roleDao.get(roleVO.getRid());

		if (rolePO == null) {
			throw new FLException(230010, "角色不存在");
		}

		UserPO operator = userDao.queryUserByUserId(userId);

		if (operator.getRole().getRid() == rolePO.getRid()) {
			throw new FLException(-1, "无操作权限");
		}

		if (operator.getRole().getLevel() < rolePO.getLevel()) {
			throw new FLException(-1, "无操作权限");
		}

		RoleOperationPO roleOperationPO = roleOperationDao.queryRoleOperation(roleVO.getRid(), operationVO.getOid(), company);

		if (roleOperationPO == null) roleOperationDao.save(new RoleOperationPO(new OperationPO(operationVO.getOid()), rolePO.getRid(), operator, company));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRoleOperationByRid(List<Integer> oids, RoleVO roleVO, String userId, Integer company) throws FLException {

		RolePO rolePO = roleDao.get(roleVO.getRid());

		if (rolePO == null) {
			throw new FLException(230010, "角色不存在");
		}

		roleOperationDao.deleteRoleOperationByRid(rolePO.getRid(), company);

		UserPO operator = userDao.queryUserByUserId(userId);

		if (operator.getRole().getRid() == rolePO.getRid()) {
			throw new FLException(-1, "无操作权限");
		}

		if (operator.getRole().getLevel() < rolePO.getLevel()) {
			throw new FLException(-1, "无操作权限");
		}

		if (oids == null || oids.size() == 0) return 0;

		for (Integer oid : oids) {
			roleOperationDao.save(new RoleOperationPO(new OperationPO(oid), rolePO.getRid(), operator, company));
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRoleOperationByUserId(List<Integer> oids, UserVO userVO, String userId, Integer company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		roleOperationDao.deleteRoleOperationByRid(userPO.getRole().getRid(), company);

		if (oids == null || oids.size() == 0) return 0;

		UserPO operator = userDao.queryUserByUserId(userId);

		if (operator.getRole().getRid() == userPO.getRole().getRid()) {
			throw new FLException(-1, "无操作权限");
		}

		if (operator.getRole().getLevel() < userPO.getRole().getLevel()) {
			throw new FLException(-1, "无操作权限");
		}

		for (Integer oid : oids) {
			roleOperationDao.save(new RoleOperationPO(new OperationPO(oid), userPO.getRole().getRid(), operator, company));
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteOperation(OperationVO operationVO, Integer company) throws FLException {

		int oid = operationVO.getOid();

		if (roleOperationDao.countRoleOperationByOid(oid, company) > 0) {
			throw new FLException(230013, "操作已经被引用,不能被删除");
		}

		operationDao.deleteById(oid);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteRoleOperation(RoleVO roleVO, OperationVO operationVO, Integer company) {

		RoleOperationPO roleOperationPO = roleOperationDao.queryRoleOperation(roleVO.getRid(), operationVO.getOid(), company);

		if (roleOperationPO != null) roleOperationDao.delete(roleOperationPO);

		return 0;
	}

}
