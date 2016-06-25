/**
 * @File Name		: QuotationClassificationServiceImpl.java
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

import com.fanglin.data.po.QuotationClassificationPO;
import com.fanglin.data.quotation.dao.QuotationClassificationDao;
import com.fanglin.data.quotation.service.QuotationClassificationService;
import com.fanglin.data.quotation.vo.QuotationClassificationVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationClassificationService")
@Transactional(readOnly=true)
public class QuotationClassificationServiceImpl implements QuotationClassificationService {

	@Autowired
	private QuotationClassificationDao quotationClassificationDao;

	@Override
	public List<QuotationClassificationVO> queryQuotationClassification(){
		
		List<QuotationClassificationPO> quotationClassificationPOs = quotationClassificationDao.list();
		List<QuotationClassificationVO> quotationClassificationVOs = new ArrayList<QuotationClassificationVO>();
		
		for(QuotationClassificationPO quotationClassificationPO: quotationClassificationPOs){
			QuotationClassificationVO quotationClassificationVO = new QuotationClassificationVO();
			BeanUtil.copyProperties(quotationClassificationPO, quotationClassificationVO);
			quotationClassificationVOs.add(quotationClassificationVO);
		}
		
		return quotationClassificationVOs;
	}

	public QuotationClassificationDao getQuotationClassificationDao(){
		return quotationClassificationDao;
	}

	public void setQuotationClassificationDao(QuotationClassificationDao quotationClassificationDao){
		this.quotationClassificationDao = quotationClassificationDao;
	}
	
}
