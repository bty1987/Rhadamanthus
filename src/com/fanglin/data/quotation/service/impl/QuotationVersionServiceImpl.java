/**
 * @File Name		: QuotationVersionServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.data.quotation.service.QuotationVersionService;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("quotationVersionService")
@Transactional(readOnly = true)
public class QuotationVersionServiceImpl implements QuotationVersionService {

	@Autowired
	private QuotationVersionDao quotationVersionDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public void pageQuotationVersion(Paging paging, List<Filter> filters, int company) {

		List<QuotationVersionPO> quotationVersionPOs = quotationVersionDao.pageQuotationVersion(paging, filters, company);
		List<QuotationVersionVO> quotationVersionVOs = new ArrayList<QuotationVersionVO>();

		QuotationVersionVO quotationVersionVO;

		for (QuotationVersionPO quotationVersionPO : quotationVersionPOs) {

			quotationVersionVO = new QuotationVersionVO();

			BeanUtil.copyProperties(quotationVersionPO, quotationVersionVO);

			quotationVersionVOs.add(quotationVersionVO);
		}

		paging.setData(quotationVersionVOs);
	}

	@Override
	public QuotationVersionVO queryQuotationVersionById(QuotationVersionVO quotationVersionVO) {

		QuotationVersionPO quotationVersionPO = quotationVersionDao.get(quotationVersionVO.getNo());

		BeanUtil.copyProperties(quotationVersionPO, quotationVersionVO);

		return quotationVersionVO;
	}

	@Override
	public List<QuotationVersionVO> queryQuotationVersion(int company) {

		List<QuotationVersionPO> quotationVersionPOs = quotationVersionDao.queryQuotationVersion(company);
		List<QuotationVersionVO> quotationVersionVOs = new ArrayList<QuotationVersionVO>();

		QuotationVersionVO quotationVersionVO;

		for (QuotationVersionPO quotationVersionPO : quotationVersionPOs) {

			quotationVersionVO = new QuotationVersionVO();

			BeanUtil.copyProperties(quotationVersionPO, quotationVersionVO);

			quotationVersionVOs.add(quotationVersionVO);
		}

		return quotationVersionVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveQuotationVersion(QuotationVersionVO quotationVersionVO, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		if (quotationVersionVO.getDefaultFlag() == QuotationVersionPO.DEFAULTFLAG_DEFAULT_INT) {
			quotationVersionDao.updateQuotationVersionForDefault(company, QuotationVersionPO.DEFAULTFLAG_INIT_INT);
		}

		QuotationVersionPO quotationVersionPO = new QuotationVersionPO();

		BeanUtil.copyProperties(quotationVersionVO, quotationVersionPO, Arrays.asList(new String[] { "versionId" }));

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_QUOTATION_VERSION_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		String no = String.format("%sQV_%s", companyPO.getShortname(), FormatUtil.fillZero(count, "000"));

		quotationVersionPO.setNo(no);
		quotationVersionPO.setCompany(company);
		quotationVersionPO.setDefaultFlag(QuotationVersionPO.DEFAULTFLAG_DEFAULT_INT);

		quotationVersionDao.save(quotationVersionPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateQuotationVersion(QuotationVersionVO quotationVersionVO) throws FLException {

		QuotationVersionPO quotationVersionPO = quotationVersionDao.get(quotationVersionVO.getNo());

		if (quotationVersionPO == null) {
			throw new FLException(200022, "报价版本不存在");
		}

		if (quotationVersionVO.getDefaultFlag() == QuotationVersionPO.DEFAULTFLAG_DEFAULT_INT) {
			quotationVersionDao.updateQuotationVersionForDefault(quotationVersionPO.getCompany(), QuotationVersionPO.DEFAULTFLAG_INIT_INT);
		}

		BeanUtil.copyProperties(quotationVersionVO, quotationVersionPO, Arrays.asList("qvId"));

		quotationVersionDao.update(quotationVersionPO);
	}

}
