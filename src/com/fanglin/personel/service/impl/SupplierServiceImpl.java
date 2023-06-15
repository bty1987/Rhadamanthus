/**
 * @File Name		: SupplierServiceImpl.java
 * @Package   	: com.fanglin.personel.service.impl
 * @Version		: 1.0
 * @Date			: 2019-10-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.SupplierDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.dao.UserRoleDao;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserRolePO;
import com.fanglin.personel.service.SupplierService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;
import com.fanglin.utils.SystemConfig;

@Service("supplierService")
@Transactional(readOnly = true)
public class SupplierServiceImpl implements SupplierService {

	@Autowired
	private SupplierDao supplierDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private UserRoleDao userRoleDao;

	@Autowired
	private UserInfoDao userInfoDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageSupplier(Paging paging, List<Filter> filters, int company) throws FLException {

		List<UserPO> supplierPOs = supplierDao.pageSupplier(paging, filters, company);
		List<UserVO> supplierVOs = new ArrayList<UserVO>();

		for (UserPO supplierPO : supplierPOs) {
			supplierVOs.add(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()).ptv(supplierPO));
		}

		paging.setData(supplierVOs);
	}

	@Override
	public List<UserVO> querySupplierByPinyin(String pinyin, int company) throws FLException {

		List<UserVO> supplierVOs = new ArrayList<UserVO>();
		List<UserPO> supplierPOs = supplierDao.querySupplierByPinyin(pinyin, company);

		for (UserPO supplierPO : supplierPOs) {
			supplierVOs.add(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()).ptv(supplierPO));
		}

		return supplierVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSupplier(UserVO supplierVO, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		SystemConfigPO userlimit = systemConfigDao.querySystemConfig("supplierlimit", company);

		if (supplierDao.countSupplierByCompany(company) >= (userlimit == null ? 100 : Integer.valueOf(userlimit.getValue()))) {
			throw new FLException(190008, "人员数已达上限");
		}

		UserPO supplierPO = new UserPO();

		DepartmentPO departmentPO = departmentDao.get(supplierVO.getDept().getDid());

		if (departmentPO.getFatherDept() == null) {
			throw new FLException(310002, "部门不可添加人员");
		}

		SystemConfigPO supplier = systemConfigDao.querySystemConfig("supplier"); // 游客角色ID

		if (supplier == null) {
			throw new FLException(230010, "角色不存在");
		}

		BeanUtil.copyProperties(supplierVO, supplierPO, Arrays.asList("role", "dept", "duty", "uId", "userId", "loginId", "password", "role", "isLogin", "company", "extranet"));

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_SUPPLIER_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		StringBuffer no = new StringBuffer();
		no.append(SystemConfig.getInt("multicompany", 0) != 0 ? String.format("%sU-", companyPO.getShortname()) : "OC-");
		no.append(FormatUtil.fillZero(count, "00000"));

		supplierPO.setUserId(no.toString());
		supplierPO.setLoginId(supplierVO.getLoginId());
		supplierPO.setCurrentName(supplierVO.getUserName());

		SystemConfigPO password = systemConfigDao.querySystemConfig("password", company);

		supplierPO.setPassword(MD5Helper.MD5(password == null ? "helloworld" : password.getValue()));

		supplierPO.setRole(new RolePO(Integer.valueOf(supplier.getValue())));
		supplierPO.setDuty(new DutyPO(supplierVO.getDuty().getDid()));
		supplierPO.setDept(departmentPO);

		supplierPO.setCompany(company);

		supplierPO.setPinYin(PinYin4Util.getPinyin(supplierVO.getCurrentName()).get(0));

		supplierPO.setIsLogin(UserPO.ISLOGIN_FIP_INT);
		supplierPO.setType(UserPO.TYPE_SUPPLIER_INT);

		supplierDao.save(supplierPO);

		UserPO operator = userDao.queryUserByUserId(userId);

		userRoleDao.save(new UserRolePO(supplierPO.getUid(), supplierPO.getRole(), operator));

		supplierVO.setUid(supplierPO.getUid());

		UserInfoPO userInfoPO = new UserInfoPO();

		userInfoPO.setSalary("0");
		userInfoPO.setUser(supplierPO);

		userInfoDao.save(userInfoPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateSupplier(UserVO supplier) throws FLException {

		UserPO supplierPO = supplierDao.get(supplier.getUid());

		if (supplierPO == null) {
			throw new FLException(190012, "厂商不存在");
		}

		supplierPO.setUserName(supplier.getUserName());
		supplierPO.setCurrentName(supplier.getCurrentName());
		supplierPO.setPhone(supplier.getPhone());
		supplierPO.setOldUserId(supplier.getOldUserId());

		supplierDao.update(supplierPO);
	}

}
