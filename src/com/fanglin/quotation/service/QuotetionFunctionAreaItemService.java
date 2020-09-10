package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotetionFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotetionFunctionAreaVO;
import com.fanglin.quotation.vo.QuotetionVO;

public interface QuotetionFunctionAreaItemService {

	public QuotetionFunctionAreaItemVO updateQuotetionFunctionAreaItem(QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO, QuotetionVO quotetionVO) throws FLException;

	public int updateQuotetionFunctionAreaItemForIndex(List<QuotetionFunctionAreaItemVO> QuotetionFunctionAreaItemVOs, QuotetionFunctionAreaVO quotationFunctionAreaVO) throws FLException;

	public int updateQuotetionFunctionAreaItemForSpec(QuotetionFunctionAreaItemVO quotationFunctionAreaItemVO, QuotetionVO quotetionVO) throws FLException;

	public int deleteQuotetionFunctionAreaItem(List<Long> qfaiIds, QuotetionVO quotetionVO, QuotetionFunctionAreaVO quotetionFunctionAreaVO) throws FLException;

}
