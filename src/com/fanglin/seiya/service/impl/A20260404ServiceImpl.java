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
	public Map<String, Object> syncSupplier(String userId, String userName, String phone, Integer company) throws FLException {

		Map<String, Object> result = new HashMap<String, Object>();

		try {
			logger.info("同步供应商数据: userId={}, userName={}, phone={}, company={}", userId, userName, phone, company);

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
				supplierPO.setOldUserId(userId); // oldUserId = userId

				supplierDao.update(supplierPO);
				logger.info("更新供应商成功: uid={}, userId={}", supplierPO.getUid(), supplierPO.getUserId());

			} else {
				// 不存在则创建
				logger.info("供应商不存在，执行新增: userId={}", userId);

				// 2. 检查供应商数量限制
				SystemConfigPO userlimit = systemConfigDao.querySystemConfig("supplierlimit", company);
				if (supplierDao.countSupplierByCompany(company) >= (userlimit == null ? 100 : Integer.valueOf(userlimit.getValue()))) {
					throw new FLException(190008, "供应商数已达上限");
				}

				// 3. 获取默认部门（供应商部门）
				DepartmentPO departmentPO = getOrCreateSupplierDepartment(company);

				// 4. 获取默认角色（从 systemConfig 获取 supplier 角色ID）
				SystemConfigPO supplierConfig = systemConfigDao.querySystemConfig("supplier");
				if (supplierConfig == null) {
					throw new FLException(230010, "供应商角色配置不存在");
				}
				RolePO rolePO = new RolePO(Integer.valueOf(supplierConfig.getValue()));

				// 5. 获取默认职位（供应商职位）
				DutyPO dutyPO = getOrCreateSupplierDuty();

				// 6. 创建供应商用户
				supplierPO = new UserPO();
				supplierPO.setUserId(userId);
				supplierPO.setLoginId(userId); // loginId = userId
				supplierPO.setCurrentName(userName);
				supplierPO.setUserName(userName);
				supplierPO.setPhone(phone);
				supplierPO.setOldUserId(userId); // oldUserId = userId

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
				supplierPO.setPinYin(PinYin4Util.getPinyin(userName).get(0));

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

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			logger.error("同步供应商异常: userId={}, userName={}, company={}", userId, userName, company, e);
			throw new FLException(500003, "同步供应商失败: " + e.getMessage());
		}
	}

	/**
	 * 获取或创建供应商部门
	 *
	 * @param company 公司ID
	 * @return 供应商部门
	 * @throws FLException
	 */
	private DepartmentPO getOrCreateSupplierDepartment(Integer company) throws FLException {
		// 先尝试查找名为"供应商"的部门
		DepartmentPO dept = departmentDao.queryDepartment("供应商", company);

		if (dept != null) {
			// 验证是否是子部门（有父部门）
			if (dept.getFatherDept() == null) {
				logger.warn("供应商部门是根部门，不能添加人员，尝试查找子部门");
			} else {
				return dept;
			}
		}

		// 查找公司下的所有子部门
		java.util.List<DepartmentPO> depts = departmentDao.queryDepartment(null, null, company);
		if (depts != null && !depts.isEmpty()) {
			// 找第一个有父部门的子部门
			for (DepartmentPO d : depts) {
				if (d.getFatherDept() != null) {
					logger.info("使用默认部门: did={}, name={}", d.getDid(), d.getName());
					return d;
				}
			}
		}

		throw new FLException(310002, "未找到可用的供应商部门");
	}

	/**
	 * 获取或创建供应商职位
	 *
	 * @return 供应商职位
	 * @throws FLException
	 */
	private DutyPO getOrCreateSupplierDuty() throws FLException {
		// 先尝试查找名为"供应商"的职位
		DutyPO duty = dutyDao.queryDutyByName("供应商");

		if (duty != null) {
			return duty;
		}

		// 查找第一个可用职位
		java.util.List<DutyPO> dutys = dutyDao.queryDuty();
		if (dutys != null && !dutys.isEmpty()) {
			logger.info("使用默认职位: dtid={}, name={}", dutys.get(0).getDtid(), dutys.get(0).getName());
			return dutys.get(0);
		}

		throw new FLException(230011, "未找到可用的职位");
	}

}
