package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.service.BaseService;
import com.fanglin.quotation.dao.QuotationConfigDao;
import com.fanglin.quotation.po.QuotationConfigPO;
import com.fanglin.quotation.service.QuotationConfigService;
import com.fanglin.quotation.vo.QuotationConfigVO;

/**
 * 预算配置服务实现类
 */
@Service
public class QuotationConfigServiceImpl extends BaseServiceImpl<QuotationConfigPO> implements QuotationConfigService {

	@Autowired
	private QuotationConfigDao quotationConfigDao;

	@Override
	public QuotationConfigDao getDao() {
		return quotationConfigDao;
	}

	@Override
	public QuotationConfigVO getQuotationConfig(Integer company, Integer department) {
		QuotationConfigPO po = quotationConfigDao.findByCompanyAndDepartment(company, department);
		if (po == null) {
			return null;
		}
		return copyToVO(po);
	}

	@Override
	public List<QuotationConfigVO> getQuotationConfigsByCompany(Integer company) {
		List<QuotationConfigPO> poList = quotationConfigDao.findByCompany(company);
		List<QuotationConfigVO> voList = new ArrayList<QuotationConfigVO>();

		for (QuotationConfigPO po : poList) {
			QuotationConfigVO vo = copyToVO(po);
			voList.add(vo);
		}

		return voList;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveQuotationConfig(QuotationConfigVO quotationConfig) {
		// 检查是否已存在
		QuotationConfigPO existing = quotationConfigDao.findByCompanyAndDepartment(
			quotationConfig.getCompany(), quotationConfig.getDepartment());

		if (existing != null) {
			// 更新
			existing.setEnabled(quotationConfig.getEnabled());
			existing.setAutoAssign(quotationConfig.getAutoAssign());
			quotationConfigDao.update(existing);
		} else {
			// 新增
			QuotationConfigPO po = new QuotationConfigPO();
			po.setCompany(quotationConfig.getCompany());
			po.setDepartment(quotationConfig.getDepartment());
			po.setEnabled(quotationConfig.getEnabled() != null ? quotationConfig.getEnabled() : (byte) 1);
			po.setAutoAssign(quotationConfig.getAutoAssign() != null ? quotationConfig.getAutoAssign() : (byte) 1);
			quotationConfigDao.save(po);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateQuotationConfig(QuotationConfigVO quotationConfig) {
		QuotationConfigPO po = quotationConfigDao.get(quotationConfig.getQcid());
		if (po != null) {
			po.setEnabled(quotationConfig.getEnabled());
			po.setAutoAssign(quotationConfig.getAutoAssign());
			quotationConfigDao.update(po);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteQuotationConfig(Integer qcid) {
		quotationConfigDao.delete(qcid);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void enableQuotationAssign(Integer company, Integer department) {
		QuotationConfigPO po = quotationConfigDao.findByCompanyAndDepartment(company, department);

		if (po != null) {
			po.setEnabled((byte) 1);
			quotationConfigDao.update(po);
		} else {
			// 新增配置
			po = new QuotationConfigPO();
			po.setCompany(company);
			po.setDepartment(department);
			po.setEnabled((byte) 1);
			po.setAutoAssign((byte) 1); // 默认启用自动分配
			quotationConfigDao.save(po);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableQuotationAssign(Integer company, Integer department) {
		QuotationConfigPO po = quotationConfigDao.findByCompanyAndDepartment(company, department);

		if (po != null) {
			po.setEnabled((byte) 0);
			quotationConfigDao.update(po);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void enableAutoAssign(Integer company, Integer department) {
		QuotationConfigPO po = quotationConfigDao.findByCompanyAndDepartment(company, department);

		if (po != null) {
			po.setAutoAssign((byte) 1);
			quotationConfigDao.update(po);
		} else {
			// 新增配置
			po = new QuotationConfigPO();
			po.setCompany(company);
			po.setDepartment(department);
			po.setEnabled((byte) 1);
			po.setAutoAssign((byte) 1);
			quotationConfigDao.save(po);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableAutoAssign(Integer company, Integer department) {
		QuotationConfigPO po = quotationConfigDao.findByCompanyAndDepartment(company, department);

		if (po != null) {
			po.setAutoAssign((byte) 0);
			quotationConfigDao.update(po);
		}
	}

	@Override
	public boolean isQuotationAssignEnabled(Integer company, Integer department) {
		QuotationConfigPO po = quotationConfigDao.findByCompanyAndDepartment(company, department);

		if (po == null) {
			return false; // 无配置，不启用
		}

		return po.getEnabled() == 1;
	}

	@Override
	public boolean isAutoAssign(Integer company, Integer department) {
		QuotationConfigPO po = quotationConfigDao.findByCompanyAndDepartment(company, department);

		if (po == null) {
			return false; // 无配置，不启用
		}

		return po.getEnabled() == 1 && po.getAutoAssign() == 1;
	}

	/**
	 * 将 PO 转换为 VO
	 * @param po 持久化对象
	 * @return 值对象
	 */
	private QuotationConfigVO copyToVO(QuotationConfigPO po) {
		QuotationConfigVO vo = new QuotationConfigVO();
		vo.setQcid(po.getQcid());
		vo.setCompany(po.getCompany());
		vo.setDepartment(po.getDepartment());
		vo.setEnabled(po.getEnabled());
		vo.setAutoAssign(po.getAutoAssign());
		vo.setCreateTime(po.getCreateTime());
		vo.setUpdateTime(po.getUpdateTime());

		// 设置启用状态名称
		if (po.getEnabled() != null) {
			vo.setEnabledName(po.getEnabled() == 1 ? "已启用" : "已禁用");
		}

		// 设置自动分配模式名称
		if (po.getAutoAssign() != null) {
			vo.setAutoAssignName(po.getAutoAssign() == 1 ? "自动分配" : "手动分配");
		}

		return vo;
	}
}
