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
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.utils.Paging;

public interface AddReduceService {

	public void pageAddReduce(Paging paging, List<Filter> filters, AddReduceVO addReduceVO, List<Short> statuses, Integer company) throws FLException;

	public void pageAddReduceByOrderId(Paging paging, List<Filter> filters, AddReduceVO addReduceVO) throws FLException;

	public List<AddReduceVO> queryAddReduceByOrderId(AddReduceVO addReduceVO) throws FLException;

	public List<AddReduceVO> queryAddReduceForPayedByOrderId(AddReduceVO addReduceVO) throws FLException;

	public AddReduceVO queryAddReduceByArid(AddReduceVO addReduceVO) throws FLException;

	public List<AddReduceVO> queryAddReduceByDpid(AddReduceVO addReduceVO) throws FLException;

	public int sendAddReduce(AddReduceVO addReduceVO, List<AddReduceVO> addReduceVOs) throws FLException;

	public int addAddReduce(AddReduceVO addReduceVO, String userId) throws FLException;

	public int updateAddReduce(AddReduceVO addReduceVO) throws FLException;

	public int updateAddReduceForAdvance(AddReduceVO addReduceVO) throws FLException;

	public int updateAddReduceForAccount(AddReduceVO addReduceVO) throws FLException;

	public int submitAddReduce(AddReduceVO addReduceVO, List<AddReduceVO> addReduceVOs, String userId) throws FLException;

	public int cancelAddReduce(AddReduceVO addReduceVO) throws FLException;

	public int unpayAddReduce(AddReduceVO addReduceVO) throws FLException;

	public int confirmAddReduce(AddReduceVO addReduceVO) throws FLException;

	public int affirmAddReduce(DecorationVO decorationVO, List<AddReduceVO> addReduceVOs, String securityCode, String verifyCode) throws FLException;

	public int deleteAddReduceByArId(AddReduceVO addReduceVO) throws FLException;

}
