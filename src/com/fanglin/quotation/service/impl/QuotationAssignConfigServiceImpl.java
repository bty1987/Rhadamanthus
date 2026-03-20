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

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignConfigDao;
import com.fanglin.quotation.po.QuotationAssignConfigPO;
import com.fanglin.quotation.service.QuotationAssignConfigService;
import com.fanglin.quotation.vo.QuotationAssignConfigVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

/**
 * 预算配置表 Service 实现类
 * 
 * <p>
 * 职责：实现预算配置的业务逻辑处理
 * </p>
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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageQuotationAssignConfig(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<QuotationAssignConfigPO> quotationAssignConfigPOs = quotationAssignConfigDao.pageQuotationAssignConfig(paging, filters, company);
		List<QuotationAssignConfigVO> quotationAssignConfigVOs = new ArrayList<QuotationAssignConfigVO>();

		for (QuotationAssignConfigPO quotationAssignConfigPO : quotationAssignConfigPOs) {
			quotationAssignConfigVOs.add(quotationAssignConfigPO.ptv(new QuotationAssignConfigVO(new CompanyVO(), new DepartmentVO())));
		}

		// 设置分页结果
		paging.setData(quotationAssignConfigVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignConfigVO queryQuotationAssignConfigById(QuotationAssignConfigVO quotationAssignConfigVO) throws FLException {

		QuotationAssignConfigPO quotationAssignConfigPO = quotationAssignConfigDao.get(quotationAssignConfigVO.getQacid());

		return quotationAssignConfigPO.ptv(new QuotationAssignConfigVO());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createQuotationAssignConfig(QuotationAssignConfigVO quotationAssignConfigVO) throws FLException {

		int company = CompanyServiceImpl.decode(quotationAssignConfigVO.getCompany().getCid());
		Integer department = quotationAssignConfigVO.getDepartment() != null ? quotationAssignConfigVO.getDepartment().getDid() : null;

		QuotationAssignConfigPO quotationAssignConfigPO = quotationAssignConfigDao.queryQuotationAssignConfig(company, department);

		if (quotationAssignConfigPO != null) {
			throw new FLException(0, "该公司和部门的配置已存在");
		}

		CompanyPO companyPO = companyDao.get(company);

		quotationAssignConfigPO = new QuotationAssignConfigPO();

		BeanUtil.copyProperties(quotationAssignConfigVO, quotationAssignConfigPO, "company", "department");

		quotationAssignConfigPO.setCompany(companyPO);

		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		quotationAssignConfigPO.setCreateTime(currentTime);
		quotationAssignConfigPO.setUpdateTime(currentTime);

		// 保存
		quotationAssignConfigDao.save(quotationAssignConfigPO);

		// 设置返回的ID
		quotationAssignConfigVO.setQacid(quotationAssignConfigPO.getQacid());

		return 1;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignConfig(QuotationAssignConfigVO quotationAssignConfigVO) throws FLException {

		int company = CompanyServiceImpl.decode(quotationAssignConfigVO.getCompany().getCid());
		Integer department = quotationAssignConfigVO.getDepartment() != null ? quotationAssignConfigVO.getDepartment().getDid() : null;

		Long qacid = quotationAssignConfigVO.getQacid();

		QuotationAssignConfigPO existPO = quotationAssignConfigDao.queryQuotationAssignConfig(company, department);

		if (existPO != null && existPO.getQacid() != qacid.longValue()) {
			throw new FLException(0, "该公司和部门的配置已存在");
		}

		QuotationAssignConfigPO quotationAssignConfigPO = new QuotationAssignConfigPO();

		BeanUtil.copyProperties(quotationAssignConfigVO, quotationAssignConfigPO, "company", "department");

		quotationAssignConfigPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		quotationAssignConfigDao.update(quotationAssignConfigPO);

		return 1;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignConfigForStatus(QuotationAssignConfigVO quotationAssignConfigVO) throws FLException {

		QuotationAssignConfigPO quotationAssignConfigPO = quotationAssignConfigDao.get(quotationAssignConfigVO.getQacid());

		if (quotationAssignConfigPO == null) throw new FLException(0, "配置不存在");

		quotationAssignConfigPO.setEnabled(quotationAssignConfigVO.getEnabled());

		// 设置更新时间
		quotationAssignConfigPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		quotationAssignConfigDao.save(quotationAssignConfigPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignConfigForAssign(QuotationAssignConfigVO quotationAssignConfigVO) throws FLException {

		QuotationAssignConfigPO quotationAssignConfigPO = quotationAssignConfigDao.get(quotationAssignConfigVO.getQacid());

		if (quotationAssignConfigPO == null) throw new FLException(0, "配置不存在");

		quotationAssignConfigPO.setAutoAssign(quotationAssignConfigVO.getAutoAssign());

		// 设置更新时间
		quotationAssignConfigPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		quotationAssignConfigDao.save(quotationAssignConfigPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationAssignConfig(QuotationAssignConfigVO config) throws FLException {

		long qacid = config.getQacid();

		quotationAssignConfigDao.deleteById(qacid);

		return 0;
	}

}
