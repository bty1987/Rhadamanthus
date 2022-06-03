package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.NormoodItemVO;
import com.fanglin.quotation.vo.QuotationVO;

public interface NormoodItemService {

	public List<NormoodItemVO> queryNormoodItem(NormoodItemVO normoodItem);

	public List<NormoodItemVO> addNormoodItem(QuotationVO quotationVO, List<NormoodItemVO> normoodItemVOs) throws FLException;

	public int deleteNormoodItem(NormoodItemVO normoodItemVO) throws FLException;
}
