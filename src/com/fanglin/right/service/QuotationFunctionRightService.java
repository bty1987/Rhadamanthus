package com.fanglin.right.service;

import java.util.List;

import com.fanglin.right.vo.QuotationFunctionRightVO;

public interface QuotationFunctionRightService {

	public List<QuotationFunctionRightVO> queryQuotationFunctionRight(QuotationFunctionRightVO quotationFunctionRightVO);

	public void updateQuotationFunctionRight(QuotationFunctionRightVO quotationFunctionRightVO, List<Long> qfids, int company);

}
