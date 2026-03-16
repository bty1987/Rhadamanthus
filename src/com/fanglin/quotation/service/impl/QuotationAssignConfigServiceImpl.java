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
import com.fanglin.quotation.vo.QuotationAssignConfigVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

/**
 * 报价单预算配置表 Service 实现 职责: 控制哪些公司/部门启用预算员分配功能
 */
@Service("quotationAssignConfigService")
@Transactional(readOnly = true)
public class QuotationAssignConfigServiceImpl implements QuotationAssignConfigService {

	@Autowired
	private QuotationAssignConfigDao quotationAssignConfigDao;

	@Override
	public QuotationAssignConfigVO queryQuotationAssignConfigByCompanyAndDepartment(QuotationAssignConfigVO quotationAssignConfig, Integer company) {
		QuotationAssignConfigPO po = quotationAssignConfigDao.queryQuotationAssignConfigByDid(quotationAssignConfig.getCompany(), quotationAssignConfig.getDepartment());
		return po != null ? po.ptv(new QuotationAssignConfigVO()) : null;
	}

	@Override
	public List<QuotationAssignConfigVO> queryQuotationAssignConfigByCompany(QuotationAssignConfigVO quotationAssignConfig, Integer company) {
		List<QuotationAssignConfigPO> poList = quotationAssignConfigDao.queryQuotationAssignConfig(quotationAssignConfig.getCompany());
		List<QuotationAssignConfigVO> voList = new ArrayList<QuotationAssignConfigVO>();
		for (QuotationAssignConfigPO po : poList) {
			voList.add(po.ptv(new QuotationAssignConfigVO()));
		}
		return voList;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveQuotationAssignConfig(QuotationAssignConfigVO quotationAssignConfigVO, String userId) throws FLException {
		// 检查是否已存在配置
		QuotationAssignConfigPO existingPO = quotationAssignConfigDao.queryQuotationAssignConfigByDid(quotationAssignConfigVO.getCompany(), quotationAssignConfigVO.getDepartment());

		if (existingPO != null) {
			// 更新现有配置
			existingPO.setEnabled(quotationAssignConfigVO.getEnabled());
			existingPO.setAutoAssign(quotationAssignConfigVO.getAutoAssign());
			existingPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
			quotationAssignConfigDao.update(existingPO);
		} else {
			// 创建新配置
			QuotationAssignConfigPO po = new QuotationAssignConfigPO();
			BeanUtil.copyProperties(quotationAssignConfigVO, po);
			po.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			po.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
			quotationAssignConfigDao.save(po);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteQuotationAssignConfig(QuotationAssignConfigVO quotationAssignConfig, String userId) throws FLException {
		QuotationAssignConfigPO po = quotationAssignConfigDao.get(quotationAssignConfig.getQacid());
		if (po == null) {
			throw new FLException(330081, "配置不存在");
		}
		quotationAssignConfigDao.delete(po);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void enableQuotationAssignConfig(QuotationAssignConfigVO quotationAssignConfig, String userId) throws FLException {
		QuotationAssignConfigPO po = quotationAssignConfigDao.get(quotationAssignConfig.getQacid());
		if (po == null) {
			throw new FLException(330081, "配置不存在");
		}
		po.setEnabled(QuotationAssignConfigPO.ENABLED_ENABLED_INT);
		po.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		quotationAssignConfigDao.update(po);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableQuotationAssignConfig(QuotationAssignConfigVO quotationAssignConfig, String userId) throws FLException {
		QuotationAssignConfigPO po = quotationAssignConfigDao.get(quotationAssignConfig.getQacid());
		if (po == null) {
			throw new FLException(330081, "配置不存在");
		}
		po.setEnabled(QuotationAssignConfigPO.ENABLED_DISABLED_INT);
		po.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		quotationAssignConfigDao.update(po);
	}
}
