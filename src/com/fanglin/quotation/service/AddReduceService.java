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

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.utils.Paging;

public interface AddReduceService {

	public void pageAddReduce(Paging paging, List<Filter> filters, AddReduceVO addReduceVO, Integer company) throws FLException;

	public void pageAddReduceByOrderId(Paging paging, List<Filter> filters, AddReduceVO addReduceVO) throws FLException;

	public List<AddReduceVO> queryAddReduceByOrderId(AddReduceVO addReduceVO) throws FLException;

	public List<AddReduceVO> queryAddReduceForPayedByOrderId(AddReduceVO addReduceVO) throws FLException;

	public AddReduceVO queryAddReduceByArid(AddReduceVO addReduceVO) throws FLException;

	public AddReduceVO queryAddReduceByDecorationPaymentId(AddReduceVO addReduceVO) throws FLException;

	public void sendAddReduce(AddReduceVO addReduceVO) throws FLException;

	public int addAddReduce(AddReduceVO addReduceVO, String userId);

	public int updateAddReduce(AddReduceVO addReduceVO) throws FLException;

	public int updateAddReduceForAdvance(AddReduceVO addReduceVO) throws FLException;

	public int submitAddReduce(AddReduceVO addReduceVO, String userId) throws FLException;

	public int unpayAddReduce(AddReduceVO addReduceVO) throws FLException;

	public int confirmAddReduce(AddReduceVO addReduceVO) throws FLException;

	public int affirmAddReduce(List<AddReduceVO> addReduceVOs) throws FLException;

	public int deleteAddReduceByArId(AddReduceVO addReduceVO) throws FLException;

}
