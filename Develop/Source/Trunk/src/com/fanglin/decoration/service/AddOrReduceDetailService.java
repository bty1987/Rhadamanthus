package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.vo.AddOrReduceDetailVO;
import com.fanglin.decoration.vo.AddReduceVO;
import com.fanglin.utils.Paging;

public interface AddOrReduceDetailService {
	
	public void pageAddOrReduceDetailByArId(Paging paging, List<FilterVO> filters, AddReduceVO addReduceVO);

	public AddOrReduceDetailVO queryAddOrReduceDetailById(AddOrReduceDetailVO addOrReduceDetailVO) throws FLException;

	public AddOrReduceDetailVO queryAddOrReduceDetailForNoItemById(int addOrReduceId);

	public int queryAddOrReduceDetailByIds(List<Integer> addOrReduceIds, List<AddOrReduceDetailVO> addOrReduceDetailVOs) throws FLException;
	
	public int calAddOrReduceForSumPrice(AddOrReduceDetailVO quotationDetail);
	
	public int checkAddOrReduceForPenalty(AddOrReduceDetailVO addOrReduceDetail) throws FLException;
	
	public int saveAddOrReduceDetail(AddOrReduceDetailVO addOrReduceDetail) throws FLException;

	public int submitAddOrReduceDetail(AddOrReduceDetailVO addOrReduceDetail) throws FLException;
}
