/**
 * @File Name		: QuotationAssignConfigServiceImpl.java
 * @Package  	: com.fanglin.quotation.service.impl
 * @Version		: 1.0
 * @Date			: 2026-03-19
 * @Copyright	: Copyright Creators 2026
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 预算配置表 Service 实现类
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.commune.dao.CompanyDao;
import com.fanglin.commune.dao.DepartmentDao;
import com.fanglin.commune.po.CompanyPO;
import com.fanglin.commune.po.DepartmentPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.dao.QuotationAssignConfigDao;
import com.fanglin.quotation.po.QuotationAssignConfigPO;
import com.fanglin.quotation.service.QuotationAssignConfigService;
import com.fanglin.quotation.vo.QuotationAssignConfigVO;
import com.fanglin.utils.Paging;

/**
 * 预算配置表 Service 实现类
 *
 * <p>职责：实现预算配置的业务逻辑处理</p>
 *
 * @author bty1987
 * @version 1.0
 */
@Service("quotationAssignConfigService")
public class QuotationAssignConfigServiceImpl implements QuotationAssignConfigService {

	@Autowired
	private QuotationAssignConfigDao quotationAssignConfigDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageQuotationAssignConfig(Paging paging, Integer company) throws FLException {
		// 查询配置列表
		List<QuotationAssignConfigPO> poList = quotationAssignConfigDao.pageQuotationAssignConfig(paging, company);

		// 转换为 VO 并填充关联数据
		List<QuotationAssignConfigVO> voList = new ArrayList<QuotationAssignConfigVO>();
		for (QuotationAssignConfigPO po : poList) {
			QuotationAssignConfigVO vo = convertToVO(po);
			voList.add(vo);
		}

		// 设置分页结果
		paging.setData(voList);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignConfigVO queryQuotationAssignConfigById(long qacid) throws FLException {
		QuotationAssignConfigPO po = quotationAssignConfigDao.queryById(qacid);
		if (po == null) {
			return null;
		}
		return convertToVO(po);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public boolean isQuotationAssignEnabled(int company, Integer department) throws FLException {
		List<QuotationAssignConfigPO> list = quotationAssignConfigDao.queryEnabledQuotationAssignConfig(company, department);
		return list != null && !list.isEmpty();
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public boolean isAutoAssignEnabled(int company) throws FLException {
		return quotationAssignConfigDao.hasEnabledAutoAssignConfig(company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createQuotationAssignConfig(QuotationAssignConfigVO config) throws FLException {
		// 校验：公司部门组合唯一性
		int company = config.getCompany();
		Integer department = config.getDepartment();
		QuotationAssignConfigPO existPO = quotationAssignConfigDao.queryQuotationAssignConfigByCompanyAndDepartment(company, department);
		if (existPO != null) {
			throw new FLException("该公司和部门的配置已存在");
		}

		// VO 转 PO
		QuotationAssignConfigPO po = new QuotationAssignConfigPO();
		BeanUtils.copyProperties(config, po);

		// 保存
		quotationAssignConfigDao.save(po);

		// 设置返回的ID
		config.setQacid(po.getQacid());

		return 1;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignConfig(QuotationAssignConfigVO config) throws FLException {
		// 校验：公司部门组合唯一性（排除自己）
		int company = config.getCompany();
		Integer department = config.getDepartment();
		Long qacid = config.getQacid();

		QuotationAssignConfigPO existPO = quotationAssignConfigDao.queryQuotationAssignConfigByCompanyAndDepartment(company, department);
		if (existPO != null && existPO.getQacid() != qacid.longValue()) {
			throw new FLException("该公司和部门的配置已存在");
		}

		// VO 转 PO
		QuotationAssignConfigPO po = new QuotationAssignConfigPO();
		BeanUtils.copyProperties(config, po);

		// 更新
		quotationAssignConfigDao.update(po);

		return 1;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationAssignConfig(QuotationAssignConfigVO config) throws FLException {
		// 从 VO 提取 qacid
		long qacid = config.getQacid();

		// 删除
		return quotationAssignConfigDao.deleteQuotationAssignConfig(qacid);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignConfigForStatus(QuotationAssignConfigVO config) throws FLException {
		// 从 VO 提取属性
		long qacid = config.getQacid();
		short enabled = config.getEnabled();

		// 更新
		return quotationAssignConfigDao.updateQuotationAssignConfigForStatus(qacid, enabled);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignConfigForAssign(QuotationAssignConfigVO config) throws FLException {
		// 从 VO 提取属性
		long qacid = config.getQacid();
		short autoAssign = config.getAutoAssign();

		// 更新
		return quotationAssignConfigDao.updateQuotationAssignConfigForAssign(qacid, autoAssign);
	}

	/**
	 * PO 转 VO 并填充关联数据
	 *
	 * @param po 持久化对象
	 * @return 值对象
	 */
	private QuotationAssignConfigVO convertToVO(QuotationAssignConfigPO po) {
		if (po == null) {
			return null;
		}

		// PO 转 VO
		QuotationAssignConfigVO vo = new QuotationAssignConfigVO();
		BeanUtils.copyProperties(po, vo);

		// 填充公司信息
		if (po.getCompany() > 0) {
			CompanyPO companyPO = companyDao.queryById(po.getCompany());
			if (companyPO != null) {
				vo.setCompanyVO(companyPO);
			}
		}

		// 填充部门信息（部门ID可能为NULL）
		if (po.getDepartment() != null && po.getDepartment() > 0) {
			DepartmentPO departmentPO = departmentDao.queryById(po.getDepartment());
			if (departmentPO != null) {
				vo.setDepartmentVO(departmentPO);
			}
		}

		return vo;
	}
}
