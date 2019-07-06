/**
 * @File Name		: QuotationSmallCategoryServiceImpl.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.QuotationSmallCategoryDao;
import com.fanglin.communion.po.QuotationSmallCategoryPO;
import com.fanglin.communion.service.QuotationSmallCategoryService;
import com.fanglin.communion.vo.QuotationSmallCategoryVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("quotationSmallCategoryService")
@Transactional(readOnly = true)
public class QuotationSmallCategoryServiceImpl implements QuotationSmallCategoryService {

	@Autowired
	private QuotationSmallCategoryDao quotationSmallCategoryDao;

	@Override
	public List<QuotationSmallCategoryVO> queryQuotationSmallCategory(QuotationSmallCategoryVO quotationSmallCategory) {
		List<QuotationSmallCategoryPO> quotationSmallCategoryPOs = null;

		quotationSmallCategoryPOs = quotationSmallCategoryDao.list();

		List<QuotationSmallCategoryVO> quotationSmallCategoryVOs = new ArrayList<QuotationSmallCategoryVO>();

		for (QuotationSmallCategoryPO quotationSmallCategoryPO : quotationSmallCategoryPOs) {
			QuotationSmallCategoryVO quotationSmallCategoryVO = new QuotationSmallCategoryVO();
			BeanUtil.copyProperties(quotationSmallCategoryPO, quotationSmallCategoryVO);
			quotationSmallCategoryVOs.add(quotationSmallCategoryVO);
		}

		return quotationSmallCategoryVOs;
	}

	@Override
	public void pageQuotationSmallCategory(Paging paging, List<Filter> filters) {
		List<QuotationSmallCategoryPO> quotationSmallCategoryPOs = quotationSmallCategoryDao.pageQuotationSmallCategory(paging, filters);
		List<QuotationSmallCategoryVO> quotationSmallCategoryVOs = new ArrayList<QuotationSmallCategoryVO>();

		for (QuotationSmallCategoryPO quotationSmallCategoryPO : quotationSmallCategoryPOs) {

			QuotationSmallCategoryVO quotationSmallCategoryVO = new QuotationSmallCategoryVO();

			BeanUtil.copyProperties(quotationSmallCategoryPO, quotationSmallCategoryVO);

			quotationSmallCategoryVOs.add(quotationSmallCategoryVO);
		}

		paging.setData(quotationSmallCategoryVOs);

	}

	public QuotationSmallCategoryDao getQuotationSmallCategoryDao() {
		return quotationSmallCategoryDao;
	}

	public void setQuotationSmallCategoryDao(QuotationSmallCategoryDao quotationSmallCategoryDao) {
		this.quotationSmallCategoryDao = quotationSmallCategoryDao;
	}

}
