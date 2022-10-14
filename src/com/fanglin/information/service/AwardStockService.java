package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.AwardStockVO;
import com.fanglin.utils.Paging;

public interface AwardStockService {

	public void pageAwardStock(Paging paging, List<Filter> filters, int company);

	public List<AwardStockVO> queryAwardStockByType(AwardStockVO awardStockVO, int company);

	public List<AwardStockVO> queryAwardStockByName(AwardStockVO awardStock, int company);

	public AwardStockVO queryAwardStockByAsid(AwardStockVO awardStockVO) throws FLException;

	public void addAwardStock(AwardStockVO awardStockVO, String userId, int company) throws FLException;

	public void updateAwardStock(AwardStockVO awardStockVO) throws FLException;

	public void updateAwardStockForStatus(AwardStockVO awardStockVO) throws FLException;

	public void updateAwardStockForXG(AwardStockVO awardStockVO, String userId) throws FLException;

	public void updateAwardStockForCG(AwardStockVO awardStockVO, String userId) throws FLException;

	public void checkAwardStock(AwardStockVO awardStockVO, String userId) throws FLException;

}
