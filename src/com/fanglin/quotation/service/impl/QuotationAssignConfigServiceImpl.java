package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.dao.QuotationAssignConfigDao;
import com.fanglin.quotation.po.QuotationAssignConfigPO;
import com.fanglin.quotation.service.QuotationAssignConfigService;
import com.fanglin.quotation.vo.QuotationConfigVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

/**
 * 报价单预算配置表 Service 实现
 * 职责: 控制哪些公司/部门启用预算员分配功能
 */
@Service("quotationAssignConfigService")
@Transactional(readOnly = true)
public class QuotationAssignConfigServiceImpl implements QuotationAssignConfigService {

	@Autowired
	private QuotationAssignConfigDao quotationAssignConfigDao;

	@Override
	public QuotationConfigVO findByCompanyAndDepartment(QuotationConfigVO quotationConfig) {
		QuotationAssignConfigPO po = quotationAssignConfigDao.findByCompanyAndDepartment(
			quotationConfig.getCompany(),
			quotationConfig.getDepartment()
		);
		return po != null ? BeanUtil.copyProperties(po, QuotationConfigVO.class) : null;
	}

	@Override
	public List<QuotationConfigVO> findByCompany(QuotationConfigVO quotationConfig) {
		List<QuotationAssignConfigPO> poList = quotationAssignConfigDao.findByCompany(quotationConfig.getCompany());
		List<QuotationConfigVO> voList = new ArrayList<QuotationConfigVO>();
		for (QuotationAssignConfigPO po : poList) {
			voList.add(BeanUtil.copyProperties(po, QuotationConfigVO.class));
		}
		return voList;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveQuotationAssignConfig(QuotationConfigVO quotationConfigVO, String userId) throws FLException {
		// 检查是否已存在配置
		QuotationAssignConfigPO existingPO = quotationAssignConfigDao.findByCompanyAndDepartment(
			quotationConfigVO.getCompany(),
			quotationConfigVO.getDepartment()
		);

		if (existingPO != null) {
			// 更新现有配置
			existingPO.setEnabled(quotationConfigVO.getEnabled().shortValue());
			existingPO.setAutoAssign(quotationConfigVO.getAutoAssign().shortValue());
			existingPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
			quotationAssignConfigDao.update(existingPO);
		} else {
			// 创建新配置
			QuotationAssignConfigPO po = new QuotationAssignConfigPO();
			BeanUtil.copyProperties(quotationConfigVO, po);
			po.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			po.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
			quotationAssignConfigDao.save(po);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteQuotationAssignConfig(QuotationConfigVO quotationConfig, String userId) throws FLException {
		QuotationAssignConfigPO po = quotationAssignConfigDao.get(quotationConfig.getBcid());
		if (po == null) {
			throw new FLException(330081, "配置不存在");
		}
		quotationAssignConfigDao.delete(po);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void enableQuotationAssignConfig(QuotationConfigVO quotationConfig, String userId) throws FLException {
		QuotationAssignConfigPO po = quotationAssignConfigDao.get(quotationConfig.getBcid());
		if (po == null) {
			throw new FLException(330081, "配置不存在");
		}
		po.setEnabled(QuotationAssignConfigPO.ENABLED_ENABLED_INT);
		po.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		quotationAssignConfigDao.update(po);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableQuotationAssignConfig(QuotationConfigVO quotationConfig, String userId) throws FLException {
		QuotationAssignConfigPO po = quotationAssignConfigDao.get(quotationConfig.getBcid());
		if (po == null) {
			throw new FLException(330081, "配置不存在");
		}
		po.setEnabled(QuotationAssignConfigPO.ENABLED_DISABLED_INT);
		po.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		quotationAssignConfigDao.update(po);
	}

	@Override
	public boolean isQuotationAssignEnabled(QuotationConfigVO quotationConfig) {
		QuotationAssignConfigPO po = quotationAssignConfigDao.findByCompanyAndDepartment(
			quotationConfig.getCompany(),
			quotationConfig.getDepartment()
		);
		return po != null && po.getEnabled() == QuotationAssignConfigPO.ENABLED_ENABLED_INT;
	}

	@Override
	public boolean isAutoAssignEnabled(QuotationConfigVO quotationConfig) {
		QuotationAssignConfigPO po = quotationAssignConfigDao.findByCompanyAndDepartment(
			quotationConfig.getCompany(),
			quotationConfig.getDepartment()
		);
		return po != null && po.getAutoAssign() == QuotationAssignConfigPO.AUTO_ASSIGN_AUTO_INT;
	}
}
