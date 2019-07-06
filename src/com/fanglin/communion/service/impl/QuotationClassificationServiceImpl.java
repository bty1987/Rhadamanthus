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

package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.QuotationClassificationDao;
import com.fanglin.communion.po.QuotationClassificationPO;
import com.fanglin.communion.service.QuotationClassificationService;
import com.fanglin.communion.vo.QuotationClassificationVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("quotationClassificationService")
@Transactional(readOnly = true)
public class QuotationClassificationServiceImpl implements QuotationClassificationService {

	@Autowired
	private QuotationClassificationDao quotationClassificationDao;

	@Override
	public List<QuotationClassificationVO> queryQuotationClassification() {

		List<QuotationClassificationPO> quotationClassificationPOs = quotationClassificationDao.list();
		List<QuotationClassificationVO> quotationClassificationVOs = new ArrayList<QuotationClassificationVO>();

		for (QuotationClassificationPO quotationClassificationPO : quotationClassificationPOs) {
			QuotationClassificationVO quotationClassificationVO = new QuotationClassificationVO();
			BeanUtil.copyProperties(quotationClassificationPO, quotationClassificationVO);
			quotationClassificationVOs.add(quotationClassificationVO);
		}

		return quotationClassificationVOs;
	}

	@Override
	public void pageQuotationClassification(Paging paging, List<Filter> filters) {

		List<QuotationClassificationPO> quotationClassificationPOs = quotationClassificationDao.pageQuotationClassification(paging, filters);
		List<QuotationClassificationVO> quotationClassificationVOs = new ArrayList<QuotationClassificationVO>();

		for (QuotationClassificationPO quotationClassificationPO : quotationClassificationPOs) {

			QuotationClassificationVO quotationClassificationVO = new QuotationClassificationVO();

			BeanUtil.copyProperties(quotationClassificationPO, quotationClassificationVO);

			quotationClassificationVOs.add(quotationClassificationVO);
		}

		paging.setData(quotationClassificationVOs);
	}
}
