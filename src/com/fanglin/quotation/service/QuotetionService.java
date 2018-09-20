package com.fanglin.quotation.service;

import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotetionVO;

public interface QuotetionService {
	
	public List<QuotetionVO> queryQuotetion(String  userId);
	
	public QuotetionVO queryQuotetionByQid(QuotetionVO quotetionVO);
	
	public QuotetionVO queryQuotetionByNo(QuotetionVO quotetionVO); 
	
	public int addQuotetion(QuotetionVO quotetionVO, String userId, int company) throws FLException;
	
	public int updateQuotetion(QuotetionVO quotetionVO) throws FLException;
	
	public int updateQuotetionForAdvance(QuotetionVO quotetionVO) throws FLException;
	
	public int replicaQuotetion(QuotetionVO quotetionVO, String userId, int company) throws FLException;
	
	public int cloneQuotetion(QuotetionVO quotetionVO, String userId, int company) throws FLException;
	
	public int copyQuotetion(QuotetionVO quotetionVO, String userId, int company) throws FLException;
	
	public int deleteQuotetion(QuotetionVO quotetionVO) throws FLException;
	
}
