package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotetionFunctionAreaVO;
import com.fanglin.quotation.vo.QuotetionVO;

public interface QuotetionFunctionAreaService {
	
	public List<QuotetionFunctionAreaVO> queryQuotetionFunctionAreaByQid(QuotetionVO quotetionVO) throws FLException;
	
	public List<QuotetionFunctionAreaVO> addQuotetionFuctionArea(List<Long> functionAreaIds, QuotetionVO quotetionVO) throws FLException;

	public int updateQuotetionFunctionArea(QuotetionFunctionAreaVO quotetionFunctionAreaVO, QuotetionVO quotetionVO) throws FLException;

	public int deleteQuotetionFunctionArea(QuotetionFunctionAreaVO quotetionFunctionAreaVO, QuotetionVO quotetionVO) throws FLException;


}
