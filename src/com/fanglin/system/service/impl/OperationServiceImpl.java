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
		if (operationPO.getType() == OperationPO.THROUGH_COMMON_INT) return true;
		if (operationPO.getType() == OperationPO.THROUGH_PASS_INT) return true;

		List<UserRolePO> userRolePOs = userRoleDao.queryUserRole(userPO.getUid());

		List<Integer> rids = new ArrayList<Integer>(Arrays.asList(userPO.getRole().getRid()));

		for (UserRolePO userRolePO : userRolePOs) {
			rids.add(userRolePO.getRole().getRid());
		}

		RoleOperationPO roleOperationPO = roleOperationDao.queryRoleOperation(rids, operationPO.getOid());

		result = roleOperationPO != null;

		return rollcall == 0 ? result : !result;
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
