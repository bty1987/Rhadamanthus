/**
 * @File Name		: A20260404ServiceImpl.java
 * @Package   	: com.fanglin.seiya.service.impl
 * @Version		: 1.0
 * @Date			: 2026-04-04
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: Supplier供应商数据同步服务实现
 */

package com.fanglin.seiya.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.dao.DutyDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.personel.dao.SupplierDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.dao.UserRoleDao;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserRolePO;
import com.fanglin.seiya.service.A20260404Service;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.PinYin4Util;

@Service("A20260404Service")
@Transactional
public class A20260404ServiceImpl implements A20260404Service {

	private static final Logger logger = LoggerFactory.getLogger(A20260404ServiceImpl.class);

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
	private DutyDao dutyDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Object> syncSupplier(String userId, String userName, String phone, Integer company, String creditCode) throws FLException {

		Map<String, Object> result = new HashMap<String, Object>();

		logger.info("同步供应商数据: userId={}, userName={}, phone={}, company={}, creditCode={}", userId, userName, phone, company, creditCode);

		// 0. 验证公司是否存在
		CompanyPO companyPO = companyDao.get(company);
		if (companyPO == null) {
			throw new FLException(510000, "公司不存在: " + company);
		}

		// 1. 通过编号(userId)判断是否存在
		UserPO supplierPO = userDao.queryUserByUserId(userId);
		String operation = "add";

		if (supplierPO != null) {
			// 存在则更新
			operation = "update";
			logger.info("供应商已存在，执行更新: uid={}, userId={}", supplierPO.getUid(), supplierPO.getUserId());

			// 更新基本信息
			supplierPO.setUserName(userName);
			supplierPO.setCurrentName(userName);
			supplierPO.setPhone(phone);
			supplierPO.setOldUserId(creditCode); // oldUserId = 统一信用编码

			supplierDao.update(supplierPO);
			logger.info("更新供应商成功: uid={}, userId={}", supplierPO.getUid(), supplierPO.getUserId());

		} else {
			// 不存在则创建
			logger.info("供应商不存在，执行新增: userId={}", userId);

			// 2. 检查供应商数量限制
			SystemConfigPO userlimit = systemConfigDao.querySystemConfig("supplierlimit", company);
			if (supplierDao.countSupplierByCompany(company) >= (userlimit == null ? 100 : Integer.valueOf(userlimit.getValue()))) {
				throw new FLException(190036, "供应商数已达上限");
			}

			// 3. 获取默认部门（从 systemConfig 获取 supplierDept 配置）
			SystemConfigPO deptConfig = systemConfigDao.querySystemConfig("supplierDept");
			if (deptConfig == null) {
				throw new FLException(310004, "供应商部门配置不存在(supplierDept)");
			}
			DepartmentPO departmentPO = departmentDao.get(Integer.valueOf(deptConfig.getValue()));
			if (departmentPO == null) {
				throw new FLException(310002, "供应商部门不存在: " + deptConfig.getValue());
			}

			// 4. 获取默认角色（从 systemConfig 获取 supplier 角色ID）
			SystemConfigPO roleConfig = systemConfigDao.querySystemConfig("supplier");
			if (roleConfig == null) {
				throw new FLException(230029, "供应商角色配置不存在(supplier)");
			}
			RolePO rolePO = new RolePO(Integer.valueOf(roleConfig.getValue()));

			// 5. 获取默认职位（从 systemConfig 获取 supplierDuty 配置）
			SystemConfigPO dutyConfig = systemConfigDao.querySystemConfig("supplierDuty");
			if (dutyConfig == null) {
				throw new FLException(230027, "供应商职位配置不存在(supplierDuty)");
			}
			DutyPO dutyPO = dutyDao.get(Long.valueOf(dutyConfig.getValue()));
			if (dutyPO == null) {
				throw new FLException(230011, "供应商职位不存在: " + dutyConfig.getValue());
			}

			// 6. 创建供应商用户
			supplierPO = new UserPO();
			supplierPO.setUserId(userId);
			supplierPO.setLoginId(userId); // loginId = userId
			supplierPO.setCurrentName(userName);
			supplierPO.setUserName(userName);
			supplierPO.setPhone(phone);
			supplierPO.setOldUserId(creditCode); // oldUserId = 统一信用编码

			// gender/identity 为 NOT NULL 且无默认值，外部同步数据不含这两项，给空串占位
			// （与生产 user 表既有空串占位数据一致，不伪造性别/身份证信息）
			supplierPO.setGender("");
			supplierPO.setIdentity("");

			// 设置默认密码
			SystemConfigPO passwordConfig = systemConfigDao.querySystemConfig("password", company);
			String defaultPassword = passwordConfig == null ? "helloworld" : passwordConfig.getValue();
			supplierPO.setPassword(MD5Helper.MD5(defaultPassword));

			// 设置部门、角色、职位
			supplierPO.setDept(departmentPO);
			supplierPO.setRole(rolePO);
			supplierPO.setDuty(dutyPO);

			// 设置公司
			supplierPO.setCompany(company);

			// 生成拼音
			supplierPO.setPinYin(PinYin4Util.getPinYinHeadChar(userName).get(0));

			// 设置状态
			supplierPO.setIsLogin(UserPO.ISLOGIN_FIP_INT);
			supplierPO.setType(UserPO.TYPE_SUPPLIER_INT);
			supplierPO.setExtranet((short) (UserPO.EXTRANET_WEB_INT + UserPO.EXTRANET_PC_INT));

			// 保存
			supplierDao.save(supplierPO);
			logger.info("新增供应商成功: uid={}, userId={}", supplierPO.getUid(), supplierPO.getUserId());

			// 7. 创建用户角色关联
			UserRolePO userRolePO = new UserRolePO(supplierPO.getUid(), rolePO, supplierPO);
			userRoleDao.save(userRolePO);

			// 8. 创建用户信息
			UserInfoPO userInfoPO = new UserInfoPO();
			userInfoPO.setSalary("0");
			userInfoPO.setUser(supplierPO);
			userInfoDao.save(userInfoPO);
		}

		// 9. 返回结果
		result.put("success", true);
		result.put("operation", operation);
		result.put("uid", supplierPO.getUid());
		result.put("userId", supplierPO.getUserId());
		result.put("userName", supplierPO.getUserName());

		return result;

	}

}
