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

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.quotation.dao.QuotationTypeDao;
import com.fanglin.quotation.po.QuotationTypePO;
import com.fanglin.quotation.service.QuotationTypeService;
import com.fanglin.quotation.vo.QuotationTypeVO;
import com.fanglin.utils.BeanUtil;

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

	public QuotationTypeDao getQuotationTypeDao(){
		return quotationTypeDao;
	}

	public void setQuotationTypeDao(QuotationTypeDao quotationTypeDao){
		this.quotationTypeDao = quotationTypeDao;
	}
	
}
