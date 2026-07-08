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

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationAssignRequestDao;
import com.fanglin.quotation.po.QuotationAssignRequestPO;
import com.fanglin.quotation.service.QuotationAssignRequestService;
import com.fanglin.quotation.vo.QuotationAssignRequestVO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("quotationAssignRequestService")
@Transactional(readOnly = true)
public class QuotationAssignRequestServiceImpl implements QuotationAssignRequestService {

	@Autowired
	private QuotationAssignRequestDao quotationAssignRequestDao;

	private QuotationAssignRequestVO ptv(QuotationAssignRequestPO quotationAssignRequestPO) {

		QuotationAssignRequestVO vo = new QuotationAssignRequestVO();
		vo.setCompany(new CompanyVO());
		vo.setDepartment(new DepartmentVO());
		vo.setRequestUser(new UserBaseVO());
		vo.setUser(new UserBaseVO());

		quotationAssignRequestPO.ptv(vo);

		return vo;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageQuotationAssignRequest(Paging paging, List<Filter> filters, Integer company) throws FLException {
		List<QuotationAssignRequestPO> quotationAssignRequestPOs = quotationAssignRequestDao.pageQuotationAssignRequest(paging, filters, company);
		List<QuotationAssignRequestVO> quotationAssignRequestVOs = new ArrayList<QuotationAssignRequestVO>();

		for (QuotationAssignRequestPO quotationAssignRequestPO : quotationAssignRequestPOs) {
			quotationAssignRequestVOs.add(ptv(quotationAssignRequestPO));
		}

		// 设置分页结果
		paging.setData(quotationAssignRequestVOs);
	}

	@Override
	public void pageQuotationAssignRequestByUserId(Paging paging, List<Filter> filters, String userId) throws FLException {

		List<QuotationAssignRequestPO> quotationAssignRequestPOs = quotationAssignRequestDao.pageQuotationAssignRequestByUserId(paging, filters, userId);

		List<QuotationAssignRequestVO> quotationAssignRequestVOs = new ArrayList<QuotationAssignRequestVO>();

		for (QuotationAssignRequestPO quotationAssignRequestPO : quotationAssignRequestPOs) {
			quotationAssignRequestVOs.add(ptv(quotationAssignRequestPO));
		}

		paging.setData(quotationAssignRequestVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignRequestVO queryQuotationAssignRequestById(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException {

		QuotationAssignRequestPO quotationAssignRequestPO = quotationAssignRequestDao.get(quotationAssignRequestVO.getQarid());
		if (quotationAssignRequestPO == null) {
			return null;
		}
		return ptv(quotationAssignRequestPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignRequestVO queryQuotationAssignRequestForPending(String orderId) throws FLException {

		QuotationAssignRequestPO quotationAssignRequestPO = quotationAssignRequestDao.queryQuotationAssignRequestForPending(orderId);
		if (quotationAssignRequestPO == null) {
			return null;
		}
		return ptv(quotationAssignRequestPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationAssignRequestVO> queryQuotationAssignRequestForQueue(int company, Integer department, short decorationType) throws FLException {
		List<QuotationAssignRequestPO> quotationAssignRequestPOs = quotationAssignRequestDao.queryQuotationAssignRequestForQueue(company, department, decorationType);
		List<QuotationAssignRequestVO> quotationAssignRequestVOs = new ArrayList<QuotationAssignRequestVO>();

		for (QuotationAssignRequestPO quotationAssignRequestPO : quotationAssignRequestPOs) {
			quotationAssignRequestVOs.add(ptv(quotationAssignRequestPO));
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

		// 检查同一 orderId 是否已存在活跃请求（非已完成）
		QuotationAssignRequestPO existRequest = quotationAssignRequestDao.queryActiveByOrderId(quotationAssignRequestVO.getOrderId());
		if (existRequest != null) {
			// 已分配状态，不可操作
			if (existRequest.getStatus() == QuotationAssignRequestPO.STATUS_ASSIGNED_INT) {
				throw new FLException(0, "该装修单已分配报价员，请勿重复创建");
			}

			// 待分配状态：判断设计师（requestUser）是否相同
			Integer existUid = existRequest.getRequestUser() != null ? existRequest.getRequestUser().getUid() : null;
			Integer newUid = quotationAssignRequestVO.getRequestUser() != null ? quotationAssignRequestVO.getRequestUser().getUid() : null;

			if (existUid != null && existUid.equals(newUid)) {
				// 同一个设计师重复提交，拒绝
				throw new FLException(0, "该装修单已存在待分配请求，请勿重复创建");
			}

			// 设计师不同，直接替换 requestUser
			if (newUid != null) {
				com.fanglin.personel.po.UserPO newUserPO = new com.fanglin.personel.po.UserPO();
				newUserPO.setUid(newUid);
				existRequest.setRequestUser(newUserPO);
			}

			// 更新请求时间
			existRequest.setRequestTime(DateUtil.getDateToTimestamp(new Date()));

			quotationAssignRequestDao.update(existRequest);

			// 设置返回的ID
			quotationAssignRequestVO.setQarid(existRequest.getQarid());

			return 1;
		}

		// 创建 PO 对象
		QuotationAssignRequestPO quotationAssignRequestPO = new QuotationAssignRequestPO();

		// 使用 BeanUtil 复制基本属性（会跳过关联对象）
		BeanUtil.copyProperties(quotationAssignRequestVO, quotationAssignRequestPO, "company", "department", "requestUser");

		// 手动设置关联对象（使用ID构造引用PO）
		quotationAssignRequestPO.setCompany(new CompanyPO(company));

		// Department 可能是 NULL（该公司所有部门）
		if (quotationAssignRequestVO.getDepartment() != null) {
			quotationAssignRequestPO.setDepartment(new DepartmentPO(quotationAssignRequestVO.getDepartment().getDid()));
		}

		// RequestUser: 从UserBaseVO中提取uid，构造引用用UserPO
		if (quotationAssignRequestVO.getRequestUser() != null && quotationAssignRequestVO.getRequestUser().getUid() != null) {
			com.fanglin.personel.po.UserPO requestUserPO = new com.fanglin.personel.po.UserPO();
			requestUserPO.setUid(quotationAssignRequestVO.getRequestUser().getUid());
			quotationAssignRequestPO.setRequestUser(requestUserPO);
		}

		// 设置默认值
		if (quotationAssignRequestPO.getPriority() == QuotationAssignRequestPO.PRIORITY_UNSET_INT) {
			quotationAssignRequestPO.setPriority(QuotationAssignRequestPO.PRIORITY_NORMAL_INT);
		}
		if (quotationAssignRequestPO.getStatus() == QuotationAssignRequestPO.STATUS_UNSET_INT) {
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

		// 如果 VO 中包含公司对象，更新公司
		if (quotationAssignRequestVO.getCompany() != null) {
			int company = CompanyServiceImpl.decode(quotationAssignRequestVO.getCompany().getCid());
			quotationAssignRequestPO.setCompany(new CompanyPO(company));
		}

		// 如果 VO 中包含部门对象，更新部门
		if (quotationAssignRequestVO.getDepartment() != null) {
			quotationAssignRequestPO.setDepartment(new DepartmentPO(quotationAssignRequestVO.getDepartment().getDid()));
		} else {
			// 如果部门对象为null，表示设置为"所有部门"
			quotationAssignRequestPO.setDepartment(null);
		}

		// 如果 VO 中包含请求人对象，更新请求人
		if (quotationAssignRequestVO.getRequestUser() != null && quotationAssignRequestVO.getRequestUser().getUid() != null) {
			com.fanglin.personel.po.UserPO requestUserPO = new com.fanglin.personel.po.UserPO();
			requestUserPO.setUid(quotationAssignRequestVO.getRequestUser().getUid());
			quotationAssignRequestPO.setRequestUser(requestUserPO);
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
