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

import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.dao.DutyDao;
import com.fanglin.communion.dao.DepartmentTypeDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DepartmentTypePO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.seiya.service.A20260324Service;
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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String syncDuty(String code, String name, String orgCode, Integer type, Integer status, Integer leaderFlag) throws FLException {

		try {
			logger.info("同步职位信息: code={}, name={}, orgCode={}, type={}, status={}, leaderFlag={}",
					code, name, orgCode, type, status, leaderFlag);

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
			String operation = "add";

			if (code != null && !code.trim().isEmpty()) {
				// code 有值，尝试通过编码查找现有职位进行更新
				dutyPO = dutyDao.queryDutyByCode(code);
				if (dutyPO != null) {
					operation = "update";
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
	 * 自动生成职位编号
	 * 规则：D + 3位数字（如：D001, D002...）
	 * 使用 synchronized 避免并发问题
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
	public String syncDepartment(String code, String name, Integer type, String parentCode,
			String orgCode, Integer status, String leaderCode, String posts, Integer orderValue) throws FLException {

		try {
			logger.info("同步部门信息: code={}, name={}, type={}, parentCode={}, orgCode={}, status={}, leaderCode={}, orderValue={}",
					code, name, type, parentCode, orgCode, status, leaderCode, orderValue);

			// 1. 获取部门类型
			DepartmentTypePO departmentType = departmentTypeDao.get(type);
			if (departmentType == null) {
				throw new FLException(511001, "部门类型不存在: " + type);
			}

			// 2. 查询父部门（如果提供）
			DepartmentPO fatherDept = null;
			if (parentCode != null && !parentCode.trim().isEmpty()) {
				fatherDept = departmentDao.queryDepartmentByNo(parentCode);
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

			// 4. 状态转换：1启用→1，2禁用→0（注意：与duty相反）
			short deptStatus = (status != null && status == 1) ? DepartmentPO.STATUS_ENABLE_INT : DepartmentPO.STATUS_DISABLE_INT;

			// 5. 判断是新增还是更新
			DepartmentPO deptPO = null;
			String operation = "add";

			if (code != null && !code.trim().isEmpty()) {
				// code 有值，尝试通过编码查找现有部门进行更新
				deptPO = departmentDao.queryDepartmentByNo(code);
				if (deptPO != null) {
					operation = "update";
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
					DepartmentPO existingDept = departmentDao.queryDepartmentByNameAndCompany(name, companyId);
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
				deptPO.setStatus(deptStatus);
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

				// 设置定岗数据到备注字段
				if (posts != null && !posts.trim().isEmpty()) {
					deptPO.setComment(posts);
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
					DepartmentPO existingDept = departmentDao.queryDepartmentByNameAndCompany(name, companyId);
					if (existingDept != null && existingDept.getDid() != deptPO.getDid()) {
						throw new FLException(130017, "部门名称已存在: " + name);
					}
				}

				deptPO.setName(name);
				deptPO.setType(departmentType);
				if (fatherDept != null) {
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

				deptPO.setStatus(deptStatus);

				// 更新拼音
				deptPO.setPinyin(generatePinyin(name));

				// 更新别称
				deptPO.setAlias(name);

				// 更新定岗数据到备注字段
				if (posts != null && !posts.trim().isEmpty()) {
					deptPO.setComment(posts);
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
	 * 自动生成部门编号
	 * 规则：查询当前公司下最大的部门编号，递增生成
	 *
	 * @param companyId 公司ID
	 * @return 部门编号
	 */
	private String generateDepartmentNo(Integer companyId) {
		// 查询数据库获取当前公司下最大的部门编号
		String maxNo = departmentDao.queryMaxDepartmentNoByCompany(companyId);

		if (maxNo == null || maxNo.isEmpty()) {
			// 如果没有找到编号，从 DEPT0001 开始
			return "DEPT0001";
		}

		try {
			// 提取数字部分并递增（如：DEPT0001 -> 1, DEPT0002 -> 2）
			int num = Integer.parseInt(maxNo.substring(4));
			return String.format("DEPT%04d", num + 1);
		} catch (Exception e) {
			logger.warn("解析部门编号失败，使用默认编号: maxNo={}", maxNo, e);
			return "DEPT0001";
		}
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

}
