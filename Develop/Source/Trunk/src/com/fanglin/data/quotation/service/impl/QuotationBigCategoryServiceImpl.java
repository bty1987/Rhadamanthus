/**
 * @File Name		: QuotationBigCategoryServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationBigCategoryPO;
import com.fanglin.data.quotation.dao.QuotationBigCategoryDao;
import com.fanglin.data.quotation.service.QuotationBigCategoryService;
import com.fanglin.data.quotation.vo.QuotationBigCategoryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("quotationBigCategoryService")
@Transactional(readOnly=true)
public class QuotationBigCategoryServiceImpl implements QuotationBigCategoryService {

	@Autowired
	private QuotationBigCategoryDao quotationBigCategoryDao;
	
	@Override
	public List<QuotationBigCategoryVO> queryQuotationBigCategory(){
		
		List<QuotationBigCategoryPO> quotationBigCategoryPOs = quotationBigCategoryDao.list();
		List<QuotationBigCategoryVO> quotationBigCategoryVOs = new ArrayList<QuotationBigCategoryVO>();
		
		for(QuotationBigCategoryPO quotationBigCategoryPO: quotationBigCategoryPOs){
			QuotationBigCategoryVO quotationBigCategoryVO = new QuotationBigCategoryVO();
			BeanUtil.copyProperties(quotationBigCategoryPO, quotationBigCategoryVO);
			quotationBigCategoryVOs.add(quotationBigCategoryVO);
		}
		
		return quotationBigCategoryVOs;
	}

	@Override
	public void pageQuotationBigCategory(Paging paging, List<Filter> filters) {
		
		List<QuotationBigCategoryPO> quotationBigCategoryPOs = quotationBigCategoryDao.pageQuotationBigCategory(paging, filters);
		List<QuotationBigCategoryVO> quotationBigCategoryVOs = new ArrayList<QuotationBigCategoryVO>();
		
		for(QuotationBigCategoryPO quotationBigCategoryPO: quotationBigCategoryPOs){
			
			QuotationBigCategoryVO quotationBigCategoryVO = new QuotationBigCategoryVO();

			BeanUtil.copyProperties(quotationBigCategoryPO, quotationBigCategoryVO);
			
			quotationBigCategoryVOs.add(quotationBigCategoryVO);
		}
		
		paging.setData(quotationBigCategoryVOs);
	}
	
	public QuotationBigCategoryDao getQuotationBigCategoryDao(){
		return quotationBigCategoryDao;
	}

	public void setQuotationBigCategoryDao(QuotationBigCategoryDao quotationBigCategoryDao){
		this.quotationBigCategoryDao = quotationBigCategoryDao;
	}

	
	
}
