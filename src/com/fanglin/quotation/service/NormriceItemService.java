package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.NormriceItemVO;
import com.fanglin.quotation.vo.QuotationVO;

public interface NormriceItemService {

	public List<NormriceItemVO> queryNormriceItem(NormriceItemVO normriceItems);

	public int addNormriceItem(QuotationVO quotationVO, NormriceItemVO normriceItemsVO) throws FLException;

	public int deleteNormriceItem(NormriceItemVO normriceItemsVO) throws FLException;
}
