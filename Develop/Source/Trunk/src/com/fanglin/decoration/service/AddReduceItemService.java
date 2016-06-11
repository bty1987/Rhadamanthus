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

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.AddReduceItemVO;
import com.fanglin.decoration.vo.AddReduceVO;

public interface AddReduceItemService {
	
	public List<AddReduceItemVO> queryAddReduceItemByAddReduceId(AddReduceVO addReduceVO);
	
	public List<AddReduceItemVO> queryAddReduceItemByAddReduceIds(List<Integer> addReduceIds);
	
	public int updateAddReduceItem(AddReduceVO addReduceVO, AddReduceItemVO addReduceItemVO) throws FLException;
	
	public int deleteAddReduceItem(AddReduceVO addReduceVO, AddReduceItemVO addReduceItemVO) throws FLException;
	
}
