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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONException;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.dao.BrandInstorerDao;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.dao.DutyDao;
import com.fanglin.communion.po.BrandInstorerPO;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.personel.dao.InstorerDao;
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
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.PinYin4Util;
import com.fanglin.utils.SystemConfig;

@Service("A20260404Service")
@Transactional
public class A20260404ServiceImpl implements A20260404Service {

	private static final Logger logger = LoggerFactory.getLogger(A20260404ServiceImpl.class);

	@Autowired
	private SupplierDao supplierDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private InstorerDao instorerDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private BrandInstorerDao brandInstorerDao;

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

	@Autowired
	private CountingService countingService;

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

		// 1. 通过编号(userId)或原编号(oldUserId)判断是否存在
		UserPO supplierPO = userDao.queryUserByUserId(userId);

		if (supplierPO == null) {
			supplierPO = userDao.queryUserByOldUserId(userId);
		}

		String operation = "add";

		if (supplierPO != null) {
			// 存在则更新
			operation = "update";
			logger.info("供应商已存在，执行更新: uid={}, userId={}", supplierPO.getUid(), supplierPO.getUserId());

			// 更新基本信息
			supplierPO.setUserName(userName);
			supplierPO.setCurrentName(userName);
			supplierPO.setPhone(phone);
			// identity 为 NOT NULL：未传 creditCode 时跳过更新（避免置 NULL 违反约束），传空串视同清空
			if (creditCode != null) {
				supplierPO.setIdentity(creditCode);
			}

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

			// 6. 创建供应商用户（userId 系统生成, 对齐手工创建供应商: multicompany开=公司简称U-流水, 关=OC-流水; 外部原编号存 oldUserId）
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_SUPPLIER_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

			StringBuffer no = new StringBuffer();
			no.append(SystemConfig.getInt("multicompany", 0) != 0 ? String.format("%sU-", companyPO.getShortname()) : "OC-");
			no.append(FormatUtil.fillZero(count, "00000"));

			supplierPO = new UserPO();
			supplierPO.setUserId(no.toString());
			supplierPO.setLoginId(no.toString()); // loginId = userId
			supplierPO.setOldUserId(userId);
			supplierPO.setCurrentName(userName);
			supplierPO.setUserName(userName);
			supplierPO.setPhone(phone);

			// gender/identity 为 NOT NULL 且无默认值：gender 给空串占位，identity 落统一信用编码（未传时空串占位，防 NULL 拒插）
			supplierPO.setGender("");
			supplierPO.setIdentity(creditCode == null ? "" : creditCode);

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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Object> syncInstorer(String userId, String userName, String phone, Integer company, String supplierUserId, String brands, String agentName, String agentPhone) throws FLException {

		Map<String, Object> result = new HashMap<String, Object>();

		logger.info("同步驻店人员数据: userId={}, userName={}, company={}, supplierUserId={}, brands={}", userId, userName, company, supplierUserId, brands);

		// 0. 验证公司是否存在
		CompanyPO companyPO = companyDao.get(company);
		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		// 1. 验证所属厂商：必须是已存在的供应商类型用户（user.type = 1），
		// 驻店员经品牌链路归属厂商（brandInstorer.bid -> brand.ocuid），这里显式校验厂商有效性
		UserPO supplierPO = userDao.queryUserByUserId(supplierUserId);
		if (supplierPO == null || supplierPO.getType() != UserPO.TYPE_SUPPLIER_INT) {
			logger.warn("厂商不存在或类型不符: supplierUserId={}, type={}", supplierUserId, supplierPO == null ? null : supplierPO.getType());
			throw new FLException(400028, "厂商不存在");
		}

		// 2. 解析品牌编号列表（去重保序）并逐个定位品牌
		// brands 未传(null/空白)返回 null，表示本次只同步人员信息、不动品牌绑定
		List<String> brandNos = parseBrandNos(brands);

		Map<Long, BrandPO> brandPOMap = new LinkedHashMap<Long, BrandPO>();

		if (brandNos != null) {

			for (String no : brandNos) {

				BrandPO brandPO = brandDao.queryBrandByNo(no);

				if (brandPO == null) {
					logger.warn("品牌不存在: no={}", no);
					throw new FLException(400029, "品牌不存在");
				}

				// 品牌归属一致性：直属厂商与传入厂商不一致时告警不阻断（brandSupplier 多对多允许跨厂商绑定）
				if (brandPO.getSupplier() != null && brandPO.getSupplier().getUid() != supplierPO.getUid()) {
					logger.warn("品牌归属厂商与传入厂商不一致: no={}, brandOcuid={}, supplierUserId={}", no, brandPO.getSupplier().getUid(), supplierUserId);
				}

				brandPOMap.put(brandPO.getBid(), brandPO);
			}
		}

		// 3. 通过编号(userId)判断驻店员是否存在
		UserPO instorerPO = userDao.queryUserByUserId(userId);
		String operation = "add";

		if (instorerPO != null) {

			// 存在但非驻店员：编号撞车，拒绝覆盖（防止外部编号覆盖内部员工数据）
			if (instorerPO.getType() != UserPO.TYPE_INSTORER_INT) {
				logger.warn("编号已存在且非驻店员: userId={}, uid={}, type={}", userId, instorerPO.getUid(), instorerPO.getType());
				throw new FLException(400030, "编号已存在且非驻店员");
			}

			// 存在则更新
			operation = "update";
			logger.info("驻店员已存在，执行更新: uid={}, userId={}", instorerPO.getUid(), instorerPO.getUserId());

			instorerPO.setUserName(userName);
			instorerPO.setCurrentName(userName);
			instorerPO.setPhone(phone);

			instorerDao.update(instorerPO);
			logger.info("更新驻店员成功: uid={}, userId={}", instorerPO.getUid(), instorerPO.getUserId());

		} else {
			// 不存在则创建
			logger.info("驻店员不存在，执行新增: userId={}", userId);

			// 4. 检查驻店员数量限制
			SystemConfigPO userlimit = systemConfigDao.querySystemConfig("instorerlimit", company);
			if (instorerDao.countInstorerByCompany(company) >= (userlimit == null ? 100 : Integer.valueOf(userlimit.getValue()))) {
				throw new FLException(190008, "人员数已达上限");
			}

			// 5. 获取默认部门（从 systemConfig 获取 instorerDept 配置）
			SystemConfigPO deptConfig = systemConfigDao.querySystemConfig("instorerDept");
			if (deptConfig == null) {
				throw new FLException(400031, "驻店员部门配置无效(instorerDept)");
			}
			DepartmentPO departmentPO = departmentDao.get(Integer.valueOf(deptConfig.getValue()));
			if (departmentPO == null) {
				throw new FLException(400031, "驻店员部门配置无效(instorerDept)");
			}

			// 6. 获取默认角色（从 systemConfig 获取 instorer 角色ID）
			SystemConfigPO roleConfig = systemConfigDao.querySystemConfig("instorer");
			if (roleConfig == null) {
				throw new FLException(230010, "角色不存在");
			}
			RolePO rolePO = new RolePO(Integer.valueOf(roleConfig.getValue()));

			// 7. 获取默认职位（从 systemConfig 获取 instorerDuty 配置）
			SystemConfigPO dutyConfig = systemConfigDao.querySystemConfig("instorerDuty");
			if (dutyConfig == null) {
				throw new FLException(400032, "驻店员职位配置无效(instorerDuty)");
			}
			DutyPO dutyPO = dutyDao.get(Long.valueOf(dutyConfig.getValue()));
			if (dutyPO == null) {
				throw new FLException(400032, "驻店员职位配置无效(instorerDuty)");
			}

			// 8. 创建驻店员用户
			instorerPO = new UserPO();
			instorerPO.setUserId(userId);
			instorerPO.setLoginId(userId); // loginId = userId
			instorerPO.setCurrentName(userName);
			instorerPO.setUserName(userName);
			instorerPO.setPhone(phone);

			// gender/identity/oldUserId 为 NOT NULL 且无默认值，外部同步数据不含这几项，给空串占位
			// （与生产 user 表既有空串占位数据一致，不伪造性别/身份证信息；identity 列即用户表证件号字段，驻店员同步不采集）
			instorerPO.setGender("");
			instorerPO.setIdentity("");
			instorerPO.setOldUserId("");

			// 设置默认密码
			SystemConfigPO passwordConfig = systemConfigDao.querySystemConfig("password", company);
			String defaultPassword = passwordConfig == null ? "helloworld" : passwordConfig.getValue();
			instorerPO.setPassword(MD5Helper.MD5(defaultPassword));

			// 设置部门、角色、职位
			instorerPO.setDept(departmentPO);
			instorerPO.setRole(rolePO);
			instorerPO.setDuty(dutyPO);

			// 设置公司
			instorerPO.setCompany(company);

			// 生成拼音
			instorerPO.setPinYin(PinYin4Util.getPinyin(userName).get(0));

			// 设置状态
			instorerPO.setIsLogin(UserPO.ISLOGIN_FIP_INT);
			instorerPO.setType(UserPO.TYPE_INSTORER_INT);
			instorerPO.setExtranet((short) (UserPO.EXTRANET_WEB_INT + UserPO.EXTRANET_PC_INT));

			// 保存
			instorerDao.save(instorerPO);
			logger.info("新增驻店员成功: uid={}, userId={}", instorerPO.getUid(), instorerPO.getUserId());

			// 9. 创建用户角色关联
			UserRolePO userRolePO = new UserRolePO(instorerPO.getUid(), rolePO, instorerPO);
			userRoleDao.save(userRolePO);

			// 10. 创建用户信息
			UserInfoPO userInfoPO = new UserInfoPO();
			userInfoPO.setSalary("0");
			userInfoPO.setUser(instorerPO);
			userInfoDao.save(userInfoPO);
		}

		// 11. 品牌绑定全量对齐：仅当传入 brands 时执行，以本次列表为准补缺删多；未传不动存量绑定
		if (brandNos != null) {

			List<BrandInstorerPO> existPOs = brandInstorerDao.queryBrandInstorerByIuid(instorerPO.getUid());

			Map<Long, BrandInstorerPO> existMap = new HashMap<Long, BrandInstorerPO>();

			for (BrandInstorerPO existPO : existPOs) {
				if (existPO.getBrand() != null) {
					existMap.put(existPO.getBrand().getBid(), existPO);
				}
			}

			for (BrandPO brandPO : brandPOMap.values()) {

				BrandInstorerPO existPO = existMap.remove(brandPO.getBid());

				if (existPO == null) {
					BrandInstorerPO brandInstorerPO = new BrandInstorerPO();
					brandInstorerPO.setInstorer(instorerPO);
					brandInstorerPO.setBrand(brandPO);
					brandInstorerPO.setAgentName(agentName);
					brandInstorerPO.setAgentPhone(agentPhone);

					brandInstorerDao.save(brandInstorerPO);
					logger.info("新增品牌绑定: iuid={}, bid={}, no={}", instorerPO.getUid(), brandPO.getBid(), brandPO.getNo());
				} else if (agentName != null || agentPhone != null) {
					// 代理信息传入才覆盖，未传不动
					if (agentName != null) {
						existPO.setAgentName(agentName);
					}
					if (agentPhone != null) {
						existPO.setAgentPhone(agentPhone);
					}

					brandInstorerDao.update(existPO);
				}
			}

			for (BrandInstorerPO stalePO : existMap.values()) {
				brandInstorerDao.delete(stalePO);
				logger.info("删除多余品牌绑定: biid={}, iuid={}, bid={}", stalePO.getBiid(), instorerPO.getUid(), stalePO.getBrand() == null ? null : stalePO.getBrand().getBid());
			}
		}

		// 12. 返回结果
		result.put("success", true);
		result.put("operation", operation);
		result.put("uid", instorerPO.getUid());
		result.put("userId", instorerPO.getUserId());
		result.put("userName", instorerPO.getUserName());
		result.put("supplierUserId", supplierPO.getUserId());

		if (brandNos != null) {

			List<Map<String, Object>> brandResults = new ArrayList<Map<String, Object>>();

			for (BrandPO brandPO : brandPOMap.values()) {

				Map<String, Object> brandResult = new HashMap<String, Object>();
				brandResult.put("bid", brandPO.getBid());
				brandResult.put("no", brandPO.getNo());
				brandResult.put("name", brandPO.getName());

				brandResults.add(brandResult);
			}

			result.put("brands", brandResults);
		}

		return result;
	}

	/**
	 * 解析品牌编号列表：JSON数组字符串 -> 去重保序的编号列表
	 * brands 未传(null/空白)返回 null，表示调用方本次不管理品牌绑定；
	 * 传入但非法(非JSON数组)或解析后为空(如"[]")仍抛 400033，防止显式空列表触发全量删除
	 */
	private List<String> parseBrandNos(String brands) throws FLException {

		if (brands == null || brands.trim().isEmpty()) {
			return null;
		}

		List<String> brandNos = new ArrayList<String>();

		try {
			List<String> nos = JSON.parseArray(brands.trim(), String.class);

			if (nos != null) {
				for (String no : nos) {
					if (no != null && !no.trim().isEmpty() && !brandNos.contains(no.trim())) {
						brandNos.add(no.trim());
					}
				}
			}
		} catch (JSONException e) {
			throw new FLException(400033, "品牌列表不能为空且必须为JSON数组格式");
		}

		if (brandNos.isEmpty()) {
			throw new FLException(400033, "品牌列表不能为空且必须为JSON数组格式");
		}

		return brandNos;
	}

}
