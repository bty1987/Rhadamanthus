/**
 * @File Name		: AddReduceService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.vo.AddReduceVO;
import com.fanglin.utils.Paging;

public interface AddReduceService {
	
	public void pageAddReduceByOrderId(Paging paging, List<FilterVO> filters,  AddReduceVO addReduceVO);
	
	public List<AddReduceVO> queryAddReduceByOrderId(AddReduceVO addReduceVO);
	
	public List<AddReduceVO> queryAddReduceForPayedByOrderId(AddReduceVO addReduceVO);
	
	public AddReduceVO queryAddReduceByDecorationPaymentId(AddReduceVO addReduceVO) throws FLException ;
	
	public int addAddReduce(AddReduceVO addReduceVO);
	
	public int updateAddReduce(AddReduceVO addReduceVO) throws FLException;
	
	public int updateAddReduceForAdvance(AddReduceVO addReduceVO) throws FLException;
	
	public int deleteAddReduceByArId(AddReduceVO addReduceVO) throws FLException;
	
	public int submitAddReduce(AddReduceVO addReduceVO, String userId) throws FLException;
	
}
