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
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.dao.RoleModuleDao;
import com.fanglin.system.dao.RoleOperationDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.service.RoleService;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("roleService")
@Transactional(readOnly = true)
public class RoleServiceImpl implements RoleService {

	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private RoleModuleDao roleModuleDao;

	@Autowired
	private RoleOperationDao roleOperationDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageRole(Paging paging, List<Filter> filters, Integer company) {

		List<RolePO> rolePOs = roleDao.pageRole(paging, filters, company);
		List<RoleVO> roleVOs = new ArrayList<RoleVO>();

		for (RolePO rolePO : rolePOs) {
			if (rolePO != null && !RolePO.SUPER_NO_STR.equals(rolePO.getNo())) {
				RoleVO roleVO = new RoleVO();
				BeanUtil.copyProperties(rolePO, roleVO);
				roleVOs.add(roleVO);
			}
		}

		paging.setData(roleVOs);
	}

	@Override
	public List<RoleVO> querylRole(Integer company) {

		List<RolePO> rolePOs = roleDao.queryRole(company);
		List<RoleVO> roleVOs = new ArrayList<RoleVO>();

		for (RolePO rolePO : rolePOs) {
			if (rolePO != null && !RolePO.SUPER_NO_STR.equals(rolePO.getNo())) {
				RoleVO roleVO = new RoleVO();
				BeanUtil.copyProperties(rolePO, roleVO);
				roleVOs.add(roleVO);
			}
		}

		return roleVOs;
	}

	@Override
	public RoleVO queryRoleByRid(RoleVO roleVO) {

		RolePO rolePO = roleDao.get(roleVO.getRid());

		if (rolePO != null && !RolePO.SUPER_NO_STR.equals(rolePO.getNo())) {
			BeanUtil.copyProperties(rolePO, roleVO);
		}

		return roleVO;
	}

	@Override
	public RoleVO queryRoleByName(RoleVO roleVO, Integer company) {

		RolePO rolePO = roleDao.queryRoleByName(roleVO.getName(), company);

		if (rolePO != null && !RolePO.SUPER_NO_STR.equals(rolePO.getNo())) {
			BeanUtil.copyProperties(rolePO, roleVO);
		}

		return roleVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addRole(RoleVO roleVO, Integer company) throws FLException {
		
		CompanyPO companyPO = companyDao.get(company);
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}
		
		RolePO rolePO = new RolePO();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_ROLE_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		StringBuffer roleId = new StringBuffer();
		roleId.append(String.format("%sR_", companyPO.getShortname()));
		roleId.append(FormatUtil.fillZero(count, "0000"));

		BeanUtil.copyProperties(roleVO, rolePO, Arrays.asList("no"));

		rolePO.setNo(roleId.toString());
		rolePO.setCompany(company);

		roleDao.saveOrUpdate(rolePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRole(RoleVO roleVO) {
		RolePO rolePO = roleDao.get(roleVO.getRid());

		if (rolePO != null) {
			BeanUtil.copyProperties(roleVO, rolePO, Arrays.asList("no"));
			roleDao.saveOrUpdate(rolePO);
		}

		return 0;
	}

	@Override
	@Transactional
	public int deleteRole(RoleVO roleVO) {

		roleDao.deleteById(roleVO.getRid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteRoleByRid(Integer rid) throws FLException {

		RolePO rolePO = roleDao.get(rid);

		if (rolePO != null) {

			int count = userDao.countUserByRoleId(rid);

			if (count > 0) {
				throw new FLException(230006, String.format("角色编号[%s]已被引用, 不能被删除", rid));
			}

			roleModuleDao.deleteRoleModuleByRid(rolePO.getRid());
			roleOperationDao.deleteRoleOperationByRid(rolePO.getRid());

			roleDao.delete(rolePO);
		}

		return 0;
	}

}
