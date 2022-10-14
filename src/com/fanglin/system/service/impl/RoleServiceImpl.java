package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
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
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.dao.RoleModuleDao;
import com.fanglin.system.dao.RoleOperationDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.service.RoleService;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

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
				BeanUtil.copyProperties(rolePO, roleVO, Arrays.asList("creater"));
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
				RoleVO roleVO = new RoleVO(new UserBaseVO());
				BeanUtil.copyProperties(rolePO, roleVO, Arrays.asList("creater"));
				BeanUtil.copyProperties(rolePO.getCreater(), roleVO.getCreater(), Arrays.asList("duty", "dept", "role"));
				roleVOs.add(roleVO);
			}
		}

		return roleVOs;
	}

	@Override
	public RoleVO queryRoleByRid(RoleVO roleVO) {

		RolePO rolePO = roleDao.get(roleVO.getRid());

		if (rolePO != null && !RolePO.SUPER_NO_STR.equals(rolePO.getNo())) {
			BeanUtil.copyProperties(rolePO, roleVO, Arrays.asList("creater"));
		}

		return roleVO;
	}

	@Override
	public List<RoleVO> queryRoleByName(RoleVO roleVO, Integer company) {

		Paging paging = new Paging(0, 10);
		List<RolePO> rolePOs = roleDao.queryRoleByName(paging, roleVO.getName(), company);
		List<RoleVO> roleVOs = new ArrayList<RoleVO>();

		for (RolePO rolePO : rolePOs) {
			roleVO = new RoleVO();
			BeanUtil.copyPropertie(rolePO, roleVO, Arrays.asList("creater"));
			roleVOs.add(roleVO);
		}

		return roleVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addRole(RoleVO roleVO, Integer company, String userId) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		UserPO creater = userDao.queryUserByUserId(userId);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		RolePO rolePO = new RolePO();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_ROLE_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		StringBuffer roleId = new StringBuffer();
		roleId.append(String.format("%sR_", companyPO.getShortname()));
		roleId.append(FormatUtil.fillZero(count, "0000"));

		BeanUtil.copyProperties(roleVO, rolePO, Arrays.asList("no", "creater"));

		rolePO.setCreater(creater);
		rolePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		rolePO.setNo(roleId.toString());
		rolePO.setCompany(company);
		rolePO.setPinyin(PinYin4Util.getPinyin(roleVO.getName()).get(0).toString());

		roleDao.saveOrUpdate(rolePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRole(RoleVO roleVO) {

		RolePO rolePO = roleDao.get(roleVO.getRid());
		String name = roleVO.getName();
		if (rolePO != null) {

			BeanUtil.copyProperties(roleVO, rolePO, Arrays.asList("no", "creater"));
			rolePO.setPinyin(PinYin4Util.getPinyin(name).get(0).toString());

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
	public int deleteRoleByRid(RoleVO roleVO, int qid) throws FLException {

		int rid = roleVO.getRid();

		RolePO rolePO = roleDao.get(rid);

		if (rolePO == null) {
			throw new FLException(230010, "角色不存在");
		}

		int count = userDao.countUserByRoleId(rid);

		if (count > 0) {
			throw new FLException(230006, String.format("角色编号[%s]已被引用, 不能被删除", rid));
		}

		RolePO roleCO = roleDao.get(qid);

		if (roleCO == null) {
			throw new FLException(230010, "角色不存在");
		}

		if (roleCO.getLevel() < rolePO.getLevel()) {
			throw new FLException(-1, "无操作权限");
		}

		roleModuleDao.deleteRoleModuleByRid(rolePO.getRid());
		roleOperationDao.deleteRoleOperationByRid(rolePO.getRid());

		roleDao.delete(rolePO);

		return 0;
	}

}
