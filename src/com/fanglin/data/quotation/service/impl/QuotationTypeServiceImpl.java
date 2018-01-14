/**
 * @File Name		: QuotationTypeServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-27
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
import com.fanglin.data.po.QuotationTypePO;
import com.fanglin.data.quotation.dao.QuotationTypeDao;
import com.fanglin.data.quotation.service.QuotationTypeService;
import com.fanglin.data.quotation.vo.QuotationTypeVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("quotationTypeService")
@Transactional(readOnly=true)
public class QuotationTypeServiceImpl implements QuotationTypeService {

	@Autowired
	private QuotationTypeDao quotationTypeDao;
	
	@Override
	public List<QuotationTypeVO> queryQuotationType(){
		
		List<QuotationTypePO> quotationTypePOs = quotationTypeDao.list();
		List<QuotationTypeVO> quotationTypeVOs = new ArrayList<QuotationTypeVO>();
		
		for(QuotationTypePO quotationTypePO: quotationTypePOs){
			QuotationTypeVO quotationTypeVO = new QuotationTypeVO();
			BeanUtil.copyProperties(quotationTypePO, quotationTypeVO);
			quotationTypeVOs.add(quotationTypeVO);
		}
		
		return quotationTypeVOs;
	}
	
	@Override
	public void pageQuotationType(Paging paging, List<Filter> filters) {

			List<QuotationTypePO> quotationTypePOs = quotationTypeDao.pageQuotationType(paging, filters);
			List<QuotationTypeVO> quotationTypeVOs = new ArrayList<QuotationTypeVO>();
			
			for(QuotationTypePO quotationTypePO: quotationTypePOs){
				
				QuotationTypeVO quotationTypeVO = new QuotationTypeVO();

				BeanUtil.copyProperties(quotationTypePO, quotationTypeVO);
				
				quotationTypeVOs.add(quotationTypeVO);
			}
			
			paging.setData(quotationTypeVOs);
		
		
	}
	public QuotationTypeDao getQuotationTypeDao(){
		return quotationTypeDao;
	}

	public void setQuotationTypeDao(QuotationTypeDao quotationTypeDao){
		this.quotationTypeDao = quotationTypeDao;
	}

	
	
}
