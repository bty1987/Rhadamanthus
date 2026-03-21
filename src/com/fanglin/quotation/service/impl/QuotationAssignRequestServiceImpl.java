/**
 * @File Name     : QuotationAssignRequestServiceImpl.java
 * @Package      : com.fanglin.quotation.service.impl
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配请求表 Service 实现类
 */

package com.fanglin.quotation.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignRequestDao;
import com.fanglin.quotation.po.QuotationAssignRequestPO;
import com.fanglin.quotation.service.QuotationAssignRequestService;
import com.fanglin.quotation.vo.QuotationAssignRequestVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("quotationAssignRequestService")
public class QuotationAssignRequestServiceImpl implements QuotationAssignRequestService {

	@Autowired
	private QuotationAssignRequestDao quotationAssignRequestDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageQuotationAssignRequest(Paging paging, List<Filter> filters, Integer company) throws FLException {
		List<QuotationAssignRequestPO> quotationAssignRequestPOs = quotationAssignRequestDao.pageQuotationAssignRequest(paging, filters, company);
		List<QuotationAssignRequestVO> quotationAssignRequestVOs = new ArrayList<QuotationAssignRequestVO>();

		for (QuotationAssignRequestPO quotationAssignRequestPO : quotationAssignRequestPOs) {
			quotationAssignRequestVOs.add(quotationAssignRequestPO.ptv(new QuotationAssignRequestVO()));
		}

		// 设置分页结果
		paging.setData(quotationAssignRequestVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignRequestVO queryQuotationAssignRequestById(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException {

		QuotationAssignRequestPO quotationAssignRequestPO = quotationAssignRequestDao.get(quotationAssignRequestVO.getQarid());

		if (quotationAssignRequestPO == null) {
			return null;
		}

		return quotationAssignRequestPO.ptv(new QuotationAssignRequestVO());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignRequestVO queryQuotationAssignRequestForPending(String orderId) throws FLException {

		QuotationAssignRequestPO quotationAssignRequestPO = quotationAssignRequestDao.queryQuotationAssignRequestForPending(orderId);

		if (quotationAssignRequestPO == null) {
			return null;
		}

		return quotationAssignRequestPO.ptv(new QuotationAssignRequestVO());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationAssignRequestVO> queryQuotationAssignRequestForQueue(int company, Integer department, short decorationType) throws FLException {
		List<QuotationAssignRequestPO> quotationAssignRequestPOs = quotationAssignRequestDao.queryQuotationAssignRequestForQueue(company, department, decorationType);
		List<QuotationAssignRequestVO> quotationAssignRequestVOs = new ArrayList<QuotationAssignRequestVO>();

		for (QuotationAssignRequestPO quotationAssignRequestPO : quotationAssignRequestPOs) {
			quotationAssignRequestVOs.add(quotationAssignRequestPO.ptv(new QuotationAssignRequestVO()));
		}

		return quotationAssignRequestVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException {

		// 空值检查
		if (quotationAssignRequestVO.getOrderId() == null || quotationAssignRequestVO.getOrderId().trim().isEmpty()) {
			throw new FLException(0, "装修单号不能为空");
		}
		if (quotationAssignRequestVO.getCompany() == null) {
			throw new FLException(0, "公司信息不能为空");
		}

		// 从 VO 的关联对象中提取 ID
		int company = CompanyServiceImpl.decode(quotationAssignRequestVO.getCompany().getCid());

		// 创建 PO 对象
		QuotationAssignRequestPO quotationAssignRequestPO = new QuotationAssignRequestPO();

		// 使用 BeanUtil 复制基本属性（会跳过关联对象）
		BeanUtil.copyProperties(quotationAssignRequestVO, quotationAssignRequestPO, "company", "department", "requestUser");

		// 手动设置基本类型字段
		quotationAssignRequestPO.setCompany(company);

		// Department 可能是 NULL（该公司所有部门）
		if (quotationAssignRequestVO.getDepartment() != null) {
			quotationAssignRequestPO.setDepartment(quotationAssignRequestVO.getDepartment().getDid());
		}

		// RequestUser 可能是 NULL
		if (quotationAssignRequestVO.getRequestUser() != null) {
			quotationAssignRequestPO.setRequestUid(quotationAssignRequestVO.getRequestUser().getUid());
		}

		// 设置默认值
		if (quotationAssignRequestPO.getPriority() == 0) {
			quotationAssignRequestPO.setPriority(QuotationAssignRequestPO.PRIORITY_NORMAL_INT);
		}
		if (quotationAssignRequestPO.getStatus() == 0) {
			quotationAssignRequestPO.setStatus(QuotationAssignRequestPO.STATUS_PENDING_INT);
		}

		// 设置时间戳
		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		quotationAssignRequestPO.setRequestTime(currentTime);
		quotationAssignRequestPO.setCreateTime(currentTime);

		// 保存到数据库
		quotationAssignRequestDao.save(quotationAssignRequestPO);

		// 设置返回的ID
		quotationAssignRequestVO.setQarid(quotationAssignRequestPO.getQarid());

		return 1;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException {

		// 空值检查
		if (quotationAssignRequestVO.getQarid() == null || quotationAssignRequestVO.getQarid() <= 0) {
			throw new FLException(0, "请求ID不能为空");
		}

		// 查询现有记录
		QuotationAssignRequestPO quotationAssignRequestPO = quotationAssignRequestDao.get(quotationAssignRequestVO.getQarid());
		if (quotationAssignRequestPO == null) {
			throw new FLException(0, "分配请求不存在");
		}

		// 使用 BeanUtil 复制基本属性（会跳过关联对象）
		BeanUtil.copyProperties(quotationAssignRequestVO, quotationAssignRequestPO, "company", "department", "requestUser", "qarid", "orderId", "requestTime", "createTime");

		// 如果 VO 中包含公司对象，更新公司ID
		if (quotationAssignRequestVO.getCompany() != null) {
			int company = CompanyServiceImpl.decode(quotationAssignRequestVO.getCompany().getCid());
			quotationAssignRequestPO.setCompany(company);
		}

		// 如果 VO 中包含部门对象，更新部门ID
		if (quotationAssignRequestVO.getDepartment() != null) {
			quotationAssignRequestPO.setDepartment(quotationAssignRequestVO.getDepartment().getDid());
		} else {
			// 如果部门对象为null，表示设置为"所有部门"
			quotationAssignRequestPO.setDepartment(null);
		}

		// 如果 VO 中包含请求人对象，更新请求人ID
		if (quotationAssignRequestVO.getRequestUser() != null) {
			quotationAssignRequestPO.setRequestUid(quotationAssignRequestVO.getRequestUser().getUid());
		}

		// 如果状态更新为已分配，设置分配时间
		if (quotationAssignRequestVO.getStatus() != null && quotationAssignRequestVO.getStatus() == QuotationAssignRequestPO.STATUS_ASSIGNED_INT && quotationAssignRequestPO.getStatus() != QuotationAssignRequestPO.STATUS_ASSIGNED_INT) {
			quotationAssignRequestPO.setAssignTime(DateUtil.getDateToTimestamp(new Date()));
		}

		// 更新数据库
		quotationAssignRequestDao.update(quotationAssignRequestPO);

		return 1;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException {

		// 空值检查
		if (quotationAssignRequestVO.getQarid() == null || quotationAssignRequestVO.getQarid() <= 0) {
			throw new FLException(0, "请求ID不能为空");
		}

		quotationAssignRequestDao.deleteById(quotationAssignRequestVO.getQarid());

		return 0;
	}
}
