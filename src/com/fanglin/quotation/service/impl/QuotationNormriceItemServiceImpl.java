package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.quotation.dao.QuotationNormriceItemDao;
import com.fanglin.quotation.po.QuotationNormriceItemPO;
import com.fanglin.quotation.service.QuotationNormriceItemService;
import com.fanglin.quotation.vo.QuotationNormriceItemVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationNormriceItemService")
@Transactional(readOnly = true)
public class QuotationNormriceItemServiceImpl implements QuotationNormriceItemService {

	@Autowired
	private QuotationNormriceItemDao quotationNormriceItemDao;

	@Override
	public List<QuotationNormriceItemVO> queryQuotationNormrice(QuotationNormriceItemVO quotationNormriceItem) {

		List<QuotationNormriceItemPO> quotationNormriceItemPOs = quotationNormriceItemDao.queryQuotationNormrice(quotationNormriceItem.getQid());
		List<QuotationNormriceItemVO> quotationNormriceItemVOs = new ArrayList<QuotationNormriceItemVO>();

		for (QuotationNormriceItemPO quotationNormriceItemPO : quotationNormriceItemPOs) {

			quotationNormriceItem = new QuotationNormriceItemVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(quotationNormriceItemPO, quotationNormriceItem, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(quotationNormriceItemPO.getConstructionNode(), quotationNormriceItem.getConstructionNode(), Arrays.asList("accessoriesType"));

			quotationNormriceItemVOs.add(quotationNormriceItem);
		}
		return quotationNormriceItemVOs;
	}

	@Override
	public int deleteQuotationNormriceItem(QuotationNormriceItemVO quotationNormriceItemVO) throws FLException {

		QuotationNormriceItemPO quotationNormriceItemPO = quotationNormriceItemDao.get(quotationNormriceItemVO.getQnpiid());

		if (quotationNormriceItemPO == null) {

		}

		quotationNormriceItemDao.delete(quotationNormriceItemPO);
		return 0;
	}
}
