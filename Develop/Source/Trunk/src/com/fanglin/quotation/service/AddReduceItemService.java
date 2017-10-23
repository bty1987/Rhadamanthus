/**
 * @File Name		: AddReduceItemService.java
 * @Package   	: com.fanglin.decoration.service
 * @Version		: 1.0
 * @Date			: 2016-6-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.AddReduceItemVO;
import com.fanglin.quotation.vo.AddReduceVO;

public interface AddReduceItemService {
	
	public List<AddReduceItemVO> queryAddReduceItemByAddReduceId(AddReduceVO addReduceVO)throws FLException;
	
	public List<AddReduceItemVO> queryAddReduceItemByAddReduceIds(List<Integer> addReduceIds)throws FLException;
	
	public int updateAddReduceItem(AddReduceVO addReduceVO, AddReduceItemVO addReduceItemVO) throws FLException;
	
	public int deleteAddReduceItem(AddReduceVO addReduceVO, AddReduceItemVO addReduceItemVO) throws FLException;
	
}
