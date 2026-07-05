/**
 * @File Name		: A20260324ServiceImpl.java
 * @Package   	: com.fanglin.seiya.service.impl
 * @Version		: 1.0
 * @Date			: 2026-03-24
 * @Copyright	: Copyright Creators 2014
 * @Author		:
 * @Email			:
 * @Describing	:
 */

package com.fanglin.seiya.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.dao.DepartmentTypeDao;
import com.fanglin.communion.dao.DutyDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DepartmentTypePO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.personel.dao.DutmentDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserRoleDao;
import com.fanglin.personel.po.DutmentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserRolePO;
import com.fanglin.seiya.service.A20260324Service;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.PinYin4Util;

@Service("A20260324Service")
@Transactional
public class A20260324ServiceImpl implements A20260324Service {

	private static final Logger logger = LoggerFactory.getLogger(A20260324ServiceImpl.class);

	@Autowired
	private DutyDao dutyDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private DepartmentTypeDao departmentTypeDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DutmentDao dutmentDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private UserRoleDao userRoleDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String syncDuty(String code, String name, String orgCode, Integer type, Integer status, Integer leaderFlag) throws FLException {

		try {
			logger.info("同步职位信息: code={}, name={}, orgCode={}, type={}, status={}, leaderFlag={}", code, name, orgCode, type, status, leaderFlag);

			// 1. 获取部门类型
			// 注意：orgCode 参数保留但未使用，因为职位（Duty）是集团级数据，不需要归属到具体公司
			DepartmentTypePO departmentType = departmentTypeDao.get(type);
			if (departmentType == null) {
				throw new FLException(510001, "部门类型不存在: " + type);
			}

			// 2. 状态转换：1启用→0，其他→1
			short dutyStatus = (status != null && status == 1) ? DutyPO.STATUS_INIT_INT : (short) 1;

			// 3. 判断是新增还是更新
			DutyPO dutyPO = null;

			if (code != null && !code.trim().isEmpty()) {
				// code 有值，尝试通过编码查找现有职位进行更新
				dutyPO = dutyDao.queryDutyByCode(code);
				if (dutyPO != null) {
				} else {
					logger.warn("根据code未找到职位，视为新增: code={}", code);
				}
			}

			// 4. 构建 DutyPO 对象
			if (dutyPO == null) {
				// 新增：创建新对象
				dutyPO = new DutyPO(departmentType);

				// 检查职位名称是否已存在
				DutyPO existingDuty = dutyDao.queryDutyByName(name);
				if (existingDuty != null) {
					throw new FLException(130016, "职位已存在: " + name);
				}

				// 设置基本信息
				dutyPO.setName(name);
				dutyPO.setStatus(dutyStatus);
				dutyPO.setDepartmentType(departmentType);
				dutyPO.setType(0); // 保留字段，默认为0
				dutyPO.setLead(leaderFlag != null ? leaderFlag.shortValue() : 0);

				// 设置编码（如果提供）
				if (code != null && !code.trim().isEmpty()) {
					dutyPO.setCode(code);
				} else {
					// 自动生成编号
					String autoCode = generateDutyCode();
					dutyPO.setCode(autoCode);
					logger.info("自动生成职位编号: code={}", autoCode);
				}

				// 生成拼音
				dutyPO.setPinYin(generatePinyin(name));

				// 保存职位
				dutyDao.save(dutyPO);

				logger.info("新增职位成功: did={}, name={}, code={}", dutyPO.getDid(), dutyPO.getName(), dutyPO.getCode());

			} else {
				// 更新：修改现有对象
				dutyPO.setName(name);
				dutyPO.setStatus(dutyStatus);
				dutyPO.setDepartmentType(departmentType);
				dutyPO.setType(0); // 保留字段，默认为0
				dutyPO.setLead(leaderFlag != null ? leaderFlag.shortValue() : 0);

				// 更新拼音
				dutyPO.setPinYin(generatePinyin(name));

				// 更新职位
				dutyDao.update(dutyPO);

				logger.info("更新职位成功: did={}, name={}, status={}", dutyPO.getDid(), dutyPO.getName(), dutyPO.getStatus());
			}

			// 5. 返回职位ID
			return String.valueOf(dutyPO.getDid());

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			logger.error("同步职位异常: name={}, orgCode={}, type={}", name, orgCode, type, e);
			throw new FLException(500003, "同步职位失败: " + e.getMessage());
		}
	}

	/**
	 * 自动生成职位编号 规则：D + 3位数字（如：D001, D002...） 使用 synchronized 避免并发问题
	 * 
	 * @return 编号
	 */
	private synchronized String generateDutyCode() {
		String maxCode = dutyDao.queryMaxDutyCode();

		if (maxCode == null || maxCode.isEmpty()) {
			return "D001";
		}

		try {
			// 提取数字部分并递增
			int num = Integer.parseInt(maxCode.substring(1));
			return String.format("D%03d", num + 1);
		} catch (Exception e) {
			// 如果解析失败，从头开始
			return "D001";
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String syncDepartment(Integer deptId, String code, String name, Integer type, String parentCode, String orgCode, Integer status, String leaderCode, String posts, Integer orderValue) throws FLException {

		try {
			logger.info("同步部门信息: deptId={}, code={}, name={}, type={}, parentCode={}, orgCode={}, status={}, leaderCode={}, orderValue={}", deptId, code, name, type, parentCode, orgCode, status, leaderCode, orderValue);

			// 1. 获取部门类型
			DepartmentTypePO departmentType = departmentTypeDao.get(type);
			if (departmentType == null) {
				throw new FLException(511001, "部门类型不存在: " + type);
			}

			// 2. 查询父部门（如果提供）—— parent_code 传的是父部门 did
			DepartmentPO fatherDept = null;
			if (parentCode != null && !parentCode.trim().isEmpty()) {
				fatherDept = departmentDao.get(Integer.parseInt(parentCode));

				if (fatherDept == null) {
					throw new FLException(511002, "父部门不存在: " + parentCode);
				}
			}

			// 3. 查询部门经理（如果提供）
			UserPO manager = null;
			if (leaderCode != null && !leaderCode.trim().isEmpty()) {
				manager = userDao.queryUserByUserId(leaderCode);
				if (manager == null) {
					throw new FLException(511003, "部门经理不存在: " + leaderCode);
				}
			}

			// 4. 状态转换：1启用→1，2禁用→0（注意：与duty相反）。status 为 null 时不更新状态
			Short deptStatus = null;
			if (status != null) {
				deptStatus = (status == 1) ? DepartmentPO.STATUS_ENABLE_INT : DepartmentPO.STATUS_DISABLE_INT;
			}

			// 5. 判断是新增还是更新（优先级：deptId 主键 → code 编码）
			DepartmentPO deptPO = null;

			if (deptId != null) {
				// deptId 有值，优先通过主键查找现有部门进行更新
				deptPO = departmentDao.get(deptId);
				if (deptPO == null) {
					logger.warn("根据deptId未找到部门，视为新增: deptId={}", deptId);
				}
			} else if (code != null && !code.trim().isEmpty()) {
				// deptId 未提供但 code 有值，通过编码查找现有部门进行更新
				deptPO = departmentDao.queryDepartmentByNo(code);
				if (deptPO != null) {
				} else {
					logger.warn("根据code未找到部门，视为新增: code={}", code);
				}
			}

			// 6. 构建 DepartmentPO 对象
			if (deptPO == null) {
				// 新增：创建新对象
				deptPO = new DepartmentPO(departmentType, fatherDept);

				// 将 orgCode (String) 转换为公司ID (Integer)
				Integer companyId = null;
				if (orgCode != null && !orgCode.trim().isEmpty()) {
					try {
						companyId = Integer.parseInt(orgCode);
					} catch (NumberFormatException e) {
						throw new FLException(511004, "组织编码格式错误，必须是数字: " + orgCode);
					}

					// 检查部门名称是否已存在（同一公司下）
					DepartmentPO existingDept = departmentDao.queryDepartment(name, companyId);
					if (existingDept != null) {
						throw new FLException(130017, "部门名称已存在: " + name);
					}
				}

				// 设置基本信息
				deptPO.setName(name);
				deptPO.setType(departmentType);
				deptPO.setFatherDept(fatherDept);
				deptPO.setCompany(companyId);
				deptPO.setAompany(companyId); // 业绩公司默认与公司相同
				// 新增部门: status 未传时默认启用
				deptPO.setStatus(deptStatus != null ? deptStatus : DepartmentPO.STATUS_ENABLE_INT);
				deptPO.setManager(manager);

				// 生成拼音
				deptPO.setPinyin(generatePinyin(name));

				// 设置别称
				deptPO.setAlias(name);

				// 设置部门编号（如果提供）
				if (code != null && !code.trim().isEmpty()) {
					deptPO.setNo(code);
				} else {
					// 自动生成部门编号
					String deptNo = generateDepartmentNo(companyId);
					deptPO.setNo(deptNo);
					logger.info("自动生成部门编号: no={}", deptNo);
				}

				// 处理定岗数据（创建/更新 dutment 记录）
				if (posts != null && !posts.trim().isEmpty()) {
					processDutmentPosts(deptPO, posts);
				}

				// 设置排序值
				if (orderValue != null) {
					deptPO.setLimit(orderValue);
				} else {
					deptPO.setLimit(0);
				}

				// 设置其他默认值
				deptPO.setIsdet((short) 0); // 默认不是详细部门

				// 保存部门
				departmentDao.save(deptPO);

				logger.info("新增部门成功: did={}, name={}, no={}", deptPO.getDid(), deptPO.getName(), deptPO.getNo());

			} else {
				// 更新：修改现有对象

				// 将 orgCode (String) 转换为公司ID (Integer)
				Integer companyId = null;
				if (orgCode != null && !orgCode.trim().isEmpty()) {
					try {
						companyId = Integer.parseInt(orgCode);
					} catch (NumberFormatException e) {
						throw new FLException(511004, "组织编码格式错误，必须是数字: " + orgCode);
					}
				}

				// 检查部门名称是否已存在（同一公司下，排除自己）
				if (companyId != null) {
					DepartmentPO existingDept = departmentDao.queryDepartment(name, companyId);
					if (existingDept != null && existingDept.getDid() != deptPO.getDid()) {
						throw new FLException(130017, "部门名称已存在: " + name);
					}
				}

				deptPO.setName(name);
				deptPO.setType(departmentType);

				// 防御: 父部门不能是部门自身(否则 Hibernate 同一持久化对象会被误改状态)
				if (fatherDept != null && fatherDept.getDid().equals(deptPO.getDid())) {
					logger.warn("父部门did与当前部门did相同, 忽略父部门设置: did={}", deptPO.getDid());
				} else if (fatherDept != null) {
					deptPO.setFatherDept(fatherDept);
				}

				if (manager != null) {
					deptPO.setManager(manager);
				}

				// 更新公司信息（如果提供了 orgCode）
				if (companyId != null) {
					deptPO.setCompany(companyId);
					deptPO.setAompany(companyId);
				}

				// 仅当显式传入了 status 时才更新部门状态, 避免未传状态时把部门误禁用
				if (deptStatus != null) {
					deptPO.setStatus(deptStatus);
				}

				// 更新拼音
				deptPO.setPinyin(generatePinyin(name));

				// 更新别称
				deptPO.setAlias(name);

				// 处理定岗数据（创建/更新 dutment 记录）
				if (posts != null && !posts.trim().isEmpty()) {
					processDutmentPosts(deptPO, posts);
				}

				// 更新排序值
				if (orderValue != null) {
					deptPO.setLimit(orderValue);
				}

				// 更新部门
				departmentDao.update(deptPO);

				logger.info("更新部门成功: did={}, name={}, status={}", deptPO.getDid(), deptPO.getName(), deptPO.getStatus());
			}

			// 7. 返回部门ID
			return String.valueOf(deptPO.getDid());

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			logger.error("同步部门异常: name={}, orgCode={}, type={}", name, orgCode, type, e);
			throw new FLException(500004, "同步部门失败: " + e.getMessage());
		}
	}

	/**
	 * 自动生成部门编号 规则：查询当前公司下最大的部门编号，递增生成
	 * 
	 * @param companyId 公司ID
	 * @return 部门编号
	 * @throws FLException
	 */
	private String generateDepartmentNo(Integer companyId) throws FLException {

		CompanyPO companyPO = companyDao.get(companyId);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		int count = countingService.queryCountingByTypeDate(DepartmentPO.IDENT_NUM_INT, CountingPO.COUNTING_DATE_SILNLE_STR, companyId);

		return String.format("%sD_%s", companyPO.getShortname(), FormatUtil.fillZero(count, "000"));

	}

	/**
	 * 生成拼音
	 * 
	 * @param name 名称
	 * @return 拼音字符串，失败返回空字符串
	 */
	private String generatePinyin(String name) {
		try {
			List<String> pinyinList = PinYin4Util.getPinyin(name);
			if (pinyinList != null && !pinyinList.isEmpty()) {
				return pinyinList.get(0);
			}
		} catch (Exception e) {
			logger.warn("生成拼音失败: name={}", name, e);
		}
		return "";
	}

	/**
	 * 处理定岗数据（posts） 解析 JSON 并创建/更新 dutment 记录
	 * 
	 * @param deptPO 部门对象
	 * @param postsJsonString 定岗数据 JSON 字符串，格式：{"职位ID": "人员上限", ...}
	 * @throws FLException 业务异常
	 */
	private void processDutmentPosts(DepartmentPO deptPO, String postsJsonString) throws FLException {

		if (postsJsonString == null || postsJsonString.trim().isEmpty()) {
			logger.info("定岗数据为空，跳过处理: deptId={}", deptPO.getDid());
			return;
		}

		logger.info("开始处理定岗数据: deptId={}, deptName={}, posts={}", deptPO.getDid(), deptPO.getName(), postsJsonString);

		// 使用简单的字符串解析（不依赖 JSON 库）
		processDutmentPostsSimple(deptPO, postsJsonString);

		logger.info("定岗数据处理完成: deptId={}", deptPO.getDid());
	}

	/**
	 * 简单的定岗数据处理（不依赖 JSON 库） 解析格式：{"1": 10, "2": 20}
	 * 
	 * @param deptPO 部门对象
	 * @param postsJsonString 定岗数据 JSON 字符串
	 */
	private void processDutmentPostsSimple(DepartmentPO deptPO, String postsJsonString) {
		// 去掉外层花括号
		String content = postsJsonString.trim();
		if (content.startsWith("{")) {
			content = content.substring(1);
		}
		if (content.endsWith("}")) {
			content = content.substring(0, content.length() - 1);
		}

		// 按逗号分割每个键值对
		String[] pairs = content.split(",");
		int successCount = 0;
		int skipCount = 0;

		for (String pair : pairs) {
			pair = pair.trim();
			if (pair.isEmpty()) {
				continue;
			}

			try {
				// 按冒号分割键和值
				String[] kv = pair.split(":");
				if (kv.length != 2) {
					logger.warn("定岗数据格式错误，跳过: pair={}", pair);
					skipCount++;
					continue;
				}

				String dutyIdStr = kv[0].trim();
				String limitStr = kv[1].trim();

				// 去掉引号
				if (dutyIdStr.startsWith("\"")) {
					dutyIdStr = dutyIdStr.substring(1, dutyIdStr.length() - 1);
				}
				if (limitStr.startsWith("\"")) {
					limitStr = limitStr.substring(1, limitStr.length() - 1);
				}

				// 解析职位ID和人员上限
				long dutyId = Long.parseLong(dutyIdStr);
				int limit = Integer.parseInt(limitStr);

				// 验证职位是否存在
				DutyPO duty = dutyDao.get(dutyId);
				if (duty == null) {
					logger.warn("职位不存在，跳过定岗配置: dutyId={}, deptId={}", dutyId, deptPO.getDid());
					skipCount++;
					continue;
				}

				// 查找是否已存在定岗记录
				DutmentPO dutment = dutmentDao.queryDutmentByDids(deptPO.getDid(), dutyId);

				if (dutment == null) {
					// 新增定岗记录
					dutment = new DutmentPO(deptPO, duty);
					dutment.setLimit(limit);
					dutment.setNum(0); // 初始数量为0
					dutmentDao.save(dutment);
					logger.info("新增定岗记录: deptId={}, dutyId={}, limit={}", deptPO.getDid(), dutyId, limit);
				} else {
					// 更新定岗记录
					dutment.setLimit(limit);
					dutmentDao.update(dutment);
					logger.info("更新定岗记录: did={}, deptId={}, dutyId={}, limit={}", dutment.getDid(), deptPO.getDid(), dutyId, limit);
				}

				successCount++;

			} catch (NumberFormatException e) {
				logger.warn("定岗数据数字格式错误，跳过: pair={}", pair, e);
				skipCount++;
			} catch (Exception e) {
				logger.warn("处理定岗数据异常，跳过: pair={}", pair, e);
				skipCount++;
			}
		}

		logger.info("定岗数据处理完成: deptId={}, 成功={}, 跳过={}", deptPO.getDid(), successCount, skipCount);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String syncUser(String code, String name, String currentName, Integer gender, String identity, String phone, String loginId, Integer deptId, Long dutyId, Integer company, Integer status) throws FLException {

		try {
			logger.info("同步用户信息: code={}, name={}, currentName={}, gender={}, identity={}, phone={}, loginId={}, deptId={}, dutyId={}, company={}, status={}", code, name, currentName, gender, identity, phone, loginId, deptId, dutyId, company, status);

			// 1. 获取公司信息
			CompanyPO companyPO = companyDao.get(company);
			if (companyPO == null) {
				throw new FLException(402008, "公司不存在: " + company);
			}

			// 2. 获取部门信息
			DepartmentPO deptPO = departmentDao.get(deptId);
			if (deptPO == null) {
				throw new FLException(402009, "部门不存在: " + deptId);
			}

			// 3. 获取职位信息
			DutyPO dutyPO = dutyDao.get(dutyId);
			if (dutyPO == null) {
				throw new FLException(402010, "职位不存在: " + dutyId);
			}

			// 4. 状态转换（外部参数 → 内部常量）
			// 外部: 1=在职, 0=离职, 2=停薪留职
			// 内部: 0=在职, 1=离职, 2=停薪留职
			short userStatus;
			if (status == null || status == 1) {
				userStatus = UserPO.STATUS_ONJOB_INT; // 0 在职
			} else if (status == 0) {
				userStatus = UserPO.STATUS_OFFJOB_INT; // 1 离职
			} else {
				userStatus = (short) 2; // 2 停薪留职
			}

			// 5. 判断是新增还是更新
			UserPO userPO = null;

			if (code != null && !code.trim().isEmpty()) {
				// code 有值，尝试通过工号查找现有用户进行更新
				userPO = userDao.queryUserByUserId(code);
				if (userPO == null) {
					logger.warn("根据code未找到用户，视为新增: code={}", code);
				}
			}

			// 6. 构建或更新 UserPO 对象
			if (userPO == null) {
				// ========== 新增场景 ==========

				// 6.1 校验手机号/身份证是否已存在
				List<UserPO> existUsers = userDao.queryUserByPhoneAIdent(phone, identity);
				if (existUsers != null && existUsers.size() > 0) {
					throw new FLException(402011, "手机号或身份证已被使用");
				}

				// 6.2 校验登录名是否已存在
				String actualLoginId = (loginId != null && !loginId.trim().isEmpty()) ? loginId : code;
				if (actualLoginId != null) {
					UserPO existUser = userDao.queryUserByLoginId(actualLoginId);
					if (existUser != null) {
						throw new FLException(402012, "登录名已存在: " + actualLoginId);
					}
				}

				// 6.3 生成工号（使用 code，如果 code 为空则自动生成）
				String userId;
				if (code != null && !code.trim().isEmpty()) {
					userId = code;
				} else {
					// 自动生成工号
					int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_USER_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);
					userId = String.format("%sU-%s", companyPO.getShortname(), FormatUtil.fillZero(count, "00000"));
					logger.info("自动生成工号: userId={}", userId);
				}

				// 6.4 创建用户对象
				userPO = new UserPO();
				userPO.setUserId(userId);

				// 设置登录名
				if (actualLoginId != null && !actualLoginId.trim().isEmpty()) {
					userPO.setLoginId(actualLoginId);
				} else {
					userPO.setLoginId(userId);
				}

				// 6.5 设置默认角色（游客角色）
				SystemConfigPO visitor = systemConfigDao.querySystemConfig("visitor");
				if (visitor == null) {
					throw new FLException(402013, "游客角色配置不存在");
				}
				userPO.setRole(new RolePO(Integer.valueOf(visitor.getValue())));

				// 6.6 设置访问权限
				userPO.setIsLogin(UserPO.ISLOGIN_NOT_INT);
				userPO.setExtranet((short) (UserPO.EXTRANET_QCODE_INT + UserPO.EXTRANET_WEB_INT + UserPO.EXTRANET_PC_INT));
				userPO.setType(UserPO.TYPE_USER_INT);
				userPO.setCompany(company);

				// 6.7 设置基本信息
				userPO.setUserName(name);
				userPO.setCurrentName((currentName != null && !currentName.trim().isEmpty()) ? currentName : name);
				userPO.setGender(gender != null && gender == 0 ? "女" : "男");
				userPO.setIdentity(identity);
				userPO.setPhone(phone);
				userPO.setDept(deptPO);
				userPO.setDuty(dutyPO);
				userPO.setStatus(userStatus);

				// 生成拼音
				try {
					List<String> pinyinList = PinYin4Util.getPinyin(userPO.getCurrentName());
					if (pinyinList != null && !pinyinList.isEmpty()) {
						userPO.setPinYin(pinyinList.get(0));
					}
				} catch (Exception e) {
					logger.warn("生成拼音失败: name={}", userPO.getCurrentName(), e);
					userPO.setPinYin("");
				}

				userPO.setIsUpdate(UserPO.ISUPDATE_ADD_INT);

				// 6.8 设置默认密码
				SystemConfigPO password = systemConfigDao.querySystemConfig("password", company);
				userPO.setPassword(MD5Helper.MD5(password == null ? "helloworld" : password.getValue()));

				// 6.9 保存用户
				userDao.save(userPO);
				logger.info("新增用户成功: uid={}, userId={}, name={}", userPO.getUid(), userPO.getUserId(), userPO.getUserName());

				// 6.10 保存用户角色关联（使用用户自己作为创建人，满足cuid NOT NULL约束）
				userRoleDao.save(new UserRolePO(userPO.getUid(), userPO.getRole(), userPO));

				// 6.11 更新定岗人数
				DutmentPO dutmentPO = dutmentDao.queryDutmentByDids(deptId, dutyId);
				if (dutmentPO != null) {
					dutmentPO.setNum(dutmentPO.getNum() + 1);
					dutmentDao.update(dutmentPO);
					logger.info("更新定岗人数: deptId={}, dutyId={}, num={}", deptId, dutyId, dutmentPO.getNum());
				}

			} else {
				// ========== 更新场景 ==========

				// 7.1 更新基本信息
				userPO.setUserName(name);
				userPO.setCurrentName((currentName != null && !currentName.trim().isEmpty()) ? currentName : name);
				userPO.setGender(gender != null && gender == 0 ? "女" : "男");
				userPO.setIdentity(identity);
				userPO.setPhone(phone);
				userPO.setDept(deptPO);
				userPO.setDuty(dutyPO);
				userPO.setCompany(company); // 允许跨公司调动
				userPO.setStatus(userStatus);

				// 更新拼音
				try {
					List<String> pinyinList = PinYin4Util.getPinyin(userPO.getCurrentName());
					if (pinyinList != null && !pinyinList.isEmpty()) {
						userPO.setPinYin(pinyinList.get(0));
					}
				} catch (Exception e) {
					logger.warn("生成拼音失败: name={}", userPO.getCurrentName(), e);
				}

				// 7.2 更新用户（不处理定岗人数，不修改loginId）
				userDao.update(userPO);
				logger.info("更新用户成功: uid={}, userId={}, name={}, status={}", userPO.getUid(), userPO.getUserId(), userPO.getUserName(), userPO.getStatus());
			}

			// 8. 返回 JSON 格式的结果
			// 格式：{"code":"uid","belong_org_code":"company","userId":"工号"}
			String result = String.format("{\"code\":\"%d\",\"belong_org_code\":\"%d\",\"userId\":\"%s\"}", userPO.getUid(), userPO.getCompany(), userPO.getUserId());

			logger.info("同步用户完成: result={}", result);
			return result;

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			logger.error("同步用户异常: name={}, identity={}, phone={}", name, identity, phone, e);
			throw new FLException(500006, "同步用户失败: " + e.getMessage());
		}
	}

}
