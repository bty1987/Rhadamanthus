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

package com.fanglin.quotation.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.quotation.dao.QuotationSmallCategoryDao;
import com.fanglin.quotation.po.QuotationSmallCategoryPO;
import com.fanglin.quotation.vo.QuotationSmallCategoryVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationSmallCategoryService")
@Transactional(readOnly=true)
public class QuotationSmallCategoryServiceImpl implements QuotationSmallCategoryService {
	
	@Autowired
	private QuotationSmallCategoryDao quotationSmallCategoryDao;

	@Override
	public List<QuotationSmallCategoryVO> queryQuotationSmallCategory(){
		
		List<QuotationSmallCategoryPO> quotationSmallCategoryPOs = quotationSmallCategoryDao.list();
		List<QuotationSmallCategoryVO> quotationSmallCategoryVOs = new ArrayList<QuotationSmallCategoryVO>();
		
		for(QuotationSmallCategoryPO quotationSmallCategoryPO: quotationSmallCategoryPOs){
			QuotationSmallCategoryVO quotationSmallCategoryVO = new QuotationSmallCategoryVO();
			BeanUtil.copyProperties(quotationSmallCategoryPO, quotationSmallCategoryVO);
			quotationSmallCategoryVOs.add(quotationSmallCategoryVO);
		}
		
		return quotationSmallCategoryVOs;
	}

	public QuotationSmallCategoryDao getQuotationSmallCategoryDao(){
		return quotationSmallCategoryDao;
	}

	public void setQuotationSmallCategoryDao(
			QuotationSmallCategoryDao quotationSmallCategoryDao){
		this.quotationSmallCategoryDao = quotationSmallCategoryDao;
	}
	
}
