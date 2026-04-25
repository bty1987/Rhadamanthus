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
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.dao.QuotationAssignUserRuleItemDao;
import com.fanglin.quotation.po.QuotationAssignUserRuleItemPO;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.quotation.service.QuotationAssignUserRuleItemService;
import com.fanglin.quotation.vo.QuotationAssignUserRuleItemVO;
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("quotationAssignUserRuleItemService")
public class QuotationAssignUserRuleItemServiceImpl implements QuotationAssignUserRuleItemService {

	@Autowired
	private QuotationAssignUserRuleItemDao quotationAssignUserRuleItemDao;

	@Autowired
	private QuotationAssignUserRuleDao quotationAssignUserRuleDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationAssignUserRuleItemVO> queryQuotationAssignUserRuleItem(QuotationAssignUserRuleItemVO quotationAssignUserRuleItem) throws FLException {

		long qaurid = quotationAssignUserRuleItem.getQaurid();

		List<QuotationAssignUserRuleItemPO> itemPOs = quotationAssignUserRuleItemDao.queryQuotationAssignUserRuleItemByRuleId(qaurid);
		List<QuotationAssignUserRuleItemVO> itemVOs = new ArrayList<QuotationAssignUserRuleItemVO>();

		for (QuotationAssignUserRuleItemPO itemPO : itemPOs) {
			QuotationAssignUserRuleItemVO itemVO = new QuotationAssignUserRuleItemVO();
			itemVO.setCompany(new CompanyVO());
			itemVO.setDepartment(new DepartmentVO());
			itemPO.ptv(itemVO);
			itemVO.setQaurid(qaurid);
			itemVOs.add(itemVO);
		}

		return itemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationAssignUserRuleItemVO> queryItemsByRuleId(long qaurid) throws FLException {

		List<QuotationAssignUserRuleItemPO> itemPOs = quotationAssignUserRuleItemDao.queryQuotationAssignUserRuleItemByRuleId(qaurid);
		List<QuotationAssignUserRuleItemVO> itemVOs = new ArrayList<QuotationAssignUserRuleItemVO>();

		for (QuotationAssignUserRuleItemPO itemPO : itemPOs) {
			QuotationAssignUserRuleItemVO itemVO = new QuotationAssignUserRuleItemVO();
			itemVO.setCompany(new CompanyVO());
			itemVO.setDepartment(new DepartmentVO());
			itemPO.ptv(itemVO);
			itemVO.setQaurid(qaurid);
			itemVOs.add(itemVO);
		}

		return itemVOs;
	}

	@Override
	public void pageQuotationAssignUserRuleItem(Paging paging, List<Filter> filters) throws FLException {

		List<QuotationAssignUserRuleItemPO> itemPOs = quotationAssignUserRuleItemDao.pageQuotationAssignUserRuleItem(paging, filters);
		List<QuotationAssignUserRuleItemVO> itemVOs = new ArrayList<QuotationAssignUserRuleItemVO>();

		for (QuotationAssignUserRuleItemPO itemPO : itemPOs) {
			QuotationAssignUserRuleItemVO itemVO = new QuotationAssignUserRuleItemVO(new CompanyVO(), new DepartmentVO());
			itemVO.setUser(new UserBaseVO());
			itemPO.ptv(itemVO);

			// 填充所属规则基本信息（状态）
			if (itemPO.getUserRule() != null) {
				QuotationAssignUserRuleVO ruleVO = new QuotationAssignUserRuleVO();
				ruleVO.setQaurid(itemPO.getUserRule().getQaurid());
				ruleVO.setStatus(itemPO.getUserRule().getStatus());
				itemVO.setUserRule(ruleVO);

				// 填充预算员用户信息（从 userRule.user 取）
				if (itemPO.getUserRule().getUser() != null) {
					itemVO.getUser().ptv(itemPO.getUserRule().getUser());
				}
			}

			itemVOs.add(itemVO);
		}

		paging.setData(itemVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createQuotationAssignUserRuleItem(QuotationAssignUserRuleItemVO itemVO) throws FLException {
		if (itemVO == null || itemVO.getUserRule() == null || itemVO.getUserRule().getQaurid() == null) {
			throw new FLException(0, "请选择预算员规则");
		}

		QuotationAssignUserRulePO rulePO = quotationAssignUserRuleDao.get(itemVO.getUserRule().getQaurid());
		if (rulePO == null) {
			throw new FLException(0, "预算员规则不存在");
		}

		Timestamp now = DateUtil.getDateToTimestamp(new Date());

		QuotationAssignUserRuleItemPO itemPO = new QuotationAssignUserRuleItemPO();
		itemPO.setUserRule(rulePO);

		// 公司
		if (itemVO.getCompany() != null && itemVO.getCompany().getCid() != null) {
			itemPO.setCompany(new CompanyPO(CompanyServiceImpl.decode(itemVO.getCompany().getCid())));
		}

		// 部门（可选）
		if (itemVO.getDepartment() != null && itemVO.getDepartment().getDid() != null) {
			DepartmentPO deptPO = new DepartmentPO();
			deptPO.setDid(itemVO.getDepartment().getDid());
			itemPO.setDepartment(deptPO);
		}

		// 支持类型
		itemPO.setSupportedType(itemVO.getSupportedType() != null ? itemVO.getSupportedType() : QuotationAssignUserRulePO.SUPPORTED_TYPE_ALL_INT);
		itemPO.setCreateTime(now);
		itemPO.setUpdateTime(now);

		quotationAssignUserRuleItemDao.save(itemPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignUserRuleItem(QuotationAssignUserRuleItemVO itemVO) throws FLException {
		if (itemVO == null || itemVO.getQauriid() == null) {
			throw new FLException(0, "规则明细ID不能为空");
		}

		QuotationAssignUserRuleItemPO itemPO = quotationAssignUserRuleItemDao.get(itemVO.getQauriid());
		if (itemPO == null) {
			throw new FLException(0, "规则明细不存在");
		}

		Timestamp now = DateUtil.getDateToTimestamp(new Date());

		// 公司
		if (itemVO.getCompany() != null && itemVO.getCompany().getCid() != null) {
			itemPO.setCompany(new CompanyPO(CompanyServiceImpl.decode(itemVO.getCompany().getCid())));
		}

		// 部门（可选，允许清空）
		if (itemVO.getDepartment() != null && itemVO.getDepartment().getDid() != null) {
			DepartmentPO deptPO = new DepartmentPO();
			deptPO.setDid(itemVO.getDepartment().getDid());
			itemPO.setDepartment(deptPO);
		} else {
			itemPO.setDepartment(null);
		}

		// 支持类型
		itemPO.setSupportedType(itemVO.getSupportedType() != null ? itemVO.getSupportedType() : QuotationAssignUserRulePO.SUPPORTED_TYPE_ALL_INT);
		itemPO.setUpdateTime(now);

		quotationAssignUserRuleItemDao.update(itemPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationAssignUserRuleItem(QuotationAssignUserRuleItemVO itemVO) throws FLException {
		if (itemVO == null || itemVO.getQauriid() == null) {
			throw new FLException(0, "规则明细ID不能为空");
		}

		QuotationAssignUserRuleItemPO itemPO = quotationAssignUserRuleItemDao.get(itemVO.getQauriid());
		if (itemPO == null) {
			throw new FLException(0, "规则明细不存在");
		}

		quotationAssignUserRuleItemDao.delete(itemPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveItems(QuotationAssignUserRulePO rulePO, List<QuotationAssignUserRuleItemVO> items, Timestamp currentTime) throws FLException {

		if (items == null || items.isEmpty()) {
			throw new FLException(0, "至少需要添加一条规则明细（公司/部门/业务类型）");
		}

		for (QuotationAssignUserRuleItemVO itemVO : items) {

			if (itemVO.getCompany() == null || itemVO.getCompany().getCid() == null) {
				throw new FLException(0, "明细中公司信息不能为空");
			}

			QuotationAssignUserRuleItemPO itemPO = new QuotationAssignUserRuleItemPO();
			itemPO.setUserRule(rulePO);
			itemPO.setCompany(new CompanyPO(CompanyServiceImpl.decode(itemVO.getCompany().getCid())));

			// Department 可能为 NULL（公司级）
			if (itemVO.getDepartment() != null && itemVO.getDepartment().getDid() != null) {
				itemPO.setDepartment(new DepartmentPO(itemVO.getDepartment().getDid()));
			}

			itemPO.setSupportedType(itemVO.getSupportedType() != null ? itemVO.getSupportedType() : QuotationAssignUserRulePO.SUPPORTED_TYPE_ALL_INT);
			itemPO.setCreateTime(currentTime);
			itemPO.setUpdateTime(currentTime);

			quotationAssignUserRuleItemDao.save(itemPO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteItemsByRuleId(long qaurid) throws FLException {
		quotationAssignUserRuleItemDao.deleteQuotationAssignUserRuleItemByRuleId(qaurid);
	}
}
