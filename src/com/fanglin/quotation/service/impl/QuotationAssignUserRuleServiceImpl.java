/**
 * @File Name     : QuotationAssignUserRuleServiceImpl.java
 * @Package      : com.fanglin.quotation.service.impl
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 预算员规则表 Service 实现类
 */

package com.fanglin.quotation.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.quotation.service.QuotationAssignUserRuleService;
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

/**
 * 预算员规则表 Service 实现类
 * 
 * <p>
 * 职责：实现预算员规则的业务逻辑处理
 * </p>
 * 
 * @author Claude AI
 * @version 1.0
 */
@Service("quotationAssignUserRuleService")
public class QuotationAssignUserRuleServiceImpl implements QuotationAssignUserRuleService {

	@Autowired
	private QuotationAssignUserRuleDao quotationAssignUserRuleDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageQuotationAssignUserRule(Paging paging, List<Filter> filters) throws FLException {

		List<QuotationAssignUserRulePO> quotationAssignUserRulePOs = quotationAssignUserRuleDao.pageQuotationAssignUserRule(paging, filters);
		List<QuotationAssignUserRuleVO> quotationAssignUserRuleVOs = new ArrayList<QuotationAssignUserRuleVO>();

		for (QuotationAssignUserRulePO po : quotationAssignUserRulePOs) {
			quotationAssignUserRuleVOs.add(po.ptv(new QuotationAssignUserRuleVO(new UserVO(), new CompanyVO(), new DepartmentVO())));
		}

		paging.setData(quotationAssignUserRuleVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignUserRuleVO queryQuotationAssignUserRuleById(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		// 调用DAO查询
		QuotationAssignUserRulePO quotationAssignUserRulePO = quotationAssignUserRuleDao.get(quotationAssignUserRule.getQaurid());

		return quotationAssignUserRulePO == null ? null : quotationAssignUserRulePO.ptv(new QuotationAssignUserRuleVO(new UserVO(), new CompanyVO(), new DepartmentVO()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationAssignUserRuleVO> queryQuotationAssignUserRuleForAvaile(QuotationAssignUserRuleVO quotationAssignUserRule, Integer company) throws FLException {

		List<QuotationAssignUserRulePO> quotationAssignUserRulePOs = quotationAssignUserRuleDao.queryAvailableUsers(company, quotationAssignUserRule.getDepartment().getDid());
		List<QuotationAssignUserRuleVO> quotationAssignUserRuleVOs = new ArrayList<QuotationAssignUserRuleVO>();

		for (QuotationAssignUserRulePO po : quotationAssignUserRulePOs) {
			quotationAssignUserRuleVOs.add(po.ptv(new QuotationAssignUserRuleVO(new UserVO(), new CompanyVO(), new DepartmentVO())));
		}

		return quotationAssignUserRuleVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRuleVO) throws FLException {

		// 空值检查
		if (quotationAssignUserRuleVO.getUser() == null) {
			throw new FLException(0, "用户信息不能为空");
		}
		if (quotationAssignUserRuleVO.getCompany() == null) {
			throw new FLException(0, "公司信息不能为空");
		}

		// 校验：用户+公司组合唯一性
		int uid = quotationAssignUserRuleVO.getUser().getUid();
		int company = CompanyServiceImpl.decode(quotationAssignUserRuleVO.getCompany().getCid());

		QuotationAssignUserRulePO quotationAssignUserRulePO = quotationAssignUserRuleDao.getByUidAndCompany(uid, company);

		if (quotationAssignUserRulePO != null) {
			throw new FLException(0, "该公司下该用户的规则已存在");
		}

		// 创建 PO 对象
		quotationAssignUserRulePO = new QuotationAssignUserRulePO();

		// 使用 BeanUtils 复制基本属性（排除关联对象）
		BeanUtil.copyProperties(quotationAssignUserRuleVO, quotationAssignUserRulePO, "user", "company", "department");

		// 手动设置关联对象（使用 ID 创建 PO 对象）
		quotationAssignUserRulePO.setUser(new UserPO(uid));
		quotationAssignUserRulePO.setCompany(new CompanyPO(company));

		// Department可能是NULL（该公司所有部门）
		if (quotationAssignUserRuleVO.getDepartment() != null) {
			quotationAssignUserRulePO.setDepartment(new DepartmentPO(quotationAssignUserRuleVO.getDepartment().getDid()));
		}

		// 设置默认值
		if (quotationAssignUserRulePO.getStatus() == 0) {
			quotationAssignUserRulePO.setStatus(QuotationAssignUserRulePO.STATUS_AVAILABLE_INT);
		}

		// 设置创建时间和更新时间
		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		quotationAssignUserRulePO.setCreateTime(currentTime);
		quotationAssignUserRulePO.setUpdateTime(currentTime);

		// 保存到数据库
		quotationAssignUserRuleDao.save(quotationAssignUserRulePO);

		// 设置返回的ID
		quotationAssignUserRuleVO.setQaurid(quotationAssignUserRulePO.getQaurid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		// 空值检查
		if (quotationAssignUserRule.getUser() == null) {
			throw new FLException(0, "用户信息不能为空");
		}
		if (quotationAssignUserRule.getCompany() == null) {
			throw new FLException(0, "公司信息不能为空");
		}

		int uid = quotationAssignUserRule.getUser().getUid();
		int company = CompanyServiceImpl.decode(quotationAssignUserRule.getCompany().getCid());

		// 校验：用户+公司组合唯一性（排除当前记录）
		QuotationAssignUserRulePO checkPO = quotationAssignUserRuleDao.getByUidAndCompany(uid, company);
		if (checkPO != null && checkPO.getQaurid() != quotationAssignUserRule.getQaurid()) {
			throw new FLException(0, "该公司下该用户的规则已存在");
		}

		// 查询现有记录
		QuotationAssignUserRulePO quotationAssignUserRulePO = quotationAssignUserRuleDao.get(quotationAssignUserRule.getQaurid());

		if (quotationAssignUserRulePO == null) {
			throw new FLException(0, "规则不存在");
		}

		// 使用 BeanUtil 复制基本属性（排除关联对象和只读字段）
		BeanUtil.copyProperties(quotationAssignUserRule, quotationAssignUserRulePO,
				"user", "company", "department", "qaurid", "createTime", "updateTime");

		// 手动设置关联对象（使用 ID 创建 PO 对象）
		quotationAssignUserRulePO.setUser(new UserPO(uid));
		quotationAssignUserRulePO.setCompany(new CompanyPO(company));

		// Department可能是NULL（该公司所有部门）
		if (quotationAssignUserRule.getDepartment() != null) {
			quotationAssignUserRulePO.setDepartment(new DepartmentPO(quotationAssignUserRule.getDepartment().getDid()));
		} else {
			// 如果部门对象为null，表示设置为"所有部门"
			quotationAssignUserRulePO.setDepartment(null);
		}

		// 设置更新时间
		quotationAssignUserRulePO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		// 保存更新
		quotationAssignUserRuleDao.update(quotationAssignUserRulePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignUserRuleForStatus(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		QuotationAssignUserRulePO quotationAssignUserRulePO = quotationAssignUserRuleDao.get(quotationAssignUserRule.getQaurid());

		if (quotationAssignUserRulePO == null) {
			throw new FLException(0, "规则不存在");
		}

		quotationAssignUserRulePO.setStatus(quotationAssignUserRule.getStatus());

		quotationAssignUserRuleDao.update(quotationAssignUserRulePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateLastFinishTime(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		Timestamp lastFinishTime;

		if (quotationAssignUserRule.getLastFinishTime() == null || quotationAssignUserRule.getLastFinishTime().isEmpty()) {
			lastFinishTime = new Timestamp(System.currentTimeMillis());
		} else {
			lastFinishTime = Timestamp.valueOf(quotationAssignUserRule.getLastFinishTime());
		}

		QuotationAssignUserRulePO quotationAssignUserRulePO = quotationAssignUserRuleDao.get(quotationAssignUserRule.getQaurid());

		if (quotationAssignUserRulePO == null) {
			throw new FLException(0, "规则不存在");
		}

		quotationAssignUserRulePO.setStatus(quotationAssignUserRule.getStatus());

		quotationAssignUserRulePO.setLastFinishTime(lastFinishTime);

		quotationAssignUserRuleDao.update(quotationAssignUserRulePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		quotationAssignUserRuleDao.deleteById(quotationAssignUserRule.getQaurid());

		return 0;
	}

}
