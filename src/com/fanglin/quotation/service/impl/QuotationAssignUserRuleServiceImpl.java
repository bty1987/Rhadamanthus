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

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.quotation.service.QuotationAssignUserRuleService;
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
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

		// 调用DAO分页查询
		List<QuotationAssignUserRulePO> poList = quotationAssignUserRuleDao.pageQuotationAssignUserRule(paging, filters);

		// PO转VO
		List<QuotationAssignUserRuleVO> voList = new ArrayList<QuotationAssignUserRuleVO>();

		for (QuotationAssignUserRulePO po : poList) {
			voList.add(po.ptv(new QuotationAssignUserRuleVO()));
		}

		// 设置分页结果
		paging.setData(voList);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignUserRuleVO queryQuotationAssignUserRuleById(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		// 从VO中提取qaurid
		long qaurid = quotationAssignUserRule.getQaurid();

		// 调用DAO查询
		QuotationAssignUserRulePO po = quotationAssignUserRuleDao.get(qaurid);

		return po == null ? null : po.ptv(new QuotationAssignUserRuleVO());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		// 空值检查
		if (quotationAssignUserRule.getUser() == null) {
			throw new FLException(0, "用户信息不能为空");
		}
		if (quotationAssignUserRule.getCompany() == null) {
			throw new FLException(0, "公司信息不能为空");
		}

		// 校验：用户+公司组合唯一性
		int uid = quotationAssignUserRule.getUser().getUid();
		int company = CompanyServiceImpl.decode(quotationAssignUserRule.getCompany().getCid());

		QuotationAssignUserRulePO existPO = quotationAssignUserRuleDao.getByUidAndCompany(uid, company);

		if (existPO != null) {
			throw new FLException(0, "该公司下该用户的规则已存在");
		}

		// VO转PO
		QuotationAssignUserRulePO po = new QuotationAssignUserRulePO();
		BeanUtils.copyProperties(quotationAssignUserRule, po);

		// 从关联对象中提取ID（已做空值检查，安全）
		po.setUid(uid);
		po.setCompany(company);

		// Department可能是NULL（该公司所有部门）
		if (quotationAssignUserRule.getDepartment() != null) {
			po.setDepartment(quotationAssignUserRule.getDepartment().getDid());
		}

		// 设置创建时间和更新时间
		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		po.setCreateTime(currentTime);
		po.setUpdateTime(currentTime);

		// 保存
		quotationAssignUserRuleDao.save(po);

		// 设置返回的ID
		quotationAssignUserRule.setQaurid(po.getQaurid());

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

		// 校验：用户+公司组合唯一性（排除自己）
		int uid = quotationAssignUserRule.getUser().getUid();
		int company = CompanyServiceImpl.decode(quotationAssignUserRule.getCompany().getCid());
		long qaurid = quotationAssignUserRule.getQaurid();

		QuotationAssignUserRulePO existPO = quotationAssignUserRuleDao.getByUidAndCompany(uid, company);

		if (existPO != null && existPO.getQaurid() != qaurid) {
			throw new FLException(0, "该公司下该用户的规则已存在");
		}

		// 先获取原PO
		QuotationAssignUserRulePO po = quotationAssignUserRuleDao.get(qaurid);

		if (po == null) {
			throw new FLException(0, "规则不存在");
		}

		// 更新字段（已做空值检查，安全）
		po.setUid(uid);
		po.setCompany(company);

		// Department可能是NULL（该公司所有部门）
		if (quotationAssignUserRule.getDepartment() != null) {
			po.setDepartment(quotationAssignUserRule.getDepartment().getDid());
		} else {
			po.setDepartment(null);
		}

		po.setStatus(quotationAssignUserRule.getStatus());

		// 设置更新时间
		po.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		// 保存更新
		quotationAssignUserRuleDao.update(po);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		// 从VO中提取qaurid
		long qaurid = quotationAssignUserRule.getQaurid();

		// 调用DAO删除
		quotationAssignUserRuleDao.deleteQuotationAssignUserRule(qaurid);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignUserRuleForStatus(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		// 从VO中提取参数
		long qaurid = quotationAssignUserRule.getQaurid();
		short status = quotationAssignUserRule.getStatus();

		// 先获取原PO，校验存在性
		QuotationAssignUserRulePO po = quotationAssignUserRuleDao.get(qaurid);

		if (po == null) {
			throw new FLException(0, "规则不存在");
		}

		// 调用DAO更新状态
		quotationAssignUserRuleDao.updateQuotationAssignUserRuleStatus(qaurid, status);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationAssignUserRuleVO> queryAvailableUsers(int company, Integer department) throws FLException {

		// 调用DAO查询可分配预算员（status=1，按lastFinishTime排序）
		List<QuotationAssignUserRulePO> poList = quotationAssignUserRuleDao.queryAvailableUsers(company, department);

		// PO转VO
		List<QuotationAssignUserRuleVO> voList = new ArrayList<QuotationAssignUserRuleVO>();

		for (QuotationAssignUserRulePO po : poList) {
			voList.add(po.ptv(new QuotationAssignUserRuleVO()));
		}

		return voList;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateLastFinishTime(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		// 从VO中提取参数
		long qaurid = quotationAssignUserRule.getQaurid();
		Timestamp lastFinishTime;

		// 如果VO中未指定时间，使用当前时间
		if (quotationAssignUserRule.getLastFinishTime() == null || quotationAssignUserRule.getLastFinishTime().isEmpty()) {
			lastFinishTime = new Timestamp(System.currentTimeMillis());
		} else {
			// 解析字符串时间（前端传来的格式）
			try {
				lastFinishTime = Timestamp.valueOf(quotationAssignUserRule.getLastFinishTime());
			} catch (Exception e) {
				lastFinishTime = new Timestamp(System.currentTimeMillis());
			}
		}

		// 先获取原PO，校验存在性
		QuotationAssignUserRulePO po = quotationAssignUserRuleDao.get(qaurid);

		if (po == null) {
			throw new FLException(0, "规则不存在");
		}

		// 调用DAO更新最后完成时间
		quotationAssignUserRuleDao.updateLastFinishTime(qaurid, lastFinishTime);

		return 0;
	}
}
